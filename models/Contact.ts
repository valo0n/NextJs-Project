import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactDoc extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContactDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const Contact: Model<IContactDoc> =
  mongoose.models.Contact ||
  mongoose.model<IContactDoc>("Contact", ContactSchema);

export default Contact;
