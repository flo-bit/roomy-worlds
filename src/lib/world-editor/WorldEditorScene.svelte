<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { HUD, interactivity, OrbitControls, Sky } from '@threlte/extras';
	import Terrain from '$lib/world/Terrain.svelte';
	import Player from '$lib/player/Player.svelte';
	import { onMount } from 'svelte';
	import Instance from './Instance.svelte';
	import { addInstance, editingState, getPlayerLocation } from './state.svelte';
	import { ACESFilmicToneMapping } from 'three';
	import Water from '$lib/world/Water.svelte';
	import HudScene from './HudScene.svelte';
	import { Debug } from '@threlte/rapier';
	import { derivePromise } from '$lib/utils.svelte';
	import { g } from '$lib/roomy.svelte';

	interactivity({
		filter: (hits) => {
			return hits.slice(0, 1);
		}
	});

	let instances = derivePromise([], async () => (g.world ? await g.world.instances.items() : []));

	const { renderer } = useThrelte();

	onMount(async () => {
		window.addEventListener('keydown', (e) => {
			if (
				e.target instanceof HTMLInputElement ||
				(e.target instanceof HTMLElement && e.target.contentEditable === 'true') ||
				editingState.showModelEditor
			)
				return;

			// on c switch camera
			if (e.key === 'c') {
				if(editingState.camera === 'third' && !editingState.selectedCharacter) {
					editingState.showCharacterPicker = true;
				} else {
					editingState.camera = editingState.camera === 'first' ? 'third' : 'first';
				}
			}
		});

		renderer.toneMapping = ACESFilmicToneMapping;
	});

	$effect(() => {
		if (g.world && g.world.settings.version > editingState.worldSettings.version) {
			editingState.worldSettings = g.world.settings;
			console.log('settings', editingState.worldSettings);
		}
	});
</script>

{#if editingState.camera === 'third'}
	<T.PerspectiveCamera
		makeDefault
		position={[100, 50, 100]}
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

{#key editingState.worldSettings.version + editingState.worldSettings.waterPercentage + editingState.worldSettings.size}
	<Terrain
		clickedTerrain={(e) => {
			if (editingState.selectedModelId) {
				addInstance(editingState.selectedModelId, e.point);
			}
		}}
		settings={editingState.worldSettings}
	/>

	{#if editingState.worldSettings.waterPercentage > 0}
		<Water settings={editingState.worldSettings} />
	{/if}
{/key}

<!-- <Debug /> -->

<Sky />

{#each instances.value as instance}
	<Instance {instance} />
{/each}

<HUD>
	<HudScene />
</HUD>
