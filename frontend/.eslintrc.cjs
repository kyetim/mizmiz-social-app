/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ['next/core-web-vitals'],
    plugins: ['testing-library', 'jest-dom'],
    overrides: [
        {
            files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
            extends: ['plugin:testing-library/react'],
            rules: {
                'testing-library/no-unnecessary-act': 'warn',
                'testing-library/prefer-screen-queries': 'warn',
            },
        },
    ],
    rules: {
        'jest-dom/prefer-checked': 'warn',
        'jest-dom/prefer-enabled-disabled': 'warn',
    },
}

