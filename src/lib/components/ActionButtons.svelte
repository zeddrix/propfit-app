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
			class="p-3 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 shadow-sm hover:shadow-md group cursor-pointer"
			aria-label="Download PDF report"
		>
			<Download size={20} class="group-hover:scale-110 transition-transform duration-200" />
		</button>
	</Tooltip>

	<!-- Excel Download with Tooltip -->
	<Tooltip content="Download Excel Spreadsheet">
		<button
			onclick={handleExcelExport}
			class="p-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm hover:shadow-md group cursor-pointer"
			aria-label="Download Excel spreadsheet"
		>
			<FileSpreadsheet size={20} class="group-hover:scale-110 transition-transform duration-200" />
		</button>
	</Tooltip>

	<!-- Print with Tooltip -->
	<Tooltip content="Print Report">
		<button
			onclick={handlePrint}
			class="p-3 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 shadow-sm hover:shadow-md group cursor-pointer"
			aria-label="Print current page"
		>
			<Printer size={20} class="group-hover:scale-110 transition-transform duration-200" />
		</button>
	</Tooltip>

	<!-- Reset Data with Tooltip -->
	<Tooltip content="Reset All Data">
		<button
			onclick={handleReset}
			class="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 shadow-sm hover:shadow-md group cursor-pointer"
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
