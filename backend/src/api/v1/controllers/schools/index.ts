import createSchool from "./create.js";
import deleteSchool from "./delete.js";
import getSchools from "./read.js";
import restoreSchool from "./restore.js";
import schoolConnections from "./connections.js";
import updateSchool from "./update.js";

export default {
  connections: schoolConnections,
  create: createSchool,
  delete: deleteSchool,
  get: getSchools,
  restore: restoreSchool,
  update: updateSchool,
};
