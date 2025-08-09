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

<div
	class="bg-gradient-to-br from-sky-50 to-blue-50 p-8 rounded-2xl border-l-4 border-gradient-to-b from-sky-400 to-blue-400 shadow-lg"
>
	<h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
		<div class="w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 to-blue-400"></div>
		Monthly Summary
	</h3>

	<table class="w-full">
		<tbody>
			<tr class="border-b border-sky-200 hover:bg-sky-50 transition-colors">
				<td class="py-3 font-medium text-gray-800">Total Expected Rent</td>
				<td class="py-3 text-right font-mono text-gray-800 font-semibold"
					>{formatCurrency(totalExpected)}</td
				>
			</tr>
			<tr class="border-b border-sky-200 hover:bg-sky-50 transition-colors">
				<td class="py-3 font-medium text-gray-800">Total Rent Collected</td>
				<td class="py-3 text-right font-mono text-gray-800 font-semibold"
					>{formatCurrency(totalCollected)}</td
				>
			</tr>
			<tr class="border-b border-sky-200 hover:bg-sky-50 transition-colors">
				<td class="py-3 font-medium text-gray-800">Outstanding Balance</td>
				<td class="py-3 text-right font-mono text-rose-600 font-semibold"
					>{formatCurrency(outstandingBalance)}</td
				>
			</tr>
			<tr class="border-b border-sky-200 hover:bg-sky-50 transition-colors">
				<td class="py-3 font-medium text-gray-800">Total Expenses</td>
				<td class="py-3 text-right font-mono text-gray-800 font-semibold"
					>{formatCurrency(totalExpenses)}</td
				>
			</tr>
			<tr class="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
				<td class="py-4 font-bold text-gray-800 rounded-l-lg"
					>Net Income Available for Distribution</td
				>
				<td class="py-4 text-right font-mono font-bold text-emerald-700 text-lg rounded-r-lg"
					>{formatCurrency(netIncome)}</td
				>
			</tr>
		</tbody>
	</table>
</div>
