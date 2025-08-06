<script lang="ts">
  import { tenants, expenses, shareholders, currentMonth, monthlyNotes, resetToDefaults } from '$lib/stores/rentalData.js';
  import { calculateNetIncome, calculateTotalCollected } from '$lib/utils/calculations.js';
  import type { Tenant, Expenses, Shareholder } from '$lib/types/index.js';
  
  import TenantTable from '$lib/components/TenantTable.svelte';
  import ExpenseTable from '$lib/components/ExpenseTable.svelte';
  import SummarySection from '$lib/components/SummarySection.svelte';
  import ShareholderTable from '$lib/components/ShareholderTable.svelte';
  import ActionButtons from '$lib/components/ActionButtons.svelte';
  
  let currentTenants: Tenant[] = [];
  let currentExpenses: Expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 };
  let currentShareholders: Shareholder[] = [];
  let currentMonthValue: string = '';
  let currentNotes: string = '';
  
  // Subscribe to stores
  $: currentTenants = $tenants;
  $: currentExpenses = $expenses;
  $: currentShareholders = $shareholders;
  $: currentMonthValue = $currentMonth;
  $: currentNotes = $monthlyNotes;
  
  // Calculated values
  $: totalCollected = calculateTotalCollected(currentTenants.map(t => t.payment));
  $: netIncome = calculateNetIncome(totalCollected, currentExpenses);
  
  function handleTenantUpdate(event: CustomEvent<{ tenantId: string; field: keyof Tenant; value: string | number }>) {
    const { tenantId, field, value } = event.detail;
    tenants.update(tenantList => 
      tenantList.map(tenant => 
        tenant.id === tenantId ? { ...tenant, [field]: value } : tenant
      )
    );
  }
  
  function handleExpenseUpdate(event: CustomEvent<{ field: keyof Expenses; value: number }>) {
    const { field, value } = event.detail;
    expenses.update(expenseObj => ({
      ...expenseObj,
      [field]: value
    }));
  }
  
  function handleMonthChange(event: Event) {
    const target = event.target as HTMLInputElement;
    currentMonth.set(target.value);
  }
  
  function handleNotesChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    monthlyNotes.set(target.value);
  }
  
  function handleReset() {
    resetToDefaults();
  }
</script>

<svelte:head>
  <title>Rental Property Management - {new Date(currentMonthValue + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  <!-- Header -->
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Rental Property Management</h1>
    
    <div class="flex items-center justify-center gap-4 mb-6">
      <label for="month-selector" class="text-lg font-medium text-gray-700">Month:</label>
      <input 
        id="month-selector"
        type="month" 
        value={currentMonthValue}
        onchange={handleMonthChange}
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <!-- Action Buttons -->
    <ActionButtons 
      tenants={currentTenants}
      expenses={currentExpenses}
      shareholders={currentShareholders}
      currentMonth={currentMonthValue}
      notes={currentNotes}
      onreset={handleReset}
    />
  </div>
  
  <!-- Tenant Payments -->
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Tenant Payments</h2>
    <TenantTable 
      tenants={currentTenants} 
      onupdateTenant={handleTenantUpdate}
    />
  </div>
  
  <!-- Expenses -->
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Monthly Expenses</h2>
    <ExpenseTable 
      expenses={currentExpenses}
      onupdateExpense={handleExpenseUpdate}
    />
  </div>
  
  <!-- Summary -->
  <div class="mb-8">
    <SummarySection 
      tenants={currentTenants}
      expenses={currentExpenses}
    />
  </div>
  
  <!-- Shareholder Distribution -->
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Profit Distribution</h2>
    <ShareholderTable 
      shareholders={currentShareholders}
      netIncome={netIncome}
    />
  </div>
  
  <!-- Notes Section -->
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Monthly Notes</h2>
    <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
      <textarea 
        value={currentNotes}
        oninput={handleNotesChange}
        rows="4" 
        class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        placeholder="Add notes about this month's rental activities, maintenance issues, tenant communications, etc."
      ></textarea>
    </div>
  </div>
</div>

<style>
  @media print {
    .container {
      max-width: none !important;
      padding: 0 !important;
    }
    
    h1, h2 {
      color: #000 !important;
      page-break-after: avoid;
    }
    
    .bg-blue-50, .bg-green-100, .bg-purple-100, .bg-orange-100 {
      background-color: #f8f9fa !important;
    }
  }
</style>
