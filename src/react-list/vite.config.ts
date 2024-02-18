import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    build: {
        minify: process.env.NODE_ENV === 'production',
    },
});
