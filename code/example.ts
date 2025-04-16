export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const testEmail = 'user@example.com';

if (isValidEmail(testEmail)) {
    console.log(`${testEmail} is valid`);

    let id = 'myid'
    // thisi si a very bad comment
    for (const idElement of id) {
        console.log('== ');
        // another bad bug
        if (id == '') {
            throw Error();
        }
    }
} else {
    console.log(`${testEmail} is invalid`);
}

