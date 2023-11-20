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
    const collection = db.collection("chatData"); //get all user response data

    // Handle POST requests
    app.post("*", async (req, res) => {
      console.log(req.body); // Show the telegram request

      // Insert the request body into MongoDB
      collection.insertOne(req.body, (insertErr, result) => {
        if (insertErr) {
          console.error(insertErr);
        } else {
          console.log("Data inserted into MongoDB:", result.ops[0]);
        }
      });

      const response = await handler(req, "POST");
      res.send(response); // Send a single response for the POST request
    });

    // Handle GET requests to retrieve all data
    app.get("/getChatData", async (req, res) => {
      console.log("GET request received");

      // Retrieve data from MongoDB
      collection.find().toArray((findErr, data) => {
        if (findErr) {
          console.error(findErr);
          res.status(500).send("Error retrieving data from MongoDB");
        } else {
          console.log("Data retrieved from MongoDB:", data);
          res.json(data); // Send the retrieved data as a JSON response
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
