import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    build: {
        minify: process.env.NODE_ENV === 'production',
    },
    base: '/playground/battleship/',
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['src/setup.test.ts'],
        include: ['src/**/*.test.ts?(x)'],
        exclude: ['src/setup.test.ts'],
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',

        coverage: {
            clean: true,
            reporter: ['text', 'lcov', 'cobertura'],
            include: ['src/**/*.ts?(x)'],
            exclude: ['src/main.tsx', '**/*.d.ts', '**/*.generated.*', '**/*.test.*'],

            thresholds: {
                // Ideally these would be at 80%, but we are only focused on the most important
                // generic version.
                statements: 0,
                branches: 0,
                functions: 0,
                lines: 0,
            },
        },
    },
});
