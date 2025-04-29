/**
 * Welcome to the Roomy SDK!
 *
 * This is the core behind the [roomy.chat](https://roomy.chat) app, and allows you to interact with
 * Roomy spaces, channels, etc. in your own app, or lets you build your own customized chat
 * application.
 *
 * Roomy is built on the [Leaf SDK](https://github.com/muni-town/leaf), a toolkit for building
 * local-first apps with CRDTs.
 *
 * To get started you will need to create a Leaf {@linkcode Peer} and then you can start accessing
 * the Roomy API by initializing a {@linkcode Roomy} instance.
 *
 * > **Note:** Typedoc hides the types from external libraries like Leaf by default. You can show
 * > the Leaf types by checking the "External" checkbox in the right sidebar.
 *
 * @module
 */

import {
	type ComponentDef,
	Cursor,
	Entity,
	type EntityIdStr,
	type IntoEntityId,
	intoEntityId,
	LoroList,
	LoroMap,
	LoroMovableList,
	LoroText,
	Peer
} from '@muni-town/leaf';
export type { Uri } from './components.ts';

export * from '@muni-town/leaf';

/**
 * Leaf component definitions for the underlying Roomy data.
 *
 * You will not usually have to interact with these directly.
 *
 * @category Advanced
 * */
export * as components from './components';
import * as c from './components';
import { Color, Quaternion, Vector3 } from 'three';
import UberNoise, { type NoiseOptions } from 'uber-noise';

/** A constructor for an {@linkcode EntityWrapper}. */
export type EntityConstructor<T extends EntityWrapper> = new (peer: Peer, entity: Entity) => T;

/**
 * Parent class for all types that hold a {@linkcode Peer} instance.
 *
 * Usually you will not need to use this directly.
 *
 * @category Advanced
 */
export class HasPeer {
	/**
	 * The leaf peer instance.
	 * @group Advanced
	 */
	peer: Peer;

	/** @group Advanced */
	constructor(peer: Peer) {
		this.peer = peer;
	}

	/**
	 * Create a new entity of the given type.
	 *
	 * This can be used to create a new {@linkcode Entity} for any type that implements
	 * {@linkcode EntityWrapper}.
	 *
	 * ## Example
	 *
	 * ```ts
	 * const roomy = await Roomy.init(peer, catalogId);
	 * const space = roomy.create(Space);
	 * ```
	 *
	 * > **Note:** This method is inherited from {@linkcode EntityWrapper} on all entity types, and it
	 * > doesn't matter which type you call `create()` on, they are all equivalent.
	 *
	 * @group General
	 */
	async create<T extends EntityWrapper>(constructor: EntityConstructor<T>): Promise<T> {
		const ent = await this.peer.open();
		return new constructor(this.peer, ent);
	}

	/**
	 * Open an existing {@linkcode Entity} using it's ID.
	 *
	 * You provide an {@linkcode EntityWrapper} type like {@linkcode Space} or {@linkcode Message}
	 * that will be wrapped around the entity.
	 *
	 * @group General
	 * */
	async open<T extends EntityWrapper>(
		constructor: EntityConstructor<T>,
		id: IntoEntityId
	): Promise<T> {
		const ent = await this.peer.open(intoEntityId(id));
		return new constructor(this.peer, ent);
	}
}

/**
 * A convenient wrapper around an {@linkcode Entity}.
 *
 * {@linkcode EntityWrapper} is the parent of all of the more convenient entity types such as
 * {@linkcode Message} or {@linkcode Space}.
 *
 * Each subclass will usually add it's own accessors that allow for conveniently modifying the
 * underlying {@linkcode Entity}'s component data.
 *
 * You are welcome to extend this type yourself ot add custom convenient entity classes.
 */
export class EntityWrapper extends HasPeer {
	/**
	 * The underlying Leaf {@linkcode Entity}.
	 *
	 * @group Advanced
	 */
	entity: Entity;

	/**
	 * Instantiate from from a {@linkcode Peer} and an {@linkcode Entity}.
	 *
	 * This an other {@linkcode EntityWrapper} types simply provide convenient accessors on top of the
	 * underlying entity data.
	 *
	 * @group Advanced
	 */
	constructor(peer: Peer, entity: Entity) {
		super(peer);
		this.entity = entity;
	}

