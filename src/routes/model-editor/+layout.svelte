<script lang="ts">
	import { page } from '$app/state';
	import { Button } from 'fuchs';
	import { createModel } from '$lib/utils.svelte';
	import { base } from '$app/paths';
	import { modelEditor } from '$lib/model-editor/state.svelte';
	import { Model } from '$lib/schema';
	import { CoState } from 'jazz-svelte';

	let { children } = $props();

	let showEditor = $state(false);

	$effect(() => {
		const modelId = page.url.searchParams.get('id');
		if (!modelId) return;

		showEditor = true;

		modelEditor.voxelObject = new CoState(Model, modelId);
	});
</script>

{#if showEditor}
	{@render children()}
{:else}
	<Button class="m-4" onclick={() => createModel(base)}>New Model</Button>
{/if}
