<script lang="ts">
	import {
		formatCurrency,
		calculateTotalCollected,
		calculateNetIncome
	} from '$lib/utils/calculations.js';
	import type { Tenant, Expenses } from '$lib/types/index.js';

	interface Props {
		tenants: Tenant[];
		expenses: Expenses;
	}

	let {
		tenants = [],
		expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 }
	}: Props = $props();

	let totalExpected = $derived(tenants.reduce((sum, tenant) => sum + tenant.rent, 0));
	let totalCollected = $derived(calculateTotalCollected(tenants.map((t) => t.payment)));
	let outstandingBalance = $derived(totalExpected - totalCollected);
	let netIncome = $derived(calculateNetIncome(totalCollected, expenses));
	let totalExpenses = $derived(Object.values(expenses).reduce((sum, expense) => sum + expense, 0));
</script>

<div class="bg-blue-50 p-6 rounded-lg border-l-4 border-green-500">
	<h3 class="text-lg font-bold text-gray-800 mb-4">Monthly Summary</h3>

	<table class="w-full">
		<tbody>
			<tr class="border-b">
				<td class="py-2 font-medium">Total Expected Rent</td>
				<td class="py-2 text-right font-mono">{formatCurrency(totalExpected)}</td>
			</tr>
			<tr class="border-b">
				<td class="py-2 font-medium">Total Rent Collected</td>
				<td class="py-2 text-right font-mono">{formatCurrency(totalCollected)}</td>
			</tr>
			<tr class="border-b">
				<td class="py-2 font-medium">Outstanding Balance</td>
				<td class="py-2 text-right font-mono text-red-600">{formatCurrency(outstandingBalance)}</td>
			</tr>
			<tr class="border-b">
				<td class="py-2 font-medium">Total Expenses</td>
				<td class="py-2 text-right font-mono">{formatCurrency(totalExpenses)}</td>
			</tr>
			<tr class="bg-green-100">
				<td class="py-3 font-bold">Net Income Available for Distribution</td>
				<td class="py-3 text-right font-mono font-bold text-green-700"
					>{formatCurrency(netIncome)}</td
				>
			</tr>
		</tbody>
	</table>
</div>
