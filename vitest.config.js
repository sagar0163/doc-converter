import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.js'],
    testTimeout: 60000,
    hookTimeout: 60000,
    maxWorkers: 2,
  },
});
