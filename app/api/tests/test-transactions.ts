import { stripe } from "../lib/stripe";
import { testData } from "./test-data";
import Stripe from 'stripe';

enum PaymentMethodType {
  Card = 'card',
  SepaDebit = 'sepa_debit',
  Ideal = 'ideal',
  Fpx = 'fpx',
}

interface TestDataItem {
    amount: number, 
    currency: string, 
    billing_details: {
        address: {
            city: string, 
            line1: string, 
            postal_code: string, 
            state: string
        },
        email: string,
        name: string,
        phone: string
    }, 
    status: string, 
    payment_method: {
        type: string, 
        token: string
    }
}

const chooseRandomData = (array: TestDataItem[]) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

export const createPaymentIntent = async (accountId: string) => {
    const randomData = chooseRandomData(testData)
    const {amount, currency, billing_details, status, payment_method} = randomData
    try{

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card', 
            card: {token: payment_method.token}, //using the test visa card
            billing_details: {
                address: {
                    city: billing_details.address.city,
                    country: 'US',
                    line1: billing_details.address.line1, 
                    postal_code: billing_details.address.postal_code, 
                    state: billing_details.address.state
                },
                name: billing_details.name, 
                email: billing_details.email, 
                phone: billing_details.phone
                
            }
        }, {
            stripeAccount: accountId
        })

        console.log('paymentMethod created', paymentMethod)

        const payIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            payment_method: paymentMethod.id,
            confirm: true
        },{
            stripeAccount: accountId
        })

        return payIntent

        
    } catch (error){
        console.error("Error creating payment Intent", error)
    }
}

export const generatePaymentIntents = async ( accountId: string, count= 10) =>{
    const result = []
    for (let i = 0; i < count; i++){
        const payment = await createPaymentIntent(accountId)
        result.push(payment);
    }

    return result
}