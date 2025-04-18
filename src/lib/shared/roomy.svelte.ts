import { EntityId, Roomy, type EntityIdStr } from '$lib/roomy';
import { StorageManager } from '@muni-town/leaf/storage';
import { SveltePeer } from '@muni-town/leaf/svelte';
import { indexedDBStorageAdapter } from '@muni-town/leaf/storage/indexed-db';
import { webSocketSyncer } from '@muni-town/leaf/sync1/ws-client';
import { VoxelGroup, World } from './components';

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		window.location.reload();
	});
}

export const g = $state({
	/** The currently selected voxel object. */
	voxelObject: undefined as VoxelGroup | undefined,
	world: undefined as World | undefined,
	roomy: undefined as Roomy | undefined
});

export async function initRoomy(type: 'local' | 'remote' | 'dev' = 'local') {
	console.log('initRoomy', type);
	const savedCatalogId = localStorage.getItem('catalogId');
	const catalogId = new EntityId((savedCatalogId as EntityIdStr) ?? undefined);
	if (!savedCatalogId) localStorage.setItem('catalogId', catalogId.toString());

	let peer: SveltePeer;

	const storageId = 'mini-3d-voxels';

	if (type === 'local') {
		peer = new SveltePeer(new StorageManager(indexedDBStorageAdapter(storageId)));
	} else if (type === 'remote') {
		// TODO: this wont work like this, we need authentication using bluesky oauth
		peer = new SveltePeer(
			new StorageManager(indexedDBStorageAdapter(storageId)),
			await webSocketSyncer(new WebSocket('wss://syncserver.roomy.chat/sync/as/'))
		);
	} else {
		// use local dev server
		peer = new SveltePeer(
			new StorageManager(indexedDBStorageAdapter(storageId)),
			await webSocketSyncer(new WebSocket('ws://localhost:8095'))
		);
	}
	g.roomy = await Roomy.init(peer, catalogId);
}