	/**
	 * Cast from one {@linkcode EntityWrapper} type to another.
	 *
	 * Returns `undefined` if {@linkcode EntityWrapper#matches} returns `false` for the given
	 * constructor type.
	 *
	 * You will not usually need to cast entity types to other ones, but it can be useful in some
	 * situations, where you would like to use another {@linkcode EntityWrapper} types's accessors.
	 *
	 * @group Advanced
	 */
	tryCast<T extends EntityWrapper>(
		constructor: EntityConstructor<T> & typeof EntityWrapper
	): T | undefined {
		return this.matches(constructor) ? new constructor(this.peer, this.entity) : undefined;
	}

	forceCast<T extends EntityWrapper>(constructor: EntityConstructor<T>): T {
		return new constructor(this.peer, this.entity);
	}

	/**
	 * Checks whether the given entity matches this wrapper type.
	 *
	 * The default implementation is to return `true` for every entity, but some wrappers will
	 * override it to check for the existence of certain marker components.
	 * */
	// deno-lint-ignore no-unused-vars
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static matches(wrapper: EntityWrapper): boolean {
		return true;
	}

	/**
	 * Checks whether the given wrapper type matches the this entity.
	 *
	 */
	matches<T extends typeof EntityWrapper>(constructor: T): boolean {
		return constructor.matches(this);
	}

	/**
	 * Commit any changes made to the entity.
	 *
	 * **Important:** You must call commit after making changes in order for those changes to be
	 * immediately applied, reacted to, and synced to network and/or storage.
	 *
	 * @group General
	 */
	commit() {
		this.entity.commit();
	}

	/**
	 * The string entity ID.
	 *
	 * @group General
	 */
	get id(): EntityIdStr {
		return this.entity.id.toString();
	}

	/**
	 * Register a callback that will be run when the entity is committed.
	 * @returns A function that may be called to unregister the callback.
	 */
	subscribe(listener: () => void): () => void {
		return this.entity.subscribe(listener);
	}
}

export class Deletable extends EntityWrapper {
	get softDeleted(): boolean {
		return this.entity.has(c.SoftDeleted);
	}

	set softDeleted(deleted: boolean) {
		if (deleted) {
			this.entity.init(c.SoftDeleted);
		} else {
			this.entity.delete(c.SoftDeleted);
		}
	}
}

export class Administered extends Deletable {
	/** The user IDs of the admins of this entity. */
	/** The user IDs of the admins of this entity. */
	admins<R>(handler: (admins: LoroMovableList<c.Uri>) => R): R {
		return this.entity.getOrInit(c.Admins, handler);
	}

	/** The set of user IDs that have been banned from this entity. */
	bans<R>(handler: (bans: LoroMap<{ [id: c.Uri]: boolean | undefined }>) => R): R {
		return this.entity.getOrInit(c.Bans, handler);
	}

	/**
	 * Add all of the admins from another {@linkcode Administered} entity to the admins list for this
	 * entity.
	 * */
	appendAdminsFrom(other: Administered) {
		const currentAdmins = this.admins((x) => x.toArray());
		for (const admin of other.admins((x) => x.toArray())) {
			if (!currentAdmins.includes(admin)) {
				this.admins((x) => x.push(admin));
			}
		}
	}
}

export class NamedEntity extends Administered {
	get name(): string {
		return this.entity.getOrInit(c.BasicMeta, (x) => x.get('name'));
	}
	set name(name: string) {
		this.entity.getOrInit(c.BasicMeta, (x) => x.set('name', name));
	}

	handles<R>(handler: (x: LoroList<string>) => R): R {
		return this.entity.getOrInit(c.Handles, handler);
	}

	get createdDate(): Date | undefined {
		const unixTimestamp = this.entity.getOrInit(c.BasicMeta, (x) => x.get('createdDate'));
		return unixTimestamp ? new Date(unixTimestamp * 1000) : undefined;
	}
	set createdDate(date: Date | undefined) {
		this.entity.getOrInit(c.BasicMeta, (x) =>
			x.set('createdDate', date ? date.getTime() / 1000 : undefined)
		);
	}

	get updatedDate(): Date | undefined {
		const unixTimestamp = this.entity.getOrInit(c.BasicMeta, (x) => x.get('updatedDate'));
		return unixTimestamp ? new Date(unixTimestamp * 1000) : undefined;
	}
	set updatedDate(date: Date | undefined) {
		this.entity.getOrInit(c.BasicMeta, (x) =>
			x.set('updatedDate', date ? date.getTime() / 1000 : undefined)
		);
	}

