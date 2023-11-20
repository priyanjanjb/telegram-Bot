const { handleMessage, sendMessage } = require("./lib/Telegram");
const { errorHandler } = require("./lib/helper");

async function handler(req, method) {
  try {
    if (method === "GET") {
      return "GET request received";
    }

    const { body } = req;
    if (body && body.message) {
      const messageObj = body.message;
      await handleMessage(messageObj);
      return "Success";
    }
    return "unknown request";
  } catch (ex) {
    errorHandler(ex, "handler");
  }
}

module.exports = { handler };
