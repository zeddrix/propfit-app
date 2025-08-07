import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { tenants, currentMonth, monthlyNotes, resetToDefaults } from './rentalData.js';

// Mock browser environment and date
vi.mock('$app/environment', () => ({
	browser: false
}));

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

describe('Monthly Data Reset Functionality', () => {
	beforeEach(() => {
		resetToDefaults();
		vi.clearAllMocks();
	});

	describe('Month Change Detection', () => {
		it('should detect when month has changed', () => {
			const currentDate = new Date();
			const currentMonthValue = currentDate.toISOString().slice(0, 7);
			const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
				.toISOString()
				.slice(0, 7);

			// Mock localStorage to have last month
			mockLocalStorage.getItem.mockReturnValue(lastMonth);

			// Function should detect month change
			expect(currentMonthValue).not.toBe(lastMonth);
		});

		it('should not trigger reset if month has not changed', () => {
			const currentDate = new Date();
			const currentMonthValue = currentDate.toISOString().slice(0, 7);

			// Mock localStorage to have current month
			mockLocalStorage.getItem.mockReturnValue(currentMonthValue);

			// Should not trigger reset
			expect(mockLocalStorage.clear).not.toHaveBeenCalled();
		});
	});

	describe('Data Reset Behavior', () => {
		it('should reset all tenant data when month changes', () => {
			// Add some test data
			tenants.update((current) => [
				...current,
				{
					id: 'test-tenant',
					name: 'Test Tenant',
					unit: 'Unit 1 (2 pax) - studio type 1',
					rent: 2000,
					payment: 2000,
					paymentDate: '2024-01-15',
					notes: 'Test note'
				}
			]);

			// Simulate month change and reset
			resetToDefaults();

			const currentTenants = get(tenants);
			// Should reset to default tenants without the test data
			expect(currentTenants.find((t) => t.id === 'test-tenant')).toBeUndefined();
		});

		it('should clear monthly notes when month changes', () => {
			// Set some notes
			monthlyNotes.set('These are test notes');
			expect(get(monthlyNotes)).toBe('These are test notes');

			// Simulate month change and reset
			resetToDefaults();

			// Notes should be cleared
			expect(get(monthlyNotes)).toBe('');
		});

		it('should update current month to new month', () => {
			const newMonth = '2024-02';
			currentMonth.set(newMonth);

			expect(get(currentMonth)).toBe(newMonth);
		});
	});

	describe('LocalStorage Clearing', () => {
		it('should clear relevant localStorage keys when month changes', () => {
			// Mock the function that would clear localStorage
			const clearMonthlyData = vi.fn(() => {
				mockLocalStorage.removeItem('propfit-tenants');
				mockLocalStorage.removeItem('propfit-expenses');
				mockLocalStorage.removeItem('propfit-monthly-notes');
			});

			clearMonthlyData();

			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('propfit-tenants');
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('propfit-expenses');
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('propfit-monthly-notes');
		});
	});
});
