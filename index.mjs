import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const PORT = 3000;
const app = express();

import grades from "./routes/grades.mjs";
import grades_agg from "./routes/grades_agg.mjs";



app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API.");
});

app.use("/grades", grades);
app.use("/grades_agg", grades_agg);

// this connects to Mongoose.
await mongoose.connect(process.env.ATLAS_URI);


// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
