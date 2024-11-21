import { model, models, Schema } from "mongoose";

const noteSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
    content: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = models.Note || model("Note", noteSchema);

export default Note;
