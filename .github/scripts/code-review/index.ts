import * as core from '@actions/core';
import * as github from '@actions/github';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

// Rough token estimator: 1 token ≈ 4 characters
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

const run = async () => {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY!;
    const githubToken = process.env.GITHUB_TOKEN!;
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const octokit = new Octokit({ auth: githubToken });

    const context = github.context;
    const { owner, repo } = context.repo;
    const prNumber = context.payload.pull_request?.number;

    if (!prNumber) {
      core.setFailed('This action must be triggered by a pull request.');
      return;
    }

    const files = await octokit.pulls.listFiles({ owner, repo, pull_number: prNumber });

    let codeDiffs = '';
    for (const file of files.data) {
      if (file.status === 'removed' || !file.patch) continue;
      codeDiffs += `\n\nFile: ${file.filename}\n\`\`\`diff\n${file.patch}\n\`\`\``;
    }

    if (!codeDiffs) {
      core.info('No code changes to review.');
      return;
    }

    const prompt = `
You're a senior software engineer reviewing a code diff.

Please:
- Spot logic or syntax errors
- Identify any risky or suspicious changes
- Recommend improvements
- Be concise but helpful

Code diff:
${codeDiffs}
    `.trim();

    const tokenEstimate = estimateTokens(prompt);

    if (tokenEstimate > 8000) { // stay below the model limit (8192) to be safe
      core.warning(`Skipping AI review: Estimated token count ${tokenEstimate} exceeds limit.`);
      return; // Exit gracefully without marking the PR as failed
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    });

    const review = response.choices[0]?.message?.content || 'No review generated.';

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `🤖 **ChatGPT Review Summary**\n\n${review}`
    });

    core.info('Review posted to PR.');
  } catch (error: any) {
    core.warning(`AI review failed: ${error.message}`);
    // Do not call core.setFailed, just warn — keeps the PR check green
  }
};

run();
