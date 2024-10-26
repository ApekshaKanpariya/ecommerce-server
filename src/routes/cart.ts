import express from 'express';
import { authMiddleware } from '../middleware/auth';
import User from '../models/User';
import Product from "../models/Product";

const router = express.Router();

// Get cart items
router.get('/', authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user.id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.cart);
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
});

// Add item to cart
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        // @ts-ignore
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingItem = user.cart.find(item => item.product?.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // @ts-ignore
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        await user.populate('cart.product');
        res.json(user.cart);
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
});

// Update cart item quantity
router.put('/update/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        // @ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cartItem = user.cart.find(item => item.product?.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        cartItem.quantity = quantity;
        await user.save();
        res.json(user.cart);
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        // @ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        user.cart = user.cart.filter(item => item.product?.toString() !== productId);
        await user.save();
        res.json(user.cart);
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.cart = [];
        await user.save();
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
});

export default router;