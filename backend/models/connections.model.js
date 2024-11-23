import mongoose from "mongoose";
const connectionRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});
const connectionRequest = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
export default connectionRequest;
