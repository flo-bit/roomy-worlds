<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { UberNoise } from 'uber-noise';
	import { shuffle } from '$lib';
	import { ColorGradient } from './colorgradient';
	import { editingState } from '../../routes/world/state.svelte';

	const size = editingState.worldSettings.size;

	const voxelSize = 1;

	const totalVoxels = Math.ceil(
		size * size * (1 / voxelSize) * (1 / voxelSize) * (Math.PI / 4)
	);

	const instancedGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
	const instancedMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0, transparent: true, opacity: 0.95, roughness: 0 });
	const instancedMesh = new THREE.InstancedMesh(instancedGeometry, instancedMaterial, totalVoxels);

	const indices = shuffle(Array.from({ length: totalVoxels }, (_, i) => i));

	instancedMesh.receiveShadow = true;

	const dummy = new THREE.Object3D();

	const waterNoise = new UberNoise({
		seed: editingState.worldSettings.seed + 10,
		octaves: 3,
		scale: 0.01,
		min: 0,
		max: 1,
		warp: 1
	});


	const terrainNoise = new UberNoise({
		seed: editingState.worldSettings.seed,
		octaves: 6,
		scale: 0.03,
		min: 0,
		max: 3,
		warp: 1
	});

	const waterGradient = new ColorGradient({
		stops: editingState.worldSettings.waterGradient.map(({ rgb, position }) => ({
			position: (position - 1),
			value: new THREE.Color(rgb.r, rgb.g, rgb.b)
		}))
	});

	let positions: THREE.Vector3[] = new Array(totalVoxels);
	let edge: boolean[] = new Array(totalVoxels);

	for (let x = -size / 2; x < size / 2; x += voxelSize) {
		for (let z = -size / 2; z < size / 2; z += voxelSize) {
			// get distance from center
			const distance = Math.sqrt(x * x + z * z);
			// only if distance is less than 50
			const noiseHeight = terrainNoise.get(x, z);


			if (distance > size / 2) {
				continue;
			}
			const water = waterNoise.normalized(x, z);

			// check if at edge by comparing with the 4 surrounding voxels
			const surrounding = [
				Math.hypot(x + voxelSize, z),
				Math.hypot(x - voxelSize, z),
				Math.hypot(x, z + voxelSize),
				Math.hypot(x, z - voxelSize)
			];

			const isEdge = surrounding.some(s => s > size / 2);


			const height = noiseHeight + Math.pow(distance / (size / 2), 2) * -5;

			if(water > (editingState.worldSettings.waterPercentage / 100 * 2 - 1)) continue;

			dummy.position.set(x, height, z);
			dummy.scale.set(1.2, isEdge ? 20 : 3, 1.2);
			dummy.updateMatrix();
			
			const color = waterGradient.get(water);

			//if(isEdge) color.setRGB(1, 0, 0);

			let i = indices.shift() ?? 0;

			positions[i] = new THREE.Vector3(x, height, z);
			edge[i] = isEdge;

			instancedMesh.setMatrixAt(i, dummy.matrix);
			instancedMesh.setColorAt(i, color);
		}
	}
	instancedMesh.instanceMatrix.needsUpdate = true;
	if (instancedMesh.instanceColor) {
		instancedMesh.instanceColor.needsUpdate = true;
	}


	let {
		animate = true,
		animateIn = false,
		animationTime = 3
	}: {
		animate?: boolean;
		animateIn?: boolean;
		animationTime?: number;
	} = $props();

	let totalTime = 0;
	const addPerSecond = totalVoxels / animationTime;

	const { stop } = useTask((dt) => {
		if (!animate && !animateIn) {
			stop();
			return;
		}

		if(animateIn)
		instancedMesh.count = Math.min(Math.floor(totalTime * addPerSecond), totalVoxels);

		totalTime += dt;

		if (!animate && totalTime * addPerSecond >= totalVoxels) {
			stop();
		}

		// move all voxels up and down
		for (let i = 0; i < totalVoxels; i++) {
			const position = positions[i];
			if (position) {

				dummy.position.copy(position);
				dummy.position.y += Math.sin(totalTime * 3 + i) * 0.1 + 0.25 - (edge[i] ? 8.5 : 0);
				dummy.scale.set(1.2, edge[i] ? 20 : 3, 1.2);
				dummy.updateMatrix();

				instancedMesh.setMatrixAt(i, dummy.matrix);
			}
		}

		instancedMesh.instanceMatrix.needsUpdate = true;
	});
</script>

<T
	is={instancedMesh}
/>
