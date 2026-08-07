import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import unicorn from 'eslint-plugin-unicorn';

export default defineConfig([
	{ 
        files: ['src/**/*.ts'], 
        plugins: {
            unicorn,
          },
        extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        'unicorn/recommended',
      ],
     },
]);