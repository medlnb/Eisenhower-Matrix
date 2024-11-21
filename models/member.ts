import { model, models, Schema } from "mongoose";

const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  matrixTasks: {
    type: [
      {
        content: {
          type: String,
        },
        title: {
          type: String,
          required: true,
        },
        container: {
          type: String,
          required: true,
          alt: [
            "ImportUrgant",
            "ImportNotUrgant",
            "NotImportUrgant",
            "NotImportNotUrgant",
          ],
        },
      },
    ],
    default: [],
  },
  folders: {
    type: [String],
    default: [],
  },
});

const Member = models.Member || model("Member", MemberSchema);

export default Member;
