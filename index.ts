import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5000;
import dotenv from "dotenv";

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome To Campers Shop API Service!",
  });
});

async function main() {
  try {
    // connect to the database
    await mongoose.connect(process?.env?.DB_URL as string);

    // start the express server
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  } catch (err) {
    // log any errors that occur during startup
    console.log(err);
  }
}
main();

app.post("/products", (req, res) => {
  const product = req.body;
});
app.get("/products", (req, res) => {
  res.json({
    message: "Welcome",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
    error: err,
  });
});

app.use((req: Request, res: Response, next) => {
  return res.status(401).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
});
