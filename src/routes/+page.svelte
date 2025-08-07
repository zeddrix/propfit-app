<script lang="ts">
	import {
		tenants,
		expenses,
		shareholders,
		currentMonth,
		monthlyNotes,
		preparedBy,
		resetToDefaults,
		markAllPaid
	} from '$lib/stores/rentalData.js';
	import { calculateNetIncome, calculateTotalCollected } from '$lib/utils/calculations.js';
	import type { Tenant, Expenses, Shareholder } from '$lib/types/index.js';

	import TenantTable from '$lib/components/TenantTable.svelte';
	import ExpenseTable from '$lib/components/ExpenseTable.svelte';
	import SummarySection from '$lib/components/SummarySection.svelte';
	import ShareholderTable from '$lib/components/ShareholderTable.svelte';
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';

	let isSettingsModalOpen = $state(false);

	// Subscribe to stores using $derived
	const currentTenants = $derived($tenants);
	const currentExpenses = $derived($expenses);
	const currentShareholders = $derived($shareholders);
	const currentMonthValue = $derived($currentMonth);
	const currentNotes = $derived($monthlyNotes);
	const currentPreparedBy = $derived($preparedBy);

	// Calculated values
	const totalCollected = $derived(calculateTotalCollected(currentTenants.map((t) => t.payment)));
	const netIncome = $derived(calculateNetIncome(totalCollected, currentExpenses));

	function handleTenantUpdate(
		event: CustomEvent<{ tenantId: string; field: keyof Tenant; value: string | number }>
	) {
		const { tenantId, field, value } = event.detail;
		tenants.update((tenantList) =>
			tenantList.map((tenant) => (tenant.id === tenantId ? { ...tenant, [field]: value } : tenant))
		);
	}

	function handleExpenseUpdate(event: CustomEvent<{ field: keyof Expenses; value: number }>) {
		const { field, value } = event.detail;
		expenses.update((expenseObj) => ({
			...expenseObj,
			[field]: value
		}));
	}

	function handleMonthChange(event: Event) {
		const target = event.target as HTMLInputElement;
		currentMonth.set(target.value);
	}

	function handlePreparedByChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		preparedBy.set(target.value);
	}

	function handleNotesChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		monthlyNotes.set(target.value);
	}

	function handleReset() {
		resetToDefaults();
	}

	function openSettingsModal() {
		isSettingsModalOpen = true;
	}

	function closeSettingsModal() {
		isSettingsModalOpen = false;
	}
</script>

<svelte:head>
	<title
		>Rental Property Management - {new Date(currentMonthValue + '-01').toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})}</title
	>
</svelte:head>

<!-- Navigation Bar -->
<NavigationBar
	tenants={currentTenants}
	expenses={currentExpenses}
	shareholders={currentShareholders}
	currentMonth={currentMonthValue}
	notes={currentNotes}
	preparedBy={currentPreparedBy}
	onreset={handleReset}
	onopenSettings={openSettingsModal}
/>

<!-- Settings Modal -->
<SettingsModal isOpen={isSettingsModalOpen} onclose={closeSettingsModal} />

<div class="container mx-auto px-4 py-8 max-w-7xl bg-white min-h-screen">
	<!-- Header -->
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold text-gray-800 mb-4">Rental Property Management</h1>

		<div class="flex items-center justify-center gap-6 mb-6">
			<div class="flex items-center gap-2">
				<label for="month-selector" class="text-lg font-medium text-gray-700">Month:</label>
				<input
					id="month-selector"
					type="month"
					value={currentMonthValue}
					onchange={handleMonthChange}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
				/>
			</div>

			<div class="flex items-center gap-2">
				<label for="prepared-by-selector" class="text-lg font-medium text-gray-700"
					>Prepared by:</label
				>
				<select
					id="prepared-by-selector"
					value={currentPreparedBy}
					onchange={handlePreparedByChange}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
				>
					<option value="">Select preparer...</option>
					{#each currentShareholders as shareholder (shareholder.name)}
						<option value={shareholder.name}>{shareholder.name}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Tenant Payments -->
	<div class="mb-8">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-bold text-gray-800">Tenant Payments</h2>
			<button
				onclick={markAllPaid}
				class="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
			>
				Mark All Paid
			</button>
		</div>
		<TenantTable tenants={currentTenants} onupdateTenant={handleTenantUpdate} />
	</div>

	<!-- Expenses -->
	<div class="mb-8">
		<ExpenseTable expenses={currentExpenses} onupdateExpense={handleExpenseUpdate} />
	</div>

	<!-- Summary -->
	<div class="mb-8">
		<SummarySection tenants={currentTenants} expenses={currentExpenses} />
	</div>

	<!-- Shareholder Distribution -->
	<div class="mb-8">
		<ShareholderTable shareholders={currentShareholders} {netIncome} />
	</div>

	<!-- Notes Section -->
	<div class="mb-8">
		<h2 class="text-xl font-bold text-gray-800 mb-4">Monthly Notes</h2>
		<div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
			<textarea
				value={currentNotes}
				oninput={handleNotesChange}
				rows="4"
				class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical bg-white text-gray-800"
				placeholder="Add notes about this month's rental activities, maintenance issues, tenant communications, etc."
			></textarea>
		</div>
	</div>
</div>

<style>
	@media print {
		.container {
			max-width: none !important;
			padding: 0 !important;
		}

		h1,
		h2 {
			color: #000 !important;
			page-break-after: avoid;
		}

		.bg-blue-50 {
			background-color: #f8f9fa !important;
		}
	}
</style>
