import { stripe } from "../lib/stripe";

export const createPaymentIntent = async (accountId: string, amount: number) => {
    try{
        const payIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            description: "test payment for fraud detection"
        },{
            stripeAccount: accountId
        })

        return payIntent

        console.log("Payment Intent created", payIntent.id)
    } catch (error){
        console.error("Error creating payment Intent", error)
    }
}

export const generatePaymentIntents = async ( accountId: string, count: number = 10) =>{
    const result = []

    for (let i = 0; i < count; i++){
        const randomAmount = Math.floor(Math.random()* 10000) + 100 // $1 -$100
        const payment = await createPaymentIntent(accountId, randomAmount)
        result.push(payment);
    }

    return result
}
