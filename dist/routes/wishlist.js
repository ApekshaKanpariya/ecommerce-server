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
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Get wishlist items
router.get('/', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.wishlist);
    }
    catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
}));
// Add item to wishlist
router.post('/add/:productId', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // @ts-ignore
        if (!user.wishlist.includes(productId)) {
            // @ts-ignore
            user.wishlist.push(productId);
            yield user.save();
        }
        res.json(user.wishlist);
    }
    catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
}));
// Remove item from wishlist
router.delete('/remove/:productId', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        yield user.save();
        res.json(user.wishlist);
    }
    catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
}));
// Clear wishlist
router.delete('/clear', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.wishlist = [];
        yield user.save();
        res.json({ message: 'Wishlist cleared successfully' });
    }
    catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
