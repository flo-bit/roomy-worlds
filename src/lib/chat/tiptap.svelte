<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Editor, Extension, type Content } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import { keymap } from '@tiptap/pm/keymap';
	import { cn } from 'fuchs';

	let element: HTMLElement | undefined = $state();
	let editor: Editor | null = $state(null);

	let {
		content = $bindable(),
		editable = false,
		class: className,
		onEnter
	}: {
		content: Content;
		editable?: boolean;
		class?: string;
		onEnter?: (content: Content) => void;
	} = $props();

	/* Keyboard Shortcuts: used to add and override existing shortcuts */
	type KeyboardShortcutHandlerProps = {
		onEnter: () => void;
	};

	export const initKeyboardShortcutHandler = ({ onEnter }: KeyboardShortcutHandlerProps) =>
		Extension.create({
			name: 'keyboardShortcutHandler',
			addProseMirrorPlugins() {
				return [
					keymap({
						Enter: () => {
							onEnter();
							this.editor.commands.clearContent();
							return true;
						}
					})
				];
			}
		});

	onMount(() => {
		if (!element || editor) return;

		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({ heading: false }),
				Placeholder.configure({ placeholder: 'Write something ...' }),
				initKeyboardShortcutHandler({
					onEnter: () => {
						onEnter?.(editor?.getJSON());
					}
				})
			],
			onTransaction: () => {
				editor = editor;
			},

			editorProps: {
				attributes: {
					class: 'prose prose-sm focus:outline-none dark:prose-invert prose-stone'
				}
			},
			content: content,
			editable: editable
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={element} class={cn('w-full', className)}></div>
