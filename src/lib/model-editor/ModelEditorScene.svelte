<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid, interactivity, OrbitControls, Sky } from '@threlte/extras';
	import Voxels from './Voxels.svelte';
	import Floor from './Floor.svelte';
	import GhostVoxel from './GhostVoxel.svelte';
	import { modelEditor } from './state.svelte';

	interactivity({
		filter: (hits) => {
			return hits.slice(0, 1);
		}
	});
</script>

<T.PerspectiveCamera position={[10, 10, 10]} makeDefault name="model-editor-camera">
	<OrbitControls enabled={modelEditor.orbitControlsEnabled} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />

<!-- all the voxels -->
<Voxels voxels={modelEditor.voxelObject?.current?.voxels} />

<!-- floor that we can click on to place voxels -->
<Floor />

<!-- ghost voxel that shows where a newly placed voxel will be -->
<GhostVoxel />

<T.Mesh>
	<T.SphereGeometry args={[0.08]} />
	<T.MeshStandardMaterial color="red" />
</T.Mesh>

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
