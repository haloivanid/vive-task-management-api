// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import * as path from 'path';
import unusedImport from 'eslint-plugin-unused-imports';

export default defineConfig(
  { ignores: ['*.config.mjs', 'node_modules', 'dist', '*.js', 'libs', 'scripts'] },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  prettier,
  { plugins: { 'unused-import': unusedImport } },
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      sourceType: 'commonjs',
      parserOptions: { projectService: true, tsconfigRootDir: path.dirname(new URL(import.meta.url).pathname) },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'no-console': ['error', { allow: ['warn'] }],
    },
  },
);
