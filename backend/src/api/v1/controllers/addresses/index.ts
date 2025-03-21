import createAddress from "./create.js";
import deleteAddress from "./delete.js";
import readAddress from "./read.js";
import restoreAddress from "./restore.js";
import updateAddress from "./update.js";

export default {
  create: createAddress,
  delete: deleteAddress,
  get: readAddress,
  restore: restoreAddress,
  update: updateAddress,
};
