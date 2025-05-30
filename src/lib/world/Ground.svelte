<script lang="ts">
	import { applyTransform, editingState } from '$lib/world-editor/state.svelte';
	import { T, useTask } from '@threlte/core';
	import { Grid, type IntersectionEvent } from '@threlte/extras';
	import { Vector2 } from 'three';

	let {
		clickedTerrain
	}: {
		clickedTerrain?: (e: IntersectionEvent<MouseEvent>) => void;
	} = $props();

	let pointerDownPosition: Vector2 | null = $state(null);
</script>

<T.Mesh
	rotation.x={-Math.PI / 2}
	onpointerdown={(e) => {
		pointerDownPosition = new Vector2(e.nativeEvent.clientX, e.nativeEvent.clientY);
	}}
	onpointerup={(e) => {
		if (!pointerDownPosition) return;

		let dist = Math.hypot(
			e.nativeEvent.clientX - pointerDownPosition.x,
			e.nativeEvent.clientY - pointerDownPosition.y
		);
		if (dist < 5) {
			e.stopPropagation();
			clickedTerrain?.(e);
		}

		pointerDownPosition = null;
	}}
	onpointerleave={() => {
		pointerDownPosition = null;
	}}
	ondblclick={() => {
		applyTransform();
		editingState.selectedInstance = null;
	}}
>
	<T.PlaneGeometry args={[10000, 10000, 10000]}></T.PlaneGeometry>

	<T.MeshStandardMaterial visible={false} />
</T.Mesh>

{#if editingState.selectedModel?.canPlaceOnFloor}
	<Grid
		cellColor="#333333"
		sectionColor="#ffffff"
		sectionThickness={0}
		cellThickness={0.5}
		fadeDistance={500}
		cellSize={2}
		infiniteGrid
	/>
{/if}
