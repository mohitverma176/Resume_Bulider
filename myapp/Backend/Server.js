import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectdb } from "./config/db.js";
import { userRouter } from "./routes/userRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import resumeRouter from "./routes/resumeRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectdb();

app.use("/api/auth", userRouter);
app.use("/api/resume", resumeRouter);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(PORT, () => {
  console.log(`Server is starting on http://localhost:${PORT}`);
});
