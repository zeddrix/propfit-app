import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NavigationBar from './NavigationBar.svelte';

describe('NavigationBar - Sticky Behavior', () => {
	const mockProps = {
		tenants: [],
		expenses: { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 },
		shareholders: [],
		currentMonth: '2024-01',
		notes: '',
		preparedBy: '',
		onreset: () => {}
	};

	describe('Sticky Positioning', () => {
		it('should have sticky positioning for desktop', () => {
			render(NavigationBar, mockProps);

			const navbar = screen.getByRole('navigation');
			expect(navbar).toBeInTheDocument();

			// Check if navbar has sticky positioning classes
			expect(navbar).toHaveClass('sticky');
			expect(navbar).toHaveClass('top-0');
		});

		it('should have proper z-index for sticky behavior', () => {
			render(NavigationBar, mockProps);

			const navbar = screen.getByRole('navigation');

			// Should have high z-index to stay above other content
			expect(navbar).toHaveClass('z-50');
		});

		it('should maintain visibility during scroll on desktop', () => {
			render(NavigationBar, mockProps);

			const navbar = screen.getByRole('navigation');

			// Should have classes that ensure it stays visible
			expect(navbar).toHaveClass('sticky');
			expect(navbar).toHaveClass('top-0');
		});
	});

	describe('Responsive Behavior', () => {
		it('should be optimized for desktop viewing', () => {
			render(NavigationBar, mockProps);

			const navbar = screen.getByRole('navigation');

			// Should have responsive classes for better desktop experience
			expect(navbar.className).toMatch(/md:|lg:|xl:/);
		});

		it('should maintain functionality on mobile devices', () => {
			render(NavigationBar, mockProps);

			// Navigation should still be functional on mobile
			const navbar = screen.getByRole('navigation');
			expect(navbar).toBeInTheDocument();
		});
	});
});
