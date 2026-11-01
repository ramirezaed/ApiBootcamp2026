import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/db";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Docs is running on http://${HOST}:${PORT}/api-docs`);
});
