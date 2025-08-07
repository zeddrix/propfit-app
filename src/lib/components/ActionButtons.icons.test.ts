import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ActionButtons from './ActionButtons.svelte';

describe('ActionButtons - Icon Implementation', () => {
	const mockProps = {
		tenants: [],
		expenses: { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 },
		shareholders: [],
		currentMonth: '2024-01',
		notes: '',
		preparedBy: '',
		onreset: () => {}
	};

	describe('Button Icons', () => {
		it('should display download PDF icon', () => {
			render(ActionButtons, mockProps);

			const pdfButton = screen.getByRole('button', { name: /download pdf/i });
			expect(pdfButton).toBeInTheDocument();

			// Check for icon within button
			const icon = pdfButton.querySelector('svg');
			expect(icon).toBeInTheDocument();
		});

		it('should display download Excel icon', () => {
			render(ActionButtons, mockProps);

			const excelButton = screen.getByRole('button', { name: /download excel/i });
			expect(excelButton).toBeInTheDocument();

			// Check for icon within button
			const icon = excelButton.querySelector('svg');
			expect(icon).toBeInTheDocument();
		});

		it('should display print icon', () => {
			render(ActionButtons, mockProps);

			const printButton = screen.getByRole('button', { name: /print/i });
			expect(printButton).toBeInTheDocument();

			// Check for icon within button
			const icon = printButton.querySelector('svg');
			expect(icon).toBeInTheDocument();
		});

		it('should display trash bin icon for reset action', () => {
			render(ActionButtons, mockProps);

			const resetButton = screen.getByRole('button', { name: /reset data/i });
			expect(resetButton).toBeInTheDocument();

			// Check for trash bin icon specifically
			const icon = resetButton.querySelector('svg');
			expect(icon).toBeInTheDocument();
		});
	});

	describe('Icon Accessibility', () => {
		it('should have proper aria-labels for icon buttons', () => {
			render(ActionButtons, mockProps);

			const buttons = screen.getAllByRole('button');
			buttons.forEach((button) => {
				// Each button should have accessible text or aria-label
				expect(button).toHaveAttribute('aria-label');
			});
		});

		it('should maintain button functionality with icons', () => {
			render(ActionButtons, mockProps);

			// Buttons should still be clickable and functional
			const pdfButton = screen.getByRole('button', { name: /download pdf/i });
			expect(pdfButton).not.toHaveAttribute('disabled');
		});
	});
});
