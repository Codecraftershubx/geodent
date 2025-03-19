import addressRouter from "./addresses.js";
import authRouter from "./auth.js";
import amenitiesRouter from "./amenities.js";
import citiesRouter from "./cities.js";
import countriesRouter from "./countries.js";
import documentRouter from "./documents.js";
import roomsRouter from "./rooms.js";
import schoolsRouter from "./schools.js";
import statesRouter from "./states.js";
import tagsRouter from "./tags.js";
import usersRouter from "./users.js";

export default {
  address: addressRouter,
  auth: authRouter,
  amenities: amenitiesRouter,
  cities: citiesRouter,
  countries: countriesRouter,
  document: documentRouter,
  rooms: roomsRouter,
  schools: schoolsRouter,
  states: statesRouter,
  tags: tagsRouter,
  users: usersRouter,
};
