<script lang="ts">
	interface Props {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
	}

	const { content, position = 'bottom' }: Props = $props();

	let showTooltip = $state(false);
	let tooltipElement = $state<HTMLDivElement>();

	// Position classes for different tooltip positions
	const positionClasses = {
		top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
	};

	const arrowClasses = {
		top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-200',
		bottom:
			'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 dark:border-b-gray-200',
		left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 dark:border-l-gray-200',
		right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 dark:border-r-gray-200'
	};

	function handleMouseEnter() {
		showTooltip = true;
	}

	function handleMouseLeave() {
		showTooltip = false;
	}

	function handleFocus() {
		showTooltip = true;
	}

	function handleBlur() {
		showTooltip = false;
	}
</script>

<!-- Tooltip wrapper that wraps the target element -->
<div
	class="relative inline-block"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onfocus={handleFocus}
	onblur={handleBlur}
>
	<slot />

	<!-- Tooltip -->
	{#if showTooltip}
		<div
			bind:this={tooltipElement}
			id="tooltip"
			role="tooltip"
			class="absolute z-[100] px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-200 dark:text-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200 {positionClasses[
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
