import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { shareholders, resetToDefaults } from './rentalData.js';

// Mock browser environment
vi.mock('$app/environment', () => ({
	browser: false
}));

describe('Rental Data Store - Shareholder Management', () => {
	beforeEach(() => {
		resetToDefaults();
	});

	describe('Shareholder Names Update', () => {
		it('should have the new shareholder names: Maru Fabian, Ruby Fabian, Zeddrix Fabian', () => {
			const currentShareholders = get(shareholders);

			const expectedNames = ['Maru Fabian', 'Ruby Fabian', 'Zeddrix Fabian'];
			const actualNames = currentShareholders.map((s) => s.name);

			expect(actualNames).toEqual(expectedNames);
		});

		it('should maintain proper ownership percentages for new shareholders', () => {
			const currentShareholders = get(shareholders);

			// Total percentage should equal 100
			const totalPercentage = currentShareholders.reduce((sum, s) => sum + s.percentage, 0);
			expect(totalPercentage).toBe(100);

			// Each shareholder should have a reasonable percentage
			currentShareholders.forEach((shareholder) => {
				expect(shareholder.percentage).toBeGreaterThan(0);
				expect(shareholder.percentage).toBeLessThanOrEqual(100);
			});
		});

		it('should have exactly three shareholders', () => {
			const currentShareholders = get(shareholders);
			expect(currentShareholders).toHaveLength(3);
		});
	});
});
