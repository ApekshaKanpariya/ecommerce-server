import { Document, Types } from 'mongoose';

interface User extends Document {
    name: string;
    email: string;
    password: string;
    cart: {
        product: Types.ObjectId;
        quantity: number;
    }[];
    wishlist: Types.ObjectId[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}