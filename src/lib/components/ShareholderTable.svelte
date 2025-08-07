<script lang="ts">
	import { formatCurrency, calculateShareholderDistribution } from '$lib/utils/calculations.js';
	import type { Shareholder } from '$lib/types/index.js';
	import InfoIcon from './InfoIcon.svelte';

	interface Props {
		shareholders: Shareholder[];
		netIncome: number;
	}

	const { shareholders = [], netIncome = 0 }: Props = $props();

	const distributionData = $derived(calculateShareholderDistribution(netIncome, shareholders));
</script>

<div class="overflow-x-auto">
	<table class="w-full border-collapse border border-purple-200 rounded-xl overflow-hidden shadow-lg">
		<thead>
			<tr class="bg-gradient-to-r from-purple-300 to-indigo-300">
				<th class="border border-purple-200 px-6 py-4 text-left text-white font-semibold" colspan="4"
					>Shareholder Distribution</th
				>
			</tr>
			<tr class="bg-gradient-to-r from-purple-100 to-indigo-100">
				<th class="border border-purple-200 px-6 py-3 text-left text-purple-800 font-semibold">
					<div class="flex items-center">
						Shareholder
						<InfoIcon content="Property owner or investor name" position="bottom" size={14} />
					</div>
				</th>
				<th class="border border-purple-200 px-6 py-3 text-center text-purple-800 font-semibold">
					<div class="flex items-center justify-center">
						Ownership %
						<InfoIcon content="Percentage of property ownership" position="bottom" size={14} />
					</div>
				</th>
				<th class="border border-purple-200 px-6 py-3 text-right text-purple-800 font-semibold">
					<div class="flex items-center justify-end">
						Distribution Amount (₱)
						<InfoIcon content="Share of net income based on ownership percentage" position="bottom" size={14} />
					</div>
				</th>
				<th class="border border-purple-200 px-6 py-3 text-center text-purple-800 font-semibold">
					<div class="flex items-center justify-center">
						Status
						<InfoIcon content="Distribution payment status" position="bottom" size={14} />
					</div>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each distributionData as shareholder (shareholder.name)}
				<tr class="bg-white hover:bg-purple-50 transition-all duration-200">
					<td class="border border-purple-200 px-6 py-4 font-medium text-gray-800"
						>{shareholder.name}</td
					>
					<td class="border border-purple-200 px-6 py-4 text-center text-gray-800"
						>{shareholder.percentage}%</td
					>
					<td class="border border-purple-200 px-6 py-4 text-right font-mono text-gray-800"
						>{formatCurrency(shareholder.amount)}</td
					>
					<td class="border border-purple-200 px-6 py-4 text-center">
						<select class="shareholder-select text-sm cursor-pointer">
							<option>Pending</option>
							<option>Paid</option>
						</select>
					</td>
				</tr>
			{/each}
			<tr class="bg-gradient-to-r from-emerald-100 to-green-100 font-bold">
				<td class="border border-purple-200 px-6 py-4 text-gray-800">Total Distribution</td>
				<td class="border border-purple-200 px-6 py-4 text-center text-gray-800">100%</td>
				<td class="border border-purple-200 px-6 py-4 text-right font-mono text-gray-800"
					>{formatCurrency(netIncome)}</td
				>
				<td class="border border-purple-200 px-6 py-4"></td>
			</tr>
		</tbody>
	</table>
</div>

<style>
	.shareholder-select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd6fe;
		border-radius: 0.75rem;
		background-color: white;
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	.shareholder-select:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
		border-color: #9333ea;
		transform: scale(1.02);
		background-color: #faf5ff;
	}

	.shareholder-select:hover {
		border-color: #c4b5fd;
		background-color: #f3f4f6;
	}
</style>
