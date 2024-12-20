import { model, models, Schema } from "mongoose";

const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: true,
    default: false,
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
});

const Member = models.Member || model("Member", MemberSchema);

export default Member;
