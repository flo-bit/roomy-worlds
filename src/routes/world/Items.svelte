<script lang="ts">
	import { T } from '@threlte/core';
	import { TransformControls } from '@threlte/extras';
	import type { Voxel } from '$lib/shared/components';
	import { Collider } from '@threlte/rapier';

	let { voxels }: { voxels: Voxel[] } = $props();
</script>

{#each voxels as voxel, index}
	<TransformControls>
		<T.Mesh
			position={voxel.position.toArray()}
			quaternion={voxel.quaternion.toArray()}
			scale={voxel.scale.toArray()}
		>
			<T.BoxGeometry args={[1, 1, 1]} />
			<T.MeshStandardMaterial color={voxel.color} />

			<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
		</T.Mesh>
	</TransformControls>
{/each}
