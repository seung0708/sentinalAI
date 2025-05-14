import { stripe } from "@/app/api/lib/stripe";

export const createTransaction = async (accountId: string, amount: number = 5000) =>{
    try{
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
        description: "Test payment for fraud detection data set",
      }, {
        stripeAccount: accountId
      })

      console.log("created payment intent", paymentIntent.id)
      return paymentIntent
    } catch (error){
        console.error("Error creating PaymentIntent:", error)
    }
}