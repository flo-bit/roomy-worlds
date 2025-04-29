<script lang="ts">
	import '../app.css';
	import { initClient, login } from '$lib/oauth';
	import { onMount } from 'svelte';
	import { BlueskyLoginModal, Head } from 'fuchs';

	let { children } = $props();

	onMount(() => {
		initClient();
	});
</script>

{@render children()}

<Head title="roomy worlds" emojiFavicon="🏝️" />

<BlueskyLoginModal {login} />