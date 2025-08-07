<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { FileDown, FileSpreadsheet, Printer, Trash2 } from 'lucide-svelte';
	import { exportToPdf } from '$lib/utils/exportPdf.js';
	import { exportToExcel } from '$lib/utils/exportExcel.js';
	import type { Tenant, Expenses, Shareholder } from '$lib/types/index.js';

	interface Props {
		tenants: Tenant[];
		expenses: Expenses;
		shareholders: Shareholder[];
		currentMonth: string;
		notes: string;
		preparedBy?: string;
	}

	const {
		tenants = [],
		expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 },
		shareholders = [],
		currentMonth = '',
		notes = '',
		preparedBy = ''
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
			dispatch('reset');
		}
	}
</script>

<div class="flex flex-wrap gap-4 justify-center mb-6">
	<button
		onclick={handlePdfExport}
		class="btn-primary flex items-center gap-2 cursor-pointer"
		aria-label="Download PDF report"
	>
		<FileDown size={16} />
		Download PDF
	</button>

	<button
		onclick={handleExcelExport}
		class="btn-primary flex items-center gap-2 cursor-pointer"
		aria-label="Download Excel spreadsheet"
	>
		<FileSpreadsheet size={16} />
		Download Excel
	</button>

	<button
		onclick={handlePrint}
		class="btn-secondary flex items-center gap-2 cursor-pointer"
		aria-label="Print current page"
	>
		<Printer size={16} />
		Print
	</button>

	<button
		onclick={handleReset}
		class="btn-secondary flex items-center gap-2 cursor-pointer"
		aria-label="Reset all data (this action cannot be undone)"
	>
		<Trash2 size={16} />
		Reset Data
	</button>
</div>

<style>
	@media print {
		div {
			display: none !important;
		}
	}
</style>
