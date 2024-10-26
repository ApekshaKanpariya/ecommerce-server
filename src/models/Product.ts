import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
        maxlength: [100, 'Product name  cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price must be a positive number'],
    },
    image: {
        type: String,
        required: [true, 'Please provide a product image URL'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a product category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please provide the stock quantity'],
        min: [0, 'Stock quantity must be a non-negative number'],
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;