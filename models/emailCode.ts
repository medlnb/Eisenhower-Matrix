import { model, models, Schema } from "mongoose";

const emailCodeSchame = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Member",
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  triesLeft: {
    type: Number,
    default: 3,
  },
});

const EmailCode = models.EmailCode || model("EmailCode", emailCodeSchame);

export default EmailCode;
