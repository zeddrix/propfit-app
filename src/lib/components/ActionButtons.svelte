<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Download, FileSpreadsheet, Printer, RotateCcw } from 'lucide-svelte';
	import { exportToPdf } from '$lib/utils/exportPdf.js';
	import { exportToExcel } from '$lib/utils/exportExcel.js';
	import Tooltip from './Tooltip.svelte';
	import type { Tenant, Expenses, Shareholder } from '$lib/types/index.js';

	interface Props {
		tenants: Tenant[];
		expenses: Expenses;
		shareholders: Shareholder[];
		currentMonth: string;
		notes: string;
		preparedBy?: string;
		onreset?: () => void;
	}

	const {
		tenants = [],
		expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 },
		shareholders = [],
		currentMonth = '',
		notes = '',
		preparedBy = '',
		onreset
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		reset: void;
	}>();

	function handlePdfExport() {
		exportToPdf(tenants, expenses, shareholders, currentMonth, notes, preparedBy);
	}

	function handleExcelExport() {
		exportToExcel(tenants, expenses, shareholders, currentMonth, notes, preparedBy);
	}

	function handlePrint() {
		window.print();
	}

	function handleReset() {
		if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
			if (onreset) {
				onreset();
			} else {
				dispatch('reset');
			}
		}
	}
</script>

<div class="flex gap-2 justify-center">
	<!-- PDF Download with Tooltip -->
	<Tooltip content="Download PDF Report">
		<button
			onclick={handlePdfExport}
			class="p-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md group"
			aria-label="Download PDF report"
		>
			<Download size={20} class="group-hover:scale-110 transition-transform duration-200" />
		</button>
	</Tooltip>

	<!-- Excel Download with Tooltip -->
	<Tooltip content="Download Excel Spreadsheet">
		<button
			onclick={handleExcelExport}
			class="p-3 rounded-xl bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md group"
			aria-label="Download Excel spreadsheet"
		>
			<FileSpreadsheet size={20} class="group-hover:scale-110 transition-transform duration-200" />
		</button>
	</Tooltip>

	<!-- Print with Tooltip -->
	<Tooltip content="Print Report">
		<button
			onclick={handlePrint}
			class="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md group"
			aria-label="Print current page"
		>
			<Printer size={20} class="group-hover:scale-110 transition-transform duration-200" />
		</button>
	</Tooltip>

	<!-- Reset Data with Tooltip -->
	<Tooltip content="Reset All Data">
		<button
			onclick={handleReset}
			class="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm hover:shadow-md group"
			aria-label="Reset all data (this action cannot be undone)"
		>
			<RotateCcw size={20} class="group-hover:scale-110 transition-transform duration-200" />
		</button>
	</Tooltip>
</div>

<style>
	@media print {
		div {
			display: none !important;
		}
	}
</style>
