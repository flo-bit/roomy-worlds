# roomy worlds

Roomy Worlds is a tool for creating and sharing small 3D worlds as a community.

Made with [roomy-sdk](https://github.com/muni-town/roomy-sdk) and [leaf](https://github.com/muni-town/leaf).

Work in progress: You can create new worlds locally, but they are not synced yet (no multiplayer capabilities) 
and might disappear/change unexpectedly with new updates.


### Notes

- After saving a new model you might have to refresh the world page to see it in the model picker.

- Sometimes after fresh load of an existing world, items are not visible until you place one more item.

- Safari (mac and iOS) is currently not supported.

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

### general

- add at proto login

### worlds

- import/export of world
- show player positions
- show player names
- save noise settings + gradient + island size + sky settings with world
- allow transformation of models (move, rotate, scale)
- character selection
- touch controls

### models 

- categories of models
- allow setting visibility/collision of cubes
- show recently used colors in color picker
- add model name
- add undo/redo
- outline around currently selected cube
- save models with player

## Credits

- 3d character models from [kenney](https://kenney.nl/assets/mini-characters-1)