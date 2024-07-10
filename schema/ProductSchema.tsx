import { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  stock: {
    type: Boolean,
    default: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
});
