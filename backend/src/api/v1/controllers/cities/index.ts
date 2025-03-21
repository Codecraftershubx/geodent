import cityConnections from "./connections.js";
import createCity from "./create.js";
import deleteCity from "./delete.js";
import getCities from "./read.js";
import restoreCity from "./restore.js";
import updateCity from "./update.js";

export default {
  connections: cityConnections,
  create: createCity,
  delete: deleteCity,
  get: getCities,
  restore: restoreCity,
  update: updateCity,
};
