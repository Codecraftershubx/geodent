import authRouter from "./auth.js";
import amenitiesRouter from "./amenities.js";
import countriesRouter from "./countries.js";
import statesRouter from "./states.js";
import usersRouter from "./users.js";

export default {
  auth: authRouter,
  amenities: amenitiesRouter,
  countries: countriesRouter,
  states: statesRouter,
  users: usersRouter,
};
