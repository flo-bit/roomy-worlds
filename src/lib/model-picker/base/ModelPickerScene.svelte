<script lang="ts">
	import type { VoxelList } from '$lib/schema';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { GLTF } from '@threlte/extras';
	import type { Loaded } from 'jazz-tools';
	import { onMount } from 'svelte';
	import { Box3, Group, Object3D, Vector3 } from 'three';

	let {
		path,
		hover = false
	}: {
		path: string;
		scaleFactor?: number;
		hover?: boolean;
	} = $props();

	let rotation = $state(0);
	let group: Group | undefined = $state();

	const { start, stop } = useTask((delta) => {
		rotation += delta;
	});

	$effect(() => {
		if (hover) {
			start();
		} else {
			stop();
		}
	});

	const { renderer } = useThrelte();

	onMount(() => {
		renderer.toneMappingExposure = 0.7;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 2]} fov={50} near={0.1} far={10} />

<T.DirectionalLight args={[0xffffff, 1]} position={[-1, 1, 1]} />

<T.Group rotation={[0.5, rotation + 2.5, 0]}>
	{#if path}
		<T.Group
			bind:ref={group}
			oncreate={(ref) => {
				if (!group) return;

				const box = new Box3().setFromObject(ref);
				const size = box.getSize(new Vector3());
				const center = box.getCenter(new Vector3());

				let maxSize = Math.max(size.x, size.y, size.z);
				let scale = 0.9 / maxSize;

				group.scale.set(scale, scale, scale);
				group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
			}}
		>
			<!-- {#each voxels as voxel}
				{#if voxel?.transform}
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
						<T.BoxGeometry args={[1, 1, 1]} />
						<T.MeshStandardMaterial color={[voxel.r, voxel.g, voxel.b]} />
					</T.Mesh>
				{/if}
			{/each} -->
			<GLTF
				url={path}
				onload={(gltf: Group & { scene: Object3D }) => {
					if (!group) return;

					const box = new Box3().setFromObject(gltf.scene);
					const size = box.getSize(new Vector3());
					const center = box.getCenter(new Vector3());

					let maxSize = Math.max(size.x, size.y, size.z);
					let scale = 0.9 / maxSize;

					group.scale.set(scale, scale, scale);
					group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
				}}
			/>
		</T.Group>
	{/if}
</T.Group>

<T.HemisphereLight args={[0xffffff, 0x440808, 1]} />
