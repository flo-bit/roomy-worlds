# roomy worlds

Roomy Worlds is a tool for creating and sharing small 3D worlds as a community.

Made with [roomy-sdk](https://github.com/muni-town/roomy-sdk) and [leaf](https://github.com/muni-town/leaf).

Work in progress: You can create new worlds, but they might disappear/change unexpectedly with new updates. 
Also lots of bugs.

[Demo](https://flo-bit.dev/roomy-worlds)

## Development

Clone repo and run:

```bash
npm install
npm run dev
```

### For shared worlds

Clone the [leaf repo](https://github.com/muni-town/leaf) and run

```bash
deno install
deno run syncserver
```

then change this line in `src/lib/shared/roomy.svelte.ts` to `type: 'dev'`

```ts
export async function initRoomy(type: 'local' | 'remote' | 'dev' = 'local') {

// change to
export async function initRoomy(type: 'local' | 'remote' | 'dev' = 'dev') {
```

Now when opening multiple browser windows you should see changes from all windows (when in the same world) 
as well as see all models made in any window.

## todo

- save world settings with roomy world
- add default gradients
- export and import world (incl world settings)
- rotate and scale models 
- add advanced settings to world (noise settings)
- add sound effects (placing, walking)
- [x] add selection between world/local/global models
- add model name and category
- download model
- add gradient for lower part of island

### worlds

- [x] fix bug allowing placement at bottom of island
- allow transformation of models (move, rotate, scale)
- import/export of world (maybe upload to bluesky pds?)
- share/show player positions
- show player names if signed in w bluesky
- add in game chat with roomy
- save island settings (noise + gradient + island size + sky) with world
- character selection
- touch controls
- allow adding cubes directly to world
- [x] show selected model (that will be placed)
- viewer for user uploaded worlds
- inline model editor
- add clouds?
- add weather?
- add time of day?

### models 

- categories of models
- private, world, global models
- snap transform with shift
- switch between world and local transform
- box selection
- select multiple cubes with shift
- allow setting visibility/collision of cubes
- show recently used colors in color picker
- add model name
- add undo/redo
- outline around currently selected cube
- save models in players data
- add preset models
- add particle emitter?

### bugs

- fix click (for placement and selection on floor + cubes) to only work when mouse stays still (down-up)
- first cube cant be removed in model editor
- updates to models not showing without refreshing (in world)
- showing world models in model picker only after one model is added to world

## Credits

- 3d character models from [kenney](https://kenney.nl/assets/mini-characters-1)
- Music by [Nicholas Palmer](https://soundcloud.com/nicholas-palmer-4)


worlds:

- co_zZjA7PJnSUXEP7VVKomrT3gL7hf
- co_z7FMaWBpkYGHixseZu9iuA2LmTL
- co_zQLdXMAmNc7kkzeRBu7MyWDoRD1