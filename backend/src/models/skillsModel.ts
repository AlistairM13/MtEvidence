import mongoose, { Schema, Document, Types } from "mongoose";

export interface JournalEntry extends Document {
  timestamp: number;
  entry: string;
}

export interface SkillsModel extends Document {
  name: string;
  imageInHead: string;
  progress: number;
  userId: Types.ObjectId;
  journal: JournalEntry[];
}

const SkillsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a skill name"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please link the skill to a user"],
    },
    imageInHead: {
      type: String,
      required: [true, "Please add the goal for the skills"],
    },
    progress: {
      type: Number,
      default: 0,
    },
    journal: {
      type: [
        {
          timestamp: Number,
          entry: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

SkillsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    // eslint-disable-next-line no-param-reassign
    delete ret._id;
  },
});
SkillsSchema.set("toJSON", { virtuals: true });

// Export the model and return your IAppUser interface
export default mongoose.model<SkillsModel>("Skills", SkillsSchema);
