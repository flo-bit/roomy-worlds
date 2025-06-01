<script lang="ts">
	import '../app.css';

	import { JazzProvider } from 'jazz-svelte';
	import { MyAppAccount } from '$lib/schema';
	import { Head } from '@fuxui/base';
	import { Toaster } from '$lib/sonner';

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

<Toaster colors={{ default: 'accent', error: 'pink' }} position="top-right" />

<Head title="roomy worlds" emojiFavicon="🏝️" />
