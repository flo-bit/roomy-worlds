<script lang="ts">
	import { g } from '$lib/roomy.svelte';
	import { derivePromise } from '$lib/utils.svelte';
	import { onMount } from 'svelte';
	import Player from './Player.svelte';
	import { removeOldPlayerLocations } from './state.svelte';

	let players = derivePromise([], async () => (g.world ? await g.world.players.items() : []));


	$inspect(players.value);

	// onMount(() => {
	// 	setInterval(() => {
	// 		removeOldPlayerLocations();
	// 	}, 10000);
	// });
</script>

{#each players.value as player}
	<Player {player} />
{/each}
