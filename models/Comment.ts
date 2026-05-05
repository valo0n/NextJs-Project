import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommentDoc extends Document {
  text: string;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<ICommentDoc>(
  {
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

const Comment: Model<ICommentDoc> =
  mongoose.models.Comment || mongoose.model<ICommentDoc>("Comment", CommentSchema);

export default Comment;
