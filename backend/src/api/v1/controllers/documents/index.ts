import createDocument from "./create.js";
import deleteDocument from "./delete.js";
import readDocument from "./read.js";
import restoreDocument from "./restore.js";
import updateDocument from "./update.js";

export default {
  create: createDocument,
  delete: deleteDocument,
  get: readDocument,
  restore: restoreDocument,
  update: updateDocument,
};
