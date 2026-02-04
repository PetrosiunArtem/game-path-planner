/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'server/tsconfig.json'
        }]
    }
};
