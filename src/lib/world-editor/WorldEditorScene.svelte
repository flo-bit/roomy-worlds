<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { HUD, interactivity, OrbitControls, Sky } from '@threlte/extras';
	import Player from '$lib/player/Player.svelte';
	import { onMount } from 'svelte';
	import Instance from './Instance.svelte';
	import { clickedOn, editingState } from './state.svelte';
	import { ACESFilmicToneMapping } from 'three';
	import HudScene from './HudScene.svelte';
	import Ground from '$lib/world/Ground.svelte';
	import Dof from '$lib/world/DOF.svelte';
	import { Debug } from '@threlte/rapier';
	import OtherPlayer from '$lib/player/OtherPlayer.svelte';
	import { AccountCoState } from 'jazz-svelte';
	import { MyAppAccount } from '$lib/schema';

	const me = new AccountCoState(MyAppAccount, {
		resolve: {
			profile: true
		}
	});

	const playerId = $derived(me.current?.profile?.id);

	interactivity({
		filter: (hits) => {
			return hits.slice(0, 1);
		}
	});

	const { renderer } = useThrelte();

	let {
		interactive = true,
		y = 0,
		position = [0, 0, 0]
	}: { interactive?: boolean; y?: number; position?: [number, number, number] } = $props();

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
		position={[20, 20, 20]}
		oncreate={(ref) => {
			ref.lookAt(0, 1, 0);
		}}
	>
		<OrbitControls maxPolarAngle={Math.PI / 2} />
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
	shadow.mapSize.width={1024}
	shadow.mapSize.height={1024}
	shadow.bias={-0.00001}
/>

<Ground
	clickedTerrain={(e) => {
		if (!interactive) return;

		clickedOn(e.point, true);
	}}
/>

<!-- <Dof /> -->
<!-- <Debug /> -->

<Sky />

<T.Group position={[0, y, 0]}>
	<T.Mesh>
		<T.SphereGeometry args={[0.1, 32, 32]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>

	{#each Object.entries(editingState.world?.current?.cells ?? {}) as [cellId, cell]}
		{#if cell && cell.instances}
			{#each cell.instances ?? [] as instance (instance?.id)}
				{#if instance}
					<Instance {instance} {interactive} {cellId} />
				{/if}
			{/each}
		{/if}
	{/each}

	{#if playerId}
		{#each Object.entries(editingState.world?.current?.players ?? {}) as [id, player] (id)}
			{#if player && id !== playerId}
				<OtherPlayer {player} />
			{/if}
		{/each}
	{/if}
</T.Group>
<HUD>
	<HudScene />
</HUD>
