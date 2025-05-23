<script lang="ts">
	import { Vector3 as RapierVector3 } from '@dimforge/rapier3d-compat';
	import { T, useTask } from '@threlte/core';
	import { Collider } from '@threlte/rapier';
	import * as THREE from 'three';
	import { UberNoise } from 'uber-noise';
	import type { IntersectionEvent } from '@threlte/extras';
	import { shuffle } from '$lib/utils.svelte';
	import { ColorGradient } from './colorgradient';
	import type { WorldSettings } from '$lib/roomy';
	import { applyTransform, editingState } from '$lib/world-editor/state.svelte';

	let {
		clickedTerrain,
		collider = true,
		animate = false,
		animationTime = 3,
		settings
	}: {
		clickedTerrain?: (e: IntersectionEvent<MouseEvent>) => void;
		collider?: boolean;
		animate?: boolean;
		animationTime?: number;
		settings: WorldSettings;
	} = $props();

	const size = settings.size;

	const voxelSize = 1;

	const totalVoxels = Math.ceil(
		size * size * (1 / voxelSize) * (1 / voxelSize) * 2 * (Math.PI / 4)
	);

	const instancedGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
	const instancedMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const instancedMesh = new THREE.InstancedMesh(instancedGeometry, instancedMaterial, totalVoxels);

	const indices = shuffle(Array.from({ length: totalVoxels }, (_, i) => i));

	instancedMesh.receiveShadow = true;

	const dummy = new THREE.Object3D();
	const heightfield: number[] = [];

	const options = settings.terrainNoise ?? {
		octaves: 6,
		scale: 0.03,
		min: 0,
		max: 3,
		warp: 1
	};

	options.seed = settings.seed;

	const upperNoise = new UberNoise(options);
	const lowerNoise = new UberNoise({
		seed: settings.seed + 10,
		octaves: 6,
		scale: 0.05,
		min: 0,
		max: 5,
		warp: 1
	});

	const lowerIndices = new Set<number>();


	const gradient = new ColorGradient({
		stops: settings.terrainGradient.map(({ rgb, position }) => ({
			position: (position - 0.5) * 2,
			value: new THREE.Color(rgb.r, rgb.g, rgb.b)
		}))
	});

	for (let x = -size / 2; x < size / 2; x += voxelSize) {
		for (let z = -size / 2; z < size / 2; z += voxelSize) {
			// get distance from center
			const distance = Math.sqrt(x * x + z * z);
			// only if distance is less than 50
			const noiseHeight = upperNoise.get(x, z);

			if (distance > size / 2) {
				heightfield.push(-100);
				continue;
			}

			const height = noiseHeight// + Math.pow(distance / (size / 2), 2) * -5;
			const noise = upperNoise.normalized(x, z);
			dummy.position.set(x, height, z);
			dummy.scale.set(1, 3, 1);
			dummy.updateMatrix();

			const color = gradient.get(noise);

			let i = indices.shift() ?? 0;

			instancedMesh.setMatrixAt(i, dummy.matrix);
			instancedMesh.setColorAt(i, color);

			heightfield.push(height + 1.5);

			const percentage = Math.pow(Math.min(distance / (size / 2), 1), 2);
			const baseHeight = lowerNoise.get(x, z) + size * -0.5;

			const lowerHeight = (1 - percentage) * baseHeight + percentage * height;
			dummy.position.set(x, lowerHeight - 0.1, z);

			color.setRGB(0.3 * percentage + 0.1, 0.03 * percentage + 0.02, 0);
			dummy.scale.set(1.1, 3, 1.1);
			dummy.updateMatrix();

			i = indices.shift() ?? 0;

			lowerIndices.add(i);

			instancedMesh.setMatrixAt(i, dummy.matrix);
			instancedMesh.setColorAt(i, color);
		}
	}
	instancedMesh.instanceMatrix.needsUpdate = true;
	if (instancedMesh.instanceColor) {
		instancedMesh.instanceColor.needsUpdate = true;
	}

	let heightfieldData = new Float32Array(heightfield);


	let i = 0;
	const addPerSecond = totalVoxels / animationTime;

	const { stop } = useTask((dt) => {
		if (!animate) {
			stop();
			return;
		}

		instancedMesh.count = Math.min(Math.floor(i), totalVoxels);

		i += addPerSecond * dt;
	});
</script>

<T
	is={instancedMesh}
	onclick={clickedTerrain
		? (e) => {
				if (e.instanceId !== undefined && lowerIndices.has(e.instanceId)) return;

				e.stopPropagation();

				clickedTerrain(e);
			}
		: undefined}

	ondblclick={() => {
		applyTransform();
		editingState.selectedInstance = null;
	}}
/>

{#if collider}
	<T.Group position={[-voxelSize / 2, 0, -voxelSize / 2]}>
		<Collider
			shape={'heightfield'}
			args={[
				Math.round(size / voxelSize) - 1,
				Math.round(size / voxelSize) - 1,
				heightfieldData,
				new RapierVector3(size, 1, size)
			]}
		/>
	</T.Group>
{/if}
