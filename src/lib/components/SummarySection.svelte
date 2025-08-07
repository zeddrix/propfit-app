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

	const {
		tenants = [],
		expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 }
	}: Props = $props();

	const totalExpected = $derived(tenants.reduce((sum, tenant) => sum + tenant.rent, 0));
	const totalCollected = $derived(calculateTotalCollected(tenants.map((t) => t.payment)));
	const outstandingBalance = $derived(totalExpected - totalCollected);
	const netIncome = $derived(calculateNetIncome(totalCollected, expenses));
	const totalExpenses = $derived(
		Object.values(expenses).reduce((sum, expense) => sum + expense, 0)
	);
</script>

<div class="bg-blue-50 p-6 rounded-lg border-l-4 border-green-500">
	<h3 class="text-lg font-bold text-gray-800 mb-4">Monthly Summary</h3>

	<table class="w-full">
		<tbody>
			<tr class="border-b border-gray-200">
				<td class="py-2 font-medium text-gray-800">Total Expected Rent</td>
				<td class="py-2 text-right font-mono text-gray-800">{formatCurrency(totalExpected)}</td>
			</tr>
			<tr class="border-b border-gray-200">
				<td class="py-2 font-medium text-gray-800">Total Rent Collected</td>
				<td class="py-2 text-right font-mono text-gray-800">{formatCurrency(totalCollected)}</td>
			</tr>
			<tr class="border-b border-gray-200">
				<td class="py-2 font-medium text-gray-800">Outstanding Balance</td>
				<td class="py-2 text-right font-mono text-red-600">{formatCurrency(outstandingBalance)}</td>
			</tr>
			<tr class="border-b border-gray-200">
				<td class="py-2 font-medium text-gray-800">Total Expenses</td>
				<td class="py-2 text-right font-mono text-gray-800">{formatCurrency(totalExpenses)}</td>
			</tr>
			<tr class="bg-green-100">
				<td class="py-3 font-bold text-gray-800">Net Income Available for Distribution</td>
				<td class="py-3 text-right font-mono font-bold text-green-700"
					>{formatCurrency(netIncome)}</td
				>
			</tr>
		</tbody>
	</table>
</div>
