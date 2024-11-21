import { model, models, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
    title: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      // default: false,
    },
    folder: {
      type: String,
    },
    checkedDaily: {
      type: Date,
      // default: new Date("1900-01-01"),
    },
  },
  {
    timestamps: true,
  }
);

const Task = models.Task || model("Task", taskSchema);

export default Task;
