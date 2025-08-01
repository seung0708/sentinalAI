import Stripe from 'stripe'

let stripeInstance: Stripe | null = null;

export function getStripe() {
    if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-05-28.basil'
        });
    }
    return stripeInstance;
}