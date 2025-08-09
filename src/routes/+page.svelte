<script lang="ts">
	import {
		tenants,
		expenses,
		shareholders,
		currentMonth,
		monthlyNotes,
		preparedBy,
		resetToDefaults,
		markAllPaid,
		updateUnitRents
	} from '$lib/stores/rentalData.js';
	import {
		calculateNetIncome,
		calculateTotalCollected,
		calculateTenantBalance
	} from '$lib/utils/calculations.js';
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

		// First update the tenant with the new value
		tenants.update((tenantList) => {
			let updatedList = tenantList.map((tenant) =>
				tenant.id === tenantId ? { ...tenant, [field]: value } : tenant
			);

			// If payment was updated, update the status based on payment vs rent
			if (field === 'payment') {
				updatedList = updatedList.map((tenant) => {
					if (tenant.id === tenantId) {
						// Calculate the balance first
						const payment = Number(value) || 0;
						const balance = tenant.rent - payment;
						// Set status based on whether payment covers the full rent
						const status = payment >= tenant.rent ? 'Paid' : 'Pending';
						return { ...tenant, status, balance };
					}
					return tenant;
				});
			}

			// Update unit rents and return the final list
			return updateUnitRents(updatedList);
		});
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

<div
	class="container mx-auto px-4 py-8 max-w-7xl bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen"
>
	<!-- Header -->
	<div class="text-center mb-10">
		<h1
			class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
		>
			Rental Property Management
		</h1>

		<div class="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
			<div class="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
				<label for="month-selector" class="text-lg font-semibold text-gray-700">Month:</label>
				<input
					id="month-selector"
					type="month"
					value={currentMonthValue}
					onchange={handleMonthChange}
					class="px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-gray-800 cursor-pointer transition-all duration-200 hover:bg-blue-100"
				/>
			</div>

			<div class="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
				<label for="prepared-by-selector" class="text-lg font-semibold text-gray-700"
					>Prepared by:</label
				>
				<select
					id="prepared-by-selector"
					value={currentPreparedBy}
					onchange={handlePreparedByChange}
					class="px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-purple-50 text-gray-800 cursor-pointer transition-all duration-200 hover:bg-purple-100"
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
	<div class="mb-10">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
			<h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
				<div class="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-rose-400"></div>
				Tenant Payments
			</h2>
			<button
				onclick={markAllPaid}
				class="cursor-pointer bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				Mark All Paid
			</button>
		</div>
		<TenantTable tenants={currentTenants} onupdateTenant={(e) => handleTenantUpdate(e)} />
	</div>

	<!-- Expenses -->
	<div class="mb-10">
		<h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
			<div class="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
			Monthly Expenses
		</h2>
		<ExpenseTable expenses={currentExpenses} onupdateExpense={handleExpenseUpdate} />
	</div>

	<!-- Summary -->
	<div class="mb-10">
		<SummarySection tenants={currentTenants} expenses={currentExpenses} />
	</div>

	<!-- Shareholder Distribution -->
	<div class="mb-10">
		<h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
			<div class="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"></div>
			Shareholder Distribution
		</h2>
		<ShareholderTable shareholders={currentShareholders} {netIncome} />
	</div>

	<!-- Notes Section -->
	<div class="mb-10">
		<h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
			<div class="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"></div>
			Monthly Notes
		</h2>
		<div
			class="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-2xl border-l-4 border-gradient-to-b from-cyan-400 to-teal-400 shadow-lg"
		>
			<textarea
				value={currentNotes}
				oninput={handleNotesChange}
				rows="4"
				class="w-full p-4 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-vertical bg-white/70 text-gray-800 cursor-pointer transition-all duration-200 hover:bg-white placeholder-gray-500"
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
