import { Router } from "express";

import {
  createPost,
  decreament_likes,
  delete_commnet,
  deletePost,
  get_comment,
  getAllPosts,
  increamnet_likes,
} from "../controllers/post.controller.js";
import multer from "multer";
import { commentPost } from "../controllers/user.controller.js";

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({ storage: storage });
router.route("/post").post(uploads.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comment").get(get_comment);
router.route("/delete_comment").delete(delete_commnet);
router.route("/increment_likes").post(increamnet_likes);
router.route("/decreament_likes").post(decreament_likes);

export default router;
