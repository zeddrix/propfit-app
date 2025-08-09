<script lang="ts">
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

	function updateExpense(field: keyof Expenses, value: number) {
		onupdateExpense?.({ detail: { field, value } } as CustomEvent<UpdateExpenseEvent>);
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
						<div class="number-input-container">
							<input
								type="number"
								class="expense-input text-right"
								value={expenses[key] || 0}
								min="0"
								step="0.01"
								oninput={(e) => updateExpense(key, parseFloat(e.currentTarget.value) || 0)}
							/>
							<div class="spinner-buttons">
								<button 
									class="spinner-btn up"
									onclick={() => updateExpense(key, (expenses[key] || 0) + 100)}
									tabindex="-1"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
									</svg>
								</button>
								<button 
									class="spinner-btn down"
									onclick={() => updateExpense(key, Math.max(0, (expenses[key] || 0) - 100))}
									tabindex="-1"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
									</svg>
								</button>
							</div>
						</div>
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
	/* Custom number input container */
	.number-input-container {
		position: relative;
		display: inline-block;
		width: 100%;
	}

	/* Hide default number input spinners */
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
		width: 100%;
		padding: 0.75rem 2.5rem 0.75rem 0.75rem;
		border: 1px solid #fed7aa;
		border-radius: 0.75rem;
		background-color: white;
		transition: all 0.2s ease-in-out;
	}

	/* Hide WebKit spinners */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Style for the input field */
	.expense-input {
		width: 100%;
		padding: 0.75rem 2.5rem 0.75rem 0.75rem;
		border: 1px solid #fed7aa;
		border-radius: 0.75rem;
		background-color: white;
		transition: all 0.2s ease-in-out;
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

	/* Custom spinner buttons */
	.spinner-buttons {
		position: absolute;
		top: 0;
		right: 0.5rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		pointer-events: none;
	}

	.spinner-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.25rem;
		background: #fff8f1;
		border: 1px solid #fed7aa;
		color: #fb923c;
		cursor: pointer;
		transition: all 0.2s ease;
		pointer-events: auto;
	}

	.spinner-btn:hover {
		background: #ffedd5;
	}

	.spinner-btn.up {
		border-radius: 0.25rem 0.25rem 0 0;
		border-bottom: none;
	}

	.spinner-btn.down {
		border-radius: 0 0 0.25rem 0.25rem;
	}

	.spinner-btn svg {
		width: 1rem;
		height: 1rem;
	}

	.spinner-btn:hover svg {
		color: #ea580c;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.spinner-buttons {
			right: 0.25rem;
		}
		
		.spinner-btn {
			width: 1.25rem;
			height: 1rem;
		}
		
		.spinner-btn svg {
			width: 0.75rem;
			height: 0.75rem;
		}
	}

	/* Enhanced animations */
	@keyframes gentle-bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-2px); }
	}

	.expense-input:focus {
		animation: gentle-bounce 0.3s ease-in-out;
	}
</style>
