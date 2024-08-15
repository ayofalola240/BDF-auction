import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler } from "@e-mart/common";
import swaggerUi from "swagger-ui-express";
import swaggerAutogen from "swagger-autogen";
import authRouter from "./routers/auth";
import path from "path";
import dotenv from "dotenv";
import passport from "./config/passport.config";
import bodyParser from "body-parser";

const swagger = swaggerAutogen();

dotenv.config();

const app = express();

const corsOptions = {
  //   origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());

// SESSION SETUP
app.set("trust proxy", true);
app.use(
  cookieSession({
    name: "session",
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
);

// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use("/api/v1/auth", authRouter);

// SWAGGER CONFIG
const config = {
  info: {
    title: "Auction API Documentation",
    description: "These are the endpoints currently available in the backend",
  },
  host: process.env.MY_BASE_URL || "localhost:4000",
  schemes: ["http"],
};

const outputFile = path.join(__dirname, "..", "./swagger.json");
const endpointsFiles = ["./routers/auth.ts"];

swagger(outputFile, endpointsFiles, config).then(async () => {
  await import("./index");
});
const swaggerDocument = require(outputFile);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
