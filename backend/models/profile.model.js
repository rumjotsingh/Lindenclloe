import mongoose from "mongoose";
const educationScheama = new mongoose.Schema({
  school: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  fieldofStudy: {
    type: String,
    required: true,
  },
});
const workSchema = new mongoose.Schema({
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  years: {
    type: String,
    default: "",
  },
});
const ProfileScheama = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bio: {
    type: String,
    default: "",
  },
  currentpost: {
    type: String,
    default: "",
  },
  pastwork: {
    type: [workSchema],
    default: [],
  },
  education: {
    type: [educationScheama],
    default: [],
  },
});
const Profile = mongoose.model("Profile", ProfileScheama);
export default Profile;
