import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductDoc extends Document {
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Product: Model<IProductDoc> =
  mongoose.models.Product || mongoose.model<IProductDoc>("Product", ProductSchema);

export default Product;
