import express from "express";
import esm from "express-status-monitor";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import middleware from "./middleware";
import authRoutes from "./routes/auth";
import incidentRoutes from "./routes/incident";
import noteRoutes from "./routes/note";
import userRoutes from "./routes/user";

const app = express();

app.use(esm());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/incidents", incidentRoutes);
app.use("/incidents", noteRoutes);

app.use(middleware.unknownEndPointHandler);
app.use(middleware.errorHandler);

export default app;
