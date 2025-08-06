import * as XLSX from 'xlsx';
import { calculateTenantBalance, calculateTotalCollected, calculateNetIncome, calculateShareholderDistribution } from './calculations.js';
import type { Tenant, Expenses, Shareholder } from '../types/index.js';

export function exportToExcel(
  tenants: Tenant[], 
  expenses: Expenses, 
  shareholders: Shareholder[], 
  currentMonth: string, 
  notes: string = ''
): void {
  const workbook = XLSX.utils.book_new();
  
  // Tenant Payments Sheet
  const tenantData = tenants.map(tenant => {
    const calc = calculateTenantBalance(tenant.rent, tenant.payment);
    return {
      'Tenant Name': tenant.name,
      'Unit': tenant.unit,
      'Monthly Rent': tenant.rent,
      'Amount Paid': tenant.payment,
      'Payment Date': tenant.paymentDate || '',
      'Balance': Math.abs(calc.balance),
      'Status': calc.status
    };
  });
  
  const tenantSheet = XLSX.utils.json_to_sheet(tenantData);
  XLSX.utils.book_append_sheet(workbook, tenantSheet, 'Tenant Payments');
  
  // Expenses Sheet
  const expenseData = Object.entries(expenses).map(([key, value]) => ({
    'Expense Type': key.charAt(0).toUpperCase() + key.slice(1),
    'Amount': value
  }));
  
  const expenseSheet = XLSX.utils.json_to_sheet(expenseData);
  XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
  
  // Summary Sheet
  const totalCollected = calculateTotalCollected(tenants.map(t => t.payment));
  const totalExpected = tenants.reduce((sum, tenant) => sum + tenant.rent, 0);
  const netIncome = calculateNetIncome(totalCollected, expenses);
  const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);
  
  const summaryData = [
    { 'Item': 'Total Expected Rent', 'Amount': totalExpected },
    { 'Item': 'Total Rent Collected', 'Amount': totalCollected },
    { 'Item': 'Outstanding Balance', 'Amount': totalExpected - totalCollected },
    { 'Item': 'Total Expenses', 'Amount': totalExpenses },
    { 'Item': 'Net Income for Distribution', 'Amount': netIncome }
  ];
  
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Shareholder Distribution Sheet
  const distributionData = calculateShareholderDistribution(netIncome, shareholders).map(shareholder => ({
    'Shareholder': shareholder.name,
    'Ownership Percentage': shareholder.percentage,
    'Distribution Amount': shareholder.amount
  }));
  
  const distributionSheet = XLSX.utils.json_to_sheet(distributionData);
  XLSX.utils.book_append_sheet(workbook, distributionSheet, 'Distribution');
  
  // Notes Sheet
  if (notes) {
    const notesData = [{ 'Monthly Notes': notes }];
    const notesSheet = XLSX.utils.json_to_sheet(notesData);
    XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes');
  }
  
  // Save the Excel file
  const fileName = `rental-report-${currentMonth}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
