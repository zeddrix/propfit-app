import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Footer from './Footer.svelte';

describe('Footer - Copyright and Links', () => {
	describe('Footer Content', () => {
		it('should display copyright with Zeddrix Fabian name', () => {
			render(Footer);

			expect(screen.getByText(/© \d{4} Zeddrix Fabian/)).toBeInTheDocument();
		});

		it('should display current year dynamically', () => {
			render(Footer);

			const currentYear = new Date().getFullYear();
			expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
		});

		it('should have GitHub link to correct profile', () => {
			render(Footer);

			const githubLink = screen.getByRole('link', { name: /github/i });
			expect(githubLink).toBeInTheDocument();
			expect(githubLink).toHaveAttribute('href', 'https://github.com/zeddrix/');
		});

		it('should open GitHub link in new tab', () => {
			render(Footer);

			const githubLink = screen.getByRole('link', { name: /github/i });
			expect(githubLink).toHaveAttribute('target', '_blank');
			expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	describe('Footer Styling and Layout', () => {
		it('should have proper footer structure', () => {
			render(Footer);

			const footer = screen.getByRole('contentinfo');
			expect(footer).toBeInTheDocument();
		});

		it('should display GitHub icon', () => {
			render(Footer);

			const githubLink = screen.getByRole('link', { name: /github/i });
			const icon = githubLink.querySelector('svg');
			expect(icon).toBeInTheDocument();
		});

		it('should be properly positioned at bottom', () => {
			render(Footer);

			const footer = screen.getByRole('contentinfo');
			expect(footer).toHaveClass('mt-auto');
		});
	});
});
