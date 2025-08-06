<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { calculateTenantBalance, formatCurrency } from '$lib/utils/calculations.js';
  import type { Tenant } from '$lib/types/index.js';
  
  interface UpdateTenantEvent {
    tenantId: string;
    field: keyof Tenant;
    value: string | number;
  }
  
  interface Props {
    tenants: Tenant[];
  }
  
  let { tenants = [] }: Props = $props();
  
  const dispatch = createEventDispatcher<{
    updateTenant: UpdateTenantEvent;
  }>();
  
  function updatePayment(tenantId: string, field: keyof Tenant, value: string | number) {
    dispatch('updateTenant', { tenantId, field, value });
  }
  
  function getTenantCalculation(tenant: Tenant) {
    return calculateTenantBalance(tenant.rent, tenant.payment);
  }
</script>

<div class="overflow-x-auto">
  <table class="w-full border-collapse border border-gray-300">
    <thead>
      <tr class="bg-green-500 text-white">
        <th class="border border-gray-300 px-4 py-2 text-left">Unit/Tenant</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Monthly Rent (₱)</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Amount Paid (₱)</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Balance (₱)</th>
        <th class="border border-gray-300 px-4 py-2 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {#each tenants as tenant (tenant.id)}
        {@const calculation = getTenantCalculation(tenant)}
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-2 font-medium">{tenant.name}</td>
          <td class="border border-gray-300 px-4 py-2 text-right">{formatCurrency(tenant.rent)}</td>
          <td class="border border-gray-300 px-4 py-2">
            <input 
              type="number" 
              class="table-input text-right" 
              value={tenant.payment}
              min="0"
              step="0.01"
              oninput={(e) => updatePayment(tenant.id, 'payment', parseFloat(e.currentTarget.value) || 0)}
            />
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <input 
              type="date" 
              class="table-input" 
              value={tenant.paymentDate}
              oninput={(e) => updatePayment(tenant.id, 'paymentDate', e.currentTarget.value)}
            />
          </td>
          <td class="border border-gray-300 px-4 py-2 text-right font-mono">
            {formatCurrency(Math.abs(calculation.balance))}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <span class="px-2 py-1 rounded-full text-xs font-medium
              {calculation.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                calculation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'}">
              {calculation.status}
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
