<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { GLTF, interactivity, useViewport } from '@threlte/extras';
	import { ACESFilmicToneMapping, Box3, Group, Object3D, Vector3 } from 'three';
	import { editingState } from './state.svelte';
	import { onMount } from 'svelte';
	import { getPathsForModel } from './models';
	import { base } from '$app/paths';

	const viewport = useViewport();

	interactivity();

	const { renderer } = useThrelte();

	onMount(() => {
		renderer.toneMapping = ACESFilmicToneMapping;
	});

	function getColor() {
		return ((editingState.modelPickerColor ?? 0) + 1)?.toString();
	}

	let group: Group | undefined = $state(undefined);
</script>

<T.OrthographicCamera makeDefault zoom={80} position={[0, 0, 10]} />
<T.AmbientLight intensity={Math.PI / 4} />
<T.DirectionalLight position={[-5, 2, 10]} intensity={1} />

{#if editingState.selectedInstance || editingState.selectedModel}
	{#key editingState.selectedInstance?.path ?? editingState.selectedModel?.path ?? ''}
		<T.Group
			position={[-$viewport.width / 2 + 0.8, $viewport.height / 2 - 1.2, 0]}
			rotation={[0.3, 0.7, 0]}
		>
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
				{#if editingState.selectedInstance}
					<GLTF
						url={base + editingState.selectedInstance.path}
						onload={(gltf: Group & { scene: Object3D }) => {
							if (!group) return;

							const box = new Box3().setFromObject(gltf.scene);
							const size = box.getSize(new Vector3());
							const center = box.getCenter(new Vector3());

							let maxSize = Math.max(size.x, size.y, size.z);
							let scale = 1.0 / maxSize;
							console.log(scale);

							group.scale.set(scale, scale, scale);
							group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
						}}
					/>
				{:else if editingState.selectedModel}
					<GLTF
						url={getPathsForModel(editingState.selectedModel, undefined, getColor())[0]}
						onload={(gltf: Group & { scene: Object3D }) => {
							if (!group) return;

							const box = new Box3().setFromObject(gltf.scene);
							const size = box.getSize(new Vector3());
							const center = box.getCenter(new Vector3());

							let maxSize = Math.max(size.x, size.y, size.z);
							let scale = 1.0 / maxSize;

							group.scale.set(scale, scale, scale);
							group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
						}}
					/>
				{/if}
			</T.Group>
		</T.Group>
	{/key}
{/if}
