<script lang="ts">
	import { g } from '$lib/roomy.svelte';
	import { derivePromise } from '$lib/utils.svelte';
	import Player from './Player.svelte';

	let players = derivePromise([], async () => (g.world ? await g.world.players.items() : []));
</script>

{#each players.value as player}
	<Player {player} />
{/each}
