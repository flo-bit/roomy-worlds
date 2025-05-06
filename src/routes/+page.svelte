<script lang="ts">
	import { base } from '$app/paths';
	import { createWorld } from '$lib/utils.svelte';
	import { Badge, blueskyLoginModalState, Button, Prose } from 'fuchs';

	import { Canvas } from '@threlte/core';
	import world from './viewer/world.json';
	import WorldViewerScene from '$lib/viewer/WorldViewerScene.svelte';
	import { type WorldData } from '$lib/viewer/types';
	import { ACESFilmicToneMapping } from 'three';
	import { goto } from '$app/navigation';
	import { initRoomy } from '$lib/roomy.svelte';

	let showText = $state(true);
</script>

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
				<p>Roomy Worlds is a tool for creating and sharing small 3D worlds as a community.</p>

				<p class="italic">
					Work in progress/Preview only: You can create new worlds/models, but might
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
				<Button
					class="w-fit"
					size="lg"
					onclick={() => {
						// world?id=leaf:2g1z4s86dabaej80a1db1bzc97xbdf2mc3jqxjcpq3ps11ppd5rg
						goto(base + '/world?id=leaf:2g1z4s86dabaej80a1db1bzc97xbdf2mc3jqxjcpq3ps11ppd5rg');
					}}
				>
					Join shared world
				</Button>

				<Button class="w-fit" size="lg" onclick={() => createWorld(base)}>New World</Button>

				<Button
					class="w-fit"
					size="lg"
					onclick={async () => {
						await initRoomy('local');
						createWorld(base, true);
					}}>New Local World</Button
				>
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

<div class="fixed inset-0 -z-10 h-screen w-screen">
	<Canvas toneMapping={ACESFilmicToneMapping}>
		<WorldViewerScene world={world as unknown as WorldData} />
	</Canvas>
</div>
