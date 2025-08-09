<script lang="ts">
	import { calculateTenantBalance, formatCurrency } from '$lib/utils/calculations.js';
	import { addTenant, removeTenant, restoreTenant } from '$lib/stores/rentalData.js';
	import type { Tenant } from '$lib/types/index.js';
	import NumberInput from './NumberInput.svelte';

	// Color schemes for each unit
	const unit1ColorScheme = {
		border: 'border-pink-200',
		borderHover: 'border-pink-300',
		borderFocus: 'border-pink-500',
		bg: 'bg-white',
		bgHover: 'bg-pink-50',
		bgFocus: 'bg-pink-50',
		text: 'text-gray-800',
		buttonBg: 'bg-pink-50',
		buttonBorder: 'border-pink-200',
		buttonHover: 'bg-pink-100',
		buttonText: 'text-pink-600',
		buttonHoverText: 'text-pink-800',
		shadow: 'shadow-pink-100',
		shadowHover: 'shadow-pink-200',
	};

	const unit2ColorScheme = {
		border: 'border-violet-200',
		borderHover: 'border-violet-300',
		borderFocus: 'border-violet-500',
		bg: 'bg-white',
		bgHover: 'bg-violet-50',
		bgFocus: 'bg-violet-50',
		text: 'text-gray-800',
		buttonBg: 'bg-violet-50',
		buttonBorder: 'border-violet-200',
		buttonHover: 'bg-violet-100',
		buttonText: 'text-violet-600',
		buttonHoverText: 'text-violet-800',
		shadow: 'shadow-violet-100',
		shadowHover: 'shadow-violet-200',
	};

	const unit3ColorScheme = {
		border: 'border-cyan-200',
		borderHover: 'border-cyan-300',
		borderFocus: 'border-cyan-500',
		bg: 'bg-white',
		bgHover: 'bg-cyan-50',
		bgFocus: 'bg-cyan-50',
		text: 'text-gray-800',
		buttonBg: 'bg-cyan-50',
		buttonBorder: 'border-cyan-200',
		buttonHover: 'bg-cyan-100',
		buttonText: 'text-cyan-600',
		buttonHoverText: 'text-cyan-800',
		shadow: 'shadow-cyan-100',
		shadowHover: 'shadow-cyan-200',
	};
	import InfoIcon from './InfoIcon.svelte';

	interface UpdateTenantEvent {
		tenantId: string;
		field: keyof Tenant;
		value: string | number;
	}

	interface Props {
		tenants: Tenant[];
		onupdateTenant?: (event: CustomEvent<UpdateTenantEvent>) => void;
	}

	const { tenants = [], onupdateTenant }: Props = $props();

	let showUndoToast = $state(false);
	let undoTenant: Tenant | null = $state(null);
	let undoTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	// Group tenants by unit using $derived
	const unit1Tenants = $derived(tenants.filter((t) => t.unit === 'Unit 1 (2 pax) - studio type 1'));
	const unit2Tenants = $derived(tenants.filter((t) => t.unit === 'Unit 2 (6 pax) - studio type 2'));
	const unit3Tenants = $derived(tenants.filter((t) => t.unit === 'Unit 3 (10 pax) - up/down'));

	function updateTenantField(tenantId: string, field: keyof Tenant, value: string | number) {
		onupdateTenant?.({ detail: { tenantId, field, value } });
	}

	function getTenantCalculation(tenant: Tenant) {
		return calculateTenantBalance(tenant.rent, tenant.payment);
	}

	function handleAddTenant() {
		addTenant('Unit 3 (10 pax) - up/down');
	}

	function handleRemoveTenant(tenantId: string) {
		const removed = removeTenant(tenantId);
		if (removed) {
			undoTenant = removed;
			showUndoToast = true;

			if (undoTimeout) {
				clearTimeout(undoTimeout);
			}

			undoTimeout = setTimeout(() => {
				showUndoToast = false;
				undoTenant = null;
			}, 5000);
		}
	}

	function handleUndo() {
		if (undoTenant) {
			restoreTenant(undoTenant);
			showUndoToast = false;
			undoTenant = null;
			if (undoTimeout) {
				clearTimeout(undoTimeout);
				undoTimeout = null;
			}
		}
	}

	function dismissToast() {
		showUndoToast = false;
		undoTenant = null;
		if (undoTimeout) {
			clearTimeout(undoTimeout);
			undoTimeout = null;
		}
	}
