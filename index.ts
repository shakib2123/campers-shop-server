import express, { Request, Response } from "express";
import mongoose, { model, Schema } from "mongoose";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5000;
import dotenv from "dotenv";

dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome To Campers Shop API Service!",
  });
});

async function main() {
  try {
    // connect to the database
    await mongoose.connect(process?.env?.DB_URL as string);

    // start the express server
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  } catch (err) {
    // log any errors that occur during startup
    console.log(err);
  }
}
main();

// Schemas
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
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
  rating: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

// Models
const Product = model("Product", ProductSchema);
const Order = model("Order", OrderSchema);

app.post("/products", async (req, res) => {
  const product = req.body;
  const result = await Product.create(product);

  res.send({
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

app.get("/products", async (req, res) => {
  const result = await Product.find();
  res.json({
    success: true,
    message: "Products retrieved successfully!",
    data: result,
  });
});
app.get("/products/:id", async (req, res) => {
  console.log("Product Id", req.params.id);
  const result = await Product.findById(req.params.id);
  res.json({
    success: true,
    message: "Product is retrieved successfully!",
    data: result,
  });
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productData = req.body;

    // Find the product by ID and update it
    let result = await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Product updated successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product.",
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Product.findByIdAndDelete(id);
  res.json({
    success: true,
    message: "Product deleted successfully!",
    data: result,
  });
});

app.post("/orders", async (req, res) => {
  const paymentData = req.body;
  const result = await Order.create(paymentData);
  res.json({
    success: true,
    message: "Order successful!",
    data: result,
  });
});

app.put("/products", async (req, res) => {
  try {
    const updatedProductData = req.body;

    // Update quantity for each product
    const updatedResults = await Promise.all(
      updatedProductData.map(async (product) => {
        const existingProduct = await Product.findById(product._id);

        if (!existingProduct) {
          // Handle invalid product ID
          return null;
        }

        existingProduct.quantity -= product.quantity;

        if (existingProduct.quantity <= 0) {
          existingProduct.stock = false;
        }

        return await existingProduct.save();
      })
    );

    res.json({
      success: true,
      message: "Products quantity updated successfully!",
      data: updatedResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating product quantities.",
    });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
    error: err,
  });
});

app.use((req: Request, res: Response, next) => {
  return res.status(401).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
});
