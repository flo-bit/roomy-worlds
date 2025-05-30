<script module>
	import * as THREE from 'three';

	const material = new THREE.MeshStandardMaterial();
	const geometry = new THREE.BoxGeometry(1, 1, 1);
</script>

<script lang="ts">
	import { T } from '@threlte/core';
	import { TransformControls, type IntersectionEvent } from '@threlte/extras';
	import { addInstance, applyTransform, editingState } from './state.svelte';
	import { Collider } from '@threlte/rapier';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import type { Loaded } from 'jazz-tools';
	import { Instance, Model } from '$lib/schema';
	import { CoState } from 'jazz-svelte';
	import GltfModel from '$lib/world/GLTFModel.svelte';
	import AutoColliderWrapper from '$lib/world/AutoColliderWrapper.svelte';

	let { instance }: { instance: Loaded<typeof Instance> } = $props();

	let scale = new Spring(0);

	onMount(() => {
		scale.target = 1;
	});

	let pointerDownPosition: THREE.Vector2 | null = $state(null);

	async function onclick(e: IntersectionEvent<MouseEvent>) {
		e.stopPropagation();

		if (editingState.selectedModelId) {
			// place on top of instance
			addInstance(editingState.selectedModelId, e.point);
			return;
		}
		await applyTransform();
		editingState.selectedModel = null;
		editingState.selectedInstance = instance;

		return;
	}
</script>

{#if editingState.selectedInstance?.id === instance.id && instance.transform}
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
		<GltfModel source={instance.model} />
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
		scale={[
			instance.transform.sx * scale.current,
			instance.transform.sy * scale.current,
			instance.transform.sz * scale.current
		]}
		onpointerdown={(e) => {
			pointerDownPosition = new THREE.Vector2(e.nativeEvent.clientX, e.nativeEvent.clientY);
		}}
		onpointerup={(e) => {
			if (pointerDownPosition) {
				const delta = new THREE.Vector2(
					e.nativeEvent.clientX - pointerDownPosition.x,
					e.nativeEvent.clientY - pointerDownPosition.y
				);
				let dist = delta.length();
				if (dist < 5) {
					onclick(e);
				}
			}
		}}
		onpointerleave={() => {
			pointerDownPosition = null;
		}}
	>
		{#if scale.current < 0.99}
			<GltfModel source={instance.model} />
		{:else}
			<AutoColliderWrapper>
				<GltfModel source={instance.model} />
			</AutoColliderWrapper>
		{/if}
	</T.Group>
{/if}
