import addressRouter from "./addresses.js";
import authRouter from "./auth.js";
import amenitiesRouter from "./amenities.js";
import blocksRouter from "./blocks.js";
import citiesRouter from "./cities.js";
import countriesRouter from "./countries.js";
import documentRouter from "./documents.js";
import flatsRouter from "./flats.js";
import listingsRouter from "./listings.js";
import roomsRouter from "./rooms.js";
import schoolsRouter from "./schools.js";
import statesRouter from "./states.js";
import tagsRouter from "./tags.js";
import usersRouter from "./users.js";

export default {
  address: addressRouter,
  auth: authRouter,
  amenities: amenitiesRouter,
  blocks: blocksRouter,
  cities: citiesRouter,
  countries: countriesRouter,
  document: documentRouter,
  flats: flatsRouter,
  listings: listingsRouter,
  rooms: roomsRouter,
  schools: schoolsRouter,
  states: statesRouter,
  tags: tagsRouter,
  users: usersRouter,
};
