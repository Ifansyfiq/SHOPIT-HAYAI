import Product from '../models/products.js';


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
export const getProductDetails = async (req, res) => {
    const product = await Product.findById(req?.params?.id);

    res.status(200).json({
        product,
    });
};