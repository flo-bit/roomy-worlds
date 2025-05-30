<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { View } from '@threlte/extras';
	import Scene from './ModelPickerScene.svelte';
	import { Portal } from 'bits-ui';
	import { Button, cn } from 'fuchs';
	import { ACESFilmicToneMapping } from 'three';
	import { editingState } from '$lib/world-editor/state.svelte';

	type Item = {
		path: string;
		label: string;
	};

	let {
		items,
		alwaysRotate = false,
		onselect,
		canvasClasses = '',
		class: className,
		gridClasses,
		maxColumns = 5,
		showEditButton = false
	}: {
		items: Item[];
		alwaysRotate?: boolean;
		onselect?: (item: Item) => void;
		canvasClasses?: string;
		portalTo?: string;
		class?: string;
		gridClasses?: string;
		maxColumns?: number;
		showEditButton?: boolean;
	} = $props();

	let states = $state({} as Record<string, { hover: boolean; dom: HTMLElement | undefined }>);
</script>

{#key items}
	<div class={cn('relative w-full', className)}>
		<div
			class={cn(
				'grid w-full grid-cols-2 gap-4',
				maxColumns > 2 ? 'sm:grid-cols-3' : '',
				maxColumns > 3 ? 'md:grid-cols-4' : '',
				maxColumns > 4 ? 'lg:grid-cols-5' : '',
				gridClasses
			)}
		>
			{#each items as item (item.path)}
				<button
					class="hover:bg-base-200/40 dark:hover:bg-base-800/40 m-4 relative inline-block cursor-pointer rounded-2xl transition-all duration-300 hover:scale-105"
					onclick={() => {
						states[item.path].hover = false;
						onselect?.(item);
					}}
					onpointerenter={() => {
						states[item.path].hover = true;
					}}
					onpointerleave={() => {
						states[item.path].hover = false;
					}}
				>
					<div
						class="aspect-square"
						bind:this={
							() => {
								states[item.path] ??= {
									dom: undefined,
									hover: false
								};

								return states[item.path].dom;
							},
							(value) => {
								states[item.path] ??= {
									dom: value,
									hover: false
								};
								states[item.path].dom = value;
							}
						}
					></div>
					<!-- <div class="text-base-700 dark:text-base-300 text-sm">{item.label}</div> -->

					{#if showEditButton}
						<div class="absolute -top-1 -right-1 z-10">
							<Button
								size="iconSm"
								onclick={() => {
									editingState.showModelEditor = true;
									//modelEditor.voxelObject = new CoState(Model, item.path);
								}}
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
										d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
									/>
								</svg>
							</Button>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
{/key}

<Portal>
	<div class={cn('pointer-events-none fixed inset-0 z-50 h-full w-full', canvasClasses)}>
		<Canvas toneMapping={ACESFilmicToneMapping}>
			{#each items as item (states[item.path]?.dom ?? Math.random())}
				{#if states[item.path] && states[item.path].dom}
					<View dom={states[item.path].dom}>
						<Scene path={item.path} hover={states[item.path].hover || alwaysRotate} />
					</View>
				{/if}
			{/each}
		</Canvas>
	</div>
</Portal>
