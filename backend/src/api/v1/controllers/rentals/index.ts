import createRental from "./create.js";
import deleteRental from "./delete.js";
import readRentals from "./read.js";
import restoreRental from "./restore.js";
import rentalConnections from "./connections.js";
import updateRental from "./update.js";

export default {
  connection: rentalConnections,
  create: createRental,
  delete: deleteRental,
  get: readRentals,
  restore: restoreRental,
  update: updateRental,
};
