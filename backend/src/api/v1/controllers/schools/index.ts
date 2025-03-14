import createSchool from "./create.js";
import deleteSchool from "./delete.js";
import getSchools from "./read.js";
import updateSchool from "./update.js";

export default {
  create: createSchool,
  delete: deleteSchool,
  get: getSchools,
  update: updateSchool,
};
