<script lang="ts">
	import Terrain from '$lib/world/Terrain.svelte';
	import { Float, OrbitControls, Sky } from '@threlte/extras';
	import type { WorldData } from './types';
	import WorldItemsViewer from './WorldItemsViewer.svelte';
	import { T } from '@threlte/core';
	import Water from '$lib/world/Water.svelte';

	const { world }: { world: WorldData } = $props();
</script>

<T.PerspectiveCamera
	makeDefault
	position={[100, 30, 100]}
	oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
>
	<OrbitControls autoRotate autoRotateSpeed={0.5} />
</T.PerspectiveCamera>

<Float floatingRange={[-10, -5]} floatIntensity={5}>
	<Terrain collider={false} animate settings={{
		seed: 1,
		size: 100,
		terrainGradient: [
			{ rgb: { r: 0.0, g: 0.05, b: 0.0 }, position: 0 },
			{ rgb: { r: 0.0, g: 0.35, b: 0.0 }, position: 1 }
		],
		waterGradient: [
			{ rgb: { r: 0.0, g: 0.05, b: 0.0 }, position: 0 },
			{ rgb: { r: 0.0, g: 0.35, b: 0.0 }, position: 1 }
		],
	}} />

	<Water animateIn animate settings={{
		seed: 1,
		size: 100,
		terrainGradient: [
			{ rgb: { r: 0.0, g: 0.05, b: 0.0 }, position: 0 },
			{ rgb: { r: 0.0, g: 0.35, b: 0.0 }, position: 1 }
		],
		waterGradient: [
			{ rgb: { r: 0.0, g: 0.00, b: 0.05 }, position: 0 },
			{ rgb: { r: 0.1, g: 0.1, b: 0.55 }, position: 1 }
		]
	}} />

	<WorldItemsViewer {world} />
</Float>

<T.DirectionalLight
	position={[0, 10, -10]}
	castShadow
	shadow.camera.top={100}
	shadow.camera.bottom={-100}
	shadow.camera.left={-100}
	shadow.camera.right={100}
/>

<Sky />
