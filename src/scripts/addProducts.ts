import axios from 'axios';
import { faker } from '@faker-js/faker';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Product {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
}

const generateDummyProduct = (): Product => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        image: faker.image.url(),
        category: faker.commerce.department(),
        stock: faker.number.int({ min: 0, max: 100 }),
    };
};

const seedProducts = async (numProducts: number) => {
    try {
        for (let i = 0; i < numProducts; i++) {
            const product = generateDummyProduct();
            await axios.post(`${apiUrl}/products`, product);
            console.log(`Inserted product: ${product.name}`);
        }
        console.log(`Successfully inserted ${numProducts} products.`);
    } catch (error) {
        console.error('Error inserting products:', error);
    }
};

// Seed 50 dummy products
seedProducts(50);