<script lang="ts">
	import { formatCurrency, calculateShareholderDistribution } from '$lib/utils/calculations.js';
	import type { Shareholder } from '$lib/types/index.js';

	interface Props {
		shareholders: Shareholder[];
		netIncome: number;
	}

	const { shareholders = [], netIncome = 0 }: Props = $props();

	const distributionData = $derived(calculateShareholderDistribution(netIncome, shareholders));
</script>

<div class="overflow-x-auto">
	<table class="w-full border-collapse border border-gray-300">
		<thead>
			<tr class="bg-purple-500">
				<th class="border border-gray-300 px-4 py-2 text-left text-white" colspan="4"
					>Shareholder Distribution</th
				>
			</tr>
			<tr class="bg-purple-50">
				<th class="border border-gray-300 px-4 py-2 text-left text-gray-800">Shareholder</th>
				<th class="border border-gray-300 px-4 py-2 text-center text-gray-800">Ownership %</th>
				<th class="border border-gray-300 px-4 py-2 text-right text-gray-800"
					>Distribution Amount (₱)</th
				>
				<th class="border border-gray-300 px-4 py-2 text-center text-gray-800">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each distributionData as shareholder (shareholder.name)}
				<tr class="bg-white hover:bg-blue-50 transition-colors">
					<td class="border border-gray-300 px-4 py-2 font-medium text-gray-800"
						>{shareholder.name}</td
					>
					<td class="border border-gray-300 px-4 py-2 text-center text-gray-800"
						>{shareholder.percentage}%</td
					>
					<td class="border border-gray-300 px-4 py-2 text-right font-mono text-gray-800"
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
				<td class="border border-gray-300 px-4 py-2 text-gray-800">Total Distribution</td>
				<td class="border border-gray-300 px-4 py-2 text-center text-gray-800">100%</td>
				<td class="border border-gray-300 px-4 py-2 text-right font-mono text-gray-800"
					>{formatCurrency(netIncome)}</td
				>
				<td class="border border-gray-300 px-4 py-2"></td>
			</tr>
		</tbody>
	</table>
</div>
