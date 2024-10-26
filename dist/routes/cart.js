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
// Get cart items
router.get('/', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.cart);
    }
    catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
}));
// Add item to cart
router.post('/add', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const existingItem = user.cart.find(item => { var _a; return ((_a = item.product) === null || _a === void 0 ? void 0 : _a.toString()) === productId; });
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            // @ts-ignore
            user.cart.push({ product: productId, quantity });
        }
        yield user.save();
        yield user.populate('cart.product');
        res.json(user.cart);
    }
    catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
}));
// Update cart item quantity
router.put('/update/:productId', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const cartItem = user.cart.find(item => { var _a; return ((_a = item.product) === null || _a === void 0 ? void 0 : _a.toString()) === productId; });
        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }
        cartItem.quantity = quantity;
        yield user.save();
        res.json(user.cart);
    }
    catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
}));
// Remove item from cart
router.delete('/remove/:productId', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.cart = user.cart.filter(item => { var _a; return ((_a = item.product) === null || _a === void 0 ? void 0 : _a.toString()) !== productId; });
        yield user.save();
        res.json(user.cart);
    }
    catch (error) {
        // @ts-ignore
        res.status(400).json({ error: error.message });
    }
}));
// Clear cart
router.delete('/clear', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.cart = [];
        yield user.save();
        res.json({ message: 'Cart cleared successfully' });
    }
    catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
