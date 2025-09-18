import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  intent: String,
  score: Number,
  reasoning: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", ResultSchema);
