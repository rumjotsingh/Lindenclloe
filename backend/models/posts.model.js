import mongoose from "mongoose";
const PostSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  media: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  filetype: {
    type: String,
    default: "",
  },
});
const Post = mongoose.model("Post", PostSchema);
export default Post;
