require("dotenv").config();

const express = require("express");
const { handler } = require("./controller/index");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 4040;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

const app = express();
app.use(express.json());

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db(DB_NAME);

    // Create collections
    const chatDataCollection = db.collection("chatData");
    const stockDataCollection = db.collection("stockData"); // Updated collection name

    // Handle POST requests
    app.post("*", async (req, res) => {
      console.log(req.body); // Show the telegram request

      // Insert the request body into the "chatData" collection
      chatDataCollection.insertOne(req.body, (insertErr, result) => {
        if (insertErr) {
          console.error(insertErr);
        } else {
          console.log("Data inserted into chatData collection:", result.ops[0]);
        }
      });

      // Extract relevant user response data and insert it into the "stockData" collection
      const { chat, text } = req.body.message || {};
      if (chat && chat.id && text) {
        // Check if the user's response does not start with '/'
        if (!text.startsWith("/")) {
          const userResponse = {
            chatId: chat.id,
            text,
          };

          try {
            const result = await stockDataCollection.insertOne(userResponse);
            console.log(
              "User response inserted into stockData collection:",
              result.ops[0]
            );
          } catch (insertErr) {
            console.error(insertErr);
            // Handle the error (e.g., send an error response to the user)
          }
        }
      }

      const response = await handler(req, "POST");
      res.send(response); // Send a single response for the POST request
    });

    // Handle GET requests to retrieve all data from the "stockData" collection
    app.get("/getStockData", async (req, res) => {
      // Updated endpoint name
      console.log("GET request received");

      // Retrieve user responses from the "stockData" collection
      stockDataCollection.find().toArray((findErr, data) => {
        if (findErr) {
          console.error(findErr);
          res.status(500).send("Error retrieving stock data from MongoDB");
        } else {
          console.log("Stock data retrieved from MongoDB:", data);
          res.json(data); // Send the retrieved stock data as a JSON response
        }
      });
    });

    app.listen(PORT, function (err) {
      if (err) console.log(err);
      console.log("Server listening on PORT:", PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
