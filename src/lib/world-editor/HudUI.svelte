<script>
	import { editingState, applyTransform } from './state.svelte';
</script>

{#if editingState.selectedInstance || editingState.selectedModel}
	<div class="absolute top-18 left-4 z-10 flex flex-col gap-2">
		{#if editingState.selectedInstance}
			<div class="flex items-center gap-2">
				<span class="text-base-800 text-sm"> moving </span>

				<button
					onclick={() => {
						applyTransform();
						editingState.selectedInstance = null;
					}}
					class="bg-base-200/20 text-base-900 cursor-pointer rounded-full p-0.5"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-3"
					>
						<path
							fill-rule="evenodd"
							d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="sr-only"> deselect </span>
				</button>
			</div>
		{:else if editingState.selectedModel}
			<div class="flex items-center gap-2">
				<span class="text-base-800 text-sm"> placing </span>

				<button
					onclick={() => {
						editingState.selectedModel = null;
					}}
					class="bg-base-200/20 text-base-900 cursor-pointer rounded-full p-0.5"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-3"
					>
						<path
							fill-rule="evenodd"
							d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="sr-only"> deselect </span>
				</button>
			</div>
		{/if}
	</div>
{/if}
