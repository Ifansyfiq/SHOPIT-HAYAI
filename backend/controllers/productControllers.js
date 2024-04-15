import Product from '../models/products.js';


// create new Product => /api/v1/products
export const getProducts = async (req, res) => {
    res.status(200).json({
        message: 'Get all products'
    });
};

// create new Product => /api/v1/admin/products
export const newProducts = async (req, res) => {
    const product = await Product.create(req.body)

    res.status(200).json({
        product
    });
};