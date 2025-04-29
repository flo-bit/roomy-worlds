<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { interactivity, useViewport } from '@threlte/extras';
	import { ACESFilmicToneMapping, Box3, Vector3 } from 'three';
	import { editingState } from './state.svelte';
	import { models } from './models.svelte';
	import { onMount } from 'svelte';

	const viewport = useViewport();

	interactivity();

	const { renderer } = useThrelte();

	onMount(() => {
		renderer.toneMapping = ACESFilmicToneMapping;
	});
</script>

<T.OrthographicCamera makeDefault zoom={80} position={[0, 0, 10]} />
<T.AmbientLight intensity={Math.PI / 4} />
<T.DirectionalLight position={[-5, 2, 10]} intensity={1} />

{#if editingState.selectedInstance || editingState.selectedModelId}
	{#key editingState.selectedInstance?.group ?? editingState.selectedModelId ?? ''}
		{#await models.getModel(editingState.selectedInstance?.group ?? editingState.selectedModelId ?? '') then voxels}
			<T.Group
				position={[-$viewport.width / 2 + 0.8, $viewport.height / 2 - 1.6, 0]}
				oncreate={() => {
					console.log('oncreate');
				}}
				rotation={[0.1, 0.7, 0]}
			>
				<T.Group
					oncreate={(ref) => {
						const box = new Box3().setFromObject(ref);
						const size = box.getSize(new Vector3());
						const center = box.getCenter(new Vector3());

						let maxSize = Math.max(size.x, size.y, size.z);
						let scale = 0.9 / maxSize;

						ref.scale.set(scale, scale, scale);
						ref.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
					}}
				>
					{#each voxels as voxel}
						<T.Mesh
							position={voxel.position.toArray()}
							quaternion={voxel.quaternion.toArray()}
							scale={voxel.scale.toArray()}
						>
							<T.BoxGeometry args={[1, 1, 1]} />
							<T.MeshStandardMaterial color={voxel.color} />
						</T.Mesh>
					{/each}
				</T.Group>
			</T.Group>
		{/await}
	{/key}
{/if}
