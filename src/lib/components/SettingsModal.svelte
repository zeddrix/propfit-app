<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Download, RotateCcw, Trash2, Settings, X } from 'lucide-svelte';
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

	interface Props {
		isOpen: boolean;
		onclose?: () => void;
	}

	const { isOpen = false, onclose }: Props = $props();

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	// Current data for export
	const currentTenants = $derived($tenants);
	const currentExpenses = $derived($expenses);
	const currentShareholders = $derived($shareholders);
	const currentMonthValue = $derived($currentMonth);
	const currentNotes = $derived($monthlyNotes);
	const currentPreparedBy = $derived($preparedBy);

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

	function closeModal() {
		if (onclose) {
			onclose();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		// Only close if clicking directly on the backdrop, not on the modal content
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<!-- Modal Backdrop -->
{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="settings-title"
		tabindex="-1"
	>
		<!-- Modal Content -->
		<div
			class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up border border-gray-200 dark:border-slate-600"
			role="document"
		>
			<!-- Modal Header -->
			<div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl">
				<div class="flex items-center gap-4">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
						<Settings class="w-5 h-5 text-white" />
					</div>
					<div>
						<h2 id="settings-title" class="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
						<p class="text-sm text-gray-600 dark:text-slate-300">Manage your PropFit preferences</p>
					</div>
				</div>
				<button
					onclick={closeModal}
					class="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 transition-all duration-200 p-2 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 shadow-sm hover:shadow-md group cursor-pointer"
					aria-label="Close settings"
				>
					<X class="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
				</button>
			</div>

			<!-- Modal Body -->
			<div class="p-8 space-y-8">
				<!-- Export Section -->
				<div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow duration-300">
					<div class="flex items-center gap-4 mb-6">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
							<Download class="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 class="text-xl font-semibold text-gray-800 dark:text-white">Export Data</h3>
							<p class="text-sm text-gray-600 dark:text-slate-300">Download your rental reports</p>
						</div>
					</div>
					<div>
						<h4 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Export Current Month's Data</h4>
						<div class="flex flex-wrap gap-4">
							<button
								onclick={handleExportPdf}
								class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium cursor-pointer"
							>
								<Download class="w-5 h-5" />
								Export PDF
							</button>
							<button
								onclick={handleExportExcel}
								class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium cursor-pointer"
							>
								<Download class="w-5 h-5" />
								Export Excel
							</button>
						</div>
					</div>
				</div>

				<!-- Data Management Section -->
				<div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-800/50 shadow-sm hover:shadow-md transition-shadow duration-300">
					<div class="flex items-center gap-4 mb-6">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
							<Trash2 class="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 class="text-xl font-semibold text-gray-800 dark:text-white">Data Management</h3>
							<p class="text-sm text-gray-600 dark:text-slate-300">Reset all application data</p>
						</div>
					</div>
					<div>
						<h4 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Reset All Data</h4>
						<div class="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
							<p class="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
								<span class="text-red-600 dark:text-red-400 font-bold">⚠️</span>
								This will reset all tenant data, expenses, and settings back to their default values. This action cannot be undone.
							</p>
						</div>
						<button
							onclick={handleReset}
							class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium cursor-pointer"
						>
							<RotateCcw class="w-5 h-5" />
							Reset to Defaults
						</button>
					</div>
				</div>

				<!-- App Information -->
				<div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-shadow duration-300">
					<div class="flex items-center gap-4 mb-6">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
							<Settings class="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 class="text-xl font-semibold text-gray-800 dark:text-white">App Information</h3>
							<p class="text-sm text-gray-600 dark:text-slate-300">System details and version info</p>
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="bg-white/70 dark:bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
							<h4 class="font-semibold text-gray-800 dark:text-white mb-1">Version</h4>
							<p class="text-gray-600 dark:text-slate-300">PropFit v2.0</p>
						</div>
						<div class="bg-white/70 dark:bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
							<h4 class="font-semibold text-gray-800 dark:text-white mb-1">Theme</h4>
							<p class="text-gray-600 dark:text-slate-300">Light Mode</p>
						</div>
						<div class="bg-white/70 dark:bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
							<h4 class="font-semibold text-gray-800 dark:text-white mb-1">Data Storage</h4>
							<p class="text-gray-600 dark:text-slate-300">Local Browser Storage</p>
						</div>
						<div class="bg-white/70 dark:bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
							<h4 class="font-semibold text-gray-800 dark:text-white mb-1">Last Updated</h4>
							<p class="text-gray-600 dark:text-slate-300">August 2025</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@media print {
		div {
			display: none !important;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	:global(.animate-fade-in) {
		animation: fade-in 0.3s ease-out;
	}

	:global(.animate-slide-up) {
		animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
</style>
