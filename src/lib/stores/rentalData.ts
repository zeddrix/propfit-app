import { writable } from 'svelte/store';
import type { Tenant, Expenses, Shareholder } from '../types/index.js';
import { browser } from '$app/environment';

// Storage keys
const STORAGE_KEYS = {
	TENANTS: 'propfit-tenants',
	EXPENSES: 'propfit-expenses',
	SHAREHOLDERS: 'propfit-shareholders',
	CURRENT_MONTH: 'propfit-current-month',
	MONTHLY_NOTES: 'propfit-monthly-notes'
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

// Unit 3 rent calculation (total ₱5000 split among tenants)
const UNIT_3_TOTAL_RENT = 5000;
const UNIT_3_NAME = 'Unit 3 (10 pax) - up/down';

function calculateUnit3Rent(tenants: Tenant[]): number {
	const unit3Tenants = tenants.filter((t) => t.unit === UNIT_3_NAME);
	return unit3Tenants.length > 0 ? UNIT_3_TOTAL_RENT / unit3Tenants.length : 0;
}

function updateUnit3Rents(tenants: Tenant[]): Tenant[] {
	const unit3Rent = calculateUnit3Rent(tenants);
	return tenants.map((tenant) =>
		tenant.unit === UNIT_3_NAME ? { ...tenant, rent: unit3Rent } : tenant
	);
}

// Default tenant data
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
		id: 'ging',
		name: 'Ging Bagro',
		unit: 'Unit 3 (10 pax) - up/down',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'ryzza',
		name: 'Ryzza Maglanque',
		unit: 'Unit 3 (10 pax) - up/down',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'shane',
		name: 'Shane Mikaela Galang',
		unit: 'Unit 3 (10 pax) - up/down',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'shiky',
		name: 'Shiky Cagaitan',
		unit: 'Unit 3 (10 pax) - up/down',
		rent: 1000,
		payment: 0,
		paymentDate: '',
		notes: ''
	},
	{
		id: 'lyn',
		name: 'Lyn Villanueva',
		unit: 'Unit 3 (10 pax) - up/down',
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
	{ name: 'Zedd', percentage: 30 },
	{ name: 'Mommy', percentage: 35 },
	{ name: 'Maru', percentage: 35 }
];

// Create stores with localStorage integration
function createPersistentStore<T>(storageKey: string, defaultValue: T) {
	const initialValue = loadFromStorage(storageKey, defaultValue);
	const store = writable<T>(initialValue);

	// Save to localStorage on every update
	store.subscribe((value) => {
		saveToStorage(storageKey, value);
	});

	return store;
}

// Initialize stores
export const tenants = createPersistentStore(
	STORAGE_KEYS.TENANTS,
	updateUnit3Rents(defaultTenants)
);
export const expenses = createPersistentStore(STORAGE_KEYS.EXPENSES, defaultExpenses);
export const shareholders = createPersistentStore(STORAGE_KEYS.SHAREHOLDERS, defaultShareholders);
export const currentMonth = createPersistentStore(
	STORAGE_KEYS.CURRENT_MONTH,
	new Date().toISOString().slice(0, 7)
);
export const monthlyNotes = createPersistentStore(STORAGE_KEYS.MONTHLY_NOTES, '');

// Store management functions
export function addTenant(unit: string): void {
	tenants.update((currentTenants) => {
		const newId = `tenant-${Date.now()}`;
		const newTenant: Tenant = {
			id: newId,
			name: 'New Tenant',
			unit,
			rent: unit === UNIT_3_NAME ? 0 : 2000, // Will be calculated for Unit 3
			payment: 0,
			paymentDate: '',
			notes: ''
		};
		const updatedTenants = [...currentTenants, newTenant];
		return updateUnit3Rents(updatedTenants);
	});
}

export function removeTenant(tenantId: string): Tenant | null {
	let removedTenant: Tenant | null = null;
	tenants.update((currentTenants) => {
		const tenantToRemove = currentTenants.find((t) => t.id === tenantId);
		if (tenantToRemove) {
			removedTenant = tenantToRemove;
			const updatedTenants = currentTenants.filter((t) => t.id !== tenantId);
			return updateUnit3Rents(updatedTenants);
		}
		return currentTenants;
	});
	return removedTenant;
}

export function restoreTenant(tenant: Tenant): void {
	tenants.update((currentTenants) => {
		const updatedTenants = [...currentTenants, tenant];
		return updateUnit3Rents(updatedTenants);
	});
}

export function markAllPaid(): void {
	const today = new Date().toISOString().split('T')[0];
	tenants.update((currentTenants) =>
		currentTenants.map((tenant) => ({
			...tenant,
			payment: tenant.rent,
			paymentDate: today
		}))
	);
}

// Reset function to clear all data
export function resetToDefaults(): void {
	tenants.set(updateUnit3Rents([...defaultTenants]));
	expenses.set({ ...defaultExpenses });
	monthlyNotes.set('');
	currentMonth.set(new Date().toISOString().slice(0, 7));
}
