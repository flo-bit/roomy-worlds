<script lang="ts">
	import { PlayerData } from '$lib/schema';
	import { T, useTask } from '@threlte/core';
	import type { Loaded } from 'jazz-tools';
	import Caveman from './Caveman.svelte';
	import CombatMech from './CombatMech.svelte';
	import Hiker from './Hiker.svelte';
	import ProtagonistA, { type ActionName } from './Protagonist_A.svelte';
	import ProtagonistB from './Protagonist_B.svelte';
	import Superhero from './Superhero.svelte';
	import Vampire from './Vampire.svelte';
	import Witch from './Witch.svelte';

	let { player }: { player: Loaded<typeof PlayerData> } = $props();

	let animation: ActionName = $state('Idle');

	let position = $state([player.position.x, player.position.y, player.position.z]);
	let rotation = $state(player.rotation);

	let show = $state(false);

	useTask(() => {
		let lerp = 0.05;

		let dist = Math.sqrt(
			(player.position.x - position[0]) ** 2 +
				(player.position.y - position[1]) ** 2 +
				(player.position.z - position[2]) ** 2
		);

		if (dist > 0.05) {
			animation = 'Walking_A';
		} else if (dist > 0.1) {
			animation = 'Running_A';
		} else {
			animation = 'Idle';
		}

		let x = player.position.x * lerp + position[0] * (1 - lerp);
		let y = player.position.y * lerp + position[1] * (1 - lerp);
		let z = player.position.z * lerp + position[2] * (1 - lerp);

		let r = player.rotation * lerp + rotation * (1 - lerp);

		position = [x, y, z];
		rotation = r;

		show = player.timestamp + 2000 > Date.now();
	});
</script>

{#if show}
	<T.Group {position}>
		{#if player.character === 'protagonist a'}
			<ProtagonistA
				position.y={-0.7}
				rotation.y={player.rotation}
				currentAction={animation}
				scale={0.8}
			/>
		{:else if player.character === 'protagonist b'}
			<ProtagonistB
				position.y={-0.7}
				rotation.y={player.rotation}
				currentAction={animation}
				scale={0.8}
			/>
		{:else if player.character === 'hiker'}
			<Hiker position.y={-0.7} rotation.y={player.rotation} currentAction={animation} scale={0.8} />
		{:else if player.character === 'caveman'}
			<Caveman
				position.y={-0.7}
				rotation.y={player.rotation}
				currentAction={animation}
				scale={0.8}
			/>
		{:else if player.character === 'witch'}
			<Witch position.y={-0.7} rotation.y={player.rotation} currentAction={animation} scale={0.8} />
		{:else if player.character === 'combat mech'}
			<CombatMech
				position.y={-0.7}
				rotation.y={player.rotation}
				currentAction={animation}
				scale={0.8}
			/>
		{:else if player.character === 'superhero'}
			<Superhero
				position.y={-0.7}
				rotation.y={player.rotation}
				currentAction={animation}
				scale={0.8}
			/>
		{:else if player.character === 'vampire'}
			<Vampire
				position.y={-0.7}
				rotation.y={player.rotation}
				currentAction={animation}
				scale={0.8}
			/>
		{/if}
	</T.Group>
{/if}
