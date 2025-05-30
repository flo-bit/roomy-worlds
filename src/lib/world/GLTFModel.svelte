<script lang="ts">
	import * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useGltf, useSuspense } from '@threlte/extras';

	let {
		fallback,
		error,
		children,
		source,
		ref = $bindable(),
		...props
	}: Props<THREE.Group> & {
		ref?: THREE.Group;
		children?: Snippet<[{ ref: THREE.Group }]>;
		fallback?: Snippet;
		error?: Snippet<[{ error: Error }]>;
		source: string;
	} = $props();

	const suspend = useSuspense();

	const gltf = suspend(useGltf(source));

	$effect(() => {
		
	});
</script>

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then { scene }}
		<T is={scene.clone()} oncreate={(ref) => {
			console.log('ref', ref);
			ref.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					// child.material.flatShading = true;
					child.castShadow = true;
					child.receiveShadow = true;

					console.log('child', child);
				}
			});
		}} />
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
