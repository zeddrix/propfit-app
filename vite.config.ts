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
	},
	build: {
		// Optimize chunk size warning limit
		chunkSizeWarningLimit: 1000
	},
	optimizeDeps: {
		// Pre-bundle these dependencies for faster dev server startup
		include: ['jspdf', 'jspdf-autotable', 'xlsx', 'lucide-svelte']
	},
	server: {
		// Improve HMR performance
		hmr: {
			overlay: true
		},
		// Enable better caching
		fs: {
			strict: false
		}
	}
});
