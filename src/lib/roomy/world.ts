import { g, initRoomy } from '$lib/roomy.svelte';
import type { EntityIdStr } from '@muni-town/leaf';
import { Quaternion, Vector3, Color } from 'three';
import { EntityList, EntityWrapper, NamedEntity } from '.';

import * as c from './world-components';

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

	async loadGroup() {
		if (!g.roomy) await initRoomy();

		return await g.roomy!.open(VoxelGroup, this.group);
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
}

export class World extends NamedEntity {
	get instances(): EntityList<TransformedGroup> {
		return new EntityList(this.peer, this.entity, c.WorldComponent, TransformedGroup);
	}

	get locations(): EntityList<PlayerLocation> {
		return new EntityList(this.peer, this.entity, c.PlayerLocationsComponent, PlayerLocation);
	}
}
