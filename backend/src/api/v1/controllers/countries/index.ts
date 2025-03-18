import createCountry from "./create.js";
import deleteCountry from "./delete.js";
import getCountries from "./read.js";
import updateCountry from "./update.js";

export default {
  create: createCountry,
  delete: deleteCountry,
  get: getCountries,
  update: updateCountry,
};
