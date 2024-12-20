import { model, models, Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    variances: [
      {
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
        },
        info: {
          type: String,
        },
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: {
        aisle: { type: String, required: true },
        subcategories: { type: String, required: true },
        item: { type: String },
      },
      required: true,
    },
    ingedients: {
      type: [String],
    },
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    // ratings: {
    //   type: [
    //     {
    //       user: { type: Schema.Types.ObjectId, ref: "User" },
    //       rating: { type: Number, min: 1, max: 5 },
    //     },
    //   ],
    //   default: [],
    // },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model("Product", productSchema);

export default Product;
