import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  industry: String,
  location: String,
  linkedin_bio: String,
  raw: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Lead", LeadSchema);
