import mongoose from "mongoose";

// schema 
// const learnerSchema = new mongoose.Schema ({
//     LearnersWithOver70: Number,
//     totalLearners: Number,
//     percentageOver70: Number
//     })


// this shows sub-schema for scores of each learner
const scoreSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["quiz", "exam", "homework"], 
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0, 
  },
});

// this shows the schema for grades
const gradeSchema = new mongoose.Schema({
  learner_id: {
    type: String,
    required: true,
    unique: true, 
  },
  scores: {
    type: [scoreSchema], 
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "A learner must have at least one score.",
    },
  },
  class_id: {
    type: Number,
    required: true,
  },
});

// this creates a single-field index on `class_id`
gradeSchema.index({ class_id: 1 });

// this creates a single-field index on `learner_id`
gradeSchema.index({ learner_id: 1 });

// this creates a compound index on `learner_id` and `class_id` both in ascending order
gradeSchema.index({ learner_id: 1, class_id: 1 });





 //const Grade = mongoose.model("Grade", gradeSchema, "grades");
 //export default Grade;

// module.exports = Grade;


export default mongoose.model("Grade", gradeSchema);