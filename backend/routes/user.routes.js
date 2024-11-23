import { Router } from "express";
import {
  acceptconnectionRequest,
  DownloadProfile,
  getAllUserProfile,
  getMyConnectionsRequests,
  getuserandprofile,
  getUserProfileAndUserBaseOnUsername,
  login,
  register,
  sendconnectionrequest,
  updateProfileData,
  updateUserProfile,
  uploadprofilepicture,
  whatareMyconnnection,
} from "../controllers/user.controller.js";
import multer from "multer";

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
router
  .route("/update_profile_picture")
  .post(uploads.single("profile_picture"), uploadprofilepicture);
router.route("/user_update").post(updateUserProfile);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/get_user_and_profile").get(getuserandprofile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(DownloadProfile);
router.route("/user/send_connection_request").post(sendconnectionrequest);
router.route("/user/get_connection_request").get(getMyConnectionsRequests);
router.route("/user/user_connnection_request").get(whatareMyconnnection);
router.route("/user/accept_connnection/request").post(acceptconnectionRequest);
router
  .route("/user/get_profile_based_on_username")
  .get(getUserProfileAndUserBaseOnUsername);

export default router;
