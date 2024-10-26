import express from 'express';
import { authMiddleware } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get wishlist items
router.get('/', authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.wishlist);
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
});

// Add item to wishlist
router.post('/add/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        // @ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // @ts-ignore
        if (!user.wishlist.includes(productId)) {
            // @ts-ignore
            user.wishlist.push(productId);
            await user.save();
        }

        res.json(user.wishlist);
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
});

// Remove item from wishlist
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        // @ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
});

// Clear wishlist
router.delete('/clear', authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.wishlist = [];
        await user.save();
        res.json({ message: 'Wishlist cleared successfully' });
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
});

export default router;