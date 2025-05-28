<script lang="ts">
	import '../app.css';

	import { JazzProvider } from 'jazz-svelte';
	import { MyAppAccount } from '$lib/schema';
	import { BlueskyLoginModal, Head, Toaster } from 'fuchs';
	import { login } from '$lib/oauth';

	let { children } = $props();
</script>

<JazzProvider
	sync={{
		peer: `wss://cloud.jazz.tools/?key=flo.bit.dev@gmail.com`
	}}
	AccountSchema={MyAppAccount}
>
	{@render children()}
</JazzProvider>

<Toaster />

<Head title="roomy worlds" emojiFavicon="🏝️" />

<BlueskyLoginModal login={login} />