import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    templateData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    strict: false, // createdAt, updatedAt will be added
    timestamps: true,
    minimize: false,
  }
);

const Template = mongoose.model("Template", templateSchema);
export default Template;
