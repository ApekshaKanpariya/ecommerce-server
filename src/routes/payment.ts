import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: '2022-08-01'});

router.post('/create-payment-intent', async (req, res) => {
    try {
        const {amount} = req.body;
        console.log("=>(payment.ts:10) amount", amount);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: +(amount * 100).toFixed(2), // Stripe expects the amount in cents
            currency: 'usd',
        });

        res.json({clientSecret: paymentIntent.client_secret});
    } catch (error) {
        // @ts-ignore
        res.status(500).json({error: error.message});
    }
});

export default router;