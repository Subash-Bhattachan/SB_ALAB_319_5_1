import express from "express";
import db from "../db/conn.mjs";
//import { ObjectId } from "mongodb";
import Grade from "../models/Grade.mjs";


const router = express.Router();

// Create a single grade entry
// /grades/
router.post("/", async (req, res) => {
 
  let newGrade = new Grade(req.body);

  // rename fields for backwards compatibility
  if (newGrade.student_id) {
    newGrade.learner_id = newGrade.student_id;
    delete newGrade.student_id;
  }

  let result = await newGrade.save();
  res.send(result).status(204);
});



// Get a single grade entry
// /grades/112
router.get("/:id", async (req, res) => {
  
  let result = await Grade.findById(req.params.id);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});



// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {


  let result = await Grade.findByIdAndUpdate(
    req.params.id,
    { $push: { scores: req.body }},
  );

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});



// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {

  let result = await Grade.findByIdAndUpdate(
    req.params.id,
    { $pull: { scores: req.body }},
  );

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});



// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  
  let result = await Grade.findByIdAndDelete(req.params.id);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`learner/${req.params.id}`);
});



// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  
  let query = { learner_id: req.params.id };
  // Check for class_id parameter
  if (req.query.class) query.class_id = Number(req.query.class);

  let result = await Grade.find(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});



// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  

  let result = await Grade.deleteMany({ learner_id: req.params.id });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});



// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  
  let query = { class_id: Number(req.params.id) };

  // Check for learner_id parameter
  if (req.query.learner) query.learner_id = Number(req.query.learner);

  let result = await Grade.find(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});



// Update a class id
router.patch("/class/:id", async (req, res) => {
  
  let result = await Grade.updateMany(
    { class_id: req.params.id },
    { class_id: req.body.class_id }
  );

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


// Delete a class
router.delete("/class/:id", async (req, res) => {
  
  let query = { class_id: Number(req.params.id) };

  let result = await Grade.deleteMany(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
