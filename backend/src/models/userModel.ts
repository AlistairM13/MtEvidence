import mongoose, { Schema, Document } from "mongoose";

export interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a user name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    // eslint-disable-next-line no-param-reassign
    delete ret._id;
  },
});
UserSchema.set("toObject", { virtuals: true });

// Export the model and return your IAppUser interface
export default mongoose.model<UserModel>("User", UserSchema);
