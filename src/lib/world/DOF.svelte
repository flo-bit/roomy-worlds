<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import {
		DepthOfFieldEffect,
		EffectComposer,
		EffectPass,
		RenderPass
	} from 'postprocessing';
	import * as THREE from 'three';

	const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

	const composer = new EffectComposer(renderer);

	const renderPass = new RenderPass(scene);
	composer.addPass(renderPass);
	$effect(() => {
		composer.setSize($size.width, $size.height);
	});


	const depthOfField = new DepthOfFieldEffect($camera, {
		bokehScale: 5,
		resolutionX: 1024,
		resolutionY: 1024,
		focalLength: 0.02
	});

	const depthEffectPass = new EffectPass(undefined, depthOfField);
	composer.addPass(depthEffectPass);

	$effect(() => {
		renderPass.mainCamera = $camera;
		depthOfField.mainCamera = $camera;
		depthEffectPass.mainCamera = $camera;
		depthOfField.target = new THREE.Vector3(0,0,0);
	});

	$effect(() => {
		return () => {
			composer.removeAllPasses();
			depthEffectPass.dispose();
			renderPass.dispose();
			composer.dispose();
		};
	});

	$effect(() => {
		const last = autoRender.current;
		autoRender.set(false);
		return () => {
			autoRender.set(last);
		};
	});

	useTask(
		(delta) => {
			composer.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
