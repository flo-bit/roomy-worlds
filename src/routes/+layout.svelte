<script lang="ts">
	import '../app.css';
	import { initClient } from '$lib/oauth';
	import { onMount } from 'svelte';
	import { Head } from 'fuchs';

	let { children } = $props();

	onMount(() => {
		initClient();
	});
</script>

{@render children()}

<Head title="roomy worlds" emojiFavicon="🏝️" />