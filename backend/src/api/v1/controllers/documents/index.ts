import createDocument from "./create.js";
import deleteDocument from "./delete.js";
import documentConnections from "./connections.js";
import files from "./files.js";
import readDocument from "./read.js";
import restoreDocument from "./restore.js";
import updateDocument from "./update.js";

export default {
  connections: documentConnections,
  create: createDocument,
  delete: deleteDocument,
  files,
  get: readDocument,
  restore: restoreDocument,
  update: updateDocument,
};
