const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema(
  {
    pdf: String,
    title: String,
    email: String,
    domain: String,
    paper_status: {
      type: String,
      default: "In Review Process", // Set your default value here
    },
    comments: String,
  },
  { collection: "PdfDetails" }
);

mongoose.model("PdfDetails", PdfDetailsSchema);
