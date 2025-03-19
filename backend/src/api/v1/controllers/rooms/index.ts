import createRoom from "./create.js";
import deleteRoom from "./delete.js";
import readRooms from "./read.js";
import updateRoom from "./update.js";

export default {
  create: createRoom,
  delete: deleteRoom,
  get: readRooms,
  update: updateRoom,
};
