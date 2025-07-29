import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default defineConfig([
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.test.json'],
                ecmaVersion: 2020,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'unused-imports': unusedImports,
        },
        rules: {
            // Remove unused imports automatically
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            // TypeScript rules
            '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-function': 'warn',
            // General rules
            'prefer-const': 'warn',
            'no-constant-binary-expression': 'error',
        },
    },
    {
        files: ['tests/**/*.ts'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.test.json'],
                ecmaVersion: 2020,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'unused-imports': unusedImports,
        },
        rules: {
            // Remove unused imports automatically
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            // TypeScript rules (more relaxed for tests)
            '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
            '@typescript-eslint/explicit-function-return-type': 'off', // not needed in tests
            '@typescript-eslint/no-explicit-any': 'off', // more lenient in tests
            '@typescript-eslint/no-empty-function': 'warn',
            // General rules
            'prefer-const': 'warn',
            'no-constant-binary-expression': 'error',
        },
    },
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        rules: {
            'prefer-const': 'warn',
            'no-constant-binary-expression': 'error',
        },
    },
    {
        ignores: ['dist/', 'node_modules/', '*.d.ts'],
    },
]);
