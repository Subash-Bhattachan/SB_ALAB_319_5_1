import mongoose from "mongoose";

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
    type: Number,
    required: true,
    unique: true, 
    min: [0, "learner_id must be greater than or equal to 0"],
    validate: {
      validator: function (v) {
        return v > 0; // meaning to say Learner_id must be >= 0
      },
      message: "A learner_id must be greater than or equal to 0.",
      action: "warn",
    },
    },
    class_id: {
      type: Number,
      required: true,
      min: [0, "class_id must be between 0 and 300"],
      max: [300, "class_id must be between 0 and 300"],
      validate: {
        validator: function (v) {
          return v >= 0 && v <= 300;
        },
        message: "class_id must be between 0 and 300",
        action: "warn",
      
    },
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