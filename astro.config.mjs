import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
    ],
    vite: {
        resolve: {
            alias: {
                '@/': new URL('./src/', import.meta.url).pathname,
            },
        },
    },
});
