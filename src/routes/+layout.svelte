<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-white text-gray-900">
	<main class="flex-1 bg-white">
		{@render children?.()}
	</main>
	<Footer />
</div>
