import type {
	TenantBalance,
	ShareholderWithAmount,
	Shareholder,
	Expenses
} from '../types/index.js';

/**
 * Calculate tenant balance and payment status
 * @param rent - Monthly rent amount
 * @param payment - Amount paid by tenant
 * @returns Object with balance and status
 */
export function calculateTenantBalance(rent: number, payment: number): TenantBalance {
	const balance = rent - payment;
	let status: TenantBalance['status'];

	if (balance > 0) {
		status = 'Pending';
	} else if (balance === 0) {
		status = 'Paid';
	} else {
		status = 'Advance Payment';
	}

	return { balance, status };
}

/**
 * Calculate total collected from all tenants
 * @param payments - Array of payment amounts
 * @returns Total collected amount
 */
export function calculateTotalCollected(payments: number[]): number {
	return payments.reduce((sum, payment) => sum + payment, 0);
}

/**
 * Calculate net income after all expenses
 * @param totalCollected - Total rent collected
 * @param expenses - Object containing all expense amounts
 * @returns Net income
 */
export function calculateNetIncome(totalCollected: number, expenses: Expenses): number {
	const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);
	return totalCollected - totalExpenses;
}

/**
 * Calculate shareholder distribution
 * @param netIncome - Net income to distribute
 * @param shareholders - Array of shareholder objects with percentage
 * @returns Array of shareholders with calculated amounts
 */
export function calculateShareholderDistribution(
	netIncome: number,
	shareholders: Shareholder[]
): ShareholderWithAmount[] {
	return shareholders.map((shareholder) => ({
		...shareholder,
		amount: (netIncome * shareholder.percentage) / 100
	}));
}

/**
 * Format currency value
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
	return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
