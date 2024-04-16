import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/products.js';
import APIFilters from '../utils/apifilters.js';
import ErrorHandler from '../utils/errorHandler.js';


// create new Product => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {
    
    const apiFilters = new APIFilters(Product, req.query).search()

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    res.status(200).json({
        filteredProductsCount,
        products,
    });
});

// create new Product => /api/v1/admin/products
export const newProducts = catchAsyncErrors(async (req, res) => {
    const product = await Product.create(req.body)

    res.status(200).json({
        product
    });
});

// get single product details => /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
});

// update product => /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id); // check if product exists

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    };

    // product exists, update it
    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
        new: true
    });

    res.status(200).json({
        product,
    });
});

// delete product => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req?.params?.id); // check if product exists

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    };

    // product exists, delete it
    await product.deleteOne();

    res.status(200).json({
        message: 'Product deleted successfully',
    });
});