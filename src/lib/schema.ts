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
	position: z.object({
		x: z.number(),
		y: z.number(),
		z: z.number()
	}),

	quaternion: z.object({
		x: z.number(),
		y: z.number(),
		z: z.number(),
		w: z.number()
	}),

	scale: z.object({
		x: z.number(),
		y: z.number(),
		z: z.number()
	})
});

export const Instance = co.map({
	path: z.string(),
	model: z.string(),
	variant: z.string().optional(),
	color: z.string().optional(),
	transform: Transform,
	collision: z.boolean().optional()
});
export type InstanceType = co.loaded<typeof Instance>;

export const InstanceList = co.list(Instance);


export const PlayerData = co.map({
	position: z.object({
		x: z.number(),
		y: z.number(),
		z: z.number()
	}),
	rotation: z.number(),
	timestamp: z.number(),
	character: z.string(),
	velocity: z.object({
		x: z.number(),
		y: z.number(),
		z: z.number()
	})
});

export const WorldsList = co.list(z.string());

export const PlayerDataList = co.record(z.string(), PlayerData);

export const Cell = co.map({
	instances: InstanceList
});

export const WorldCells = co.record(z.string(), Cell);

export const World = co.map({
	cells: WorldCells,
	players: PlayerDataList
});


export const MyAppProfile = co.profile({
	name: z.string(),
	image: co.image().optional(),
	imageUrl: z.string().optional(),
	blueskyHandle: z.string().optional()
});

export const LastReadList = co.record(z.string(), z.date());

export const MyAppRoot = co.map({});

export const MyAppAccount = co
	.account({
		profile: MyAppProfile,
		root: MyAppRoot
	})
	.withMigration((account, creationProps?: { name: string }) => {
		if (account.root === undefined) {
			account.root = MyAppRoot.create({});
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
