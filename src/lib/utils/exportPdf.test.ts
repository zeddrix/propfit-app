import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToPdf } from './exportPdf.js';
import type { Tenant, Expenses, Shareholder } from '../types/index.js';

// Mock jsPDF with minimal essential behavior
const mockSave = vi.fn();
const mockAutoTable = vi.fn().mockReturnValue({});

const mockDoc = {
	save: mockSave,
	text: vi.fn(),
	setFontSize: vi.fn(),
	autoTable: mockAutoTable,
	lastAutoTable: { finalY: 100 },
	splitTextToSize: vi.fn().mockReturnValue(['line1', 'line2'])
};

const mockJsPDF = vi.fn().mockImplementation(() => mockDoc);

vi.mock('jspdf', () => ({
	default: mockJsPDF
}));

vi.mock('jspdf-autotable', () => ({}));

describe('PDF Export Functionality', () => {
	const mockTenants: Tenant[] = [
		{
			id: '1',
			name: 'John Doe',
			unit: 'Unit 1 (2 pax) - studio type 1',
			rent: 5000,
			payment: 5000,
			paymentDate: '2024-01-15',
			notes: ''
		}
	];

	const mockExpenses: Expenses = {
		internet: 1500,
		water: 800,
		electricity: 2000,
		maintenance: 500,
		other: 200
	};

	const mockShareholders: Shareholder[] = [
		{ name: 'Alice Smith', percentage: 50 },
		{ name: 'Bob Johnson', percentage: 50 }
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('PDF Generation Behavior', () => {
		it('should generate PDF with correct filename format', () => {
			exportToPdf(mockTenants, mockExpenses, mockShareholders, '2024-01', 'Test notes');

			expect(mockSave).toHaveBeenCalledWith('rental-report-2024-01.pdf');
		});

		it('should create PDF document for valid data', () => {
			exportToPdf(mockTenants, mockExpenses, mockShareholders, '2024-01');

			expect(mockJsPDF).toHaveBeenCalled();
			expect(mockSave).toHaveBeenCalled();
		});

		it('should handle empty tenant data gracefully', () => {
			const emptyExpenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 };

			expect(() => {
				exportToPdf([], emptyExpenses, [], '2024-01');
			}).not.toThrow();

			expect(mockSave).toHaveBeenCalled();
		});

		it('should include all required sections in PDF', () => {
			exportToPdf(mockTenants, mockExpenses, mockShareholders, '2024-01');

			// Verify that autoTable was called for all required sections
			expect(mockAutoTable).toHaveBeenCalledTimes(4); // Tenants, Expenses, Summary, Shareholders
		});
	});

	describe('Data Processing Behavior', () => {
		it('should process tenant data correctly', () => {
			exportToPdf(mockTenants, mockExpenses, mockShareholders, '2024-01');

			// Verify autoTable was called with tenant data
			const tenantTableCall = mockAutoTable.mock.calls.find((call) =>
				call[0]?.head?.[0]?.includes('Tenant Name')
			);
			expect(tenantTableCall).toBeDefined();
		});

		it('should include notes section when notes are provided', () => {
			const notes = 'This is a test note';
			exportToPdf(mockTenants, mockExpenses, mockShareholders, '2024-01', notes);

			// Verify that text method was called for notes
			expect(mockDoc.text).toHaveBeenCalledWith('Notes:', expect.any(Number), expect.any(Number));
		});

		it('should format month correctly in document', () => {
			exportToPdf(mockTenants, mockExpenses, mockShareholders, '2024-01');

			// Check if the formatted month is used somewhere in the document
			expect(mockDoc.text).toHaveBeenCalledWith(
				expect.stringContaining('January 2024'),
				expect.any(Number),
				expect.any(Number),
				expect.any(Object)
			);
		});
	});
});
