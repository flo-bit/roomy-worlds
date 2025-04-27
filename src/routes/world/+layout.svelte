<script lang="ts">
	import { page } from '$app/state';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { World, type EntityIdStr } from '$lib/roomy';
	import { goto } from '$app/navigation';
	import { Button } from 'fuchs';
	import { createWorld } from '$lib';
	import { base } from '$app/paths';

	let { children } = $props();

	let showWorld = $state(false);

	$effect(() => {
		console.log('hello');
		//const worldId = page.params.id;
		// TODO: we should use search params here
		const worldId = page.url.searchParams.get('id');
		if (!worldId) return;

		showWorld = true;

		if (!g.roomy) {
			initRoomy();

			if (!g.roomy) {
				console.error('Failed to initialize roomy');
				return;
			}
		}
		console.log('loading', worldId);

		g.roomy
			.open(World, worldId as EntityIdStr)
			.then((world) => {
				g.world = world;
				console.log(world);
			})
			.catch((e) => {
				console.error('Error opening world', e);
				goto('/');
			});
	});
</script>

{#if showWorld}
	{@render children()}
{:else}
	<Button class="m-4" onclick={() => createWorld(base)}>New World</Button>
{/if}
