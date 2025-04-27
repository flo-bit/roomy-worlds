<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { HUD, interactivity, OrbitControls, Sky } from '@threlte/extras';
	import Terrain from '../../lib/world/Terrain.svelte';
	import Player from './player/Player.svelte';
	import { onMount } from 'svelte';
	import Instance from './Instance.svelte';
	import { editingState, type AddInstanceFunction } from './state.svelte';
	import { ACESFilmicToneMapping } from 'three';
	import Water from '$lib/world/Water.svelte';
	import HudScene from './HudScene.svelte';
	import { Debug } from '@threlte/rapier';
	import { TransformedGroup } from '$lib/roomy';

	interactivity({
		filter: (hits) => {
			return hits.slice(0, 1);
		}
	});

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
		addInstance
	}: {
		instances: TransformedGroup[];
		addInstance: AddInstanceFunction;
	} = $props();
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

{#key editingState.worldSettings.version}
	<Terrain
		clickedTerrain={(e) => {
			if (editingState.selectedModelId) {
				addInstance(editingState.selectedModelId, e.point);
			}
		}}
	/>

	<Water />
{/key}

<Debug />

<Sky />

{#each instances as instance}
	<Instance {instance} />
{/each}

<HUD>
	<HudScene />
</HUD>
