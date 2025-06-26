export const testData = [
  // ✅ NORMAL CUSTOMER: John Kim — consistent billing info, 1 outlier in amount
  {
    amount: 3200,
    currency: 'usd',
    billing_details: {
      name: 'John Kim',
      email: 'john.kim@example.com',
      phone: '+1-555-1001',
      address: {
        line1: '123 Maple Street',
        city: 'Los Angeles',
        state: 'CA',
        postal_code: '90001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 2800,
    currency: 'usd',
    billing_details: {
      name: 'John Kim',
      email: 'john.kim@example.com',
      phone: '+1-555-1001',
      address: {
        line1: '123 Maple Street',
        city: 'Los Angeles',
        state: 'CA',
        postal_code: '90001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },
  {
    amount: 12000, // outlier amount
    currency: 'usd',
    billing_details: {
      name: 'John Kim',
      email: 'john.kim@example.com',
      phone: '+1-555-1001',
      address: {
        line1: '123 Maple Street',
        city: 'Los Angeles',
        state: 'CA',
        postal_code: '90001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_discover' },
  },

  //NORMAL CUSTOMER: Hannah Lee — consistent billing info
  {
    amount: 1500,
    currency: 'usd',
    billing_details: {
      name: 'Hannah Lee',
      email: 'hannah.lee@example.com',
      phone: '+1-555-2002',
      address: {
        line1: '789 Oak Avenue',
        city: 'Seattle',
        state: 'WA',
        postal_code: '98101',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_amex' },
  },
  {
    amount: 1600,
    currency: 'usd',
    billing_details: {
      name: 'Hannah Lee',
      email: 'hannah.lee@example.com',
      phone: '+1-555-2002',
      address: {
        line1: '789 Oak Avenue',
        city: 'Seattle',
        state: 'WA',
        postal_code: '98101',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 8900, // outlier amount
    currency: 'usd',
    billing_details: {
      name: 'Hannah Lee',
      email: 'hannah.lee@example.com',
      phone: '+1-555-2002',
      address: {
        line1: '789 Oak Avenue',
        city: 'Seattle',
        state: 'WA',
        postal_code: '98101',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },

  //FRAUD CUSTOMER: Tyler Fox — mismatched billing
  {
    amount: 8700,
    currency: 'usd',
    billing_details: {
      name: 'Tyler Fox',
      email: 'fox123@maildrop.cc',
      phone: '+1-555-9999',
      address: {
        line1: '432 Random St',
        city: 'Dallas',
        state: 'TX',
        postal_code: '75201',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 9200,
    currency: 'usd',
    billing_details: {
      name: 'Ty Fox',
      email: 'fox_ty@maildrop.cc',
      phone: '+1-555-9090',
      address: {
        line1: '22 Hack Dr',
        city: 'Austin',
        state: 'TX',
        postal_code: '73301',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },

  // FRAUD CUSTOMER: Rachel Moon — rapid frequency (3 transactions)
  {
    amount: 5000,
    currency: 'usd',
    billing_details: {
      name: 'Rachel Moon',
      email: 'moon.r@gmail.com',
      phone: '+1-555-3333',
      address: {
        line1: '456 Sunset Blvd',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 5100,
    currency: 'usd',
    billing_details: {
      name: 'Rachel Moon',
      email: 'moon.r@gmail.com',
      phone: '+1-555-3333',
      address: {
        line1: '456 Sunset Blvd',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },
  {
    id: 'txn_011',
    amount: 5050,
    currency: 'usd',
    billing_details: {
      name: 'Rachel Moon',
      email: 'moon.r@gmail.com',
      phone: '+1-555-3333',
      address: {
        line1: '456 Sunset Blvd',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_amex' },
  },
  {
    id: 'txn_012',
    amount: 2700,
    currency: 'usd',
    billing_details: {
      name: 'Daniel Cho',
      email: 'daniel.cho@example.com',
      phone: '+1-555-4444',
      address: {
        line1: '21 Birch Lane',
        city: 'Denver',
        state: 'CO',
        postal_code: '80203',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    id: 'txn_013',
    amount: 2950,
    currency: 'usd',
    billing_details: {
      name: 'Daniel Cho',
      email: 'daniel.cho@example.com',
      phone: '+1-555-4444',
      address: {
        line1: '21 Birch Lane',
        city: 'Denver',
        state: 'CO',
        postal_code: '80203',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_discover' },
  },
  //FRAUD CUSTOMER: Nina Wells — fake name/address
  {
    amount: 7500,
    currency: 'usd',
    billing_details: {
      name: 'Test User',
      email: 'fake@maildrop.cc',
      phone: '+1-000-0000',
      address: {
        line1: '999 Nowhere',
        city: 'Unknown',
        state: 'ZZ',
        postal_code: '00000',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    id: 'txn_015',
    amount: 25000,
    currency: 'usd',
    billing_details: {
      name: 'Joe S',
      email: 'joespam@mailinator.com',
      phone: '+1-555-1212',
      address: {
        line1: '456 Nowhere Ave',
        city: 'Fake City',
        state: 'NC',
        postal_code: '27000',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },
  //NORMAL CUSTOMER: Alice Park
  {
    amount: 1800,
    currency: 'usd',
    billing_details: {
      name: 'Alice Park',
      email: 'alice.park@example.com',
      phone: '+1-555-6006',
      address: {
        line1: '333 Pine St',
        city: 'Boston',
        state: 'MA',
        postal_code: '02108',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_discover' },
  },

  {
    amount: 1850,
    currency: 'usd',
    billing_details: {
      name: 'Alice Park',
      email: 'alice.park@example.com',
      phone: '+1-555-6006',
      address: {
        line1: '333 Pine St',
        city: 'Boston',
        state: 'MA',
        postal_code: '02108',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  //FRAUD CUSTOMER: Duplicate billing info with different names
  {
    amount: 6700,
    currency: 'usd',
    billing_details: {
      name: 'Elliot Smith',
      email: 'elliot.smith@mail.com',
      phone: '+1-555-7888',
      address: {
        line1: '123 Fake St',
        city: 'Cleveland',
        state: 'OH',
        postal_code: '44101',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 6800,
    currency: 'usd',
    billing_details: {
      name: 'Rick Jones',
      email: 'rick.jones@mail.com',
      phone: '+1-555-7888',
      address: {
        line1: '123 Fake St',
        city: 'Cleveland',
        state: 'OH',
        postal_code: '44101',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },
  //NORMAL: Jenny Chang
  {
    amount: 2100,
    currency: 'usd',
    billing_details: {
      name: 'Jenny Chang',
      email: 'jenny.chang@example.com',
      phone: '+1-555-9992',
      address: {
        line1: '777 Walnut Ln',
        city: 'Phoenix',
        state: 'AZ',
        postal_code: '85001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
]
