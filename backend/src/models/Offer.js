import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  name: String,
  value_props: [String],
  ideal_use_cases: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Offer", OfferSchema);
