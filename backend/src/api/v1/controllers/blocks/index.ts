import blockConnections from "./connections.js";
import createBlock from "./create.js";
import deleteBlock from "./delete.js";
import readBlock from "./read.js";
import restoreBlock from "./restore.js";
import updateBlock from "./update.js";

export default {
  connections: blockConnections,
  create: createBlock,
  delete: deleteBlock,
  get: readBlock,
  restore: restoreBlock,
  update: updateBlock,
};
