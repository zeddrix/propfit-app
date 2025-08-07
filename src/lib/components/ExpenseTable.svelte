<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Expenses } from '$lib/types/index.js';

	interface UpdateExpenseEvent {
		field: keyof Expenses;
		value: number;
	}

	interface Props {
		expenses: Expenses;
		onupdateExpense?: (event: CustomEvent<UpdateExpenseEvent>) => void;
	}

	const { expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 }, onupdateExpense }: Props =
		$props();

	const dispatch = createEventDispatcher<{
		updateExpense: UpdateExpenseEvent;
	}>();

	function updateExpense(field: keyof Expenses, value: number) {
		dispatch('updateExpense', { field, value });
	}

	const expenseLabels: Record<keyof Expenses, string> = {
		internet: 'Internet',
		water: 'Water',
		electricity: 'Electricity',
		maintenance: 'Maintenance & Repairs',
		other: 'Other Expenses'
	};
</script>

<div class="overflow-x-auto">
	<table class="w-full border-collapse border border-gray-300">
		<thead>
			<tr class="bg-orange-500">
				<th class="border border-gray-300 px-4 py-2 text-left text-white" colspan="3"
					>Monthly Expenses</th
				>
			</tr>
			<tr class="bg-orange-50">
				<th class="border border-gray-300 px-4 py-2 text-left text-gray-800">
					Expense Type
				</th>
				<th class="border border-gray-300 px-4 py-2 text-left text-gray-800">
					Amount (₱)
				</th>
				<th class="border border-gray-300 px-4 py-2 text-left text-gray-800">
					Notes
				</th>
			</tr>
		</thead>
		<tbody>
			{#each Object.keys(expenseLabels) as expenseKey (expenseKey)}
				{@const key = expenseKey as keyof Expenses}
				<tr class="hover:bg-gray-50 bg-white transition-colors">
					<td class="border border-gray-300 px-4 py-2 text-gray-800">{expenseLabels[key]}</td>
					<td class="border border-gray-300 px-4 py-2">
						<input
							type="number"
							class="table-input text-right"
							value={expenses[key] || 0}
							min="0"
							step="0.01"
							oninput={(e) => updateExpense(key, parseFloat(e.currentTarget.value) || 0)}
						/>
					</td>
					<td class="border border-gray-300 px-4 py-2">
						<input type="text" class="table-input" placeholder="Add notes..." />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
