<script lang="ts">
	import { base } from '$app/paths';
	import { createWorld } from '$lib/utils.svelte';
	import { Badge, Button, Prose } from '@fuxui/base';
	import { goto } from '$app/navigation';
	import { Canvas } from '@threlte/core';
	import { CineonToneMapping } from 'three';
	import Scene from '$lib/world-editor/WorldEditorScene.svelte';
	import { onMount } from 'svelte';
	import { editingState } from '$lib/world-editor/state.svelte';
	import { CoState } from 'jazz-svelte';
	import { World as RapierWorld } from '@threlte/rapier';
	import { World } from '$lib/schema';
	
	let showText = $state(true);

	onMount(() => {
		editingState.worldId = 'co_zioLGB74w8coU8iQ6tab4EbZbCL';
		editingState.world = new CoState(World, 'co_zioLGB74w8coU8iQ6tab4EbZbCL', {
			resolve: {
				cells: {
					$each: {
						instances: {
							$each: true,
							$onError: null
						}
					},
					$onError: null
				}
			}
		});
	});
</script>

<div class={'absolute inset-0 h-[100dvh] w-screen transition-all duration-200'}>
	<Canvas toneMapping={CineonToneMapping}>
		<RapierWorld framerate={60}>
			<Scene interactive={false} y={-10} />
		</RapierWorld>
	</Canvas>
</div>

{#if showText}
	<div class="mx-auto max-w-3xl px-4 py-4">
		<div class="bg-base-50/20 relative flex flex-col gap-4 rounded-2xl p-4 backdrop-blur-xl">
			<button
				class="text-base-600 hover:text-base-800 absolute right-4 bottom-2 cursor-pointer"
				onclick={() => (showText = !showText)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
				</svg>
				<span class="sr-only"> Toggle Text </span>
			</button>
			<Prose>
				<h1>Roomy Worlds</h1>

				<Badge>work in progress!</Badge>
				<p>Roomy Worlds is a tool for creating, sharing and editing 3D worlds as a community.</p>

				<p class="italic">
					Work in progress/Preview only: You can create new worlds/models, but they might
					disappear/change unexpectedly with new updates. Lots of bugs too.
				</p>
				<p class="flex flex-wrap gap-8">
					<a href="https://github.com/flo-bit/roomy-worlds" target="_blank"> Source </a>
					<a href="https://roomy.chat" target="_blank"> Roomy Chat </a>
					<a href="https://soundcloud.com/nicholas-palmer-4" target="_blank">
						Music by Nicholas Palmer
					</a>
				</p>
			</Prose>

			<div class="mt-4 flex gap-2">
				<!-- <Button
					class="w-fit"
					size="lg"
					onclick={() => {
						goto(base + '/world?id=co_zQLdXMAmNc7kkzeRBu7MyWDoRD1');
					}}
				>
					Join shared world
				</Button> -->

				<Button class="w-fit" size="lg" onclick={() => createWorld(base)}>New World</Button>
			</div>
		</div>
	</div>
{:else}
	<button
		class="bg-base-50/20 text-base-900 hover:text-base-800 absolute top-4 right-4 cursor-pointer rounded-full p-2 backdrop-blur-xl"
		onclick={() => (showText = !showText)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
			/>
		</svg>

		<span class="sr-only"> Toggle Text </span>
	</button>
{/if}
