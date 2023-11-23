const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helper");

const MY_TOKEN = process.env.TELE_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

let userResponses = {}; // Store user responses in a dictionary

function sendMessage(chatId, messageText) {
  return axiosInstance
    .get("sendMessage", {
      chat_id: chatId,
      text: messageText,
    })
    .catch((ex) => {
      errorHandler(ex, "sendMessage", "axios");
    });
}

async function handleMessage(messageObj) {
  const messageText = messageObj.text || "";
  const chatId = messageObj.chat.id;

  if (!messageText) {
    errorHandler("messageText is empty", "handleMessage");
    return ""; // Return empty string
  }

  const userInput = messageText.trim();

  try {
    if (chatId === 5160219595 || chatId === -4064546335) {
      if (userInput.charAt(0) === "/") {
        const command = userInput.substring(1);

        switch (command) {
          // Existing cases...

          case "stock_Number":
            userResponses[chatId] = { stockNumber: true };
            return sendMessage(chatId, `Enter Stock Number`);

          case "contract_Number":
            userResponses[chatId] = { contractNumber: true };
            return sendMessage(chatId, `Enter Contract Number`);

          case "season":
            userResponses[chatId] = { season: true };
            return sendMessage(chatId, `Enter Season`);

          default:
            return sendMessage(
              chatId,
              "Unknown command, Please type /help to see all commands"
            );
        }
      } else {
        // If it's not a command, check if the user is in the process of entering data
        if (userResponses[chatId]) {
          const responseKey = Object.keys(userResponses[chatId])[0];

          // Handle the user response based on the previous command
          switch (responseKey) {
            case "stockNumber":
              // Process stock number (e.g., save it to a database)
              userResponses[chatId] = {};
              return sendMessage(chatId, `Stock Number entered: ${userInput}`);

            case "contractNumber":
              // Process contract number
              userResponses[chatId] = {};
              return sendMessage(
                chatId,
                `Contract Number entered: ${userInput}`
              );

            case "season":
              // Process season
              userResponses[chatId] = {};
              return sendMessage(chatId, `Season entered: ${userInput}`);

            default:
              return sendMessage(chatId, `You entered: ${userInput}`);
          }
        } else {
          // If the user is not in the process of entering data, handle as needed
          return sendMessage(chatId, `You entered: ${userInput}`);
        }
      }
    } else {
      return sendMessage(chatId, "You are not authorized to use this bot");
    }
  } catch (ex) {
    errorHandler(ex, "handleMessage");
  }
}

module.exports = { sendMessage, handleMessage };
