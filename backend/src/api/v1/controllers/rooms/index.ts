import createRoom from "./create.js";
import deleteRoom from "./delete.js";
import readRooms from "./read.js";
import restoreRooms from "./restore.js";
import updateRoom from "./update.js";

export default {
  create: createRoom,
  delete: deleteRoom,
  get: readRooms,
  restore: restoreRooms,
  update: updateRoom,
};
