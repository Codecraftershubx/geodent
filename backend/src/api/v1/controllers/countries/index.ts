import createCountry from "./create.js";
import countryConnections from "./connections.js";
import deleteCountry from "./delete.js";
import getCountries from "./read.js";
import restoreCountry from "./restore.js";
import updateCountry from "./update.js";

export default {
  connections: countryConnections,
  create: createCountry,
  delete: deleteCountry,
  get: getCountries,
  restore: restoreCountry,
  update: updateCountry,
};
