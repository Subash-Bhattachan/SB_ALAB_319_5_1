import express from "express";
//import db from "../db/conn.mjs";
//import { ObjectId } from "mongodb";
import Grade from "../models/Grade.mjs";

const router = express.Router();

/**
 * It is not best practice to seperate these routes
 * like we have done here. This file was created
 * specifically for educational purposes, to contain
 * all aggregation routes in one place.
 */

/**
 * Grading Weights by Score Type:
 * - Exams: 50%
 * - Quizes: 30%
 * - Homework: 20%
 */

// /grades_agg/stats
router.get("/stats", async (req, res) => {
  //const collection = db.collection("grades");

  const result = await Grade
  .aggregate([
    { $unwind: "$scores" },
    {
      $group: {
        _id: "$learner_id",
        quiz: {
          $push: {
            $cond: [
              { $eq: ["$scores.type", "quiz"] },
              "$scores.score",
              "$$REMOVE",
            ],
          },
        },
        exam: {
          $push: {
            $cond: [
              { $eq: ["$scores.type", "exam"] },
              "$scores.score",
              "$$REMOVE",
            ],
          },
        },
        homework: {
          $push: {
            $cond: [
              { $eq: ["$scores.type", "homework"] },
              "$scores.score",
              "$$REMOVE",
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        avg: {
          $sum: [
            { $multiply: [{ $avg: "$exam" }, 0.5] },
            { $multiply: [{ $avg: "$quiz" }, 0.3] },
            { $multiply: [{ $avg: "$homework" }, 0.2] },
          ],
        },
      },
    },
    { $match: { avg: { $gte: 70 }}},
  ]);
  console.log(result);
  //.toArray();
  //const totalLearners = await Grade.countDocuments(); 
  const totalLearners = (await Grade.distinct("learner_id")).length;
  //const totalLearners = await Grade.distinct("learner_id").then((ids) => ids.length);
  const learnersWithOver70 = result.length; 
  const percentageOver70 = ((learnersWithOver70 / totalLearners) * 100 ).toFixed(2);

  if (!result) res.send("Not found").status(404);
  else res.send({learnersWithOver70, totalLearners, percentageOver70}).status(200);
})




router.get("/stats/:id", async (req, res) => {

  const { id } = req.params; // to extract class_id 

  // to make sure id is a number 
  const classId = parseInt(id);

  //let collection = await db.collection("grades");

  const result = await Grade
    .aggregate([
      {
        $match: { class_id: classId } 
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$learner_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          student_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
      {
        $match: {
          avg: { $gte: 70 },
        }, 
      },
    ])
    
    console.log(result);
    console.log("Class ID:", id);
    


    const totalLearners = (await Grade.distinct("learner_id", { class_id: classId })).length;
    const learnersWithOver70 = result.length;
    const percentageover70 = ((learnersWithOver70 / totalLearners) * 100).toFixed(2);
  

    if (!result) res.send("Not found").status(404);
    else res.send({learnersWithOver70, totalLearners, percentageover70}).status(200);

});


















// Get the weighted average of a specified learner's grades, per class
router.get("/learner/:id/avg-class", async (req, res) => {
  let collection = await db.collection("grades");

  let result = await collection
    .aggregate([
      {
        $match: { learner_id: Number(req.params.id) },
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ])
    .toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
//module.exports = router;