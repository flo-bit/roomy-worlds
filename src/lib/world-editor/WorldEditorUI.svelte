<script>
	import { Button, cn } from 'fuchs';
	import { applyTransform, editingState } from './state.svelte';
	import InstanceEditorUi from './InstanceEditorUI.svelte';
</script>

<div class="absolute right-4 bottom-4 flex flex-col gap-2">
	{#if editingState.camera === 'first'}
		<Button
			size="iconLg"
			class={cn('bg-accent-100 hover:bg-accent-200')}
			onclick={() => {
				editingState.camera = 'third';
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6"
			>
				<path
					d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z"
				/>
				<path
					fill-rule="evenodd"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
					clip-rule="evenodd"
				/>
			</svg>

			<span class="sr-only">Back to World View</span>
		</Button>
	{:else}
		<Button
			size="iconLg"
			class={cn('bg-accent-100 hover:bg-accent-200')}
			onclick={() => {
				if (editingState.selectedCharacter) {
					editingState.camera = 'first';
				} else {
					editingState.showCharacterPicker = true;
				}
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6"
			>
				<path
					fill-rule="evenodd"
					d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="sr-only">Walk around</span>
		</Button>
	{/if}
	<Button
		size="iconLg"
		class={cn('bg-accent-100 hover:bg-accent-200 duration-100')}
		onclick={() => {
			editingState.showWorldSettings = false;
			editingState.showModelPicker = true;
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2.5"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>

		<span class="sr-only">Add Model</span>
	</Button>
</div>

{#if editingState.selectedInstance || editingState.selectedModel}
	<Button
		size="iconSm"
		class={cn('bg-accent-100 hover:bg-accent-200 absolute top-4 left-4 rounded-xl duration-100')}
		onclick={() => {
			applyTransform();
			editingState.selectedInstance = null;
			editingState.selectedModel = null;
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2.5"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
		</svg>

		<span class="sr-only"> deselect </span>
	</Button>

	<span class={cn('absolute top-4 left-13 text-sm font-medium transition-all duration-100')}
		>{editingState.selectedInstance ? 'editing' : 'placing'}
	</span>
{/if}

<InstanceEditorUi />

<div class={cn('absolute bottom-4 left-4 flex flex-col gap-2 transition-all duration-100')}></div>
