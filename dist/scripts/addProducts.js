"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const faker_1 = require("@faker-js/faker");
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const generateDummyProduct = () => {
    return {
        name: faker_1.faker.commerce.productName(),
        description: faker_1.faker.commerce.productDescription(),
        price: parseFloat(faker_1.faker.commerce.price()),
        image: faker_1.faker.image.url(),
        category: faker_1.faker.commerce.department(),
        stock: faker_1.faker.number.int({ min: 0, max: 100 }),
    };
};
const seedProducts = (numProducts) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < numProducts; i++) {
            const product = generateDummyProduct();
            yield axios_1.default.post(`${apiUrl}/products`, product);
            console.log(`Inserted product: ${product.name}`);
        }
        console.log(`Successfully inserted ${numProducts} products.`);
    }
    catch (error) {
        console.error('Error inserting products:', error);
    }
});
// Seed 50 dummy products
seedProducts(50);
