import { EntityId, Roomy, VoxelGroup, World, type EntityIdStr } from '$lib/roomy';
import { StorageManager } from '@muni-town/leaf/storage';
import { SveltePeer } from '@muni-town/leaf/svelte';
import { indexedDBStorageAdapter } from '@muni-town/leaf/storage/indexed-db';
import { webSocketSyncer } from '@muni-town/leaf/sync1/ws-client';

if (import.meta.hot) {
	import.meta.hot.accept(() => {
		window.location.reload();
	});
}

export const g = $state({
	/** The currently selected voxel object. */
	voxelObject: undefined as VoxelGroup | undefined,
	world: undefined as World | undefined,
	roomy: undefined as Roomy | undefined,
	token: undefined as string | undefined,
	did: undefined as string | undefined
});

export async function initRoomy(type: 'local' | 'remote' | 'dev' = 'local') {
	const savedCatalogId = localStorage.getItem('catalogId');
	const catalogId = new EntityId((savedCatalogId as EntityIdStr) ?? undefined);
	if (!savedCatalogId) localStorage.setItem('catalogId', catalogId.toString());

	const token = g.token ?? localStorage.getItem('token');
	const did = g.did ?? localStorage.getItem('did');

	if (token) localStorage.setItem('token', token);
	if (did) localStorage.setItem('did', did);

	let peer: SveltePeer;

	const storageId = 'mini-3d-voxels';

	//if ((!token || !did) && type === 'remote') type = 'local';

	console.log('initRoomy', type, token, did);

	if (type === 'local') {
		peer = new SveltePeer(new StorageManager(indexedDBStorageAdapter(storageId)));
	} else if (type === 'remote') {
		try {
			peer = new SveltePeer(
				new StorageManager(indexedDBStorageAdapter(storageId)),
				await webSocketSyncer(
					//new WebSocket('wss://syncserver.roomy.chat/sync/as/' + did, ['authorization', token])
					new WebSocket(
						'wss://demo.sync.muni.town/sync/as/' + (did ?? 'did:plc:xv2x4dimpe3zukzuynblaiyt'),
						['authorization', token ?? 'demodevtoken']
					)
				)
			);
		} catch (e) {
			console.error(e);
		}
	} else {
		// use local dev server
		peer = new SveltePeer(
			new StorageManager(indexedDBStorageAdapter(storageId)),
			await webSocketSyncer(new WebSocket('ws://localhost:8095'))
		);
	}
	try {
		// @ts-expect-error - this is probably fine?
		g.roomy = await Roomy.init(peer, catalogId);
	} catch (e) {
		console.error(e);
	}
}
