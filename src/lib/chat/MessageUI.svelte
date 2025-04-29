<script lang="ts">
	import type { Message } from '$lib/roomy';
	import { derivePromise } from '$lib/utils.svelte';
	import { Avatar, ChatBubble } from 'fuchs';
	import Tiptap from './tiptap.svelte';
	import { users } from './Users.svelte';
	import { client } from '$lib/oauth';

	let { message }: { message: Message } = $props();

	const authorDid = derivePromise(null, async () => {
		return await message.authors(async (authors) => {
			return authors.get(0);
		});
	});

	const user = derivePromise(null, async () => {
		return await users.getUser(authorDid.value);
	});

	$inspect(user);
</script>

<div class="flex w-full items-start gap-1">
	{#if !client.isLoggedIn || authorDid.value !== client.profile?.did}
		<Avatar src={user?.value?.avatar} class="mt-1 size-8" />
	{/if}
	<div class=" grow">
		<ChatBubble
			class="gap-0"
			side={authorDid.value === client.profile?.did ? 'right' : 'left'}
			variant={authorDid.value === client.profile?.did ? 'primary' : 'secondary'}
		>
			{#if !client.isLoggedIn || authorDid.value !== client.profile?.did}
				<div class="text-accent-600 line-clamp-1 w-full truncate text-sm font-semibold">
					{user?.value?.displayName || user?.value?.handle}
				</div>
			{/if}
			<Tiptap content={JSON.parse(message.bodyJson)} />
		</ChatBubble>
	</div>

	<!-- {#if client.isLoggedIn && authorDid.value === client.profile?.did}
		<Avatar src={client.profile?.avatar} class="mt-1 size-8" />
	{/if} -->
</div>
