<script lang="ts">
	import { Channel, Message, type Timeline } from '$lib/roomy';
	import { g } from '$lib/roomy.svelte';
	import { derivePromise } from '$lib/utils.svelte';
	import { blueskyLoginModalState, Button, ChatBubble, cn, Input } from 'fuchs';
	import Tiptap from './tiptap.svelte';
	import MessageUI from './MessageUI.svelte';
	import { tick } from 'svelte';
	import { client } from '$lib/oauth';
	import { type Content } from '@tiptap/core';
	import { editingState } from '$lib/world-editor/state.svelte';

	let { timeline }: { timeline: Channel | undefined | null } = $props();

	let messages = derivePromise(null, async () => {
		const items = (await timeline?.timeline.items())
			?.map((x) => x.tryCast(Message))
			.filter((x) => !!x);

		return items;
	});

	async function scrollToBottom() {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const chat = document.querySelector('.chat');
		if (chat) {
			chat.scrollTop = chat.scrollHeight;
		}
	}

	$effect(() => {
		if (messages.value?.length && editingState.showChat) {
			scrollToBottom();
		}
	});

	async function sendMessage(input: Content) {
		if (!timeline || !g.roomy || !client.profile) return;

		const newMessage = await g.roomy.create(Message);
		newMessage.authors((authors) => client.profile && authors.push(client.profile.did));
		newMessage.bodyJson = JSON.stringify(input);
		newMessage.createdDate = new Date();
		newMessage.commit();

		timeline.timeline.push(newMessage);
		timeline.commit();
	}
</script>

{#if editingState.showChat}
	<div
		class="bg-base-100 dark:bg-base-900 absolute right-2 bottom-2 z-10 flex h-[50dvh] w-md max-w-[calc(100dvw-1rem)] flex-col gap-2 overflow-y-hidden rounded-2xl"
	>
		<div class="flex h-[50dvh] flex-col">
			<!-- <div>
        <slot name="header"></slot>
    </div> -->

			<div
				class="chat flex h-full w-full flex-grow flex-col gap-2 overflow-y-auto scroll-smooth p-4"
			>
				{#if messages.value}
					{#each messages.value as item}
						<MessageUI message={item} />
					{/each}
				{/if}
			</div>
			<div class="border-base-200 dark:border-base-800 bg-base-200/50 flex border-t py-2">
				{#if !client.isLoggedIn}
					<Button onclick={() => blueskyLoginModalState.show()} class="mx-auto"
						>Login to chat</Button
					>
				{:else}
					<Tiptap
						content={{ type: 'doc', content: [{ type: 'paragraph', content: [] }] }}
						editable={true}
						class="mx-2"
						onEnter={sendMessage}
					/>
				{/if}
			</div>
		</div>

		<div class="absolute top-1 right-1">
			<Button onclick={() => (editingState.showChat = false)} variant="ghost" size="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-6"
				>
					<path
						fill-rule="evenodd"
						d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>

				<span class="sr-only">close chat</span>
			</Button>
		</div>
	</div>
{:else}
	<div class="absolute right-1 bottom-1 z-10">
		<Button
			onclick={() => (editingState.showChat = true)}
			size="iconLg"
			class={cn('bg-accent-100 hover:bg-accent-200 absolute right-4 bottom-4')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6"
			>
				<path
					d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z"
				/>
				<path
					d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z"
				/>
			</svg>

			<span class="sr-only">open chat</span>
		</Button>
	</div>
{/if}
