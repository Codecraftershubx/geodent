import createUser from "./create.js";
import deleteUser from "./delete.js";
import likeUser from "./likes.js";
import profile from "./userProfile.js";
import readUser from "./read.js";
import restoreUser from "./restore.js";
import updateUser from "./update.js";
import userConnections from "./connections.js";

export default {
  connections: userConnections,
  create: createUser,
  delete: deleteUser,
  like: likeUser,
  get: readUser,
  profile,
  restore: restoreUser,
  update: updateUser,
};
