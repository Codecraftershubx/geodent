import createCity from "./create.js";
import deleteCity from "./delete.js";
import getCities from "./read.js";
import updateCity from "./update.js";

export default {
  create: createCity,
  delete: deleteCity,
  get: getCities,
  update: updateCity,
};
