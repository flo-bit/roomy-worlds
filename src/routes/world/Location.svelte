<script lang="ts">
	import { PlayerLocation } from '$lib/shared/components';
	import { T, useTask } from '@threlte/core';
	import type { Mesh } from 'three';
	let { location }: { location: PlayerLocation } = $props();

	useTask(() => {
		mesh?.position.set(location.x, location.y, location.z);
	});

	let mesh: Mesh | undefined = $state();
</script>

<T.Mesh bind:ref={mesh}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="red" />
</T.Mesh>
