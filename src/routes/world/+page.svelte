<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/world-editor/WorldEditorScene.svelte';
	import { PerfMonitor } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import { ACESFilmicToneMapping, CineonToneMapping } from 'three';
	import ModelSelection from '$lib/world-editor/ModelSelection.svelte';
	import { editingState } from '$lib/world-editor/state.svelte';
	import { cn } from 'fuchs';
	import WorldEditorUi from '$lib/world-editor/WorldEditorUI.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Howl } from 'howler';
	import { base } from '$app/paths';
	import CharacterSelection from '$lib/character-picker/CharacterSelection.svelte';
	import Joystick from '$lib/Joystick.svelte';
	import JumpButton from '$lib/JumpButton.svelte';

	let showPerfMonitor = $state(false);

	let sound = $state<Howl | null>(null);

	onMount(() => {
		sound = new Howl({
			src: [base + '/audio.mp3'],
			autoplay: true,
			volume: 0.5,
			onend: function () {
				// play again after 5-20 seconds
				setTimeout(
					() => {
						sound?.play();
					},
					Math.random() * 15000 + 5000
				);
			}
		});
	});

	onDestroy(() => {
		sound?.stop();
	});
</script>

<!-- {#if !editingState.showModelEditor && !editingState.showWorldSettings && !g.isLocal}
	<Chat timeline={channel.value} />
{/if} -->

<div class={cn('absolute inset-0 h-[100dvh] w-screen transition-all duration-200')}>
	<Canvas toneMapping={CineonToneMapping}>
		{#if showPerfMonitor}
			<PerfMonitor anchorX={'right'} logsPerSecond={30} />
		{/if}
		<World framerate={60}>
			<Scene />
		</World>
	</Canvas>
</div>

{#if Object.keys(editingState.world?.current?.cells ?? {}).length < 1}
	<div class="absolute inset-0 flex items-center justify-center text-3xl font-bold">Loading world...</div>
{/if}

<Joystick />
<JumpButton />

<ModelSelection />

<WorldEditorUi />

<CharacterSelection />
