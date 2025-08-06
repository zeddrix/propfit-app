import { describe, it, expect } from 'vitest';
import {
	calculateTenantBalance,
	calculateTotalCollected,
	calculateNetIncome,
	calculateShareholderDistribution
} from '$lib/utils/calculations.js';
import type { Expenses, Shareholder } from '$lib/types/index.js';

describe('Rental Calculations', () => {
	describe('calculateTenantBalance', () => {
		it('should calculate correct balance when payment is less than rent', () => {
			const result = calculateTenantBalance(1000, 800);
			expect(result).toEqual({ balance: 200, status: 'Pending' });
		});

		it('should show paid status when payment equals rent', () => {
			const result = calculateTenantBalance(1000, 1000);
			expect(result).toEqual({ balance: 0, status: 'Paid' });
		});

		it('should show advance payment when payment exceeds rent', () => {
			const result = calculateTenantBalance(1000, 1500);
			expect(result).toEqual({ balance: -500, status: 'Advance Payment' });
		});

		it('should handle Unit 3 dynamic rent calculation correctly', () => {
			// Test with 2500 rent (5000/2 tenants)
			const result = calculateTenantBalance(2500, 2500);
			expect(result).toEqual({ balance: 0, status: 'Paid' });
		});
	});

	describe('calculateTotalCollected', () => {
		it('should sum all tenant payments correctly', () => {
			const payments = [1000, 800, 1200, 0, 500, 1000];
			const result = calculateTotalCollected(payments);
			expect(result).toBe(4500);
		});

		it('should handle empty array', () => {
			const payments: number[] = [];
			const result = calculateTotalCollected(payments);
			expect(result).toBe(0);
		});

		it('should correctly sum Unit 3 payments with dynamic rent', () => {
			// Test scenario: 2 Unit 3 tenants with 2500 each + Franz with 2000
			const payments = [2000, 2500, 2500];
			const result = calculateTotalCollected(payments);
			expect(result).toBe(7000);
		});
	});

	describe('calculateNetIncome', () => {
		it('should calculate net income after expenses', () => {
			const totalCollected = 7000;
			const expenses: Expenses = {
				internet: 1585.54,
				water: 800,
				electricity: 1200,
				maintenance: 500,
				other: 0
			};
			const result = calculateNetIncome(totalCollected, expenses);
			expect(result).toBe(2914.46);
		});

		it('should handle zero expenses', () => {
			const totalCollected = 5000;
			const expenses: Expenses = {
				internet: 0,
				water: 0,
				electricity: 0,
				maintenance: 0,
				other: 0
			};
			const result = calculateNetIncome(totalCollected, expenses);
			expect(result).toBe(5000);
		});

		it('should calculate net income with new Unit 3 structure', () => {
			// Franz: 2000, Unit 3 (2 tenants): 5000 = 7000 total
			const totalCollected = 7000;
			const expenses: Expenses = {
				internet: 1585.54,
				water: 0,
				electricity: 0,
				maintenance: 0,
				other: 0
			};
			const result = calculateNetIncome(totalCollected, expenses);
			expect(result).toBe(5414.46);
		});
	});

	describe('calculateShareholderDistribution', () => {
		it('should distribute profits according to ownership percentages', () => {
			const netIncome = 3000;
			const shareholders: Shareholder[] = [
				{ name: 'Zedd', percentage: 30 },
				{ name: 'Mommy', percentage: 35 },
				{ name: 'Maru', percentage: 35 }
			];

			const result = calculateShareholderDistribution(netIncome, shareholders);
			expect(result).toEqual([
				{ name: 'Zedd', percentage: 30, amount: 900 },
				{ name: 'Mommy', percentage: 35, amount: 1050 },
				{ name: 'Maru', percentage: 35, amount: 1050 }
			]);
		});

		it('should handle zero net income', () => {
			const netIncome = 0;
			const shareholders: Shareholder[] = [
				{ name: 'Zedd', percentage: 30 },
				{ name: 'Mommy', percentage: 70 }
			];

			const result = calculateShareholderDistribution(netIncome, shareholders);
			expect(result).toEqual([
				{ name: 'Zedd', percentage: 30, amount: 0 },
				{ name: 'Mommy', percentage: 70, amount: 0 }
			]);
		});

		it('should distribute higher profits with new rent structure', () => {
			const netIncome = 5414.46; // Based on new calculation above
			const shareholders: Shareholder[] = [
				{ name: 'Zedd', percentage: 30 },
				{ name: 'Mommy', percentage: 35 },
				{ name: 'Maru', percentage: 35 }
			];

			const result = calculateShareholderDistribution(netIncome, shareholders);

			// Use closeTo for floating point comparisons
			expect(result[0].name).toBe('Zedd');
			expect(result[0].percentage).toBe(30);
			expect(result[0].amount).toBeCloseTo(1624.34, 2);

			expect(result[1].name).toBe('Mommy');
			expect(result[1].percentage).toBe(35);
			expect(result[1].amount).toBeCloseTo(1895.06, 2);

			expect(result[2].name).toBe('Maru');
			expect(result[2].percentage).toBe(35);
			expect(result[2].amount).toBeCloseTo(1895.06, 2);
		});
	});
});
