import createTag from "./create.js";
import deleteTag from "./delete.js";
import readTags from "./read.js";
import restoreTag from "./restore.js";
import updateTag from "./update.js";

export default {
  create: createTag,
  delete: deleteTag,
  get: readTags,
  restore: restoreTag,
  update: updateTag,
};
