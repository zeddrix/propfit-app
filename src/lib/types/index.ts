// Types for the rental management system
export interface Tenant {
	id: string;
	name: string;
	unit: string;
	rent: number;
	payment: number;
	paymentDate: string;
	notes: string;
}

export interface Expenses {
	internet: number;
	water: number;
	electricity: number;
	maintenance: number;
	other: number;
}

export interface Shareholder {
	name: string;
	percentage: number;
}

export interface ShareholderWithAmount extends Shareholder {
	amount: number;
}

export interface TenantBalance {
	balance: number;
	status: 'Paid' | 'Pending' | 'Advance Payment';
}

export interface Summary {
	totalExpected: number;
	totalCollected: number;
	outstandingBalance: number;
	totalExpenses: number;
	netIncome: number;
}
