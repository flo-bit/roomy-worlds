<script lang="ts">
	import { T } from '@threlte/core';
	import { TransformControls, type IntersectionEvent } from '@threlte/extras';
	import { applyTransform, clickedOn, editingState } from './state.svelte';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import type { Loaded } from 'jazz-tools';
	import { Instance } from '$lib/schema';
	import GltfModel from '$lib/world/GLTFModel.svelte';
	import AutoColliderWrapper from '$lib/world/AutoColliderWrapper.svelte';
	import { Vector2 } from 'three';

	let { instance }: { instance: Loaded<typeof Instance> } = $props();

	let scale = new Spring(0);

	onMount(() => {
		scale.target = 1;
	});

	let pointerDownPosition: Vector2 | null = $state(null);

	async function onclick(e: IntersectionEvent<MouseEvent>) {
		e.stopPropagation();

		if (editingState.selectedModel) {
			// place on top of instance
			clickedOn(e.point);
			return;
		}

		await applyTransform();
		editingState.selectedInstance = instance;

		return;
	}
</script>

{#if editingState.selectedInstance?.id === instance.id && instance.transform}
	<TransformControls
		position={[instance.transform.position.x, instance.transform.position.y, instance.transform.position.z]}
		quaternion={[
			instance.transform.quaternion.x,
			instance.transform.quaternion.y,
			instance.transform.quaternion.z,
			instance.transform.quaternion.w
		]}
		scale={[instance.transform.scale.x, instance.transform.scale.y, instance.transform.scale.z]}
		bind:controls={editingState.transformControls}
		mode={editingState.tool === 'move' ? 'translate' : editingState.tool}
	>
		<GltfModel source={instance.path} />
	</TransformControls>
{:else if instance.transform}
	<T.Group
		position={[instance.transform.position.x, instance.transform.position.y, instance.transform.position.z]}
		quaternion={[
			instance.transform.quaternion.x,
			instance.transform.quaternion.y,
			instance.transform.quaternion.z,
			instance.transform.quaternion.w
		]}
		scale={[
			instance.transform.scale.x * scale.current,
			instance.transform.scale.y * scale.current,
			instance.transform.scale.z * scale.current
		]}
		onpointerdown={(e) => {
			pointerDownPosition = new Vector2(e.nativeEvent.clientX, e.nativeEvent.clientY);
		}}
		onpointerup={(e) => {
			if (pointerDownPosition) {
				const delta = new Vector2(
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
		{#if scale.current < 0.99 || !instance.collision}
			<GltfModel source={instance.path} />
		{:else}
			<AutoColliderWrapper>
				<GltfModel source={instance.path} />
			</AutoColliderWrapper>
		{/if}
	</T.Group>
{/if}
