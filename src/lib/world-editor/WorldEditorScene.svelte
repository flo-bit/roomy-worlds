<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { HUD, interactivity, OrbitControls, Sky } from '@threlte/extras';
	import Terrain from '$lib/world/Terrain.svelte';
	import Player from '$lib/player/Player.svelte';
	import { onMount } from 'svelte';
	import Instance from './Instance.svelte';
	import { addInstance, editingState } from './state.svelte';
	import { ACESFilmicToneMapping } from 'three';
	import Water from '$lib/world/Water.svelte';
	// import HudScene from './HudScene.svelte';
	import { Debug } from '@threlte/rapier';
	import { CoState } from 'jazz-svelte';
	import { World } from '$lib/schema';
	import GltfModel from '$lib/world/GLTFModel.svelte';
	import { base } from '$app/paths';
	import AutoColliderWrapper from '$lib/world/AutoColliderWrapper.svelte';
	import { getPathsForModel } from './models';

	interactivity({
		filter: (hits) => {
			return hits.slice(0, 1);
		}
	});

	let world = $derived(
		new CoState(World, editingState.worldId, {
			resolve: {
				instances: {
					$each: true,
					$onError: null
				}
			}
		})
	);

	const { renderer, scene } = useThrelte();

	onMount(async () => {
		window.addEventListener('keydown', (e) => {
			if (
				e.target instanceof HTMLInputElement ||
				(e.target instanceof HTMLElement && e.target.contentEditable === 'true') ||
				editingState.showModelEditor
			)
				return;

			// on shift+c switch camera
			if (e.key.toLowerCase() === 'c' && e.shiftKey) {
				if (editingState.camera === 'third' && !editingState.selectedCharacter) {
					editingState.showCharacterPicker = true;
				} else {
					editingState.camera = editingState.camera === 'first' ? 'third' : 'first';
				}

				editingState.showWorldSettings = false;
			}
		});

		renderer.toneMapping = ACESFilmicToneMapping;
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

<T.DirectionalLight
	position={[0, 100, -100]}
	castShadow
	shadow.camera.top={100}
	shadow.camera.bottom={-100}
	shadow.camera.left={-100}
	shadow.camera.right={100}
/>

<Terrain
	clickedTerrain={(e) => {
		if (editingState.selectedModel) {
			let paths = getPathsForModel(editingState.selectedModel);
			let randomIndex = Math.floor(Math.random() * paths.length);
			addInstance(paths[randomIndex], e.point);
		}
	}}
	settings={editingState.worldSettings}
/>

{#if editingState.worldSettings.waterPercentage > 0}
	<Water settings={editingState.worldSettings} />
{/if}

<!-- <Debug /> -->

<Sky />

{#each editingState.world?.current?.instances ?? [] as instance (instance.id)}
	<Instance {instance} />
{/each}

<!-- <HUD>
	<HudScene />
</HUD> -->
