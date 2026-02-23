const { formatKoreanWon } = require('./src/utils/formatters');

const testCases = [
    { input: 1500000000, expected: '15.0억 원' },
    { input: 3200000000, expected: '32.0억 원' },
    { input: 750000000, expected: '7.5억 원' },
    { input: 85000000, expected: '8,500만 원' },
    { input: 9000000, expected: '900만 원' },
    { input: 1234567, expected: '123만 원' },
    { input: 0, expected: '0원' }
];

console.log('--- formatKoreanWon Unit Test ---');
testCases.forEach(({ input, expected }) => {
    const result = formatKoreanWon(input);
    const passed = result === expected;
    console.log(`Input: ${input.toLocaleString().padStart(15)} | Expected: ${expected.padStart(10)} | Result: ${result.padStart(10)} | [${passed ? 'PASS' : 'FAIL'}]`);
});
