<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Download, Printer, RotateCcw } from 'lucide-svelte';
	import { exportToPdf } from '$lib/utils/exportPdf.js';
	import { exportToExcel } from '$lib/utils/exportExcel.js';
	import type { Tenant, Expenses, Shareholder } from '$lib/types/index.js';

	interface Props {
		tenants: Tenant[];
		expenses: Expenses;
		shareholders: Shareholder[];
		currentMonth: string;
		notes: string;
	}

	let {
		tenants = [],
		expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 },
		shareholders = [],
		currentMonth = '',
		notes = ''
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		reset: void;
	}>();

	function handlePdfExport() {
		exportToPdf(tenants, expenses, shareholders, currentMonth, notes);
	}

	function handleExcelExport() {
		exportToExcel(tenants, expenses, shareholders, currentMonth, notes);
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
	<button onclick={handlePdfExport} class="btn-primary flex items-center gap-2">
		<Download size={16} />
		Download PDF
	</button>

	<button onclick={handleExcelExport} class="btn-primary flex items-center gap-2">
		<Download size={16} />
		Download Excel
	</button>

	<button onclick={handlePrint} class="btn-secondary flex items-center gap-2">
		<Printer size={16} />
		Print
	</button>

	<button onclick={handleReset} class="btn-secondary flex items-center gap-2">
		<RotateCcw size={16} />
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
