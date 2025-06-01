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
				cells: {
					$each: {
						instances: {
							$each: true,
							$onError: null
						},
						$onError: null
					},
					$onError: null
				},
				players: {
					$each: true,
					$onError: null
				}
			}
		});
	});

	// $inspect(Object.keys(editingState.world?.current?.cells ?? {}));
</script>

{#if showWorld}
	{@render children()}
{:else}
	<Button class="m-4" onclick={() => createWorld(base)}>New World</Button>
{/if}
