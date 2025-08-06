import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import TenantTable from './TenantTable.svelte';
import { tenants, resetToDefaults } from '$lib/stores/rentalData.js';
import type { Tenant } from '$lib/types/index.js';

describe('TenantTable Enhanced Features', () => {
	const mockTenants: Tenant[] = [
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
		}
	];

	beforeEach(() => {
		// Reset stores before each test
		resetToDefaults();
		tenants.set(mockTenants);
	});

	describe('Task 1: Editable Tenant Names', () => {
		it('should display tenant names in editable input fields', () => {
			render(TenantTable, { tenants: mockTenants });

			// Check that tenant names are in input fields
			const franzInput = screen.getByDisplayValue('Franz');
			const gingInput = screen.getByDisplayValue('Ging Bagro');

			expect(franzInput).toBeInTheDocument();
			expect(gingInput).toBeInTheDocument();
			expect(franzInput.tagName).toBe('INPUT');
			expect(gingInput.tagName).toBe('INPUT');
		});

		it('should trigger update event when tenant name is changed', async () => {
			const { component } = render(TenantTable, { tenants: mockTenants });

			let updateEvent: CustomEvent | null = null;
			component.$on('updateTenant', (event) => {
				updateEvent = event;
			});

			const franzInput = screen.getByDisplayValue('Franz');
			await fireEvent.input(franzInput, { target: { value: 'Franz Updated' } });

			expect(updateEvent).toBeTruthy();
			expect(updateEvent?.detail).toEqual({
				tenantId: 'franz',
				field: 'name',
				value: 'Franz Updated'
			});
		});

		it('should have proper accessibility attributes for name inputs', () => {
			render(TenantTable, { tenants: mockTenants });

			const franzInput = screen.getByDisplayValue('Franz');
			expect(franzInput).toHaveClass('table-input');
			expect(franzInput.getAttribute('type')).toBe('text');
		});
	});

	describe('Task 2: Separate Unit Tables', () => {
		it('should group tenants by unit correctly', () => {
			render(TenantTable, { tenants: mockTenants });

			// Check for unit headings
			expect(screen.getByText('Unit 1 (2 pax) - studio type 1')).toBeInTheDocument();
			expect(screen.getByText('Unit 3 (10 pax) - up/down')).toBeInTheDocument();
		});

		it('should show Franz only in Unit 1 table', () => {
			render(TenantTable, { tenants: mockTenants });

			const unit1Section = screen.getByText('Unit 1 (2 pax) - studio type 1').closest('div');
			const unit3Section = screen.getByText('Unit 3 (10 pax) - up/down').closest('div');

			// Franz should be in Unit 1 section
			expect(unit1Section).toContainElement(screen.getByDisplayValue('Franz'));
			// Franz should not be in Unit 3 section
			expect(unit3Section).not.toContainElement(screen.getByDisplayValue('Franz'));
		});

		it('should show other tenants only in Unit 3 table', () => {
			render(TenantTable, { tenants: mockTenants });

			const unit1Section = screen.getByText('Unit 1 (2 pax) - studio type 1').closest('div');
			const unit3Section = screen.getByText('Unit 3 (10 pax) - up/down').closest('div');

			// Unit 3 tenants should be in Unit 3 section
			expect(unit3Section).toContainElement(screen.getByDisplayValue('Ging Bagro'));
			expect(unit3Section).toContainElement(screen.getByDisplayValue('Ryzza Maglanque'));

			// Unit 3 tenants should not be in Unit 1 section
			expect(unit1Section).not.toContainElement(screen.getByDisplayValue('Ging Bagro'));
			expect(unit1Section).not.toContainElement(screen.getByDisplayValue('Ryzza Maglanque'));
		});

		it('should only show Add Tenant button for Unit 3', () => {
			render(TenantTable, { tenants: mockTenants });

			const addTenantButtons = screen.getAllByText('Add Tenant');
			expect(addTenantButtons).toHaveLength(1);

			const unit3Section = screen.getByText('Unit 3 (10 pax) - up/down').closest('div');
			expect(unit3Section).toContainElement(addTenantButtons[0]);
		});
	});

	describe('Task 3: 1000-Step Amount Input', () => {
		it('should have step="1000" attribute on amount paid inputs', () => {
			render(TenantTable, { tenants: mockTenants });

			const amountInputs = screen.getAllByRole('spinbutton');
			amountInputs.forEach((input) => {
				if (input.getAttribute('type') === 'number') {
					expect(input.getAttribute('step')).toBe('1000');
				}
			});
		});

		it('should have minimum value constraint on amount inputs', () => {
			render(TenantTable, { tenants: mockTenants });

			const amountInputs = screen.getAllByRole('spinbutton');
			amountInputs.forEach((input) => {
				if (input.getAttribute('type') === 'number') {
					expect(input.getAttribute('min')).toBe('0');
				}
			});
		});
	});

	describe('Task 4: Cursor Pointer on Buttons', () => {
		it('should have cursor-pointer class on all buttons', () => {
			render(TenantTable, { tenants: mockTenants });

			const buttons = screen.getAllByRole('button');
			buttons.forEach((button) => {
				expect(button).toHaveClass('cursor-pointer');
			});
		});

		it('should have cursor-pointer class on number inputs', () => {
			render(TenantTable, { tenants: mockTenants });

			const numberInputs = screen.getAllByRole('spinbutton');
			numberInputs.forEach((input) => {
				expect(input).toHaveClass('cursor-pointer');
			});
		});
	});

	describe('Task 5: Mark All Paid Button', () => {
		it('should render Mark All Paid button', () => {
			render(TenantTable, { tenants: mockTenants });

			const markAllPaidButton = screen.getByText('Mark All Paid');
			expect(markAllPaidButton).toBeInTheDocument();
			expect(markAllPaidButton.tagName).toBe('BUTTON');
		});

		it('should update all tenants when Mark All Paid is clicked', async () => {
			render(TenantTable, { tenants: mockTenants });

			const markAllPaidButton = screen.getByText('Mark All Paid');
			await fireEvent.click(markAllPaidButton);

			// Check that store was updated
			const updatedTenants = get(tenants);
			updatedTenants.forEach((tenant) => {
				expect(tenant.payment).toBe(tenant.rent);
				expect(tenant.paymentDate).toBeTruthy();
			});
		});

		it('should set payment date to today when Mark All Paid is clicked', async () => {
			render(TenantTable, { tenants: mockTenants });

			const today = new Date().toISOString().split('T')[0];
			const markAllPaidButton = screen.getByText('Mark All Paid');

			await fireEvent.click(markAllPaidButton);

			const updatedTenants = get(tenants);
			updatedTenants.forEach((tenant) => {
				expect(tenant.paymentDate).toBe(today);
			});
		});
	});

	describe('Task 6: Add/Remove Tenants with Undo Toast', () => {
		it('should add new tenant to Unit 3 when Add Tenant button is clicked', async () => {
			render(TenantTable, { tenants: mockTenants });

			const initialTenantCount = get(tenants).length;
			const addTenantButton = screen.getByText('Add Tenant');

			await fireEvent.click(addTenantButton);

			const updatedTenants = get(tenants);
			expect(updatedTenants.length).toBe(initialTenantCount + 1);

			const newTenant = updatedTenants[updatedTenants.length - 1];
			expect(newTenant.unit).toBe('Unit 3 (10 pax) - up/down');
			expect(newTenant.name).toBe('New Tenant');
		});

		it('should show Remove button for Unit 3 tenants only', () => {
			render(TenantTable, { tenants: mockTenants });

			const removeButtons = screen.getAllByText('Remove');

			// Should have Remove buttons for Unit 3 tenants only
			const unit3Tenants = mockTenants.filter((t) => t.unit === 'Unit 3 (10 pax) - up/down');
			expect(removeButtons).toHaveLength(unit3Tenants.length);
		});

		it('should show undo toast when tenant is removed', async () => {
			render(TenantTable, { tenants: mockTenants });

			const removeButtons = screen.getAllByText('Remove');
			await fireEvent.click(removeButtons[0]);

			// Check for undo toast
			expect(screen.getByText(/Removed/)).toBeInTheDocument();
			expect(screen.getByText('Undo')).toBeInTheDocument();
		});

		it('should restore tenant when undo is clicked', async () => {
			render(TenantTable, { tenants: mockTenants });

			const initialTenantCount = get(tenants).length;
			const removeButtons = screen.getAllByText('Remove');

			// Remove a tenant
			await fireEvent.click(removeButtons[0]);
			expect(get(tenants).length).toBe(initialTenantCount - 1);

			// Click undo
			const undoButton = screen.getByText('Undo');
			await fireEvent.click(undoButton);

			// Tenant should be restored
			expect(get(tenants).length).toBe(initialTenantCount);
		});
	});

	describe('Task 8: Unit 3 Dynamic Rent Calculation', () => {
		it('should calculate Unit 3 rent as 5000 divided by number of tenants', () => {
			const unit3Tenants = mockTenants.filter((t) => t.unit === 'Unit 3 (10 pax) - up/down');
			const expectedRentPerTenant = 5000 / unit3Tenants.length;

			render(TenantTable, { tenants: mockTenants });

			unit3Tenants.forEach((tenant) => {
				expect(tenant.rent).toBe(expectedRentPerTenant);
			});
		});

		it('should recalculate rent when tenant is added to Unit 3', async () => {
			render(TenantTable, { tenants: mockTenants });

			const addTenantButton = screen.getByText('Add Tenant');
			await fireEvent.click(addTenantButton);

			const updatedTenants = get(tenants);
			const unit3Tenants = updatedTenants.filter((t) => t.unit === 'Unit 3 (10 pax) - up/down');
			const expectedRentPerTenant = 5000 / unit3Tenants.length;

			unit3Tenants.forEach((tenant) => {
				expect(tenant.rent).toBe(expectedRentPerTenant);
			});
		});

		it('should recalculate rent when tenant is removed from Unit 3', async () => {
			render(TenantTable, { tenants: mockTenants });

			const removeButtons = screen.getAllByText('Remove');
			await fireEvent.click(removeButtons[0]);

			const updatedTenants = get(tenants);
			const unit3Tenants = updatedTenants.filter((t) => t.unit === 'Unit 3 (10 pax) - up/down');
			const expectedRentPerTenant = unit3Tenants.length > 0 ? 5000 / unit3Tenants.length : 0;

			unit3Tenants.forEach((tenant) => {
				expect(tenant.rent).toBe(expectedRentPerTenant);
			});
		});

		it('should maintain Unit 1 rent unchanged', async () => {
			render(TenantTable, { tenants: mockTenants });

			const addTenantButton = screen.getByText('Add Tenant');
			await fireEvent.click(addTenantButton);

			const updatedTenants = get(tenants);
			const franzTenant = updatedTenants.find((t) => t.id === 'franz');
			expect(franzTenant?.rent).toBe(2000); // Should remain unchanged
		});
	});
});
