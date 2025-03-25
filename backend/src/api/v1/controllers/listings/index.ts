import createListing from "./create.js";
import deleteListing from "./delete.js";
import listingConnections from "./connections.js";
import readListings from "./read.js";
import restoreListing from "./restore.js";
import updateRoom from "./update.js";

export default {
  connections: listingConnections,
  create: createListing,
  delete: deleteListing,
  get: readListings,
  restore: restoreListing,
  update: updateRoom,
};
