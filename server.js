import express from "express";

import userRoutes from "./routes/user-routes.js";
import movieRoutes from "./routes/movie-routes.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = ENV_VARS.BACKEND_PORT;

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRoutes);

app.listen(process.env.BACKEND_PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
