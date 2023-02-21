import mongoose, { Types } from "mongoose";
import Users from "./Users";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Users.findById(value),
      message: "User does not exist",
    },
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    required: true,
  },
});

const taskHistory = mongoose.model("taskHistory", TaskSchema);
export default taskHistory;
