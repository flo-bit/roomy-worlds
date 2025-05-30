<script lang="ts">
	import { page } from '$app/state';
	import { Button } from 'fuchs';
	import { createWorld } from '$lib/utils.svelte';
	import { base } from '$app/paths';
	import { editingState } from '$lib/world-editor/state.svelte';
	import { World } from '$lib/schema';
	import { CoState } from 'jazz-svelte';

	let { children } = $props();

	let showWorld = $state(false);

	$effect(() => {
		const worldId = page.url.searchParams.get('id');
		if (!worldId) return;

		showWorld = true;

		editingState.worldId = worldId;
		editingState.world = new CoState(World, worldId, {
			resolve: {
				instances: {
					$each: true,
					$onError: null
				}
			}
		});
	});
</script>

{#if showWorld}
	{@render children()}
{:else}
	<Button class="m-4" onclick={() => createWorld(base)}>New World</Button>
{/if}
