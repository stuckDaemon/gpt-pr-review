Here’s a clean and clear `README.md` for your repo, explaining how to use your ChatGPT-powered code review workflow:

---

```markdown
# 🤖 ChatGPT Code Review Bot

This repo demonstrates how to use OpenAI's ChatGPT to automatically review pull requests in a GitHub repository. It leverages GitHub Actions, the OpenAI API, and a TypeScript script to analyze code changes and post a summary directly to the PR.
```
---

## 📁 Project Structure

```
.
├── code
│ └── example.ts                      # Sample TypeScript function (used to test the review)
├── scripts
│   └── code-review
│       ├── index.ts                    # The main TypeScript review script
│       ├── package.json                # Local dependencies for the review script
│       ├── tsconfig.json              # TypeScript config
│       └── yarn.lock
└── workflows
└── chatgpt-review.yml             # GitHub Actions workflow that runs the review
```

---

## 🚀 How It Works

Whenever a pull request is opened or updated:

1. GitHub Actions triggers the `chatgpt-review.yml` workflow.
2. The action checks out the code and runs a TypeScript script using `ts-node`.
3. The script:
   - Fetches the code diffs in the PR
   - Sends them to OpenAI’s ChatGPT API with a review prompt
   - Posts the review summary as a comment on the pull request

---

## 🛠 Setup Instructions

### 1. Clone the repository and install dependencies

```bash
cd .github/scripts/code-review
yarn install
```

### 2. Add required secrets to your GitHub repository

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

- `OPENAI_API_KEY` — your OpenAI API key
- `GITHUB_TOKEN` — default GitHub token (already available in Actions, but required in the script)

> Note: The default `GITHUB_TOKEN` will work only for internal PRs. For forked PRs, you'll need to use a GitHub App or bot account.

---

### 3. Confirm workflow is enabled

The file `.github/workflows/chatgpt-review.yml` should already exist. It’s triggered automatically on:

```yaml
on:
  pull_request:
    types: [opened, synchronize]
```

---

## ✏️ Example Usage

You can edit `code/example.ts` and open a pull request. The ChatGPT bot will analyze the code and leave a comment on the PR with suggestions, improvements, or warnings.

---

## ⚠️ Permissions Note

To allow the GitHub Action to post comments, the workflow must request permissions:

```yaml
permissions:
  contents: read
  pull-requests: write
```

This is already included in the `chatgpt-review.yml`.

---

## 🧠 Customizing the Prompt

Want a stricter review? Friendlier tone? Edit the prompt in:

```ts
// .github/scripts/code-review/index.ts
const prompt = `
You're a senior software engineer reviewing a code diff.

Please:
- Spot logic or syntax errors
- Identify any risky or suspicious changes
- Recommend improvements
- Be concise but helpful

Code diff:
${codeDiffs}
`;
```

---

## 🧪 Local Testing

You can test the review script locally (without GitHub) like this:

```bash
cd .github/scripts/code-review
OPENAI_API_KEY=your_key_here GITHUB_TOKEN=your_token_here yarn review
```

> You’ll need to mock `github.context` or pass in data for local testing.

---

## ✅ To Do
- [ ] Support forked PRs with GitHub App
- [ ] Add inline comments instead of summary
- [ ] Limit file types (e.g. only `.ts` or `.js`)
- [ ] Improve prompt templates

---

## 📄 License

MIT (add it in `package.json` too if you want to avoid warnings)
```

---

Let me know if you'd like to turn this into a template repo, add screenshots of the PR comment, or tweak the language for a more formal tone.