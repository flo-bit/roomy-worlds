<script lang="ts">
	import { T } from '@threlte/core';
	import type { WorldData } from './types';
	import * as THREE from 'three';

	const { world }: { world: WorldData } = $props();

	const totalVoxels = world.instances.reduce((acc, instance) => {
		return acc + world.models[instance.model].voxels.length;
	}, 0);

	const voxelSize = 1;

	const instancedGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
	const instancedMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const instancedMesh = new THREE.InstancedMesh(
		instancedGeometry,
		instancedMaterial,
		totalVoxels
	);

	instancedMesh.castShadow = true;
	instancedMesh.receiveShadow = true;

	const dummy = new THREE.Object3D();
	const parentDummy = new THREE.Group();

	const color = new THREE.Color(0x00ff00);

	const worldMatrix = new THREE.Matrix4();
	let i = 0;
	for (let instance of world.instances) {
		const model = world.models[instance.model];

		parentDummy.position.set(instance.position.x, instance.position.y, instance.position.z);
		parentDummy.quaternion.set(instance.quaternion[0], instance.quaternion[1], instance.quaternion[2], instance.quaternion[3]);
		parentDummy.scale.set(instance.scale.x, instance.scale.y, instance.scale.z);

		parentDummy.updateMatrix();

		for (let voxel of model.voxels) {
			dummy.position.set(voxel.position.x, voxel.position.y, voxel.position.z);
			dummy.quaternion.set(voxel.quaternion[0], voxel.quaternion[1], voxel.quaternion[2], voxel.quaternion[3]);
			dummy.scale.set(voxel.scale.x, voxel.scale.y, voxel.scale.z);

			dummy.updateMatrix();

			color.set(voxel.color);

			// get world matrix
			worldMatrix.multiplyMatrices(parentDummy.matrix, dummy.matrix);

			instancedMesh.setMatrixAt(i, worldMatrix);
			instancedMesh.setColorAt(i, color);
			i++;
		}
	}

	instancedMesh.instanceMatrix.needsUpdate = true;
	if (instancedMesh.instanceColor) {
		instancedMesh.instanceColor.needsUpdate = true;
	}
</script>

<T
	is={instancedMesh}
/>