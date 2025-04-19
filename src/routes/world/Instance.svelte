<script module>
	import * as THREE from 'three';

	const material = new THREE.MeshStandardMaterial();
	const geometry = new THREE.BoxGeometry(1, 1, 1);
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	// import { TransformControls } from '@threlte/extras';
	import type { TransformedGroup } from '$lib/shared/components';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import { Instance, InstancedMesh, TransformControls } from '@threlte/extras';
	import { Collider } from '@threlte/rapier';
	import { applyTransform, editingState } from './state.svelte';

	let { instance }: { instance: TransformedGroup } = $props();

	let voxels = derivePromise([], async () =>
		instance ? await (await instance.loadGroup()).voxels.items() : []
	);
</script>

{#if editingState.selectedInstance !== instance}
	<T.Group
		position={instance.position.toArray()}
		quaternion={instance.quaternion.toArray()}
		scale={instance.scale.toArray()}
		onclick={async (e) => {
			e.stopPropagation();

			await applyTransform();

			editingState.selectedInstance = instance;
		}}
	>
		<!-- <InstancedMesh>
		<T.BoxGeometry />
		<T.MeshStandardMaterial /> -->
		{#each voxels.value as voxel}
			<T.Mesh
				position={voxel.position.toArray()}
				quaternion={voxel.quaternion.toArray()}
				scale={voxel.scale.toArray()}
			>
				<T is={geometry} />
				<T is={material.clone()} color={voxel.color} />
			</T.Mesh>
			<!-- <T.Group
				position={voxel.position.toArray()}
				quaternion={voxel.quaternion.toArray()}
				scale={voxel.scale.toArray().map((s) => Math.abs(s)) as [number, number, number]}
			>
				<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
			</T.Group> -->
			<!-- <Instance
				position={voxel.position.toArray()}
				quaternion={voxel.quaternion.toArray()}
				scale={voxel.scale.toArray()}
				color={voxel.color}
			/> -->
		{/each}
		<!-- </InstancedMesh> -->
	</T.Group>
{:else}
	<TransformControls
		position={instance.position.toArray()}
		quaternion={instance.quaternion.toArray()}
		scale={instance.scale.toArray()}
		bind:controls={editingState.transformControls}
	>
		{#each voxels.value as voxel}
			<T.Mesh
				position={voxel.position.toArray()}
				quaternion={voxel.quaternion.toArray()}
				scale={voxel.scale.toArray()}
			>
				<T is={geometry} />
				<T is={material.clone()} color={voxel.color} />
			</T.Mesh>
		{/each}
	</TransformControls>
{/if}
