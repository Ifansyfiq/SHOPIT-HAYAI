import mongoose from 'mongoose';
import products from './data.js';
import Product from '../models/products.js';

const SeedProduct = async () => {
    try {

        await mongoose.connect("mongodb://127.0.0.1:27017/shopit-hayai")

        // Delete all the data from the database
        await Product.deleteMany();
        console.log('Data deleted successfully');

        // Insert the data into the database
        await Product.insertMany(products);
        console.log('Data import success');

        process.exit();
    } 
    catch (error) {
        console.log(error.message);
        process.exit();
    }
};

SeedProduct();