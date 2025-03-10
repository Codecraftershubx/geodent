import authRouter from "./auth.js";
import amenitiesRouter from "./amenities.js";
import countriesRouter from "./countries.js";
import usersRouter from "./users.js";

export default {
  auth: authRouter,
  amenities: amenitiesRouter,
  countries: countriesRouter,
  users: usersRouter,
};
