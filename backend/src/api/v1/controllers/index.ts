import authControllers from "./auth/index.js";
import amenitiesControllers from "./amenities/index.js";
import citiesControllers from "./cities/index.js";
import countriesControllers from "./countries/index.js";
import schoolsControllers from "./schools/index.js";
import statesControllers from "./states/index.js";
import usersControllers from "./users/index.js";

export default {
  auth: authControllers,
  amenities: amenitiesControllers,
  cities: citiesControllers,
  countries: countriesControllers,
  schools: schoolsControllers,
  states: statesControllers,
  users: usersControllers,
};
