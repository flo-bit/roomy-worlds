<script lang="ts">
	import { Suspense } from '@threlte/extras';
	import { AutoColliders } from '@threlte/rapier';
	import { Group } from 'three';
	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';

	let ref:
		| AutoColliders<{
				density?: never;
				mass?: never;
				centerOfMass?: never;
				principalAngularInertia?: never;
				angularInertiaLocalFrame?: never;
		  }>
		| undefined = $state(undefined);

	let {
		children,
		collider = true,
		...props
	}: {
		children: Snippet<[{ ref: Group }]>;
		collider?: boolean;
	} & Props<Group> = $props();

	let group = $state<Group | undefined>(undefined);
</script>

<T.Group bind:ref={group} {...props}>
	{#if collider}
		<AutoColliders shape="trimesh" bind:this={ref}>
			<Suspense
				onload={() => {
					ref?.refresh?.();
				}}
			>
				{@render children?.({ ref })}
			</Suspense>
		</AutoColliders>
	{:else}
		{@render children?.({ ref: group })}
	{/if}
</T.Group>
