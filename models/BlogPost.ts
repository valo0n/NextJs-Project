import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPostDoc extends Document {
  title: string;
  excerpt: string; // paragrafi i shkurter qe shfaqet
  content?: string; // permbajtja e plote (opsionale)
  image?: string;
  category: string;
  author: string;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPostDoc>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String },
    image: { type: String },
    category: { type: String, default: "General" },
    author: { type: String, default: "Admin" },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const BlogPost: Model<IBlogPostDoc> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPostDoc>("BlogPost", BlogPostSchema);

export default BlogPost;
