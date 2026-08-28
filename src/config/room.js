// 面试房间 template — every dimension of the room in METERS, in one object.
// The scene (src/scenes/InterviewRoom.js) builds the room by reading ONLY this
// config: in P3 this template is instanced thousands of times behind the
// corridor's doors, so layout numbers live here, never in scene code.
//
// Coordinates: origin at the center of the floor, y up.
//   x runs across the room's width (east +x / west -x)
//   z runs along the room's depth (south +z / north -z)
//
// TODO(canon): every number here is a generic graybox placeholder. Real values
// arrive in the P2 canon pass from docs/对照表-面试房间.md, each citing its 引用.
export const ROOM = {
  // Inner (walkable) size of the room; walls sit outside these bounds.
  inner: { width: 6, depth: 8, height: 3 },

  wallThickness: 0.2,

  // The door opening.
  //   wall: which wall holds it — 'north' | 'south' | 'east' | 'west'
  //   offset: meters along that wall, measured from the wall's center
  //           (toward +x on north/south walls, toward +z on east/west walls)
  door: { wall: 'north', offset: 0, width: 0.9, height: 2.1 },

  // Where the player starts: [x, z] on the floor (just inside the door),
  // plus yaw in radians (0 faces north / -z; Math.PI faces south / +z).
  spawn: { position: [0, -3], yaw: Math.PI },

  // Furniture as simple boxes — real human proportions arrive in P1.5.
  //   size: [width, height, depth] of the box, resting on the floor
  //   position: [x, z] of the box center
  //   rotationY: facing, in radians (0 faces north / -z)
  furniture: [
    { id: 'desk', size: [1.4, 0.75, 0.7], position: [0, 1.5], rotationY: 0 },
    { id: 'chair-interviewer', size: [0.45, 0.45, 0.45], position: [0, 2.5], rotationY: 0 },
    { id: 'chair-candidate', size: [0.45, 0.45, 0.45], position: [0, 0.5], rotationY: Math.PI },
  ],

  // Graybox palette (P1 is gray-only). Values differ so surfaces separate.
  grays: {
    floor: 0x55555a,
    ceiling: 0x74747a,
    wall: 0x8a8a8e,
    door: 0x67676d,
    furniture: 0x9c9ca2,
  },
};