	get description(): string | undefined {
		return this.entity.getOrInit(c.BasicMeta, (x) => x.get('description'));
	}
	set description(description: string | undefined) {
		this.entity.getOrInit(c.BasicMeta, (x) => x.set('description', description));
	}

	get image(): EntityIdStr | undefined {
		return this.entity.getOrInit(c.BasicMeta, (x) => x.get('image'));
	}
	set image(value: EntityIdStr | { id: EntityIdStr }) {
		this.entity.getOrInit(c.BasicMeta, (x) =>
			x.set('image', typeof value == 'object' && 'id' in value ? value.id : value)
		);
	}
}

/** A Loro list type, either movable or not. */
export type LoroListType<T> = LoroList<T> | LoroMovableList<T>;

/**
 * An accessor for a list of other entities.
 *
 * This access will allow you to read and modify the entities in the list.
 * */
export class EntityList<
	T extends EntityWrapper,
	L extends LoroListType<EntityIdStr> = LoroMovableList<EntityIdStr>
> extends EntityWrapper {
	#def: ComponentDef<L>;
	#factory: EntityConstructor<T>;

	/**
	 * You will not usually need to create an {@linkcode EntityList} yourself unless you are
	 * implementing your own subclass of {@linkcode EntityWrapper}.
	 *
	 * @param peer The Leaf peer.
	 * @param entity The entity containing the list of other entities.
	 * @param component The underlying leaf component containing the list of other entities.
	 * @param constructor The {@linkcode EntityWrapper} type to wrap the entities in the list with.
	 */
	constructor(
		peer: Peer,
		entity: Entity,
		component: ComponentDef<L>,
		constructor: EntityConstructor<T>
	) {
		super(peer, entity);
		this.#def = component;
		this.#factory = constructor;
	}

	/** Get the list of entity IDs in the list. */
	ids(): EntityIdStr[] {
		return this.entity.getOrInit(this.#def, (x) => x.toArray());
	}

	/** Load the full list of entities as an array. */
	async items(): Promise<T[]> {
		return await Promise.all(
			this.entity.getOrInit(this.#def, (x) =>
				x.toArray().map(async (ent) => new this.#factory(this.peer, await this.peer.open(ent)))
			)
		);
	}

	/** Same as {@linkcode EntityList#items()}, but also returns a Loro Cursor. */
	itemCursors(): Promise<[Cursor, T][]> {
		return this.entity.getOrInit(this.#def, (list) =>
			Promise.all(
				Array.from({ length: list.length }, async (_, i) => [
					list.getCursor(i)!,
					new this.#factory(this.peer, await this.peer.open(list.get(i)))
				])
			)
		);
	}

	/** Add an entity to the end of the list. */
	push(item: T) {
		this.entity.getOrInit(this.#def, (x) => x.push(item.entity.id.toString()));
	}

	/** Add an entity to the specified index in the list. */
	insert(index: number, item: T) {
		this.entity.getOrInit(this.#def, (x) => x.insert(index, item.entity.id.toString()));
	}

	/** Remove an entity from the list. */
	remove(itemIdx: number) {
		this.entity.getOrInit(this.#def, (x) => x.delete(itemIdx, 1));
	}

	/** Move an entity in the list from `itemIdx` to `newIdx`. */
	move(
		// This funky trick makes typechecking fail when trying to call this function if it is not a
		// movable list.
		itemIdx: L extends LoroMovableList ? number : never,
		newIdx: number
	): L extends LoroMovableList ? void : never {
		return this.entity.getOrInit(this.#def, (list) => {
			if (list instanceof LoroMovableList) {
				list.move(itemIdx, newIdx);
			} else {
				throw 'Cannot use move function in an immovable list.';
			}

			// deno-lint-ignore no-explicit-any
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return undefined as any;
		});
	}

	/** Get the raw {@linkcode LoroMovableList}. */
	rawList<R>(handler: (x: L) => R): R {
		return this.entity.getOrInit(this.#def, handler);
	}

	/** The number of items in the list. */
	get length(): number {
		return this.entity.getOrInit(this.#def, (x) => x.length);
	}

	/** Delete all of the items in the list and remove the component from the entity. */
	delete() {
		this.entity.delete(this.#def);
	}
}

/** Helper class for an entity with a {@linkcode c.JsonContent} or {@linkcode c.Content}. */
export class Content extends NamedEntity {
	body<R>(handler: (x: LoroText) => R): R {
		return this.entity.getOrInit(c.Content, handler);
	}

	get bodyJson(): string {
		return this.entity.getOrInit(c.JsonContent, (x) => x.get('content'));
	}

	set bodyJson(jsonString: string) {
		this.entity.getOrInit(c.JsonContent, (x) => x.set('content', jsonString));
	}
}

/**
 * A roomy instance.
 *
 * Contains everything necessary to interact with Roomy data
 * */
export class Roomy extends EntityWrapper {
	/**
	 * Create a Roomy instance.
	 *
	 * @param peer You must first construct a Leaf {@linkcode Peer} and configure it's storage backend
	 * and syncer implementations before constructing the {@linkcode Roomy} instance.
	 * @param catalogId The `catalogId` ID of the entity that will be used to store the user's list of
	 * joined spaces, preferences, etc.
	 * */
	static async init(peer: Peer, catalogId: IntoEntityId): Promise<Roomy> {
		const catalog = await peer.open(intoEntityId(catalogId));
		return new Roomy(peer, catalog);
	}

	/** The list of spaces in the Roomy instance. */
	get spaces(): EntityList<Space> {
		return new EntityList(this.peer, this.entity, c.Spaces, Space);
	}

	get models(): EntityList<VoxelGroup> {
		return new EntityList(this.peer, this.entity, c.ModelsComponent, VoxelGroup);
	}
}

/**
 * A Roomy space.
 */
export class Space extends NamedEntity {
	/** The items in the Roomy sidebar. */
	get sidebarItems(): EntityList<NamedEntity> {
		return new EntityList(this.peer, this.entity, c.SpaceSidebarNavigation, NamedEntity);
	}

	get wikipages(): EntityList<WikiPage> {
		return new EntityList(this.peer, this.entity, c.WikiPages, WikiPage);
	}

	/** The global list of channels in the space, separate from the i. */
	get channels(): EntityList<Channel> {
		return new EntityList(this.peer, this.entity, c.Channels, Channel);
	}

	/** The global list of threads in the space. */
	get threads(): EntityList<Thread> {
		return new EntityList(this.peer, this.entity, c.Threads, Thread);
	}
}

/**
 * A category is a container for channels that may be put in the Roomy sidebar.
 */
export class Category extends NamedEntity {
	constructor(peer: Peer, entity: Entity) {
		super(peer, entity);
		this.entity.init(c.Category);
	}
	static override matches(wrapper: EntityWrapper): boolean {
		return wrapper.entity.has(c.Category);
	}

	get channels(): EntityList<Channel> {
		return new EntityList(this.peer, this.entity, c.Channels, Channel);
	}
}
export class WikiPage extends NamedEntity {
	constructor(peer: Peer, entity: Entity) {
		super(peer, entity);
		this.entity.init(c.WikiPage);
	}

	static override matches(wrapper: EntityWrapper): boolean {
		return wrapper.entity.has(c.WikiPage);
	}

	get bodyJson(): string {
		return this.entity.getOrInit(c.JsonContent, (x) => x.get('content'));
	}

	set bodyJson(jsonString: string) {
		this.entity.getOrInit(c.JsonContent, (x) => x.set('content', jsonString));
	}

	body<R>(handler: (x: LoroText) => R): R {
		return this.entity.getOrInit(c.Content, handler);
	}
}

export class Timeline extends NamedEntity {
	get timeline(): EntityList<TimelineItem> {
		return new EntityList(this.peer, this.entity, c.Timeline, TimelineItem);
	}
}

/**
 * A channel is a container for messages that is considered long-lived and usually created
 * ahead-of-time for on-topic discussion.
 */
export class Channel extends Timeline {
	constructor(peer: Peer, entity: Entity) {
		super(peer, entity);
		this.entity.init(c.Channel);
	}
	static override matches(wrapper: EntityWrapper): boolean {
		return wrapper.entity.has(c.Channel);
	}

	get threads(): EntityList<Thread> {
		return new EntityList(this.peer, this.entity, c.Threads, Thread);
	}
	get wikipages(): EntityList<WikiPage> {
		return new EntityList(this.peer, this.entity, c.WikiPages, WikiPage);
	}
}

/**
 * A thread is a container for messages that is considered short-lived and is often created ad-hoc.
 */
export class Thread extends Timeline {
	constructor(peer: Peer, entity: Entity) {
		super(peer, entity);
		this.entity.init(c.Thread);
	}
	static override matches(wrapper: EntityWrapper): boolean {
		return wrapper.entity.has(c.Thread);
	}
}

/**
 * An entry that may appear in a {@linkcode Channel} or {@linkcode Thread} timeline, such as a
 * {@linkcode Message} or {@linkcode Announcement}.
 */
// TODO: Think about this: we are extending named entity to get the createdDate meta, but we don't
// actually have a name for chat messages usually. We should probably either make the created date
// separate from the component with the name in it, or make the name optional.
//
// At this point I'm thinking about making the name optional.
export class TimelineItem extends NamedEntity {
	/** The emoji reactions to the message. */
	get reactions(): Reactions {
		return this.forceCast(Reactions);
	}

	/** The entity that this message was in reply to, if any. */
	get replyTo(): EntityIdStr | undefined {
		return this.entity.get(c.ReplyTo, (x) => x?.get('entity'));
	}

	/** Set the entity that this message was in reply to, if any. */
	set replyTo(entity: EntityWrapper | IntoEntityId | undefined) {
		if (entity) {
			this.entity.getOrInit(c.ReplyTo, (x) =>
				x.set(
					'entity',
					entity instanceof EntityWrapper ? entity.id : intoEntityId(entity).toString()
				)
			);
		} else {
			this.entity.delete(c.ReplyTo);
		}
	}
}

/** Accessor reactions on an entity. */
export class Reactions extends EntityWrapper {
	/** Get all of the reactions, and the set of users that reacted with the given reaction. */
	all(): Record<string, Set<string>> {
		const list = this.entity.getOrInit(c.Reactions, (x) => x.toArray());
		const reactions: Record<string, Set<string>> = {};
		for (const raw of list) {
			const [reaction, user] = raw.split(' ');
			if (!reactions[reaction]) reactions[reaction] = new Set();
			reactions[reaction].add(user);
		}
		return reactions;
	}

	has(reaction: string, authorId: string): boolean {
		const raw: `${string} ${string}` = `${reaction} ${authorId}`;
		return this.entity.getOrInit(c.Reactions, (x) => x.toArray().includes(raw));
	}

	toggle(reaction: string, authorId: string) {
		if (this.has(reaction, authorId)) {
			this.remove(reaction, authorId);
		} else {
			this.add(reaction, authorId);
		}
	}

	/** Add a reaction. */
	add(reaction: string, authorId: string) {
		if (reaction.includes(' ') || authorId.includes(' '))
			throw new Error('Reaction and Author ID must not contain spaces.');
		const raw: c.Reaction = `${reaction} ${authorId}`;
		this.entity.getOrInit(c.Reactions, (component) => {
			const list = component.toArray();
			if (!list.includes(raw)) {
				component.push(raw);
			}
		});
	}

	/** Remove a reaction. */
	remove(reaction: string, authorId: string) {
		if (reaction.includes(' ') || authorId.includes(' '))
			throw new Error('Reaction and Author ID must not contain spaces.');
		const raw: `${string} ${string}` = `${reaction} ${authorId}`;
		this.entity.getOrInit(c.Reactions, (component) => {
			const list = component.toArray();
			const idx = list.indexOf(raw);
			if (idx !== -1) {
				component.delete(idx, 1);
			}
		});
	}
}

/** A message usually sent in a channel or thread. */
export class Message extends TimelineItem {
	constructor(peer: Peer, entity: Entity) {
		super(peer, entity);
		this.entity.init(c.Message);
	}
	static override matches(wrapper: EntityWrapper): boolean {
		return wrapper.entity.has(c.Message);
	}

	authors<R>(handler: (x: LoroMovableList<c.Uri>) => R): R {
		return this.entity.getOrInit(c.AuthorUris, handler);
	}

	/** The main content body of the message. */
	body<R>(handler: (x: LoroText) => R): R {
		return this.entity.getOrInit(c.Content, handler);
	}

	get bodyJson(): string {
		return this.entity.getOrInit(c.JsonContent, (x) => x.get('content'));
	}

	set bodyJson(jsonString: string) {
		this.entity.getOrInit(c.JsonContent, (x) => x.set('content', jsonString));
	}

	/** A list of images attached to the message. */
	get images(): EntityList<Image> {
		return new EntityList(this.peer, this.entity, c.Images, Image);
	}
}

/**
 * An announcement is some event usually announced by the system and put in a {@linkcode Channel}
 * or {@linkcode Thread}.
 * */
export class Announcement extends TimelineItem {
	constructor(peer: Peer, entity: Entity) {
		super(peer, entity);
		this.entity.init(c.ChannelAnnouncement);
	}
	static override matches(wrapper: EntityWrapper): boolean {
		return wrapper.entity.has(c.ChannelAnnouncement);
	}

	/** The kind of announcement */
	get kind(): c.ChannelAnnouncementKind {
		return this.entity.getOrInit(c.ChannelAnnouncement, (x) => x.get('kind'));
	}

	/** Set the kind of announcement */
	set kind(kind: c.ChannelAnnouncementKind) {
		this.entity.getOrInit(c.ChannelAnnouncement, (x) => x.set('kind', kind));
	}

	/** The threads related to this announcement. */
	get relatedThreads(): EntityList<Thread> {
		return new EntityList(this.peer, this.entity, c.Threads, Thread);
	}

	/** The messages related to this announcement. */
	get relatedMessages(): EntityList<Message> {
		return new EntityList(this.peer, this.entity, c.Timeline, Message);
	}
}

/**
 * An image defined by a URI.
 * */
export class Image extends Deletable {
	/**
	 * The URI of the image. This could be an HTTP(S) URL or a base64 encoded data URI, or any other
	 * kind of URI.
	 * */
	get uri(): string {
		return this.entity.getOrInit(c.ImageUri, (x) => x.get('uri'));
	}
	/** Set the URI of the image. */
	set uri(uri: string) {
		this.entity.getOrInit(c.ImageUri, (x) => x.set('uri', uri));
	}
	/** The alt text of the image */
	get alt(): string | undefined {
		return this.entity.getOrInit(c.ImageUri, (x) => x.get('alt'));
	}
	/** Set the alt text of the image */
	set alt(alt: string) {
		this.entity.getOrInit(c.ImageUri, (x) => x.set('alt', alt));
	}
	/** The width of the image. */
	get width(): number | undefined {
		return this.entity.getOrInit(c.ImageUri, (x) => x.get('width'));
	}
	/** Set the width of the image. */
	set width(width: number | undefined) {
		this.entity.getOrInit(c.ImageUri, (x) => x.set('width', width));
	}
	/** The height of the image. */
	get height(): number | undefined {
		return this.entity.getOrInit(c.ImageUri, (x) => x.get('height'));
	}
	/** Set the height of the image. */
	set height(height: number) {
		this.entity.getOrInit(c.ImageUri, (x) => x.set('height', height));
	}
}

export class Transform extends EntityWrapper {
	get position() {
		return new Vector3(this.x, this.y, this.z);
	}

	set position(value: Vector3) {
		this.x = value.x;
		this.y = value.y;
		this.z = value.z;
	}

	get quaternion() {
		return new Quaternion(this.qx, this.qy, this.qz, this.qw);
	}

	set quaternion(value: Quaternion) {
		this.qx = value.x;
		this.qy = value.y;
		this.qz = value.z;
		this.qw = value.w;
	}

	get scale() {
		return new Vector3(this.sx, this.sy, this.sz);
	}

	set scale(value: Vector3) {
		this.sx = value.x;
		this.sy = value.y;
		this.sz = value.z;
	}

	get x() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('x'));
	}
	set x(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('x', value));
	}

	get y() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('y'));
	}
	set y(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('y', value));
	}

	get z() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('z'));
	}
	set z(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('z', value));
	}

	get sx() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('sx'));
	}

	set sx(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('sx', value));
	}

	get sy() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('sy'));
	}

	set sy(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('sy', value));
	}

	get sz() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('sz'));
	}

	set sz(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('sz', value));
	}

	get qx() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('qx'));
	}

	set qx(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('qx', value));
	}

	get qy() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('qy'));
	}

	set qy(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('qy', value));
	}

	get qz() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('qz'));
	}

	set qz(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('qz', value));
	}

	get qw() {
		return this.entity.getOrInit(c.TransformComponent, (entity) => entity.get('qw'));
	}

	set qw(value: number) {
		this.entity.getOrInit(c.TransformComponent, (entity) => entity.set('qw', value));
	}
}

