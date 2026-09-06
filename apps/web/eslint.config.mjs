import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Cypress specs have their own globals and their own tsconfig; they are not
  // part of the Next app's lint surface.
  { ignores: ['.next/**', 'node_modules/**', 'cypress/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];
