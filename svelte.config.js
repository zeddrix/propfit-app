import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		appDir: 'internal',
		paths: {
			base: '/propfit-app', // Fixed base path for GitHub Pages subdirectory deployment
			relative: false
		},
		prerender: {
			handleHttpError: 'warn',
			crawl: true,
			entries: ['*']
		}
	}
};

export default config;
