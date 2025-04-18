<script lang="ts">
	import { base } from '$app/paths';
	import { createWorld } from '$lib';
	import { Badge, Button, Prose } from 'fuchs';

</script>

<div class="mx-auto flex max-w-xl flex-col gap-4 px-4 py-16">
	<Prose>
		<h1>Roomy Worlds</h1>

		<Badge>work in progress!</Badge>
		<p>
			Roomy Worlds is a tool for creating and sharing 3D voxel worlds with your friends.
		</p>

		<p class="italic">

			Work in progress: You can create new worlds locally, but they are not synced yet (no multiplayer capabilities) 
			and might not work as expected (and they might disappear/change unexpectedly with new updates).
		</p>

		<p>Notes:
			After saving a new model you might have to refresh the world page to see it in the model picker.
		</p>
	</Prose>

	<Button class="w-fit" size="lg" onclick={() => createWorld(base)}>New World</Button>
</div>
