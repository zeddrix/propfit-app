<script lang="ts">
	import { Github, Heart } from 'lucide-svelte';

	// Dynamic year calculation
	const currentYear = new Date().getFullYear();
</script>

<footer
	class="mt-auto bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-600 py-6 print:hidden"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
			<!-- Copyright -->
			<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
				<span>© {currentYear} Zeddrix Fabian</span>
				<span class="text-gray-400 dark:text-gray-500">•</span>
				<span class="flex items-center gap-1">
					Made with <Heart size={14} class="text-red-500 fill-current" /> for rental management
				</span>
			</div>

			<!-- Links and Icons -->
			<div class="flex items-center space-x-6">
				<!-- GitHub Link -->
				<a
					href="https://github.com/zeddrix/"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Visit Zeddrix's GitHub profile"
					class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
				>
					<Github size={20} />
					<span class="text-sm">GitHub</span>
				</a>

				<!-- PropFit Badge -->
				<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
					<span
						class="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium"
					>
						PropFit v1.0
					</span>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	@media print {
		footer {
			display: none !important;
		}
	}
</style>
