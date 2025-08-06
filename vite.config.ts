import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			headless: true
		},
		environment: 'jsdom',
		setupFiles: ['./vitest-setup-client.ts']
	}
});
