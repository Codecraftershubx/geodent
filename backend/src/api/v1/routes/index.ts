import authRouter from "./auth.js";
import amenitiesRouter from "./amenities.js";
import usersRouter from "./users.js";

export default {
  auth: authRouter,
  amenities: amenitiesRouter,
  users: usersRouter,
};