export class Voxel extends Transform {
	get color() {
		return new Color(this.r, this.g, this.b);
	}

	set color(value: Color) {
		this.r = value.r;
		this.g = value.g;
		this.b = value.b;
	}

	get r() {
		return this.entity.getOrInit(c.VoxelComponent, (entity) => entity.get('r'));
	}
	set r(value: number) {
		this.entity.getOrInit(c.VoxelComponent, (entity) => entity.set('r', value));
	}

	get g() {
		return this.entity.getOrInit(c.VoxelComponent, (entity) => entity.get('g'));
	}
	set g(value: number) {
		this.entity.getOrInit(c.VoxelComponent, (entity) => entity.set('g', value));
	}

	get b() {
		return this.entity.getOrInit(c.VoxelComponent, (entity) => entity.get('b'));
	}
	set b(value: number) {
		this.entity.getOrInit(c.VoxelComponent, (entity) => entity.set('b', value));
	}

	get visible() {
		return this.entity.getOrInit(c.VoxelComponent, (entity) => entity.get('visible'));
	}

	set visible(value: boolean) {
		this.entity.getOrInit(c.VoxelComponent, (entity) => entity.set('visible', value));
	}

	get collider() {
		return this.entity.getOrInit(c.VoxelComponent, (entity) => entity.get('collider'));
	}

