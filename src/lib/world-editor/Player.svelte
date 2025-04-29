<script lang="ts">
	import CharacterModel from '$lib/player/CharacterModel.svelte';
	import type { PlayerLocation } from '$lib/roomy';
	import { T, useTask } from '@threlte/core';
	import { Vector3 } from 'three';
	import { editingState } from './state.svelte';

	let {
		player
	}: {
		player: PlayerLocation;
	} = $props();

	let x = $state(0);
	let y = $state(0);
	let z = $state(0);

	let rotation = $state(0);

	let timeDist = $state(0);

	let moving = $state(false);

	useTask((dt) => {
		let position = [player.x, player.y, player.z];

		timeDist = Date.now() - player.time;

		if(timeDist > 5000) return;

		// get distance between current position and target position
		const dist = Math.hypot(x - position[0], y - position[1], z - position[2]);
		// if distance is greater than 20 or more than 3 seconds ago, just teleport
		if (dist > 25 || timeDist > 3000) {
			x = position[0];
			y = position[1];
			z = position[2];
		}

		moving = dist > 0.5;
		if (!moving) return;

		// otherwise, interpolate linearly
		let direction = new Vector3(position[0] - x, position[1] - y, position[2] - z);
		direction.setLength(dist < 1 ? dist : 1);
		x += direction.x * dt * 2;
		y += direction.y * dt * 2;
		z += direction.z * dt * 2;

		// interpolate rotation
		rotation = rotation * 0.95 + (player.rotation ?? 0) * 0.05;
	});


	let playerId = $state(localStorage.getItem('playerId'));
</script>

{#if timeDist < 5000 && player.id !== playerId}
	<T.Group position={[x, y, z]} rotation.y={rotation}>
		{#key player.model}
			<CharacterModel
				scale={2}
				position.y={-0.7}
				currentAction={moving ? 'walk' : 'idle'}
				gender={player.model?.split(' ')[0].toLowerCase() as 'male' | 'female'}
				version={player.model?.split(' ')[1] as 'a' | 'b' | 'c' | 'd' | 'e' | 'f'}
			/>
		{/key}
	</T.Group>
{/if}
