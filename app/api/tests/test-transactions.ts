import { NextResponse } from "next/server";
import { stripe } from "../lib/stripe";
import { testData } from "./test-data";
import Stripe from 'stripe';



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

export const createPaymentIntent = async (accountId: string) => {
    const transactions = testData.filter(transaction => transaction.billing_details?.name == 'John Kim')
    const {amount, currency, billing_details, payment_method} = transactions[0]
    let customer
    try{
        const customersList = await stripe.customers.list({
            stripeAccount: accountId
        })
        console.log('customersList', customersList)
        const testTransactionCustomer = customersList.data.filter(customer => customer.name == billing_details.name)

        if (!testTransactionCustomer[0]?.id) {
            const createCustomer = await stripe.customers.create({
                name: billing_details.name,
                email: billing_details.email,
                phone: billing_details.phone, 
                address: billing_details.address
            }, {
                stripeAccount: accountId
            })

            customer = createCustomer
        } else {
            customer = testTransactionCustomer[0]
        }
        console.log('customer', customer)
        if (!customer || !customer.id) {
            throw new Error("Customer creation failed or missing ID");
        }

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {token: payment_method.token}, //using the test visa card
            billing_details: billing_details
        }, {
            stripeAccount: accountId
        })
        console.log('paymentMethod', paymentMethod)
        if (!paymentMethod|| !paymentMethod.id) {
            throw new Error("PaymentMethod creation failed or missing ID");
        }

        await stripe.paymentMethods.attach(
            paymentMethod.id, 
            {
                customer: customer?.id
            }, {
                stripeAccount: accountId
            }
        )

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            payment_method: paymentMethod.id,
            customer: customer.id,
            confirm: true
        },{
            stripeAccount: accountId
        })
        console.log('paymentIntent', paymentIntent)
        return paymentIntent

        
    } catch (error){
        console.error("Error creating payment Intent", error)
    }
}

// export const generatePaymentIntents = async ( accountId: string) =>{
//     const transactions = testData.filter(transaction => transaction.billing_details?.name == 'John Kim')
//     const results = []
//     for (let i = 0; i < transactions.length; i++){
//         const payment = await createPaymentIntent(accountId, transactions[i])
//         if(!payment) throw new Error('Error when creating payment')
//         results.push(payment);
//     }
//     return results
// }