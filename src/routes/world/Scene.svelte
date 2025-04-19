<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { Grid, interactivity, OrbitControls, Sky } from '@threlte/extras';
	import Terrain from '../../lib/world/Terrain.svelte';
	import Emitter from './Emitter.svelte';
	import Player from './player/Player.svelte';
	import { onMount } from 'svelte';
	import { PlayerLocation, type Transform, type TransformedGroup } from '$lib/shared/components';
	import Instance from './Instance.svelte';
	import { editingState, type AddInstanceFunction } from './state.svelte';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { ACESFilmicToneMapping } from 'three';
	import Water from '$lib/world/Water.svelte';

	interactivity();

	let camera = $state('first');

	const { renderer } = useThrelte();

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			// on c switch camera
			if (e.key === 'c') {
				camera = camera === 'first' ? 'third' : 'first';
			}
		});

		renderer.toneMapping = ACESFilmicToneMapping;
	});

	let {
		instances,
		addInstance,
		locations
	}: {
		instances: TransformedGroup[];
		addInstance: AddInstanceFunction;
		locations: PlayerLocation[];
	} = $props();

	let playerLocation: PlayerLocation | undefined = $state();

	async function createLocation() {
		if (!g.roomy) {
			await initRoomy();

			if (!g.roomy) return;
		}
		playerLocation = await g.roomy.create(PlayerLocation);
		playerLocation.x = 0;
		playerLocation.y = 0;
		playerLocation.z = 0;
		playerLocation.time = Date.now();
		playerLocation.commit();
		g.world?.locations.push(playerLocation);
		g.world?.commit();
	}

	$effect(() => {
		if (!playerLocation) {
			createLocation();
		}
	});

	useTask(() => {
		// remove locations that are older than 10 seconds or dont have a timestamp
		// for(let i = locations.length - 1; i >= 0; i--) {
		// 	if(locations[i].time === undefined || locations[i].time < Date.now() - 10000 ) {
		// 		g.world?.locations.remove(i);
		// 	}
		// }
		// g.world?.locations.subscribe(() => {
		// 	console.log('commit');
		// });
		//console.log(locations.length);
		// locations.forEach((location) => {
		// 	location.subscribe(() => {
		// 		console.log('location changed', location.x, location.y, location.z);
		// 	});
		// });
	});
</script>

{#if camera === 'first'}
	<T.PerspectiveCamera
		makeDefault
		position={[100, 10, 100]}
		oncreate={(ref) => {
			ref.lookAt(0, 1, 0);
		}}
	>
		<OrbitControls />
	</T.PerspectiveCamera>
{:else}
	<Player />
{/if}

<T.DirectionalLight position={[0, 10, -10]} />
<T.HemisphereLight position={[0, 10, 10]} args={[0xffff00, 0x0000ff, 1]} />

<Terrain
	clickedTerrain={(e) => {
		if (editingState.selectedModelId) {
			addInstance(editingState.selectedModelId, e.point);
		}
	}}
/>


<Water />

<!-- <Debug /> -->

<!-- <Emitter /> -->

<Sky />

{#each instances as instance}
	<Instance {instance} />
{/each}

<!-- {#each locations as location}
	<Location {location} />
{/each} -->
