import { writable } from 'svelte/store';
import type { Tenant, Expenses, Shareholder } from '../types/index.js';
import { browser } from '$app/environment';

// Storage keys
const STORAGE_KEYS = {
	TENANTS: 'propfit-tenants',
	EXPENSES: 'propfit-expenses',
	SHAREHOLDERS: 'propfit-shareholders',
	CURRENT_MONTH: 'propfit-current-month',
	MONTHLY_NOTES: 'propfit-monthly-notes',
	PREPARED_BY: 'propfit-prepared-by',
	LAST_RESET_MONTH: 'propfit-last-reset-month'
};

// Utility functions for localStorage
function saveToStorage<T>(key: string, data: T): void {
	if (browser) {
		try {
			localStorage.setItem(key, JSON.stringify(data));
		} catch (error) {
			console.warn('Failed to save to localStorage:', error);
		}
	}
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (browser) {
		try {
			const stored = localStorage.getItem(key);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch (error) {
			console.warn('Failed to load from localStorage:', error);
		}
	}
	return defaultValue;
}

// Unit rent constants
const UNIT_3_TOTAL_RENT = 5000;
const UNIT_3_NAME = 'Unit 3 (10 pax) - up/down';
const UNIT_2_NAME = 'Unit 2 (6 pax) - studio type 2';
const UNIT_2_MIN_RENT = 2000;
const UNIT_2_MIN_PER_PERSON = 1000;

function calculateUnit3Rent(tenants: Tenant[]): number {
	const unit3Tenants = tenants.filter((t) => t.unit === UNIT_3_NAME);
	return unit3Tenants.length > 0 ? UNIT_3_TOTAL_RENT / unit3Tenants.length : 0;
}

function calculateUnit2Rent(tenants: Tenant[]): number {
	const unit2Tenants = tenants.filter((t) => t.unit === UNIT_2_NAME);
	const occupants = unit2Tenants.length;

	if (occupants === 0) {
		return 0;
	}
	if (occupants === 1) {
		return UNIT_2_MIN_RENT; // Single tenant pays full minimum
	}

	// 2 or more tenants: minimum per person is 1000, but total must be at least 2000
	const perPersonRent = Math.max(UNIT_2_MIN_PER_PERSON, UNIT_2_MIN_RENT / occupants);
	return perPersonRent;
}

export function updateUnitRents(tenants: Tenant[]): Tenant[] {
	const unit3Rent = calculateUnit3Rent(tenants);
	const unit2Rent = calculateUnit2Rent(tenants);

	return tenants.map((tenant) => {
		if (tenant.unit === UNIT_3_NAME) {
			return { ...tenant, rent: unit3Rent };
		} else if (tenant.unit === UNIT_2_NAME) {
			return { ...tenant, rent: unit2Rent };
		}
		return tenant;
	});
}

// Default tenant data (updated to move tenants to Unit 2)
const defaultTenants: Tenant[] = [
	{
		id: 'franz',
		name: 'Franz',
		unit: 'Unit 1 (2 pax) - studio type 1',
		rent: 2000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'ryzza',
		name: 'Ryzza Maglanque',
		unit: 'Unit 2 (6 pax) - studio type 2',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'shane',
		name: 'Shane Mikaela Galang',
		unit: 'Unit 2 (6 pax) - studio type 2',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'shiky',
		name: 'Shiky Cagaitan',
		unit: 'Unit 2 (6 pax) - studio type 2',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'lyn',
		name: 'Lyn Villanueva',
		unit: 'Unit 2 (6 pax) - studio type 2',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	}
];

// Default expense data
const defaultExpenses: Expenses = {
	internet: 1585.54,
	water: 0,
	electricity: 0,
	maintenance: 0,
	other: 0
};

// Default shareholder data
const defaultShareholders: Shareholder[] = [
	{ name: 'Maru Fabian', percentage: 35, status: 'Pending' },
	{ name: 'Ruby Fabian', percentage: 35, status: 'Pending' },
	{ name: 'Zeddrix Fabian', percentage: 30, status: 'Pending' }
];

// Create stores with localStorage integration
function createPersistentStore<T>(storageKey: string, defaultValue: T) {
	const initialValue = loadFromStorage(storageKey, defaultValue);
	const store = writable<T>(initialValue);

	// Save to localStorage on every update, with browser environment check
	store.subscribe((value) => {
		// Only save if we're in the browser environment
		if (browser) {
			saveToStorage(storageKey, value);
		}
	});

	return store;
}

// Initialize stores
export const tenants = createPersistentStore(STORAGE_KEYS.TENANTS, updateUnitRents(defaultTenants));
export const expenses = createPersistentStore(STORAGE_KEYS.EXPENSES, defaultExpenses);
export const shareholders = createPersistentStore(STORAGE_KEYS.SHAREHOLDERS, defaultShareholders);
export const currentMonth = createPersistentStore(
	STORAGE_KEYS.CURRENT_MONTH,
	new Date().toISOString().slice(0, 7)
);
export const monthlyNotes = createPersistentStore(STORAGE_KEYS.MONTHLY_NOTES, '');
export const preparedBy = createPersistentStore(STORAGE_KEYS.PREPARED_BY, '');

// Store management functions
export function addTenant(unit: string): void {
	tenants.update((currentTenants) => {
		const newId = `tenant-${Date.now()}`;
		const newTenant: Tenant = {
			id: newId,
			name: 'New Tenant',
			unit,
			rent: unit === UNIT_3_NAME || unit === UNIT_2_NAME ? 0 : 2000, // Will be calculated for Unit 2 and 3
			payment: 0,
			paymentDate: '',
			notes: ''
		};
		const updatedTenants = [...currentTenants, newTenant];
		return updateUnitRents(updatedTenants);
	});
}

export function removeTenant(tenantId: string): Tenant | null {
	let removedTenant: Tenant | null = null;
	tenants.update((currentTenants: Tenant[]) => {
		const tenantToRemove = currentTenants.find((t: Tenant) => t.id === tenantId);
		if (tenantToRemove) {
			removedTenant = tenantToRemove;
			const updatedTenants = currentTenants.filter((t: Tenant) => t.id !== tenantId);
			return updateUnitRents(updatedTenants);
		}
		return currentTenants;
	});
	return removedTenant;
}

export function restoreTenant(tenant: Tenant): void {
	tenants.update((currentTenants) => {
		const updatedTenants = [...currentTenants, tenant];
		return updateUnitRents(updatedTenants);
	});
}

export function markAllPaid(): void {
	const today = new Date().toISOString().split('T')[0];
	tenants.update((currentTenants: Tenant[]) =>
		currentTenants.map((tenant: Tenant) => ({
			...tenant,
			payment: tenant.rent,
			paymentDate: today
		}))
	);
}

// Migration function to move tenants from Unit 3 to Unit 2
export function migrateTenantsToUnit2(): void {
	tenants.update((currentTenants: Tenant[]) => {
		const updatedTenants = currentTenants.map((tenant: Tenant) =>
			tenant.unit === UNIT_3_NAME ? { ...tenant, unit: UNIT_2_NAME } : tenant
		);
		return updateUnitRents(updatedTenants);
	});
}

// Reset function to clear all data
export function resetToDefaults(): void {
	tenants.set(updateUnitRents([...defaultTenants]));
	expenses.set({ ...defaultExpenses });
	monthlyNotes.set('');
	preparedBy.set('');
	currentMonth.set(new Date().toISOString().slice(0, 7));
}

// Monthly reset functionality
function getCurrentMonth(): string {
	return new Date().toISOString().slice(0, 7);
}

function checkAndResetMonthlyData(): void {
	if (!browser) {
		return;
	}

	const currentMonthValue = getCurrentMonth();
	const lastResetMonth = loadFromStorage(STORAGE_KEYS.LAST_RESET_MONTH, '');

	// If this is a new month, reset all data
	if (lastResetMonth && lastResetMonth !== currentMonthValue) {
		console.log(`Month changed from ${lastResetMonth} to ${currentMonthValue}. Resetting data...`);

		// Clear specific localStorage keys (keep shareholders as they persist)
		if (browser) {
			try {
				localStorage.removeItem(STORAGE_KEYS.TENANTS);
				localStorage.removeItem(STORAGE_KEYS.EXPENSES);
				localStorage.removeItem(STORAGE_KEYS.MONTHLY_NOTES);
				localStorage.removeItem(STORAGE_KEYS.PREPARED_BY);
			} catch {
				// Fail silently
			}
		}

		// Reset stores to defaults
		tenants.set(updateUnitRents([...defaultTenants]));
		expenses.set({ ...defaultExpenses });
		monthlyNotes.set('');
		preparedBy.set('');
		currentMonth.set(currentMonthValue);
	}

	// Update the last reset month
	saveToStorage(STORAGE_KEYS.LAST_RESET_MONTH, currentMonthValue);
}

// Check for monthly reset when the module loads
if (browser) {
	checkAndResetMonthlyData();
}
