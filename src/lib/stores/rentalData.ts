import { writable } from 'svelte/store';
import type { Tenant, Expenses, Shareholder } from '../types/index.js';

// Default tenant data
const defaultTenants: Tenant[] = [
  { id: 'franz', name: 'Franz', unit: 'Unit 1', rent: 2000, payment: 0, paymentDate: '', notes: '' },
  { id: 'ging', name: 'Ging Bagro', unit: 'Unit 3', rent: 1000, payment: 0, paymentDate: '', notes: '' },
  { id: 'ryzza', name: 'Ryzza Maglanque', unit: 'Unit 3', rent: 1000, payment: 0, paymentDate: '', notes: '' },
  { id: 'shane', name: 'Shane Mikaela Galang', unit: 'Unit 3', rent: 1000, payment: 0, paymentDate: '', notes: '' },
  { id: 'shiky', name: 'Shiky Cagaitan', unit: 'Unit 3', rent: 1000, payment: 0, paymentDate: '', notes: '' },
  { id: 'lyn', name: 'Lyn Villanueva', unit: 'Unit 3', rent: 1000, payment: 0, paymentDate: '', notes: '' }
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

// Create stores
export const tenants = writable<Tenant[]>(defaultTenants);
export const expenses = writable<Expenses>(defaultExpenses);
export const shareholders = writable<Shareholder[]>(defaultShareholders);
export const currentMonth = writable<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM format
export const monthlyNotes = writable<string>('');

// Reset function to clear all data
export function resetToDefaults(): void {
  tenants.set([...defaultTenants]);
  expenses.set({...defaultExpenses});
  monthlyNotes.set('');
  currentMonth.set(new Date().toISOString().slice(0, 7));
}
