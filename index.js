import express from "express";
import { port, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./route/booksRoute.js";
import cors from "cors";
import userRoute from "./route/userRoute.js";

const app = express();
app.use(express.json());

app.use(cors("*"));

app.use("/books", booksRoute);
app.use("/users", userRoute);

// Default route
app.get("/", (request, response) => {
  console.log(request);
  response;
  return response.status(200).send("Welcome to MERN stack");
});

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(port, () => {
      console.log(`App is listening on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
