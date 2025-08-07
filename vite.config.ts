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
		chunkSizeWarningLimit: 1000,
		// Ensure assets are properly hashed for cache busting
		rollupOptions: {
			output: {
				// Force hash on all assets for cache busting
				assetFileNames: (assetInfo) => {
					const info = assetInfo.name?.split('.') || [];
					const ext = info[info.length - 1];
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
						return `assets/images/[name].[hash][extname]`;
					}
					if (/css/i.test(ext)) {
						return `assets/css/[name].[hash][extname]`;
					}
					return `assets/[name].[hash][extname]`;
				}
			}
		}
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
