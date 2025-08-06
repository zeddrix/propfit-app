<script lang="ts">
	import { formatCurrency, calculateShareholderDistribution } from '$lib/utils/calculations.js';
	import type { Shareholder } from '$lib/types/index.js';

	interface Props {
		shareholders: Shareholder[];
		netIncome: number;
	}

	let { shareholders = [], netIncome = 0 }: Props = $props();

	let distributionData = $derived(calculateShareholderDistribution(netIncome, shareholders));
</script>

<div class="overflow-x-auto">
	<table class="w-full border-collapse border border-gray-300">
		<thead>
			<tr class="bg-purple-100">
				<th class="border border-gray-300 px-4 py-2 text-left" colspan="4"
					>Shareholder Distribution</th
				>
			</tr>
			<tr class="bg-purple-50">
				<th class="border border-gray-300 px-4 py-2 text-left">Shareholder</th>
				<th class="border border-gray-300 px-4 py-2 text-center">Ownership %</th>
				<th class="border border-gray-300 px-4 py-2 text-right">Distribution Amount (₱)</th>
				<th class="border border-gray-300 px-4 py-2 text-center">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each distributionData as shareholder}
				<tr class="bg-blue-50 hover:bg-blue-100">
					<td class="border border-gray-300 px-4 py-2 font-medium">{shareholder.name}</td>
					<td class="border border-gray-300 px-4 py-2 text-center">{shareholder.percentage}%</td>
					<td class="border border-gray-300 px-4 py-2 text-right font-mono"
						>{formatCurrency(shareholder.amount)}</td
					>
					<td class="border border-gray-300 px-4 py-2 text-center">
						<select class="table-input text-sm">
							<option>Pending</option>
							<option>Paid</option>
						</select>
					</td>
				</tr>
			{/each}
			<tr class="bg-green-100 font-bold">
				<td class="border border-gray-300 px-4 py-2">Total Distribution</td>
				<td class="border border-gray-300 px-4 py-2 text-center">100%</td>
				<td class="border border-gray-300 px-4 py-2 text-right font-mono"
					>{formatCurrency(netIncome)}</td
				>
				<td class="border border-gray-300 px-4 py-2"></td>
			</tr>
		</tbody>
	</table>
</div>
