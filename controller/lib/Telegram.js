const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helper");

const MY_TOKEN = process.env.TELE_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText) {
  return axiosInstance
    .get("sendMessage", {
      chat_id: chatId || MY_GROUP_CHAT_ID,
      text: messageText,
    })
    .catch((ex) => {
      errorHandler(ex, "sendMessage", "axios");
    });
}

async function handleMessage(messageObj) {
  const messageText = messageObj.text || "";

  if (!messageText) {
    errorHandler("messageText is empty", "handleMessage");
    return ""; // Return empty string
  }

  // Save user input in a variable
  const userInput = messageText.trim(); // Trim to remove leading/trailing whitespaces

  try {
    const chatId = messageObj.chat.id;
    if (chatId === 5160219595 || chatId === -4064546335) {
      if (userInput.charAt(0) === "/") {
        const command = userInput.substring(1);

        switch (command) {
          case "start":
            return sendMessage(
              chatId,
              `Welcome to bot manager
              Use /stock_Number to Enter Stock Number
              Use /contract_Number to Enter Contract Number,
              Use /season to Enter Season`
            );
          case "help":
            return sendMessage(
              chatId,
              `How can I help you?
            Those commands that you can use:
            /start - to start the bot
            /help - to see all commands`
            );

          case "stock_Number":
            return sendMessage(chatId, `Enter Stock Number`);
          case "contract_Number":
            return sendMessage(chatId, `Enter Contract Number`);
          case "season":
            return sendMessage(chatId, `Enter Season`);
          default:
            return sendMessage(
              chatId,
              "Unknown command, Please type /help to see all commands"
            );
        }
      } else {
        // If it's not a command, save the user input or process it as needed
        // For example, you can save it in a database or perform some other action
        // Here, I'm just returning the user input in a response message
        return sendMessage(chatId, `You entered: ${userInput}`);
      }
    } else {
      return sendMessage(chatId, "You are not authorized to use this bot");
    }
  } catch (ex) {
    errorHandler(ex, "handleMessage");
  }
}

module.exports = { sendMessage, handleMessage };
