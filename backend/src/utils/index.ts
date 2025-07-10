import cache from "./Cache.js";
import passwords from "./passwordManager.js";
import resHandlers from "./resHandlers.js";
import storage from "./fileStorage.js";
import text from "./text.js";
import tokens from "./tokens.js";
import { getTokenTimes } from "./tokens.js";

export default {
  handlers: resHandlers,
  passwords,
  storage,
  text,
  tokens,
	getTokenTimes,
  cache,
};
