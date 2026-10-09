
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ""
    },
    sellerName: {
      type: String,
      default: ""
    },
    sellerEmail: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Book || mongoose.model("Book", bookSchema);