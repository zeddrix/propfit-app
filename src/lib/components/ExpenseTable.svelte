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
	<table class="w-full border-collapse border border-orange-200 rounded-xl overflow-hidden shadow-lg">
		<thead>
			<tr class="bg-gradient-to-r from-orange-300 to-amber-300">
				<th class="border border-orange-200 px-6 py-4 text-left text-white font-semibold" colspan="3"
					>Monthly Expenses</th
				>
			</tr>
			<tr class="bg-gradient-to-r from-orange-100 to-amber-100">
				<th class="border border-orange-200 px-6 py-3 text-left text-orange-800 font-semibold">
					Expense Type
				</th>
				<th class="border border-orange-200 px-6 py-3 text-left text-orange-800 font-semibold">
					Amount (₱)
				</th>
				<th class="border border-orange-200 px-6 py-3 text-left text-orange-800 font-semibold">
					Notes
				</th>
			</tr>
		</thead>
		<tbody>
			{#each Object.keys(expenseLabels) as expenseKey (expenseKey)}
				{@const key = expenseKey as keyof Expenses}
				<tr class="hover:bg-orange-50 bg-white transition-all duration-200">
					<td class="border border-orange-200 px-6 py-4 text-gray-800 font-medium">{expenseLabels[key]}</td>
					<td class="border border-orange-200 px-6 py-4">
						<input
							type="number"
							class="expense-input text-right cursor-pointer"
							value={expenses[key] || 0}
							min="0"
							step="0.01"
							oninput={(e) => updateExpense(key, parseFloat(e.currentTarget.value) || 0)}
						/>
					</td>
					<td class="border border-orange-200 px-6 py-4">
						<input type="text" class="expense-input cursor-pointer" placeholder="Add notes..." />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.expense-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #fed7aa;
		border-radius: 0.75rem;
		background-color: white;
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	.expense-input:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
		border-color: #fb923c;
		transform: scale(1.02);
		background-color: #fffbeb;
	}

	.expense-input:hover {
		border-color: #fdba74;
		background-color: #fef3c7;
	}
</style>
