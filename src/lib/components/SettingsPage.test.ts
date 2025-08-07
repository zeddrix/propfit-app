import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import SettingsPage from './SettingsPage.svelte';

// Mock localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
	value: mockLocalStorage,
	writable: true
});

describe('SettingsPage - Settings Interface', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Page Structure', () => {
		it('should render settings page with proper heading', () => {
			render(SettingsPage);

			const heading = screen.getByRole('heading', { name: /settings/i });
			expect(heading).toBeInTheDocument();
		});

		it('should display all settings categories', () => {
			render(SettingsPage);

			// Check for main categories
			expect(screen.getByText(/appearance/i)).toBeInTheDocument();
			expect(screen.getByText(/data management/i)).toBeInTheDocument();
			expect(screen.getByText(/display preferences/i)).toBeInTheDocument();
		});

		it('should have proper navigation structure', () => {
			render(SettingsPage);

			// Should have a navigation link back to main page
			const backLink = screen.getByRole('link', { name: /back to dashboard/i });
			expect(backLink).toBeInTheDocument();
			expect(backLink).toHaveAttribute('href', '/');
		});
	});

	describe('Theme Settings Section', () => {
		it('should display theme toggle in settings', () => {
			render(SettingsPage);

			const themeSection = screen.getByText(/theme preferences/i);
			expect(themeSection).toBeInTheDocument();
		});

		it('should show current theme status', () => {
			mockLocalStorage.getItem.mockReturnValue('dark');
			render(SettingsPage);

			// Should indicate current theme
			const themeIndicator = screen.getByText(/current.*dark/i);
			expect(themeIndicator).toBeInTheDocument();
		});
	});

	describe('Data Management Section', () => {
		it('should display data management options', () => {
			render(SettingsPage);

			expect(screen.getByText(/export data/i)).toBeInTheDocument();
			expect(screen.getByText(/reset data/i)).toBeInTheDocument();
			expect(screen.getByText(/monthly reset/i)).toBeInTheDocument();
		});

		it('should show export buttons for PDF and Excel', () => {
			render(SettingsPage);

			const exportPdfBtn = screen.getByRole('button', { name: /export.*pdf/i });
			const exportExcelBtn = screen.getByRole('button', { name: /export.*excel/i });

			expect(exportPdfBtn).toBeInTheDocument();
			expect(exportExcelBtn).toBeInTheDocument();
		});

		it('should display reset options with warnings', () => {
			render(SettingsPage);

			const resetBtn = screen.getByRole('button', { name: /reset all data/i });
			expect(resetBtn).toBeInTheDocument();
		});
	});

	describe('Display Preferences', () => {
		it('should show currency format options', () => {
			render(SettingsPage);

			expect(screen.getByText(/currency format/i)).toBeInTheDocument();
		});

		it('should display table density options', () => {
			render(SettingsPage);

			expect(screen.getByText(/table density/i)).toBeInTheDocument();
		});
	});

	describe('Settings Page Accessibility', () => {
		it('should have proper focus management', () => {
			render(SettingsPage);

			const firstInteractiveElement = screen.getAllByRole('button')[0];
			expect(firstInteractiveElement).not.toHaveAttribute('tabindex', '-1');
		});

		it('should have descriptive labels for all controls', () => {
			render(SettingsPage);

			const buttons = screen.getAllByRole('button');
			buttons.forEach((button) => {
				expect(button).toHaveAttribute('aria-label');
			});
		});
	});

	describe('Settings Navigation Integration', () => {
		it('should provide smooth transitions', () => {
			render(SettingsPage);

			const pageContainer = screen.getByRole('main');
			expect(pageContainer).toHaveClass('transition-all');
		});
	});
});
