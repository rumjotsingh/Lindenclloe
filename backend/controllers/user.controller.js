import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import PDFDocumenet from "pdfkit";
import fs from "fs";
import connnectionRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocumenet();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);
  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name:${userData.userId.name}`);
  doc.fontSize(14).text(`UserName:${userData.userId.username}`);
  doc.fontSize(14).text(`Email:${userData.userId.email}`);

  doc.fontSize(14).text(`Bio:${userData.bio}`);
  doc.fontSize(14).text(`Current Position:${userData.currentpost}`);
  doc.fontSize(14).text("Past Work:");
  userData.pastwork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name:${work.company}`);
    doc.fontSize(14).text(`Position:${work.position}`);
    doc.fontSize(14).text(`Years:${work.years}`);
  });
  doc.end();
  return outputPath;
};
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(500).json({ message: "all field are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();
    const newProfile = new Profile({
      userId: newUser._id,
    });
    await newProfile.save();
    return res.json({ message: "the new user is created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ message: "all field are required" });
    }
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({ message: "user doesnot exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password is incorrect" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    await user.save();
    return res.json({ token: token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const uploadprofilepicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message: "profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    // Find the user by token
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    // Check if the username or email already exists in another user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Update user fields
    Object.assign(user, newUserData);
    await user.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getuserandprofile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const userprofile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ profile: userprofile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfiledata } = req.body;
    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(400).json({ message: "User not found" });
    }
    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });
    Object.assign(profile_to_update, newProfiledata);
    await profile_to_update.save();
    return res.json({ message: "Profile Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture "
    );

    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DownloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name  username email profilePicture"
    );
    let outputPath = await convertUserDataTOPDF(userProfile);
    return res.json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const sendconnectionrequest = async (req, res) => {
  try {
    const { token, connectionId } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(400).json({ message: "connnection found" });
    }
    const existingrequest = await connnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingrequest) {
      return res.status(400).json({ message: "Request Already Sent" });
    }
    const request = new connnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    await request.save();
    return res.json({ message: "Request sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getMyConnectionsRequests = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "Usernot found" });
    }
    const connections = await connnectionRequest
      .find({
        userId: user._id,
      })
      .populate("connectionId", "name email username profilePicture");
    return res.json({ connections: connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const whatareMyconnnection = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "Usernot found" });
    }
    const connections = await connnectionRequest
      .find({
        connectionId: user._id,
      })
      .populate("userId", "name email username profilePicture");
    return res.json({ connections: connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const acceptconnectionRequest = async (req, res) => {
  try {
    const { token, requestId, action_type } = req.body;
    console.log(requestId);
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(400).json({ message: "Usernot found" });
    }
    const connection = await connnectionRequest.findOne({ _id: requestId });
    if (!connection) {
      return res.status(400).json({ message: "Connection not found" });
    }
    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }
    await connection.save();
    return res.json({ message: "Connection updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const commentPost = async (req, res) => {
  try {
    const { token, post_id, commentBody } = req.body;
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(400).json({ message: "Usernot found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const commnet = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });
    await commnet.save();
    return res.status(200).json({ message: "Commment Added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUserProfileAndUserBaseOnUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({
      username: username,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ profile: userProfile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
