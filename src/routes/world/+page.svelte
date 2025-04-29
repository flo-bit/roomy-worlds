<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/world-editor/WorldEditorScene.svelte';
	import { PerfMonitor } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import { ACESFilmicToneMapping } from 'three';
	import ModelSelection from '$lib/world-editor/ModelSelection.svelte';
	import { editingState } from '$lib/world-editor/state.svelte';
	import ModelScene from '$lib/model-editor/ModelEditorScene.svelte';
	import { cn } from 'fuchs';
	import ModelEditorUi from '$lib/model-editor/ModelEditorUI.svelte';
	import WorldSettingsUi from '$lib/world-editor/WorldSettingsUI.svelte';
	import HudUi from '$lib/world-editor/HudUI.svelte';
	import WorldEditorUi from '$lib/world-editor/WorldEditorUI.svelte';
	import { g } from '$lib/roomy.svelte';
	import { onMount } from 'svelte';
	import { downloadWorld } from '$lib/download';
	import { Howl } from 'howler';
	import { base } from '$app/paths';
	import CharacterSelection from '$lib/character-picker/CharacterSelection.svelte';

	let showPerfMonitor = $state(false);

	let sound = $state<Howl | null>(null);

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			// on control + 5, save world
			if (e.ctrlKey && e.key === '5' && g.world) {
				e.preventDefault();
				console.log('downloading world');
				downloadWorld(g.world);
			}
		});

		sound = new Howl({
			src: [base + '/audio.mp3'],
			autoplay: true,
			volume: 0.5,
			onend: function () {
				// play again after 5-20 seconds
				setTimeout(() => {
					sound?.play();
				}, Math.random() * 15000 + 5000);
			}
		});
	});
</script>

<div
	class={cn(
		'absolute h-[100dvh] transition-all duration-200',
		!editingState.showModelEditor && editingState.showWorldSettings
			? 'left-80 w-[calc(100vw-320px)]'
			: 'left-0 w-screen'
	)}
>
	<Canvas toneMapping={ACESFilmicToneMapping}>
		{#if showPerfMonitor}
			<PerfMonitor anchorX={'right'} logsPerSecond={30} />
		{/if}
		<World framerate={60}>
			{#if editingState.showModelEditor}
				<ModelScene />
			{:else}
				<Scene />
			{/if}
		</World>
	</Canvas>
</div>

<ModelSelection />

{#if !editingState.showModelEditor}
	{#if editingState.showWorldSettings}
		{#if g.world?.settings}
			<WorldSettingsUi />
		{/if}
	{/if}
	<WorldEditorUi />

	<HudUi />
{:else}
	<ModelEditorUi />
{/if}


<CharacterSelection />