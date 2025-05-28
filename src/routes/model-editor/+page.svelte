<script>
	import ModelEditorUi from '$lib/model-editor/ModelEditorUI.svelte';
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import { ACESFilmicToneMapping } from 'three';
	import { default as ModelScene } from '$lib/model-editor/ModelEditorScene.svelte';
	import { modelEditor } from '$lib/model-editor/state.svelte';

	$inspect(modelEditor.voxelObject?.current);
</script>

<div class="absolute left-0 h-[100dvh] w-screen transition-all duration-200">
	<Canvas toneMapping={ACESFilmicToneMapping}>
		<World framerate={60}>
			<ModelScene />
		</World>
	</Canvas>
</div>

<ModelEditorUi />
