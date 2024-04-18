import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxLength: [5, "Product price cannot exceed 5 characters"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: { //public id of the image
            type: String,
            required: true
        },
        url: { //url of the image
            type: String,
            required: true
        },
    }],
    category: {
        type: String,
        required: [true, "Please select category for this product"],
        enum: {
            values:
                [
                    "Electronics",
                    "Cameras",
                    "Laptops",
                    "Accessories",
                    "Headphones",
                    "Food",
                    "Books"
                ],
            message: "Please select correct category for product"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
    },
    numOfReviews: { //number of reviews
        type: Number,
        default: 0
    },
    reviews: [ //user reviewed the product
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: { //user who created the product
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
},
    { timestamps: true } //created at and updated at
);

export default mongoose.model("Product", productSchema);