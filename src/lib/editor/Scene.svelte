<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid, interactivity, OrbitControls, Sky } from '@threlte/extras';
	import Voxels from './Voxels.svelte';
	import Floor from './Floor.svelte';
	import GhostVoxel from './GhostVoxel.svelte';
	import { Voxel } from '$lib/shared/components';
	import type { AddVoxelFunction } from './types';

	interactivity();

	let {
		voxels,
		addVoxel,
		deleteVoxel
	}: {
		voxels: Voxel[];
		addVoxel: AddVoxelFunction;
		deleteVoxel: (id: string) => Promise<void>;
	} = $props();
</script>

<T.PerspectiveCamera position={[10, 10, 10]} makeDefault>
	<OrbitControls />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />

<!-- all the voxels -->
<Voxels {voxels} {addVoxel} {deleteVoxel} />

<!-- floor that we can click on to place voxels -->
<Floor addVoxel={addVoxel} />

<!-- ghost voxel that shows where a newly placed voxel will be -->
<GhostVoxel />

<Grid
	cellColor="#333333"
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={100}
	cellSize={1}
	position.x={0.5}
	position.z={0.5}
/>

<Sky />
