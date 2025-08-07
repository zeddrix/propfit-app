import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'bg-green-500',
		'bg-purple-500',
		'bg-blue-500',
		'hover:bg-gray-50',
		'bg-green-100',
		'text-green-800',
		'bg-yellow-100',
		'text-yellow-800',
		'bg-blue-100',
		'text-blue-800'
	],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'Noto Sans',
					'sans-serif'
				]
			}
		}
	},
	plugins: [forms]
};
