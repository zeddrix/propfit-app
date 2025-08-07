import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import TenantTable from './TenantTable.svelte';
import { tenants, resetToDefaults } from '$lib/stores/rentalData.js';
import type { Tenant } from '$lib/types/index.js';

describe('TenantTable Core Functionality', () => {
	const mockTenants: Tenant[] = [
		{
			id: 'tenant1',
			name: 'John Doe',
			unit: 'Unit 1 (2 pax) - studio type 1',
			rent: 5000,
			payment: 0,
			paymentDate: '',
			notes: ''
		},
		{
			id: 'tenant2',
			name: 'Jane Smith',
			unit: 'Unit 3 (10 pax) - up/down',
			rent: 2500,
			payment: 2500,
			paymentDate: '2024-01-15',
			notes: 'Paid on time'
		}
	];

	beforeEach(() => {
		resetToDefaults();
		tenants.set(mockTenants);
	});

	describe('Table Rendering Behavior', () => {
		it('should display all tenant information correctly', () => {
			render(TenantTable, { tenants: mockTenants });

			// Check if tenant names are displayed
			expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
			expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();

			// Check if rent amounts are displayed
			expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
			expect(screen.getByDisplayValue('2500')).toBeInTheDocument();
		});

		it('should display payment status correctly', () => {
			render(TenantTable, { tenants: mockTenants });

			// Check balance calculations are reflected in display
			const balanceElements = screen.getAllByText(/₱\d+/);
			expect(balanceElements.length).toBeGreaterThan(0);
		});

		it('should show appropriate action buttons', () => {
			render(TenantTable, { tenants: mockTenants });

			// Should have Mark All Paid button
			expect(screen.getByText('Mark All Paid')).toBeInTheDocument();

			// Should have Remove buttons for applicable tenants
			const removeButtons = screen.getAllByText('Remove');
			expect(removeButtons.length).toBeGreaterThan(0);
		});
	});

	describe('Payment Update Behavior', () => {
		it('should update tenant payment when amount is changed', async () => {
			const { component } = render(TenantTable, { tenants: mockTenants });

			let updateEvent: CustomEvent | null = null;
			component.$on('updateTenant', (event) => {
				updateEvent = event;
			});

			// Find payment input for John Doe and update it
			const paymentInput = screen.getByDisplayValue('0');
			await fireEvent.input(paymentInput, { target: { value: '3000' } });

			expect(updateEvent).toBeTruthy();
			expect(updateEvent?.detail.field).toBe('payment');
			expect(updateEvent?.detail.value).toBe(3000);
		});

		it('should update payment date when date is changed', async () => {
			const { component } = render(TenantTable, { tenants: mockTenants });

			let updateEvent: CustomEvent | null = null;
			component.$on('updateTenant', (event) => {
				updateEvent = event;
			});

			const dateInput = screen
				.getAllByRole('textbox')
				.find((input) => input.getAttribute('type') === 'date');

			if (dateInput) {
				await fireEvent.input(dateInput, { target: { value: '2024-01-20' } });

				expect(updateEvent).toBeTruthy();
				expect(updateEvent?.detail.field).toBe('paymentDate');
				expect(updateEvent?.detail.value).toBe('2024-01-20');
			}
		});
	});

	describe('Tenant Management Behavior', () => {
		it('should handle Mark All Paid functionality', async () => {
			render(TenantTable, { tenants: mockTenants });

			const markAllPaidButton = screen.getByText('Mark All Paid');
			await fireEvent.click(markAllPaidButton);

			// Verify all tenants have been marked as paid
			const updatedTenants = get(tenants);
			updatedTenants.forEach((tenant) => {
				expect(tenant.payment).toBe(tenant.rent);
				expect(tenant.paymentDate).toBeTruthy();
			});
		});

		it('should show undo functionality when tenant is removed', async () => {
			render(TenantTable, { tenants: mockTenants });

			const removeButtons = screen.getAllByText('Remove');
			if (removeButtons.length > 0) {
				await fireEvent.click(removeButtons[0]);

				// Should show undo option
				expect(screen.getByText('Undo')).toBeInTheDocument();
			}
		});
	});

	describe('Data Validation Behavior', () => {
		it('should handle empty tenant list gracefully', () => {
			render(TenantTable, { tenants: [] });

			// Should not throw error and should render empty state appropriately
			expect(screen.queryByText('Mark All Paid')).toBeInTheDocument();
		});

		it('should validate payment amounts correctly', async () => {
			const { component } = render(TenantTable, { tenants: mockTenants });

			let updateEvent: CustomEvent | null = null;
			component.$on('updateTenant', (event) => {
				updateEvent = event;
			});

			const paymentInput = screen.getByDisplayValue('0');

			// Test negative value handling
			await fireEvent.input(paymentInput, { target: { value: '-100' } });

			// Should convert negative to 0 or handle appropriately
			expect(updateEvent?.detail.value).toBeGreaterThanOrEqual(0);
		});
	});

	describe('Accessibility Behavior', () => {
		it('should have proper form labels and inputs', () => {
			render(TenantTable, { tenants: mockTenants });

			// Check that inputs have proper attributes
			const nameInputs = screen.getAllByRole('textbox');
			nameInputs.forEach((input) => {
				expect(input).toHaveAttribute('type');
			});

			const numberInputs = screen.getAllByRole('spinbutton');
			numberInputs.forEach((input) => {
				expect(input).toHaveAttribute('min');
				expect(input).toHaveAttribute('step');
			});
		});

		it('should have keyboard navigation support', () => {
			render(TenantTable, { tenants: mockTenants });

			const buttons = screen.getAllByRole('button');
			buttons.forEach((button) => {
				expect(button).not.toHaveAttribute('tabindex', '-1');
			});
		});
	});
});
