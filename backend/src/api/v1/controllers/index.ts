import addressControllers from "./addresses/index.js";
import authControllers from "./auth/index.js";
import amenitiesControllers from "./amenities/index.js";
import blocksControllers from "./blocks/index.js";
import citiesControllers from "./cities/index.js";
import countriesControllers from "./countries/index.js";
import documentsControllers from "./documents/index.js";
import flatsControllers from "./flats/index.js";
import listingsControllers from "./listings/index.js";
import likesControllers from "./likes/index.js";
import reviewsControllers from "./reviews/index.js";
import roomsControllers from "./rooms/index.js";
import schoolsControllers from "./schools/index.js";
import statesControllers from "./states/index.js";
import tagsControllers from "./tags/index.js";
import usersControllers from "./users/index.js";

export default {
  address: addressControllers,
  auth: authControllers,
  amenities: amenitiesControllers,
  blocks: blocksControllers,
  cities: citiesControllers,
  countries: countriesControllers,
  documents: documentsControllers,
  flats: flatsControllers,
  likes: likesControllers,
  listings: listingsControllers,
  reviews: reviewsControllers,
  rooms: roomsControllers,
  schools: schoolsControllers,
  states: statesControllers,
  tags: tagsControllers,
  users: usersControllers,
};
