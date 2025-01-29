import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishyear: {
      type: Number,
      required: true,
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    },


  },
  {
    timeStamps: true,
  }
);
export const book = mongoose.model("mybook", bookSchema);
