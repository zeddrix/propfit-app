<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Tenant, Expenses, Shareholder } from '$lib/types/index.js';
	import ActionButtons from './ActionButtons.svelte';
	import Tooltip from './Tooltip.svelte';
	import { Settings, Menu, X } from 'lucide-svelte';

	interface Props {
		tenants: Tenant[];
		expenses: Expenses;
		shareholders: Shareholder[];
		currentMonth: string;
		notes: string;
		preparedBy: string;
		onreset?: () => void;
		onopenSettings?: () => void;
	}

	const {
		tenants = [],
		expenses = { internet: 0, water: 0, electricity: 0, maintenance: 0, other: 0 },
		shareholders = [],
		currentMonth = '',
		notes = '',
		preparedBy = '',
		onreset,
		onopenSettings
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		openSettings: void;
	}>();

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function openSettings() {
		if (onopenSettings) {
			onopenSettings();
		}
		closeMobileMenu();
	}
</script>

<nav
	class="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 shadow-lg border-b border-gray-200 dark:border-slate-700 print:hidden backdrop-blur-md"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-20">
			<!-- Logo/Brand -->
			<div class="flex items-center space-x-4">
				<div class="flex-shrink-0">
					<div class="flex items-center space-x-3">
						<div
							class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg"
						>
							<span class="text-white font-bold text-lg">P</span>
						</div>
						<div>
							<h1 class="text-2xl font-bold text-gray-900 dark:text-white">PropFit</h1>
							<p class="text-sm text-gray-500 dark:text-slate-400 font-medium">Rental Management</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Right side - Action Buttons and Settings (Desktop) -->
			<div class="hidden md:flex md:items-center md:gap-4">
				<ActionButtons
					{tenants}
					{expenses}
					{shareholders}
					{currentMonth}
					{notes}
					{preparedBy}
					{onreset}
				/>
				<button
					onclick={openSettings}
					class="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md group cursor-pointer"
					aria-label="Open Settings"
					title="Application Settings"
				>
					<Settings
						class="w-5 h-5 text-gray-600 dark:text-slate-300 group-hover:scale-110 transition-transform duration-200"
					/>
				</button>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
					onclick={toggleMobileMenu}
					aria-expanded={mobileMenuOpen}
					aria-label="Toggle main menu"
				>
					{#if !mobileMenuOpen}
						<Menu class="h-6 w-6" />
					{:else}
						<X class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile menu with smooth animation -->
		{#if mobileMenuOpen}
			<div
				class="md:hidden border-t border-gray-200 dark:border-slate-700 pt-6 pb-8 animate-slideDown"
			>
				<div class="space-y-6">
					<!-- Mobile Settings -->
					<div class="flex justify-center">
						<button
							onclick={openSettings}
							class="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md group cursor-pointer"
							aria-label="Open Settings"
							title="Application Settings"
						>
							<Settings
								class="w-5 h-5 text-gray-600 dark:text-slate-300 group-hover:scale-110 transition-transform duration-200"
							/>
						</button>
					</div>

					<!-- Mobile Action Buttons -->
					<div class="px-4">
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
				</div>

				<!-- Close button for mobile menu -->
				<div class="mt-6 flex justify-center">
					<button
						onclick={closeMobileMenu}
						class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
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
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-slideDown) {
		animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Enhanced backdrop blur support */
	nav {
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	/* Ensure proper stacking context */
	nav {
		position: relative;
		z-index: 50;
	}

	/* Add subtle gradient border */
	nav::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
	}
</style>
