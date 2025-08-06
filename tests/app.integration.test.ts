import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';
import Page from '../src/routes/+page.svelte';

describe('Rental Management App Integration', () => {
  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = '';
  });

  it('renders all main sections', () => {
    render(Page);
    
    expect(screen.getByText('Rental Property Management')).toBeInTheDocument();
    expect(screen.getByText('Tenant Payments')).toBeInTheDocument();
    expect(screen.getByText('Monthly Expenses')).toBeInTheDocument();
    expect(screen.getByText('Monthly Summary')).toBeInTheDocument();
    expect(screen.getByText('Profit Distribution')).toBeInTheDocument();
  });

  it('displays default tenant data', () => {
    render(Page);
    
    // Check if default tenants are displayed
    expect(screen.getByText('Franz')).toBeInTheDocument();
    expect(screen.getByText('Ging Bagro')).toBeInTheDocument();
    expect(screen.getByText('Ryzza Maglanque')).toBeInTheDocument();
  });

  it('has functioning action buttons', () => {
    render(Page);
    
    // Check if action buttons are present
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByText('Download Excel')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
    expect(screen.getByText('Reset Data')).toBeInTheDocument();
  });

  it('displays monthly summary calculations', () => {
    render(Page);
    
    // Check if summary section is displaying
    expect(screen.getByText('Total Expected Rent')).toBeInTheDocument();
    expect(screen.getByText('Total Rent Collected')).toBeInTheDocument();
    expect(screen.getByText('Outstanding Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Net Income Available for Distribution')).toBeInTheDocument();
  });

  it('displays shareholder distribution', () => {
    render(Page);
    
    // Check if shareholder data is displayed
    expect(screen.getByText('Zedd')).toBeInTheDocument();
    expect(screen.getByText('Mommy')).toBeInTheDocument();
    expect(screen.getByText('Maru')).toBeInTheDocument();
  });
});
