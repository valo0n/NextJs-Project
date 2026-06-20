import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  productId?: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

export interface IOrderDoc extends Document {
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  email?: string;
  stripeSessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrderDoc>(
  {
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    email: { type: String },
    stripeSessionId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const Order: Model<IOrderDoc> =
  mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);

export default Order;
