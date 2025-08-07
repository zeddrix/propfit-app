<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
	}

	const { content, position = 'top' }: Props = $props();

	let showTooltip = $state(false);
	let tooltipElement = $state<HTMLDivElement>();

	const dispatch = createEventDispatcher<{
		show: void;
		hide: void;
	}>();

	function handleMouseEnter() {
		showTooltip = true;
		dispatch('show');
	}

	function handleMouseLeave() {
		showTooltip = false;
		dispatch('hide');
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			showTooltip = !showTooltip;
		} else if (event.key === 'Escape') {
			showTooltip = false;
		}
	}

	function handleFocus() {
		showTooltip = true;
		dispatch('show');
	}

	function handleBlur() {
		showTooltip = false;
		dispatch('hide');
	}

	// Position classes for different tooltip positions
	const positionClasses = {
		top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
	};

	const arrowClasses = {
		top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
		bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
		left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
		right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800'
	};
</script>

<div class="relative inline-block">
	<!-- Trigger element (info icon) -->
	<button
		type="button"
		class="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none transition-colors cursor-help"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onfocus={handleFocus}
		onblur={handleBlur}
		onkeydown={handleKeyDown}
		aria-describedby="tooltip"
		aria-label="Information"
	>
		<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
				clip-rule="evenodd"
			></path>
		</svg>
	</button>

	<!-- Tooltip -->
	{#if showTooltip}
		<div
			bind:this={tooltipElement}
			id="tooltip"
			role="tooltip"
			class="absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg max-w-xs {positionClasses[
				position
			]}"
		>
			{content}
			<!-- Arrow -->
			<div class="absolute w-0 h-0 border-4 border-transparent {arrowClasses[position]}"></div>
		</div>
	{/if}
</div>

<style>
	/* Ensure tooltip appears above other elements */
	.relative {
		z-index: 10;
	}
</style>
