import authControllers from "./auth/index.js";
import amenitiesControllers from "./amenities/index.js";
import countriesControllers from "./countries/index.js";
import statesControllers from "./states/index.js";
import usersControllers from "./users/index.js";

export default {
  auth: authControllers,
  amenities: amenitiesControllers,
  countries: countriesControllers,
  states: statesControllers,
  users: usersControllers,
};
