<script lang="ts">
	import { Euler, Group, Vector3 } from 'three';
	import { T } from '@threlte/core';
	import { RigidBody, CollisionGroups, Collider, usePhysicsTask } from '@threlte/rapier';
	import Controller from './ThirdPersonControls.svelte';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { onMount } from 'svelte';
	import { editingState } from '$lib/world-editor/state.svelte';
	import ProtagonistA, { type ActionName } from './Protagonist_A.svelte';
	import ProtagonistB from './Protagonist_B.svelte';
	import Hiker from './Hiker.svelte';
	import Caveman from './Caveman.svelte';
	import Witch from './Witch.svelte';
	import CombatMech from './CombatMech.svelte';
	import Superhero from './Superhero.svelte';
	import Vampire from './Vampire.svelte';

	let {
		position = [0, 10, 0],
		radius = 0.4,
		height = 1.4,
		speed = 4,
		runningSpeed = 8
	}: {
		position?: [number, number, number];
		radius?: number;
		height?: number;
		speed?: number;
		runningSpeed?: number;
	} = $props();

	let isRunning = false;

	let capsule: Group | undefined = $state();
	let capRef = $derived(capsule);

	let rigidBody: RapierRigidBody | undefined = $state();

	let forward = 0;
	let backward = 0;
	let left = 0;
	let right = 0;

	const temp = new Vector3();

	let grounded = false;

	let rotation = $state(0);

	let animation: ActionName = $state('idle');

	let total = 0;

	let maxRotationSpeed = 10;

	let direction = new Vector3();

	usePhysicsTask((delta) => {
		if (!rigidBody || !capsule) return;

		total += delta;
		// get direction

		let smooth = 0.1;
		direction.multiplyScalar(1 - smooth);
		direction.add(new Vector3((left - right) * smooth, 0, (forward - backward) * smooth));

		//const velVec = temp.fromArray([left - right, 0, forward - backward]); // left - right

		temp.copy(direction);

		let currentSpeed =
			(Math.abs(Math.sin(total * 10)) * 0.5 + 0.5) * (isRunning ? runningSpeed : speed);

		// sort rotate and multiply by speed
		temp.applyEuler(new Euler().copy(capsule.rotation)).multiplyScalar(currentSpeed);

		// don't override falling velocity
		const linVel = rigidBody.linvel();
		temp.y = linVel.y;
		// finally set the velocities and wake up the body
		rigidBody.setLinvel(temp, true);

		temp.y = 0;

		// rotate the body based on the direction
		if (temp.length() > 0.5) {
			let newRotation = Math.atan2(linVel.x, linVel.z);

			// get difference between current rotation and new rotation
			newRotation = newRotation - rotation;

			// if difference is greater than PI, then we need to rotate the other way
			if (newRotation > Math.PI) {
				newRotation -= Math.PI * 2;
			} else if (newRotation < -Math.PI) {
				newRotation += Math.PI * 2;
			}

			if (Math.abs(newRotation) > maxRotationSpeed * delta) {
				// rotate the body towards the new rotation
				rotation += maxRotationSpeed * delta * Math.sign(newRotation);
			} else {
				rotation += newRotation;
			}
		}

		if (temp.length() > 3 && isRunning) {
			animation = 'Running_A';
		} else if (temp.length() > 0.5) {
			animation = 'Walking_B';
		} else {
			animation = 'Idle';
		}

		if (!grounded) {
			if (linVel.y > 0) {
				animation = 'Jump_Start';
			} else {
				animation = 'Jump_Idle';
			}
		}

		// when body position changes update camera position
		const pos = rigidBody.translation();
		position = [pos.x, pos.y, pos.z];

		// respawn if falling of the map
		if (position[1] < -10) {
			position = [0, 10, 0];
			rigidBody.setTranslation(new Vector3(0, 10, 0), true);
			rigidBody.setLinvel(new Vector3(0, 0, 0), true);
		}
	});

	function jump() {
		//console.log('jump', grounded);
		if (!grounded) return;
		rigidBody?.applyImpulse(new Vector3(0, 800, 0), true);
		grounded = false;
	}

	function onKeyDown(e: KeyboardEvent) {
		//console.log('down', e.key.toLowerCase());
		console.log('down', e.code.toLowerCase());
		switch (e.code.toLowerCase()) {
			case 'arrowdown':
			case 'keys':
				backward = 1;
				break;
			case 'arrowup':
			case 'keyw':
				forward = 1;
				break;
			case 'arrowleft':
			case 'keya':
				left = 1;
				break;
			case 'arrowright':
			case 'keyd':
				right = 1;
				break;
			case 'shiftleft':
			case 'shiftright':
				isRunning = true;
				break;
			case 'space':
				jump();
			default:
				break;
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		//console.log('up', e.key.toLowerCase());
		switch (e.code.toLowerCase()) {
			case 'arrowdown':
			case 'keys':
				backward = 0;
				break;
			case 'arrowup':
			case 'keyw':
				forward = 0;
				break;
			case 'arrowleft':
			case 'keya':
				left = 0;
				break;
			case 'arrowright':
			case 'keyd':
				right = 0;
				break;

			case 'shiftleft':
			case 'shiftright':
				isRunning = false;
				break;
			default:
				break;
		}
	}
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />

<T.PerspectiveCamera makeDefault fov={70} near={2}>
	<Controller bind:object={capRef} />
</T.PerspectiveCamera>

<T.Group bind:ref={capsule} {position} rotation.y={Math.PI}>
	<RigidBody bind:rigidBody enabledRotations={[false, false, false]} gravityScale={3}>
		<CollisionGroups groups={[0]}>
			<Collider
				shape={'capsule'}
				args={[height / 2 - radius, radius]}
				oncollisionenter={() => (grounded = true)}
				density={100}
			/>

			{#if editingState.selectedCharacter === 'protagonist a'}
				<ProtagonistA
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{:else if editingState.selectedCharacter === 'protagonist b'}
				<ProtagonistB
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{:else if editingState.selectedCharacter === 'hiker'}
				<Hiker
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{:else if editingState.selectedCharacter === 'caveman'}
				<Caveman
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{:else if editingState.selectedCharacter === 'witch'}
				<Witch
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{:else if editingState.selectedCharacter === 'combat mech'}
				<CombatMech
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{:else if editingState.selectedCharacter === 'superhero'}
				<Superhero
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{:else if editingState.selectedCharacter === 'vampire'}
				<Vampire
					position.y={-0.7}
					rotation.y={rotation + Math.PI}
					currentAction={animation}
					scale={0.8}
				/>
			{/if}
		</CollisionGroups>
	</RigidBody>
</T.Group>