	set collider(value: boolean) {
		this.entity.getOrInit(c.VoxelComponent, (entity) => entity.set('collider', value));
	}
}

export class VoxelGroup extends NamedEntity {
	get voxels(): EntityList<Voxel> {
		return new EntityList(this.peer, this.entity, c.VoxelGroupComponent, Voxel);
	}
}

export class TransformedGroup extends Transform {
	get group() {
		return this.entity.getOrInit(c.TransformedGroupComponent, (entity) => entity.get('group'));
	}

	async loadGroup(): Promise<VoxelGroup> {
		return this.open(VoxelGroup, this.group);
	}

	set group(value: EntityIdStr) {
		this.entity.getOrInit(c.TransformedGroupComponent, (entity) => entity.set('group', value));
	}
}

export class Models extends NamedEntity {
	get models(): EntityList<VoxelGroup> {
		return new EntityList(this.peer, this.entity, c.ModelsComponent, VoxelGroup);
	}
}

export class PlayerLocation extends EntityWrapper {
	get time() {
		return this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.get('time'));
	}

	set time(value: number) {
		this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.set('time', value));
	}

	get x() {
		return this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.get('x'));
	}

	set x(value: number) {
		this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.set('x', value));
	}

	get y() {
		return this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.get('y'));
	}

	set y(value: number) {
		this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.set('y', value));
	}

	get z() {
		return this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.get('z'));
	}

	set z(value: number) {
		this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.set('z', value));
	}

	get rotation() {
		return this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.get('rotation'));
	}

	set rotation(value: number) {
		this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.set('rotation', value));
	}

	get model() {
		return this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.get('model'));
	}

	set model(value: string) {
		this.entity.getOrInit(c.PlayerLocationComponent, (entity) => entity.set('model', value));
	}
}

export class World extends NamedEntity {
	get instances(): EntityList<TransformedGroup> {
		return new EntityList(this.peer, this.entity, c.WorldComponent, TransformedGroup);
	}

	get players(): EntityList<PlayerLocation> {
		return new EntityList(this.peer, this.entity, c.PlayerLocationsComponent, PlayerLocation);
	}

	get settings(): WorldSettings {
		return JSON.parse(
			this.entity.getOrInit(c.WorldSettingsComponent, (entity) => entity.get('settings'))
		);
	}

	set settings(value: WorldSettings) {
		this.entity.getOrInit(c.WorldSettingsComponent, (entity) =>
			entity.set('settings', JSON.stringify(value))
		);
	}
}

export type WorldSettings = {
	seed: string;
	size: number;
	terrainGradient: {
		rgb: { r: number; g: number; b: number };
		position: number;
	}[];
	waterGradient: {
		rgb: { r: number; g: number; b: number };
		position: number;
	}[];
	version: number;
	waterPercentage: number;
	terrainNoise?: NoiseOptions;
	waterNoise?: NoiseOptions;
};
