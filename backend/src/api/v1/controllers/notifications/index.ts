import createNotification from "./create.js";
import deleteNotification from "./delete.js";
import readNotification from "./read.js";
import restoreNotification from "./restore.js";
import updateNotification from "./update.js";

export default {
  create: createNotification,
  delete: deleteNotification,
  get: readNotification,
  restore: restoreNotification,
  update: updateNotification,
};
