import authRouter from "./auth.js";
import amenitiesRouter from "./amenities.js";
import citiesRouter from "./cities.js";
import countriesRouter from "./countries.js";
import schoolsRouter from "./schools.js";
import statesRouter from "./states.js";
import usersRouter from "./users.js";

export default {
  auth: authRouter,
  amenities: amenitiesRouter,
  cities: citiesRouter,
  countries: countriesRouter,
  schools: schoolsRouter,
  states: statesRouter,
  users: usersRouter,
};
