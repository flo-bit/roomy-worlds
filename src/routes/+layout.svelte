<script lang="ts">
	import '../app.css';
	import { initClient, login } from '$lib/oauth';
	import { onMount } from 'svelte';
	import { BlueskyLoginModal, Head } from 'fuchs';
	import { initRoomy } from '$lib/roomy.svelte';

	let { children } = $props();

	onMount(() => {
		initClient();


		if (window.location.search.includes('local')) {
			initRoomy('local');
		} else {
			initRoomy();
		}
	});
</script>

{@render children()}

<Head title="roomy worlds" emojiFavicon="🏝️" />

<BlueskyLoginModal {login} />