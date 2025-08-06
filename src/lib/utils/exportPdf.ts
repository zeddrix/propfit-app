import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
	formatCurrency,
	calculateTenantBalance,
	calculateTotalCollected,
	calculateNetIncome,
	calculateShareholderDistribution
} from './calculations.js';
import type { Tenant, Expenses, Shareholder } from '../types/index.js';

declare module 'jspdf' {
	interface jsPDF {
		autoTable: (options: {
			startY?: number;
			head?: string[][];
			body?: (string | number)[][];
			theme?: string;
			headStyles?: Record<string, unknown>;
		}) => jsPDF;
		lastAutoTable: { finalY: number };
	}
}

export function exportToPdf(
	tenants: Tenant[],
	expenses: Expenses,
	shareholders: Shareholder[],
	currentMonth: string,
	notes: string = ''
): void {
	const doc = new jsPDF();

	// Header
	doc.setFontSize(18);
	doc.text('Rental Property Management Report', 105, 20, { align: 'center' });

	doc.setFontSize(14);
	doc.text(
		`Month: ${new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
		105,
		30,
		{ align: 'center' }
	);

	let yPosition = 45;

	// Tenant Payment Table
	doc.setFontSize(12);
	doc.text('Tenant Payments', 20, yPosition);
	yPosition += 5;

	const tenantData = tenants.map((tenant) => {
		const calc = calculateTenantBalance(tenant.rent, tenant.payment);
		return [
			tenant.name,
			formatCurrency(tenant.rent),
			formatCurrency(tenant.payment),
			tenant.paymentDate || '-',
			formatCurrency(Math.abs(calc.balance)),
			calc.status
		];
	});

	doc.autoTable({
		startY: yPosition,
		head: [['Tenant', 'Rent', 'Paid', 'Date', 'Balance', 'Status']],
		body: tenantData,
		theme: 'grid',
		headStyles: { fillColor: [76, 175, 80] }
	});

	yPosition = doc.lastAutoTable.finalY + 15;

	// Expenses Table
	doc.text('Monthly Expenses', 20, yPosition);
	yPosition += 5;

	const expenseData = Object.entries(expenses).map(([key, value]) => [
		key.charAt(0).toUpperCase() + key.slice(1),
		formatCurrency(value)
	]);

	doc.autoTable({
		startY: yPosition,
		head: [['Expense Type', 'Amount']],
		body: expenseData,
		theme: 'grid',
		headStyles: { fillColor: [255, 152, 0] }
	});

	yPosition = doc.lastAutoTable.finalY + 15;

	// Summary
	const totalCollected = calculateTotalCollected(tenants.map((t) => t.payment));
	const totalExpected = tenants.reduce((sum, tenant) => sum + tenant.rent, 0);
	const netIncome = calculateNetIncome(totalCollected, expenses);
	const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);

	const summaryData = [
		['Total Expected Rent', formatCurrency(totalExpected)],
		['Total Rent Collected', formatCurrency(totalCollected)],
		['Outstanding Balance', formatCurrency(totalExpected - totalCollected)],
		['Total Expenses', formatCurrency(totalExpenses)],
		['Net Income for Distribution', formatCurrency(netIncome)]
	];

	doc.text('Monthly Summary', 20, yPosition);
	yPosition += 5;

	doc.autoTable({
		startY: yPosition,
		head: [['Item', 'Amount']],
		body: summaryData,
		theme: 'grid',
		headStyles: { fillColor: [33, 150, 243] }
	});

	yPosition = doc.lastAutoTable.finalY + 15;

	// Shareholder Distribution
	const distributionData = calculateShareholderDistribution(netIncome, shareholders);
	const shareholderTableData = distributionData.map((shareholder) => [
		shareholder.name,
		`${shareholder.percentage}%`,
		formatCurrency(shareholder.amount)
	]);

	doc.text('Shareholder Distribution', 20, yPosition);
	yPosition += 5;

	doc.autoTable({
		startY: yPosition,
		head: [['Shareholder', 'Ownership %', 'Distribution Amount']],
		body: shareholderTableData,
		theme: 'grid',
		headStyles: { fillColor: [156, 39, 176] }
	});

	// Notes
	if (notes) {
		yPosition = doc.lastAutoTable.finalY + 15;
		doc.text('Notes:', 20, yPosition);
		yPosition += 5;

		const splitNotes = doc.splitTextToSize(notes, 170);
		doc.text(splitNotes, 20, yPosition);
	}

	// Save the PDF
	const fileName = `rental-report-${currentMonth}.pdf`;
	doc.save(fileName);
}
