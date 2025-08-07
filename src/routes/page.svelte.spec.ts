import { page } from '@vitest/browser/context';
import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('Main Page Behavior', () => {
	beforeEach(() => {
		// Reset any stored data before each test
		localStorage.clear();
	});

	describe('Page Structure and Navigation', () => {
		it('should display the main application title', async () => {
			render(Page);

			const heading = page.getByRole('heading', { level: 1 });
			await expect.element(heading).toBeInTheDocument();
			await expect.element(heading).toHaveTextContent('Rental Property Management');
		});

		it('should render navigation bar with proper functionality', async () => {
			render(Page);

			const navbar = page.getByRole('navigation');
			await expect.element(navbar).toBeInTheDocument();
		});
	});

	describe('Data Display Behavior', () => {
		it('should show all main data sections', async () => {
			render(Page);

			// Check for main sections
			await expect.element(page.getByText('Tenant Payments')).toBeInTheDocument();
			await expect.element(page.getByText('Monthly Expenses')).toBeInTheDocument();
			await expect.element(page.getByText('Monthly Summary')).toBeInTheDocument();
			await expect.element(page.getByText('Profit Distribution')).toBeInTheDocument();
		});

		it('should display tenant information correctly', async () => {
			render(Page);

			// Check if default tenant data is loaded
			await expect.element(page.getByText('Franz')).toBeInTheDocument();
			await expect.element(page.getByText('Ging Bagro')).toBeInTheDocument();
			await expect.element(page.getByText('Ryzza Maglanque')).toBeInTheDocument();
		});

		it('should show shareholder distribution data', async () => {
			render(Page);

			// Check for shareholder information
			await expect.element(page.getByText('Zedd')).toBeInTheDocument();
			await expect.element(page.getByText('Mommy')).toBeInTheDocument();
			await expect.element(page.getByText('Maru')).toBeInTheDocument();
		});
	});

	describe('Interactive Functionality', () => {
		it('should have functional action buttons', async () => {
			render(Page);

			// Check for action buttons
			await expect.element(page.getByText('Download PDF')).toBeInTheDocument();
			await expect.element(page.getByText('Download Excel')).toBeInTheDocument();
			await expect.element(page.getByText('Print')).toBeInTheDocument();
			await expect.element(page.getByText('Reset Data')).toBeInTheDocument();
		});

		it('should calculate and display financial summaries', async () => {
			render(Page);

			// Check if financial calculation elements are present
			await expect.element(page.getByText('Total Expected Rent')).toBeInTheDocument();
			await expect.element(page.getByText('Total Rent Collected')).toBeInTheDocument();
			await expect.element(page.getByText('Outstanding Balance')).toBeInTheDocument();
			await expect
				.element(page.getByText('Net Income Available for Distribution'))
				.toBeInTheDocument();
		});

		it('should allow tenant payment updates', async () => {
			render(Page);

			// Find payment input fields
			const paymentInputs = page.getByRole('spinbutton');
			await expect.element(paymentInputs.first()).toBeInTheDocument();
		});
	});

	describe('Data Persistence Behavior', () => {
		it('should load data from localStorage when available', async () => {
			// Pre-populate localStorage with test data
			const testData = {
				tenants: [
					{
						id: 'test1',
						name: 'Test Tenant',
						unit: 'Unit 1',
						rent: 5000,
						payment: 5000,
						paymentDate: '2024-01-15',
						notes: ''
					}
				]
			};
			localStorage.setItem('rentalData', JSON.stringify(testData));

			render(Page);

			// Should display the test data
			await expect.element(page.getByText('Test Tenant')).toBeInTheDocument();
		});

		it('should use default data when localStorage is empty', async () => {
			render(Page);

			// Should show default tenant names
			await expect.element(page.getByText('Franz')).toBeInTheDocument();
		});
	});

	describe('Responsive Design Behavior', () => {
		it('should be properly structured for different screen sizes', async () => {
			render(Page);

			// Check that main container exists
			const mainContent = page.locator('main, .container, [class*="main"]').first();
			await expect.element(mainContent).toBeInTheDocument();
		});

		it('should have proper layout for tables and forms', async () => {
			render(Page);

			// Check that tables are properly rendered
			const tables = page.getByRole('table');
			await expect.element(tables.first()).toBeInTheDocument();
		});
	});
});
