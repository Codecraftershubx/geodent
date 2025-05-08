import login from "./login.js";
import logout from "./logout.js";
import refresh from "./refreshAccesstoken.js";
import signup from "./signup.js";

export default {
  logout,
  login,
  refreshAccessToken: refresh,
  signup,
};
