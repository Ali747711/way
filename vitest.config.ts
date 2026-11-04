import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['vitest.setup.ts'],
    include: [
      'lib/**/*.test.{ts,tsx}',
      'components/**/*.test.tsx',
      'scripts/**/*.test.ts'
    ],
    coverage: {
      provider: 'v8',
      include: ['lib/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
