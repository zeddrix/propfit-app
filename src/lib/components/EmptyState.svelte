<script lang="ts">
	interface Props {
		title: string;
		description: string;
		actionText?: string;
		onaction?: () => void;
	}

	const { title = '', description = '', actionText = '', onaction }: Props = $props();
</script>

<div class="text-center py-8 px-4 bg-gray-100 rounded-lg border border-gray-200">
	<div class="mb-4">
		<svg
			class="mx-auto h-12 w-12 text-gray-400"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
			/>
		</svg>
	</div>
	<h3 class="text-lg font-medium text-gray-900 mb-2">{title}</h3>
	<p class="text-gray-500 mb-4">{description}</p>
	{#if actionText && onaction}
		<button
			onclick={onaction}
			class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
		>
			{actionText}
		</button>
	{/if}
</div>
