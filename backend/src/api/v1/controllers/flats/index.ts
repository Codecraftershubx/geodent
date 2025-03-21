import createFlat from "./create.js";
import deleteFlat from "./delete.js";
import flatConnections from "./connections.js";
import readFlats from "./read.js";
import restoreFlat from "./restore.js";
import updateFlat from "./update.js";

export default {
  connections: flatConnections,
  create: createFlat,
  delete: deleteFlat,
  get: readFlats,
  restore: restoreFlat,
  update: updateFlat,
};
