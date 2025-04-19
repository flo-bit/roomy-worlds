<script lang="ts">
	import { Canvas } from '@threlte/core';
	import world from './world.json';
	import WorldViewerScene from '$lib/viewer/WorldViewerScene.svelte';
	import { type WorldData } from '$lib/viewer/types';
	import { ACESFilmicToneMapping } from 'three';
</script>

<div class="h-screen w-screen">
	<Canvas toneMapping={ACESFilmicToneMapping}>
		<WorldViewerScene world={world as unknown as WorldData} />
	</Canvas>
</div>
