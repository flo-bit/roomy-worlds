<script>
	import { Button } from 'fuchs';
	import { editingState } from './state.svelte';
</script>

<Button
	size="iconLg"
	class="bg-accent-100 hover:bg-accent-200 absolute top-4 left-4"
	onclick={() => (editingState.showModelPicker = true)}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2.5"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg>

	<span class="sr-only">Add Model</span>
</Button>
