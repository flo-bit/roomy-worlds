<script lang="ts">
	import '../app.css';
	import { initClient } from '$lib/oauth';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initClient();
	});
</script>

{@render children()}
