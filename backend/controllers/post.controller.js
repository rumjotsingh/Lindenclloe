import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const createPost = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const posts = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      filetype: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await posts.save();
    return res.status(200).json({ message: "Post created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { token, post_id } = req.body;

    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "unauthorized" });
    }
    await Post.deleteOne({ _id: post_id });
    return res.json({ message: " post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const get_comment = async (req, res) => {
  try {
    const { post_id } = req.query;
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "username name"
    );

    return res.json(comments.reverse());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const delete_commnet = async (req, res) => {
  try {
    const { token, commnet_id } = req.body;
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const commnet = await Comment.findOne({ _id: commnet_id });
    if (!commnet) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (commnet.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "unauthorized" });
    }
    await Comment.deleteOne({ _id: commnet_id });
    return res.json({ message: "Comment Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const increamnet_likes = async (req, res) => {
  try {
    const { post_id } = req.body;
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }
    post.likes = post.likes + 1;

    await post.save();
    return res.json({ message: "Likes Increamneted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const decreament_likes = async (req, res) => {
  try {
    const { post_id } = req.body;
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }
    post.dislikes += 1;

    // Only decrement likes if it's above zero

    await post.save();
    return res.json({ message: "Dislikes Increamneted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