</script>

<div class="space-y-6">
	<!-- Unit 1 Table -->
	<div class="overflow-x-auto">
		<div class="mb-2">
			<h3 class="text-lg font-semibold text-gray-800">Unit 1 (2 pax) - studio type 1</h3>
		</div>

		<table class="w-full border-collapse border border-pink-200 rounded-xl overflow-hidden shadow-lg">
			<thead>
				<tr class="bg-gradient-to-r from-pink-300 to-rose-300 text-white">
					<th class="border border-pink-200 px-4 py-3 text-left font-semibold">
						Unit/Tenant
					</th>
					<th class="border border-pink-200 px-4 py-3 text-left font-semibold">
						Monthly Rent (₱)
					</th>
					<th class="border border-pink-200 px-4 py-3 text-left font-semibold">
						Amount Paid (₱)
					</th>
					<th class="border border-pink-200 px-4 py-3 text-left font-semibold">
						Payment Date
					</th>
					<th class="border border-pink-200 px-4 py-3 text-left font-semibold">
						Balance (₱)
					</th>
					<th class="border border-pink-200 px-4 py-3 text-left font-semibold">
						Status
					</th>
				</tr>
			</thead>
			<tbody>
				{#each unit1Tenants as tenant (tenant.id)}
					{@const calculation = getTenantCalculation(tenant)}
					<tr class="hover:bg-pink-50 bg-white transition-colors border-pink-100">
						<td class="border border-pink-200 px-4 py-3 font-medium">
							<input
								type="text"
								class="table-input font-medium bg-transparent border-none p-0 focus:bg-white focus:border-pink-300 rounded-lg"
								value={tenant.name}
								oninput={(e) => {
									e.stopPropagation();
									updateTenantField(tenant.id, 'name', e.currentTarget.value);
								}}
							/>
						</td>
						<td class="border border-pink-200 px-4 py-3 text-right"
							>{formatCurrency(tenant.rent)}</td
						>
						<td class="border border-pink-200 px-4 py-3">
							<NumberInput
								value={tenant.payment}
								on:change={(e) => updateTenantField(tenant.id, 'payment', e.detail)}
								step={1000}
								min={0}
								colorScheme={unit1ColorScheme}
								class="w-full text-right"
							/>
						</td>
						<td class="border border-pink-200 px-4 py-3">
							<input
								type="date"
								class="table-input cursor-pointer"
								value={tenant.paymentDate}
								oninput={(e) => {
									e.stopPropagation();
									updateTenantField(tenant.id, 'paymentDate', e.currentTarget.value);
								}}
							/>
						</td>
						<td class="border border-pink-200 px-4 py-3 text-right font-mono">
							{formatCurrency(Math.abs(calculation.balance))}
						</td>
						<td class="border border-pink-200 px-4 py-3">
							<span
								class="px-3 py-1 rounded-full text-xs font-medium
								{calculation.status === 'Paid'
									? 'bg-emerald-100 text-emerald-800'
									: calculation.status === 'Pending'
										? 'bg-amber-100 text-amber-800'
										: 'bg-sky-100 text-sky-800'}"
							>
								{calculation.status}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Unit 2 Table -->
	<div class="overflow-x-auto">
		<div class="mb-2 flex justify-between items-center">
			<div class="flex items-center gap-2">
				<h3 class="text-lg font-semibold text-gray-800">Unit 2 (6 pax) - studio type 2</h3>
				<InfoIcon
					content="Min unit rent: P2,000/month | Min rent/person (2+ occupants): P1,000/month | Max occupancy: 6 persons | Max unit rent: P6,000/month"
					position="right"
					size={16}
				/>
			</div>
			<button
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					addTenant('Unit 2 (6 pax) - studio type 2');
				}}
				class="cursor-pointer bg-gradient-to-r from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				Add Tenant
			</button>
		</div>

		<table class="w-full border-collapse border border-violet-200 rounded-xl overflow-hidden shadow-lg">
			<thead>
				<tr class="bg-gradient-to-r from-violet-300 to-purple-300 text-white">
					<th class="border border-violet-200 px-4 py-3 text-left font-semibold">
						Unit/Tenant
					</th>
					<th class="border border-violet-200 px-4 py-3 text-left font-semibold">
						Monthly Rent (₱)
					</th>
					<th class="border border-violet-200 px-4 py-3 text-left font-semibold">
						Amount Paid (₱)
					</th>
					<th class="border border-violet-200 px-4 py-3 text-left font-semibold">
						Payment Date
					</th>
					<th class="border border-violet-200 px-4 py-3 text-left font-semibold">
						Balance (₱)
					</th>
					<th class="border border-violet-200 px-4 py-3 text-left font-semibold">
						Status
					</th>
					<th class="border border-violet-200 px-4 py-3 text-left font-semibold">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{#each unit2Tenants as tenant (tenant.id)}
					{@const calculation = getTenantCalculation(tenant)}
					<tr class="hover:bg-violet-50 bg-white transition-colors border-violet-100">
						<td class="border border-violet-200 px-4 py-3 font-medium">
							<input
								type="text"
								class="table-input font-medium bg-transparent border-none p-0 focus:bg-white focus:border-violet-300 rounded-lg"
								value={tenant.name}
								oninput={(e) => {
									e.stopPropagation();
									updateTenantField(tenant.id, 'name', e.currentTarget.value);
								}}
							/>
						</td>
						<td class="border border-violet-200 px-4 py-3 text-right"
							>{formatCurrency(tenant.rent)}</td
						>
						<td class="border border-violet-200 px-4 py-3">
							<NumberInput
								value={tenant.payment}
								on:change={(e) => updateTenantField(tenant.id, 'payment', e.detail)}
								step={1000}
								min={0}
								colorScheme={unit2ColorScheme}
								class="w-full text-right"
							/>
						</td>
						<td class="border border-violet-200 px-4 py-3">
							<input
								type="date"
								class="table-input cursor-pointer"
								value={tenant.paymentDate}
								oninput={(e) => {
									e.stopPropagation();
									updateTenantField(tenant.id, 'paymentDate', e.currentTarget.value);
								}}
							/>
						</td>
						<td class="border border-violet-200 px-4 py-3 text-right font-mono">
							{formatCurrency(Math.abs(calculation.balance))}
						</td>
						<td class="border border-violet-200 px-4 py-3">
							<span
								class="px-3 py-1 rounded-full text-xs font-medium
								{calculation.status === 'Paid'
									? 'bg-emerald-100 text-emerald-800'
									: calculation.status === 'Pending'
										? 'bg-amber-100 text-amber-800'
										: 'bg-sky-100 text-sky-800'}"
							>
								{calculation.status}
							</span>
						</td>
						<td class="border border-violet-200 px-4 py-3">
							<button
								onclick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleRemoveTenant(tenant.id);
								}}
								class="cursor-pointer bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
							>
								Remove
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Unit 3 Table -->
	<div class="overflow-x-auto">
		<div class="mb-2 flex justify-between items-center">
			<div class="flex items-center gap-2">
				<h3 class="text-lg font-semibold text-gray-800">Unit 3 (10 pax) - up/down</h3>
				<InfoIcon
					content="Min rent/person: P1,000/month | Max occupancy: 10 persons | Max unit rent: P10,000/month"
					position="right"
					size={16}
				/>
			</div>
			<button
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleAddTenant();
				}}
				class="cursor-pointer bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				Add Tenant
			</button>
		</div>

		<table class="w-full border-collapse border border-cyan-200 rounded-xl overflow-hidden shadow-lg">
			<thead>
				<tr class="bg-gradient-to-r from-cyan-300 to-teal-300 text-white">
					<th class="border border-cyan-200 px-4 py-3 text-left font-semibold">
						Unit/Tenant
					</th>
					<th class="border border-cyan-200 px-4 py-3 text-left font-semibold">
						Monthly Rent (₱)
					</th>
					<th class="border border-cyan-200 px-4 py-3 text-left font-semibold">
						Amount Paid (₱)
					</th>
					<th class="border border-cyan-200 px-4 py-3 text-left font-semibold">
						Payment Date
					</th>
					<th class="border border-cyan-200 px-4 py-3 text-left font-semibold">
						Balance (₱)
					</th>
					<th class="border border-cyan-200 px-4 py-3 text-left font-semibold">
						Status
					</th>
					<th class="border border-cyan-200 px-4 py-3 text-left font-semibold">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{#each unit3Tenants as tenant (tenant.id)}
					{@const calculation = getTenantCalculation(tenant)}
					<tr class="hover:bg-cyan-50 bg-white transition-colors border-cyan-100">
						<td class="border border-cyan-200 px-4 py-3 font-medium">
							<input
								type="text"
								class="table-input font-medium bg-transparent border-none p-0 focus:bg-white focus:border-cyan-300 rounded-lg"
								value={tenant.name}
								oninput={(e) => {
									e.stopPropagation();
									updateTenantField(tenant.id, 'name', e.currentTarget.value);
								}}
							/>
						</td>
						<td class="border border-cyan-200 px-4 py-3 text-right"
							>{formatCurrency(tenant.rent)}</td
						>
						<td class="border border-cyan-200 px-4 py-3">
							<NumberInput
								value={tenant.payment}
								on:change={(e) => updateTenantField(tenant.id, 'payment', e.detail)}
								step={1000}
								min={0}
								colorScheme={unit3ColorScheme}
								class="w-full text-right"
							/>
						</td>
						<td class="border border-cyan-200 px-4 py-3">
							<input
								type="date"
								class="table-input cursor-pointer"
								value={tenant.paymentDate}
							oninput={(e) => {
							e.stopPropagation();
							updateTenantField(tenant.id, 'paymentDate', e.currentTarget.value);
						}}
							/>
						</td>
						<td class="border border-cyan-200 px-4 py-3 text-right font-mono">
							{formatCurrency(Math.abs(calculation.balance))}
						</td>
						<td class="border border-cyan-200 px-4 py-3">
							<span
								class="px-3 py-1 rounded-full text-xs font-medium
								{calculation.status === 'Paid'
									? 'bg-emerald-100 text-emerald-800'
									: calculation.status === 'Pending'
										? 'bg-amber-100 text-amber-800'
										: 'bg-sky-100 text-sky-800'}"
							>
								{calculation.status}
							</span>
						</td>
						<td class="border border-cyan-200 px-4 py-3">
							<button
								onclick={() => {
							handleRemoveTenant(tenant.id);
						}}
								class="cursor-pointer bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
							>
								Remove
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Undo Toast -->
	{#if showUndoToast && undoTenant}
		<div
			class="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 backdrop-blur-md border border-slate-600"
		>
			<span>Removed {undoTenant.name}</span>
			<button
				onclick={handleUndo}
				class="cursor-pointer bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 px-3 py-1 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
			>
				Undo
			</button>
			<button
				onclick={dismissToast}
				class="cursor-pointer text-gray-300 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700"
			>
				✕
			</button>
		</div>
	{/if}
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
	}

	/* Hide WebKit spinners */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Style for the input field */
	.table-input {
		width: 100%;
		padding: 0.75rem 2.5rem 0.75rem 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		background-color: white;
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	.table-input:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
		border-color: #8b5cf6;
		transform: scale(1.02);
	}

	.table-input:hover {
		border-color: #d1d5db;
		background-color: #fafafa;
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
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		color: #4b5563;
		cursor: pointer;
		transition: all 0.2s ease;
		pointer-events: auto;
	}

	.spinner-btn:hover {
		background: #e5e7eb;
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
		color: #8b5cf6;
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

	.table-input:focus {
		animation: gentle-bounce 0.3s ease-in-out;
	}
</style>
