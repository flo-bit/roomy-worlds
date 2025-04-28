<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Camera, Vector2, Vector3, Quaternion, Mesh } from 'three';
	import { useThrelte, useParent } from '@threlte/core';
	import { usePhysicsTask } from '@threlte/rapier';

	let {
		object,
		rotateSpeed = 0.8,
		idealOffset = { x: -0.5, y: 1.5, z: -4 },
		idealLookAt = { x: 0, y: 1, z: 5 },
	}: {
		object: Mesh;
		rotateSpeed: number;
		idealOffset: { x: number; y: number; z: number };
		idealLookAt: { x: number; y: number; z: number };
	} = $props();

	const currentPosition = new Vector3();
	const currentLookAt = new Vector3();

	let isOrbiting = false;
	let pointerDown = false;

	const rotateStart = new Vector2();
	const rotateEnd = new Vector2();
	const rotateDelta = new Vector2();

	const axis = new Vector3(0, 1, 0);
	const rotationQuat = new Quaternion();

	const { renderer } = useThrelte();

	const domElement = renderer.domElement;
	const camera = useParent();

	const isCamera = (p: any): p is Camera => {
		return p.isCamera;
	};

	if (!isCamera($camera)) {
		throw new Error('Parent missing: <PointerLockControls> need to be a child of a <Camera>');
	}

	domElement.addEventListener('pointerdown', onPointerDown);
	domElement.addEventListener('pointermove', onPointerMove);
	domElement.addEventListener('pointerleave', onPointerLeave);
	domElement.addEventListener('pointerup', onPointerUp);

	onDestroy(() => {
		domElement.removeEventListener('pointerdown', onPointerDown);
		domElement.removeEventListener('pointermove', onPointerMove);
		domElement.removeEventListener('pointerleave', onPointerLeave);
		domElement.removeEventListener('pointerup', onPointerUp);
	});

	// This is basically your update function
	usePhysicsTask((delta) => {
		// the object's position is bound to the prop
		if (!object) return;

		// camera is based on character so we rotation character first
		rotationQuat.setFromAxisAngle(axis, -rotateDelta.x * rotateSpeed * delta);
		object.quaternion.multiply(rotationQuat);

		// then we calculate our ideal's
		const offset = vectorFromObject(idealOffset);
		const lookAt = vectorFromObject(idealLookAt);

		// and how far we should move towards them
		const t = 1.0 - Math.pow(0.001, delta);
		currentPosition.lerp(offset, t);
		currentLookAt.lerp(lookAt, t);

		// then finally set the camera
		$camera.position.copy(currentPosition);
		$camera.lookAt(currentLookAt);
	});

	function onPointerMove(event: PointerEvent) {
		const { x, y } = event;
		if (pointerDown && !isOrbiting) {
			// calculate distance from init down
			const distCheck =
				Math.sqrt(Math.pow(x - rotateStart.x, 2) + Math.pow(y - rotateStart.y, 2)) > 10;
			if (distCheck) {
				isOrbiting = true;
			}
		}
		if (!isOrbiting) return;

		rotateEnd.set(x, y);
		rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(rotateSpeed);
		rotateStart.copy(rotateEnd);
	}

	function onPointerDown(event: PointerEvent) {
		const { x, y } = event;
		rotateStart.set(x, y);
		pointerDown = true;
	}

	function onPointerUp() {
		rotateDelta.set(0, 0);
		pointerDown = false;
		isOrbiting = false;
	}

	function onPointerLeave() {
		rotateDelta.set(0, 0);
		pointerDown = false;
		isOrbiting = false;
	}

	function vectorFromObject(vec: { x: number; y: number; z: number }) {
		const { x, y, z } = vec;
		const ideal = new Vector3(x, y, z);
		ideal.applyQuaternion(object.quaternion);
		ideal.add(new Vector3(object.position.x, object.position.y, object.position.z));
		return ideal;
	}

	function onKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'q':
				rotateDelta.x = -2 * rotateSpeed;
				break;
			case 'e':
				rotateDelta.x = 2 * rotateSpeed;
				break;
			default:
				break;
		}
	}

	function onKeyUp(event: KeyboardEvent) {
		switch (event.key) {
			case 'q':
				rotateDelta.x = 0;
				break;
			case 'e':
				rotateDelta.x = 0;
				break;
			default:
				break;
		}
	}
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />
