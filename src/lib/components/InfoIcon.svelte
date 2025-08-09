<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import { Info } from 'lucide-svelte';

	interface Props {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		size?: number;
	}

	const { content, position = 'top', size = 16 }: Props = $props();
</script>

<Tooltip {content} {position}>
	<button
		type="button"
		class="inline-flex items-center justify-center ml-1 text-white/70 hover:text-white dark:text-gray-300 dark:hover:text-white focus:text-white focus:outline-none transition-colors cursor-help"
		aria-label="Information"
	>
		<Info {size} />
	</button>
</Tooltip>
