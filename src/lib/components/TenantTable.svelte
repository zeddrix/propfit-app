<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { calculateTenantBalance, formatCurrency } from '$lib/utils/calculations.js';
	import { addTenant, removeTenant, restoreTenant, markAllPaid } from '$lib/stores/rentalData.js';
	import type { Tenant } from '$lib/types/index.js';

	interface UpdateTenantEvent {
		tenantId: string;
		field: keyof Tenant;
		value: string | number;
	}

	interface Props {
		tenants: Tenant[];
	}

	const { tenants = [] }: Props = $props();

	const dispatch = createEventDispatcher<{
		updateTenant: UpdateTenantEvent;
	}>();

	let showUndoToast = $state(false);
	let undoTenant: Tenant | null = $state(null);
	let undoTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	// Group tenants by unit using $derived
	const unit1Tenants = $derived(tenants.filter((t) => t.unit === 'Unit 1 (2 pax) - studio type 1'));
	const unit3Tenants = $derived(tenants.filter((t) => t.unit === 'Unit 3 (10 pax) - up/down'));

	function updateTenantField(tenantId: string, field: keyof Tenant, value: string | number) {
		dispatch('updateTenant', { tenantId, field, value });
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

	function handleMarkAllPaid() {
		markAllPaid();
	}
</script>

<div class="space-y-6">
	<!-- Mark All Paid Button -->
	<div class="flex justify-end">
		<button
			onclick={handleMarkAllPaid}
			class="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
		>
			Mark All Paid
		</button>
	</div>

	<!-- Unit 1 Table -->
	<div class="overflow-x-auto">
		<div class="mb-2">
			<h3 class="text-lg font-semibold text-gray-800">Unit 1 (2 pax) - studio type 1</h3>
		</div>

		<table class="w-full border-collapse border border-gray-300">
			<thead>
				<tr class="bg-green-500 text-white">
					<th class="border border-gray-300 px-4 py-2 text-left">Unit/Tenant</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Monthly Rent (₱)</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Amount Paid (₱)</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Balance (₱)</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Status</th>
				</tr>
			</thead>
			<tbody>
				{#each unit1Tenants as tenant (tenant.id)}
					{@const calculation = getTenantCalculation(tenant)}
					<tr class="hover:bg-gray-50">
						<td class="border border-gray-300 px-4 py-2 font-medium">
							<input
								type="text"
								class="table-input font-medium bg-transparent border-none p-0 focus:bg-white focus:border-gray-300"
								value={tenant.name}
								oninput={(e) => updateTenantField(tenant.id, 'name', e.currentTarget.value)}
							/>
						</td>
						<td class="border border-gray-300 px-4 py-2 text-right"
							>{formatCurrency(tenant.rent)}</td
						>
						<td class="border border-gray-300 px-4 py-2">
							<input
								type="number"
								class="table-input text-right cursor-pointer"
								value={tenant.payment}
								min="0"
								step="1000"
								oninput={(e) =>
									updateTenantField(tenant.id, 'payment', parseFloat(e.currentTarget.value) || 0)}
							/>
						</td>
						<td class="border border-gray-300 px-4 py-2">
							<input
								type="date"
								class="table-input cursor-pointer"
								value={tenant.paymentDate}
								oninput={(e) => updateTenantField(tenant.id, 'paymentDate', e.currentTarget.value)}
							/>
						</td>
						<td class="border border-gray-300 px-4 py-2 text-right font-mono">
							{formatCurrency(Math.abs(calculation.balance))}
						</td>
						<td class="border border-gray-300 px-4 py-2">
							<span
								class="px-2 py-1 rounded-full text-xs font-medium
								{calculation.status === 'Paid'
									? 'bg-green-100 text-green-800'
									: calculation.status === 'Pending'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-blue-100 text-blue-800'}"
							>
								{calculation.status}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Unit 3 Table -->
	<div class="overflow-x-auto">
		<div class="mb-2 flex justify-between items-center">
			<h3 class="text-lg font-semibold text-gray-800">Unit 3 (10 pax) - up/down</h3>
			<button
				onclick={handleAddTenant}
				class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
			>
				Add Tenant
			</button>
		</div>

		<table class="w-full border-collapse border border-gray-300">
			<thead>
				<tr class="bg-green-500 text-white">
					<th class="border border-gray-300 px-4 py-2 text-left">Unit/Tenant</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Monthly Rent (₱)</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Amount Paid (₱)</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Balance (₱)</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Status</th>
					<th class="border border-gray-300 px-4 py-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each unit3Tenants as tenant (tenant.id)}
					{@const calculation = getTenantCalculation(tenant)}
					<tr class="hover:bg-gray-50">
						<td class="border border-gray-300 px-4 py-2 font-medium">
							<input
								type="text"
								class="table-input font-medium bg-transparent border-none p-0 focus:bg-white focus:border-gray-300"
								value={tenant.name}
								oninput={(e) => updateTenantField(tenant.id, 'name', e.currentTarget.value)}
							/>
						</td>
						<td class="border border-gray-300 px-4 py-2 text-right"
							>{formatCurrency(tenant.rent)}</td
						>
						<td class="border border-gray-300 px-4 py-2">
							<input
								type="number"
								class="table-input text-right cursor-pointer"
								value={tenant.payment}
								min="0"
								step="1000"
								oninput={(e) =>
									updateTenantField(tenant.id, 'payment', parseFloat(e.currentTarget.value) || 0)}
							/>
						</td>
						<td class="border border-gray-300 px-4 py-2">
							<input
								type="date"
								class="table-input cursor-pointer"
								value={tenant.paymentDate}
								oninput={(e) => updateTenantField(tenant.id, 'paymentDate', e.currentTarget.value)}
							/>
						</td>
						<td class="border border-gray-300 px-4 py-2 text-right font-mono">
							{formatCurrency(Math.abs(calculation.balance))}
						</td>
						<td class="border border-gray-300 px-4 py-2">
							<span
								class="px-2 py-1 rounded-full text-xs font-medium
								{calculation.status === 'Paid'
									? 'bg-green-100 text-green-800'
									: calculation.status === 'Pending'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-blue-100 text-blue-800'}"
							>
								{calculation.status}
							</span>
						</td>
						<td class="border border-gray-300 px-4 py-2">
							<button
								onclick={() => handleRemoveTenant(tenant.id)}
								class="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
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
			class="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
		>
			<span>Removed {undoTenant.name}</span>
			<button
				onclick={handleUndo}
				class="cursor-pointer bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
			>
				Undo
			</button>
			<button
				onclick={dismissToast}
				class="cursor-pointer text-gray-300 hover:text-white transition-colors"
			>
				✕
			</button>
		</div>
	{/if}
</div>

<style>
	.table-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		background-color: white;
	}

	.table-input:focus {
		outline: none;
		box-shadow: 0 0 0 2px #3b82f6;
		border-color: transparent;
	}

	button {
		cursor: pointer;
	}
</style>
