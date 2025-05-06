<script lang="ts">
	import { Label, SliderNumber, ColorGradientPicker, Button, Textarea, Subheading } from 'fuchs';
	import { editingState } from './state.svelte';
	import { g } from '$lib/roomy.svelte';
	import { untrack } from 'svelte';

	// let { settings }: { settings: WorldSettings } = $props();

	// // let mySettings = $state(settings);

	// worldSettings.seed = settings.seed;
	// worldSettings.size = settings.size;
	// worldSettings.terrainGradient = settings.terrainGradient;
	// worldSettings.waterGradient = settings.waterGradient;
	// worldSettings.version = settings.version;
	// worldSettings.waterPercentage = settings.waterPercentage;

	$effect(() => {
		if (
			g.world &&
			g.world.settings &&
			g.world.settings.version < editingState.worldSettings.version
		) {
			g.world.settings = JSON.parse(JSON.stringify(editingState.worldSettings));
			g.world.commit();
			console.log('committed');
		}
	});

	let terrainNoise = $derived(JSON.stringify(editingState.worldSettings.terrainNoise, null, 2));
	let waterNoise = $derived(JSON.stringify(editingState.worldSettings.waterNoise, null, 2));
</script>

{#if g.world}
	<div class="absolute top-0 bottom-0 left-0 -z-10 w-80 px-8 py-16">
		<Button class="absolute top-2 left-69" size="icon" onclick={() => {
			editingState.showWorldSettings = false;
		}} variant="ghost">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</Button>
		<Subheading>Size</Subheading>
		<SliderNumber
			class="mt-2"
			min={20}
			max={100}
			type="single"
			bind:value={editingState.worldSettings.size}
		/>

		<Subheading class="mt-8">Terrain</Subheading>
		<ColorGradientPicker
			size="sm"
			class="mt-2 mb-8"
			bind:colors={editingState.worldSettings.terrainGradient}
			onchange={() => {
				editingState.worldSettings.version += 1;
			}}
		/>

		<Subheading class="mt-8">Water</Subheading>

		<ColorGradientPicker
			size="sm"
			class="mt-2 mb-4"
			bind:colors={editingState.worldSettings.waterGradient}
			onchange={() => {
				editingState.worldSettings.version += 1;
			}}
		/>

		<Label>Water Level</Label>
		<SliderNumber
			class="mt-2"
			type="single"
			bind:value={editingState.worldSettings.waterPercentage}
		/>

		<Button
			class="mt-8"
			onclick={() => {
				editingState.worldSettings.version += 1;
			}}
		>
			Update
		</Button>

		<Textarea
			bind:value={terrainNoise}
			class="mt-8 hidden w-full"
			oninput={() => {
				console.log('changed');
				editingState.worldSettings.terrainNoise = JSON.parse(terrainNoise);
				editingState.worldSettings.version += 1;
			}}
		/>
	</div>
{/if}
