import Product from '../models/products.js';
import ErrorHandler from '../utils/errorHandler.js';


// create new Product => /api/v1/products
export const getProducts = async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        products
    });
};

// create new Product => /api/v1/admin/products
export const newProducts = async (req, res) => {
    const product = await Product.create(req.body)

    res.status(200).json({
        product
    });
};

// get single product details => /api/v1/products/:id
export const getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
};

// update product => /api/v1/products/:id
export const updateProduct = async (req, res) => {
    let product = await Product.findById(req?.params?.id); // check if product exists

    if (!product) {
        return res.status(404).json({
            message: 'Product not found with this ID',
        });
    };

    // product exists, update it
    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { 
        new: true 
    });

    res.status(200).json({
        product,
    });
};

// delete product => /api/v1/products/:id
export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req?.params?.id); // check if product exists

    if (!product) {
        return res.status(404).json({
            message: 'Product not found with this ID',
        });
    };

    // product exists, delete it
    await product.deleteOne();

    res.status(200).json({
        message: 'Product deleted successfully',
    });
};