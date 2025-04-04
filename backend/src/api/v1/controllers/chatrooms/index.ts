import createChatroom from "./create.js";
import deleteChatroom from "./delete.js";
import connections from "./connections.js";
import readChatrooms from "./read.js";
import restoreChatroom from "./restore.js";
import updateChatroom from "./update.js";

// messages
import createMessage from "./messages/create.js";
import readMessages from "./messages/read.js";
import updateMessage from "./messages/update.js";
import deleteMessage from "./messages/delete.js";
import restoreMessage from "./messages/restore.js";

export default {
  connections,
  create: createChatroom,
  delete: deleteChatroom,
  get: readChatrooms,
  messages: {
    create: createMessage,
    delete: deleteMessage,
    get: readMessages,
    restore: restoreMessage,
    update: updateMessage,
  },

  restore: restoreChatroom,
  update: updateChatroom,
};
