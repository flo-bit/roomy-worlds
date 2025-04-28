<script module>
	import * as THREE from 'three';

	const material = new THREE.MeshStandardMaterial();
	const geometry = new THREE.BoxGeometry(1, 1, 1);
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	import { derivePromise } from '$lib/utils.svelte';
	import { TransformControls } from '@threlte/extras';
	import { addInstance, applyTransform, editingState } from './state.svelte';
	import { Collider } from '@threlte/rapier';
	import { models } from './models.svelte';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { TransformedGroup } from '$lib/roomy';

	let { instance }: { instance: TransformedGroup } = $props();

	let voxels = derivePromise([], async () => models.getModel(instance.group));


	let scale = new Spring(0)

	onMount(() => {
		scale.target = 1;
	})
</script>

{#if editingState.selectedInstance === instance}
	<TransformControls
		position={instance.position.toArray()}
		quaternion={instance.quaternion.toArray()}
		scale={instance.scale.toArray()}
		bind:controls={editingState.transformControls}
		mode={editingState.tool === 'move' ? 'translate' : editingState.tool}
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
{:else}
	<T.Group
		position={instance.position.toArray()}
		quaternion={instance.quaternion.toArray()}
		scale={instance.scale.toArray().map(s => scale.current * s) as [number, number, number]}
		onclick={async (e) => {
			e.stopPropagation();

			if(editingState.selectedModelId) {
				// place on top of instance
				addInstance(editingState.selectedModelId, e.point);
				return;
			}
				await applyTransform();
				editingState.selectedModelId = null;
				editingState.selectedInstance = instance;
				
				return;

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
				castShadow
				receiveShadow
			>
				<T is={geometry} />
				<T is={material.clone()} color={voxel.color} />

				{#if scale.current > 0.99}
					<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
				{/if}
			</T.Mesh>
		{/each}
	</T.Group>
{/if}
