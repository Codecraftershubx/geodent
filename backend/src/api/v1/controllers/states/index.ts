import createState from "./create.js";
import getStates from "./read.js";
import deleteState from "./delete.js";
import restoreState from "./restore.js";
import stateConnections from "./connections.js";
import updateState from "./update.js";

export default {
  connections: stateConnections,
  create: createState,
  delete: deleteState,
  get: getStates,
  restore: restoreState,
  update: updateState,
};
