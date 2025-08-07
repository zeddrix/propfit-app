<script lang="ts">
	import { ArrowLeft, Download, RotateCcw, Trash2, Settings } from 'lucide-svelte';
	import {
		resetToDefaults,
		tenants,
		expenses,
		shareholders,
		currentMonth,
		monthlyNotes,
		preparedBy
	} from '$lib/stores/rentalData.js';
	import { exportToPdf } from '$lib/utils/exportPdf.js';
	import { exportToExcel } from '$lib/utils/exportExcel.js';

	// Current data for export
	$: currentTenants = $tenants;
	$: currentExpenses = $expenses;
	$: currentShareholders = $shareholders;
	$: currentMonthValue = $currentMonth;
	$: currentNotes = $monthlyNotes;
	$: currentPreparedBy = $preparedBy;

	async function handleExportPdf() {
		try {
			await exportToPdf(
				currentTenants,
				currentExpenses,
				currentShareholders,
				currentMonthValue,
				currentNotes,
				currentPreparedBy
			);
		} catch {
			// Error exporting PDF
		}
	}

	async function handleExportExcel() {
		try {
			await exportToExcel(
				currentTenants,
				currentExpenses,
				currentShareholders,
				currentMonthValue,
				currentNotes,
				currentPreparedBy
			);
		} catch {
			// Error exporting Excel
		}
	}

	function handleReset() {
		if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
			resetToDefaults();
		}
	}
</script>

<svelte:head>
	<title>Settings - PropFit Rental Management</title>
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-lg border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center gap-4">
					<a
						href="/"
						class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
						aria-label="Back to Dashboard"
					>
						<ArrowLeft class="w-5 h-5" />
						<span>Back to Dashboard</span>
					</a>
				</div>
				<div class="flex items-center gap-4">
					<Settings class="w-6 h-6 text-gray-800" />
					<h1 class="text-xl font-bold text-gray-800">Settings</h1>
				</div>
			</div>
		</div>
	</div>

	<!-- Settings Content -->
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="space-y-8">
			<!-- Export Section -->
			<div class="bg-white rounded-lg shadow-md border border-gray-200">
				<div class="px-6 py-4 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<Download class="w-5 h-5 text-green-600" />
						<h2 class="text-lg font-semibold text-gray-800">Export Data</h2>
					</div>
				</div>
				<div class="p-6 space-y-6">
					<div>
						<h3 class="text-md font-medium text-gray-800 mb-3">Export Current Month's Data</h3>
						<div class="flex gap-4">
							<button
								onclick={handleExportPdf}
								class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
							>
								<Download class="w-4 h-4" />
								Export PDF
							</button>
							<button
								onclick={handleExportExcel}
								class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
							>
								<Download class="w-4 h-4" />
								Export Excel
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Data Management Section -->
			<div class="bg-white rounded-lg shadow-md border border-gray-200">
				<div class="px-6 py-4 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<Trash2 class="w-5 h-5 text-red-600" />
						<h2 class="text-lg font-semibold text-gray-800">Data Management</h2>
					</div>
				</div>
				<div class="p-6 space-y-6">
					<div>
						<h3 class="text-md font-medium text-gray-800 mb-3">Reset All Data</h3>
						<p class="text-sm text-gray-600 mb-4">
							This will reset all tenant data, expenses, and settings back to their default values.
							This action cannot be undone.
						</p>
						<button
							onclick={handleReset}
							class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
						>
							<RotateCcw class="w-4 h-4" />
							Reset to Defaults
						</button>
					</div>
				</div>
			</div>

			<!-- App Information -->
			<div class="bg-white rounded-lg shadow-md border border-gray-200">
				<div class="px-6 py-4 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<Settings class="w-5 h-5 text-blue-600" />
						<h2 class="text-lg font-semibold text-gray-800">App Information</h2>
					</div>
				</div>
				<div class="p-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h4 class="font-medium text-gray-800">Version</h4>
							<p class="text-gray-600">PropFit v1.0</p>
						</div>
						<div>
							<h4 class="font-medium text-gray-800">Theme</h4>
							<p class="text-gray-600">Light Mode</p>
						</div>
						<div>
							<h4 class="font-medium text-gray-800">Data Storage</h4>
							<p class="text-gray-600">Local Browser Storage</p>
						</div>
						<div>
							<h4 class="font-medium text-gray-800">Last Updated</h4>
							<p class="text-gray-600">December 2024</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	@media print {
		main {
			display: none !important;
		}
	}
</style>
