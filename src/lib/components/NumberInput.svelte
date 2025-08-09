<script lang="ts">
	export let value: number;
	export let step = 1;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let placeholder = '';
	export let disabled = false;

	// Default color scheme (orange/amber)
	export let colorScheme = {
		border: 'border-orange-200',
		borderHover: 'border-amber-300',
		borderFocus: 'border-amber-500',
		bg: 'bg-white',
		bgHover: 'bg-amber-50',
		bgFocus: 'bg-amber-50',
		text: 'text-gray-800',
		buttonBg: 'bg-amber-50',
		buttonBorder: 'border-amber-200',
		buttonHover: 'bg-amber-100',
		buttonText: 'text-amber-600',
		buttonHoverText: 'text-amber-800',
		shadow: 'shadow-amber-100',
		shadowHover: 'shadow-amber-200'
	};

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const newValue = parseFloat(target.value) || 0;
		dispatch('change', newValue);
	};

	const handleStep = (increment: boolean) => {
		if (disabled) return;

		let newValue = value || 0;
		const stepValue = increment ? step : -step;
		newValue += stepValue;

		if (min !== undefined) newValue = Math.max(min, newValue);
		if (max !== undefined) newValue = Math.min(max, newValue);

		dispatch('change', newValue);
	};

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		change: number;
	}>();
</script>

<div class="number-input-container relative w-full">
	<input
		type="number"
		class="w-full px-3 py-2 pr-10 rounded-lg border {colorScheme.border} {colorScheme.bg} {colorScheme.text} 
			transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 {colorScheme.shadow} focus:ring-amber-200
			hover:{colorScheme.bgHover} focus:{colorScheme.bgFocus} focus:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
		bind:value
		{min}
		{max}
		{step}
		{placeholder}
		{disabled}
		on:input={handleInput}
	/>

	<div
		class="spinner-buttons absolute right-1 top-1/2 -translate-y-1/2 flex flex-col h-[calc(100%-0.5rem)]"
	>
		<button
			type="button"
			class="spinner-btn up w-6 h-1/2 flex items-center justify-center
				{colorScheme.buttonBg} {colorScheme.buttonBorder} {colorScheme.buttonText}
				hover:{colorScheme.buttonHover} hover:{colorScheme.buttonHoverText} 
				border rounded-t-md rounded-b-none border-b-0"
			on:click|stopPropagation|preventDefault={() => handleStep(true)}
			{disabled}
		>
			<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		<button
			type="button"
			class="spinner-btn down w-6 h-1/2 flex items-center justify-center
				{colorScheme.buttonBg} {colorScheme.buttonBorder} {colorScheme.buttonText}
				hover:{colorScheme.buttonHover} hover:{colorScheme.buttonHoverText} 
				border rounded-b-md rounded-t-none"
			on:click|stopPropagation|preventDefault={() => handleStep(false)}
			{disabled}
		>
			<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
</div>

<style>
	/* Hide default number input spinners */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Animation for focus state */
	@keyframes gentle-bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-2px);
		}
	}

	input:focus {
		animation: gentle-bounce 0.3s ease-in-out;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.spinner-buttons {
			height: calc(100% - 0.25rem);
		}

		.spinner-btn {
			width: 1.5rem;
		}
	}
</style>
