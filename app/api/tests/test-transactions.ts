import { getStripe } from "../lib/stripe";
import { testData } from "./test-data";

export const createPaymentIntent = async (accountId: string) => {
    const stripe = getStripe()
    const transactions = testData.filter(transaction => transaction.billing_details?.name == 'Tyler Fox')
    const {amount, currency, billing_details, payment_method} = transactions[1]
    let customer
    try{

        const customersList = await stripe?.customers.list({
            stripeAccount: accountId
        })
        
        const testTransactionCustomer = customersList?.data.filter(customer => 
            customer.name == billing_details?.name &&
            customer.email == billing_details?.email &&
            customer.phone == billing_details?.phone
        )
        console.log(testTransactionCustomer)
        if (!testTransactionCustomer?.[0]?.id) {
            const createCustomer = await stripe?.customers.create({
                name: billing_details?.name,
                email: billing_details?.email,
                phone: billing_details?.phone, 
                address: billing_details?.address
            }, {
                stripeAccount: accountId
            })
        
            // Add a small delay to allow propagation
            await new Promise(resolve => setTimeout(resolve, 1000))
        
            // Verify customer was created
            if (createCustomer?.id) {
                // Verify customer was created
                const verifyCustomer = await stripe?.customers.retrieve(createCustomer.id, {
                    stripeAccount: accountId
                });
                customer = verifyCustomer;
            } else {
                throw new Error("Failed to create customer");
            }
        } else {
            customer = testTransactionCustomer?.[0]
        }
        if (!customer || !customer.id) {
            throw new Error("Customer creation failed or missing ID");
        }

        const paymentMethod = await stripe?.paymentMethods.create({
            type: 'card',
            card: {token: payment_method?.token}, //using the test visa card
            billing_details: billing_details
        }, {
            stripeAccount: accountId
        })
        if (!paymentMethod|| !paymentMethod.id) {
            throw new Error("PaymentMethod creation failed or missing ID");
        }

        await stripe?.paymentMethods.attach(
            paymentMethod.id, 
            {
                customer: customer?.id
            }, {
                stripeAccount: accountId
            }
        )

        const paymentIntent = await stripe?.paymentIntents.create(
            {
              amount,
              currency: currency as string,
              automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
              },
              payment_method: paymentMethod.id,
              customer: customer.id,
              confirm: true,
              expand: ['charges', 'customer'],
            },
            {
              stripeAccount: accountId,
            }
          );
          
          
          return paymentIntent;

        
    } catch (error){
        console.error("Error creating payment Intent", error)
    }
}
