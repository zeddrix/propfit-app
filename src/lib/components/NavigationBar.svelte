<script lang="ts">
	import type { Tenant, Expenses, Shareholder } from '$lib/types/index.js';
	import ActionButtons from './ActionButtons.svelte';
	import { Settings } from 'lucide-svelte';

	interface Props {
		tenants: Tenant[];
		expenses: Expenses;
		shareholders: Shareholder[];
		currentMonth: string;
		notes: string;
		preparedBy: string;
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

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<nav
	class="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-700 print:hidden backdrop-blur-sm bg-white/95 dark:bg-slate-900/95"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<h1 class="text-xl font-bold text-gray-800 dark:text-white">PropFit</h1>
					<p class="text-xs text-gray-500 dark:text-slate-400">Rental Management</p>
				</div>
			</div>

			<!-- Desktop Action Buttons -->
			<div class="hidden md:flex md:items-center md:space-x-4">
				<a
					href="/settings"
					class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					title="Settings"
					aria-label="Go to Settings"
				>
					<Settings class="w-5 h-5 text-gray-600" />
				</a>
				<ActionButtons
					{tenants}
					{expenses}
					{shareholders}
					{currentMonth}
					{notes}
					{preparedBy}
					{onreset}
				/>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
					onclick={toggleMobileMenu}
					aria-expanded={mobileMenuOpen}
					aria-label="Toggle main menu"
				>
					<!-- Hamburger icon with smooth transition -->
					<svg
						class="h-6 w-6 transition-transform duration-200 {mobileMenuOpen ? 'rotate-90' : ''}"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						{#if !mobileMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile menu with smooth animation -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-gray-200 pt-4 pb-6 animate-slideDown">
				<div class="space-y-4">
					<div class="flex justify-center gap-4">
						<a
							href="/settings"
							class="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							title="Settings"
							aria-label="Go to Settings"
						>
							<Settings class="w-5 h-5 text-gray-600" />
						</a>
					</div>
					<ActionButtons
						{tenants}
						{expenses}
						{shareholders}
						{currentMonth}
						{notes}
						{preparedBy}
						{onreset}
					/>
				</div>
				<!-- Close button for mobile menu -->
				<div class="mt-4 flex justify-center">
					<button
						onclick={closeMobileMenu}
						class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
					>
						Close Menu
					</button>
				</div>
			</div>
		{/if}
	</div>
</nav>

<style>
	@media print {
		nav {
			display: none !important;
		}
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-slideDown) {
		animation: slideDown 0.2s ease-out;
	}

	/* Ensure sticky navbar has proper backdrop blur support */
	nav {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
</style>
