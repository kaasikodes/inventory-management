import express from "express";
import config from "./_config";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error";
import v1Routes from "./routes/v1";
import { AppError } from "./types/error";
import cors from "cors";

const { port, corsAcceptedOrigins } = config;
const app = express();
const router = express.Router();

// TODO: STarts here, also work on restucturing app and using the paths, refactor to be cleaner, implement try catches so err is propogated
// // custom middleware logger
// app.use(logger);

// // Handle options credentials check - before CORS!
// // and fetch cookies credentials requirement
// app.use(credentials);

// // Cross Origin Resource Sharing
app.use(
  cors({
    origin: corsAcceptedOrigins,
    // origin: "*",
    // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// // built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// TODO: STarts here

app.use(express.json());
//middleware for cookies
app.use(cookieParser());

app.listen(port, () => {
  v1Routes(router);
  app.use("/v1", router);
  app.use("/address", (request, response) => {
    // write logic to make request to external api

    const data = {};
    response.status(200).json({
      data,
    });
  });
  app.all("*", (request, response) => {
    throw new AppError("Invalid route.", 404);
  });
  app.use(errorHandler);
  console.log(`Server running on port ${port}`);
});
