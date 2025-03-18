import createAmenities from "./create.js";
import deleteAmenities from "./delete.js";
import readAmenities from "./read.js";
import updateAmenities from "./update.js";

export default {
  create: createAmenities,
  delete: deleteAmenities,
  get: readAmenities,
  update: updateAmenities,
};
