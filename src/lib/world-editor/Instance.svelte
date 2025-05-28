<script module>
	import * as THREE from 'three';

	const material = new THREE.MeshStandardMaterial();
	const geometry = new THREE.BoxGeometry(1, 1, 1);
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	import { TransformControls } from '@threlte/extras';
	import { addInstance, applyTransform, editingState } from './state.svelte';
	import { Collider } from '@threlte/rapier';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import type { Loaded } from 'jazz-tools';
	import { Instance, Model } from '$lib/schema';
	import { CoState } from 'jazz-svelte';

	let { instance }: { instance: Loaded<typeof Instance> } = $props();

	let voxels = $derived(
		new CoState(Model, instance.model, {
			resolve: {
				voxels: {
					$each: true,
					$onError: null
				}
			}
		})
	);

	let scale = new Spring(0);

	onMount(() => {
		scale.target = 1;
	});
</script>

{#if editingState.selectedInstance === instance?.id && instance.transform}
	<TransformControls
		position={[instance.transform.x, instance.transform.y, instance.transform.z]}
		quaternion={[
			instance.transform.rx,
			instance.transform.ry,
			instance.transform.rz,
			instance.transform.rw
		]}
		scale={[instance.transform.sx, instance.transform.sy, instance.transform.sz]}
		bind:controls={editingState.transformControls}
		mode={editingState.tool === 'move' ? 'translate' : editingState.tool}
	>
		{#each voxels.current?.voxels ?? [] as voxel}
			{#if voxel.transform}
				<T.Mesh
					position={[voxel.transform.x, voxel.transform.y, voxel.transform.z]}
					quaternion={[
						voxel.transform.rx,
						voxel.transform.ry,
						voxel.transform.rz,
						voxel.transform.rw
					]}
					scale={[voxel.transform.sx, voxel.transform.sy, voxel.transform.sz]}
				>
					<T is={geometry} />
					<T is={material.clone()} color={[voxel.r, voxel.g, voxel.b]} />
				</T.Mesh>
			{/if}
		{/each}
	</TransformControls>
{:else if instance.transform}
	<T.Group
		position={[instance.transform.x, instance.transform.y, instance.transform.z]}
		quaternion={[
			instance.transform.rx,
			instance.transform.ry,
			instance.transform.rz,
			instance.transform.rw
		]}
		scale={[instance.transform.sx, instance.transform.sy, instance.transform.sz]}
		onclick={async (e) => {
			e.stopPropagation();

			if (editingState.selectedModelId) {
				// place on top of instance
				addInstance(editingState.selectedModelId, e.point);
				return;
			}
			await applyTransform();
			editingState.selectedModelId = null;
			editingState.selectedInstance = instance.id;

			return;
		}}
	>
		<!-- <InstancedMesh>
		<T.BoxGeometry />
		<T.MeshStandardMaterial /> -->
		{#each voxels.current?.voxels ?? [] as voxel}
			{#if voxel.transform}
				<T.Mesh
					position={[voxel.transform.x, voxel.transform.y, voxel.transform.z]}
					quaternion={[
						voxel.transform.rx,
						voxel.transform.ry,
						voxel.transform.rz,
						voxel.transform.rw
					]}
					scale={[voxel.transform.sx, voxel.transform.sy, voxel.transform.sz]}
					castShadow
					receiveShadow
				>
					<T is={geometry} />
					<T is={material.clone()} color={[voxel.r, voxel.g, voxel.b]} />

					{#if scale.current > 0.99}
						<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
					{/if}
				</T.Mesh>
			{/if}
		{/each}
	</T.Group>
{/if}
