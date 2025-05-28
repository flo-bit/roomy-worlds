import { co, Group, z } from 'jazz-tools';

export const Reaction = co.map({
	emoji: z.string()
});

export const ImageList = co.list(co.image());

export const Image = co.image();

export const Message = co.map({
	content: co.richText(),
	images: ImageList,

	createdAt: z.date(),
	updatedAt: z.date(),

	replyTo: z.string().optional(),
	reactions: co.list(Reaction),
	type: z.enum(['message', 'announcement']),

	thread: z.string().optional(),

	softDeleted: z.boolean().optional()
});

export const Timeline = co.list(Message);

export const Thread = co.map({
	name: z.string(),
	timeline: Timeline
});

export const Channel = co.map({
	name: z.string(),
	image: co.image().optional(),

	mainThread: Thread,
	subThreads: co.list(Thread)
});

export const Space = co.map({
	name: z.string(),
	image: co.image().optional(),
	channels: co.list(Channel),
	description: z.string().optional(),
	emoji: z.string().optional(),
	members: co.list(co.account())
});

export const SpaceList = co.list(Space);

export const Transform = co.map({
	x: z.number(),
	y: z.number(),
	z: z.number(),

	sx: z.number(),
	sy: z.number(),
	sz: z.number(),

	rx: z.number(),
	ry: z.number(),
	rz: z.number(),
	rw: z.number()
});

export const Voxel = co.map({
	transform: Transform,
	r: z.number(),
	g: z.number(),
	b: z.number(),

	visible: z.boolean(),
	collider: z.boolean()
});

export const VoxelList = co.list(Voxel);

export const Model = co.map({
	voxels: VoxelList,
	name: z.string().optional()
});

export const ModelList = co.list(Model);

export const Instance = co.map({
	model: z.string(),
	transform: Transform
});
export type InstanceType = co.loaded<typeof Instance>;

export const InstanceList = co.list(Instance);

export const World = co.map({
	instances: InstanceList
});

export const MyAppProfile = co.profile({
	name: z.string(),
	image: co.image().optional(),
	imageUrl: z.string().optional(),
	blueskyHandle: z.string().optional()
});

export const LastReadList = co.record(z.string(), z.date());

export const MyAppRoot = co.map({
	models: ModelList
});

export const MyAppAccount = co
	.account({
		profile: MyAppProfile,
		root: MyAppRoot
	})
	.withMigration((account, creationProps?: { name: string }) => {
		if (account.root === undefined) {
			account.root = MyAppRoot.create({
				models: ModelList.create([])
			});
			console.log('account.root', account.root);
		}

		if (account.profile === undefined) {
			const profileGroup = Group.create();
			profileGroup.addMember('everyone', 'reader');

			account.profile = MyAppProfile.create(
				{
					name: creationProps?.name ?? 'Anonymous User'
				},
				profileGroup
			);
		}
	});
