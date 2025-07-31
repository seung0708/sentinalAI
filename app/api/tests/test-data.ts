export const testData = [
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
   // LOW FRAUD RISK: Emily Grant — consistent info, spaced out txns
  {
    amount: 1000,
    currency: 'usd',
    billing_details: {
      name: 'Emily Grant',
      email: 'emily.grant@example.com',
      phone: '+1-555-1010',
      address: {
        line1: '101 Elm Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
    created_at: '2025-07-01T10:00:00Z',
  },
  {
    amount: 1200,
    currency: 'usd',
    billing_details: {
      name: 'Emily Grant',
      email: 'emily.grant@example.com',
      phone: '+1-555-1010',
      address: {
        line1: '101 Elm Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
    created_at: '2025-07-03T14:00:00Z',
  },
  {
    amount: 1100,
    currency: 'usd',
    billing_details: {
      name: 'Emily Grant',
      email: 'emily.grant@example.com',
      phone: '+1-555-1010',
      address: {
        line1: '101 Elm Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_amex' },
    created_at: '2025-07-05T09:30:00Z',
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
  // MEDIUM FRAUD RISK: David Lee — billing city variation & rapid txns
  {
    amount: 3500,
    currency: 'usd',
    billing_details: {
      name: 'David Lee',
      email: 'david.lee@example.com',
      phone: '+1-555-3030',
      address: {
        line1: '88 Pine Street',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94102',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_amex' },
    created_at: '2025-07-10T09:00:00Z',
  },
  {
    amount: 4200,
    currency: 'usd',
    billing_details: {
      name: 'David Lee',
      email: 'david.lee@example.com',
      phone: '+1-555-3030',
      address: {
        line1: '88 Pine Street',
        city: 'Oakland', // nearby different city — suspicious
        state: 'CA',
        postal_code: '94607',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
    created_at: '2025-07-10T09:10:00Z',
  },
  {
    amount: 4000,
    currency: 'usd',
    billing_details: {
      name: 'David Lee',
      email: 'david.lee@example.com',
      phone: '+1-555-3030',
      address: {
        line1: '88 Pine Street',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94102',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_discover' },
    created_at: '2025-07-10T09:20:00Z',
  },

  //HIGH FRAUD RISK: Sophia Martinez — fake/unknown billing addresses & rapid txns
  {
    amount: 9000,
    currency: 'usd',
    billing_details: {
      name: 'Sophia Martinez',
      email: 'sophia.fake@mailinator.com',
      phone: '+1-555-7070',
      address: {
        line1: '777 Phantom Road',
        city: 'Unknown',
        state: 'ZZ',
        postal_code: '00000',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
    created_at: '2025-07-15T11:00:00Z',
  },
  {
    amount: 8500,
    currency: 'usd',
    billing_details: {
      name: 'Sophia Martinez',
      email: 'sophia.fake@mailinator.com',
      phone: '+1-555-7070',
      address: {
        line1: '123 Mystery Ln',
        city: 'Nowhere',
        state: 'ZZ',
        postal_code: '00000',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
    created_at: '2025-07-15T11:02:00Z',
  },
  {
    amount: 8700,
    currency: 'usd',
    billing_details: {
      name: 'Sophia Martinez',
      email: 'sophia.fake@mailinator.com',
      phone: '+1-555-7070',
      address: {
        line1: '999 Nowhere Blvd',
        city: 'Unknown',
        state: 'ZZ',
        postal_code: '00000',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_discover' },
    created_at: '2025-07-15T11:04:00Z',
  },
  // NORMAL CUSTOMER: Michael Chen - Large legitimate purchases
{
  amount: 150000, // $1,500 - high but normal for business
  currency: 'usd',
  billing_details: {
    name: 'Michael Chen',
    email: 'michael.chen@acme-corp.com',
    phone: '+1-555-7777',
    address: {
      line1: '850 Market Street',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      country: 'US',
    }
  },
  status: 'succeeded',
  payment_method: { type: 'card', token: 'tok_visa' },
  created_at: '2025-07-25T10:00:00Z',
},
{
  amount: 180000, // $1,800
  // ... same details as above
  created_at: '2025-07-25T16:00:00Z',
},

// FRAUD PATTERN: Sarah Miller - Address hopping
{
  amount: 4500,
  currency: 'usd',
  billing_details: {
    name: 'Sarah Miller',
    email: 'sarah.miller@gmail.com',
    phone: '+1-555-8888',
    address: {
      line1: '123 First St',
      city: 'Miami',
      state: 'FL',
      postal_code: '33101',
      country: 'US',
    }
  },
  status: 'succeeded',
  payment_method: { type: 'card', token: 'tok_visa' },
  created_at: '2025-07-25T12:00:00Z',
},
{
  amount: 4800,
  // ... same details but different address
  address: {
    line1: '456 Second St',
    city: 'Orlando',
    state: 'FL',
    postal_code: '32801',
  },
  created_at: '2025-07-25T12:30:00Z',
},
{
  amount: 5200,
  // ... different address again
  address: {
    line1: '789 Third St',
    city: 'Tampa',
    state: 'FL',
    postal_code: '33601',
  },
  created_at: '2025-07-25T13:00:00Z',
},

// FRAUD PATTERN: Alex Johnson - Rapid small transactions
{
  amount: 1000, // $10
  currency: 'usd',
  billing_details: {
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1-555-9999',
    address: {
      line1: '742 Pine St',
      city: 'Portland',
      state: 'OR',
      postal_code: '97201',
      country: 'US',
    }
  },
  status: 'succeeded',
  payment_method: { type: 'card', token: 'tok_visa' },
  created_at: '2025-07-25T14:00:00Z',
},
// Add 5 more transactions with 2-minute intervals
// ... same details but timestamps: 14:02, 14:04, 14:06, 14:08, 14:10

// NORMAL CUSTOMER: Lisa Wong - Regular shopping pattern
{
  amount: 3500,
  currency: 'usd',
  billing_details: {
    name: 'Lisa Wong',
    email: 'lisa.wong@example.com',
    phone: '+1-555-5555',
    address: {
      line1: '222 Market St',
      city: 'Chicago',
      state: 'IL',
      postal_code: '60601',
      country: 'US',
    }
  },
  status: 'succeeded',
  payment_method: { type: 'card', token: 'tok_visa' },
  created_at: '2025-07-25T09:00:00Z',
},
// Add 2 more normal transactions spaced 4 hours apart
// ... same details but timestamps: 13:00, 17:00

// FRAUD PATTERN: Anonymous User - Fake details
{
  amount: 7500,
  currency: 'usd',
  billing_details: {
    name: 'John Smith',
    email: 'user123@tempmail.com',
    phone: '+1-000-0000',
    address: {
      line1: '999 Unknown St',
      city: 'Springfield',
      state: 'ZZ', // Invalid state
      postal_code: '00000',
      country: 'US',
    }
  },
  status: 'succeeded',
  payment_method: { type: 'card', token: 'tok_visa' },
  created_at: '2025-07-25T15:00:00Z',
},
{
    amount: 1875,
    currency: 'usd',
    billing_details: {
      name: 'Noah Delgado',
      email: 'noah.d@example.com',
      phone: '+1-555-8823',
      address: {
        line1: '741 Willow Way',
        city: 'Phoenix',
        state: 'AZ',
        postal_code: '85001',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 14210,
    currency: 'usd',
    billing_details: {
      name: 'Isabella Martinez',
      email: 'isabella.martinez@safeemail.com',
      phone: '+1-555-6261',
      address: {
        line1: '3033 Coral Ridge',
        city: 'San Diego',
        state: 'CA',
        postal_code: '92101',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },
  {
    amount: 21000,
    currency: 'usd',
    billing_details: {
      name: 'Liam O’Connor',
      email: 'liam.oconnor@inboxmail.com',
      phone: '+1-555-4622',
      address: {
        line1: '910 Oakridge Blvd',
        city: 'Boston',
        state: 'MA',
        postal_code: '02108',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_amex' },
  },
  {
    amount: 7250,
    currency: 'usd',
    billing_details: {
      name: 'Grace Holloway',
      email: 'grace.holloway@protonmail.com',
      phone: '+1-555-8890',
      address: {
        line1: '1312 Linden Avenue',
        city: 'Chicago',
        state: 'IL',
        postal_code: '60601',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_discover' },
  },
  {
    amount: 2499,
    currency: 'usd',
    billing_details: {
      name: 'Owen Simmons',
      email: 'owen.simms@fastmail.com',
      phone: '+1-555-9902',
      address: {
        line1: '77 Briar Patch Road',
        city: 'Nashville',
        state: 'TN',
        postal_code: '37201',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 19849,
    currency: 'usd',
    billing_details: {
      name: 'Avery Chen',
      email: 'avery.chen@inboxmail.com',
      phone: '+1-555-3347',
      address: {
        line1: '884 Jasmine Street',
        city: 'Portland',
        state: 'OR',
        postal_code: '97201',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  },
  {
    amount: 1500,
    currency: 'usd',
    billing_details: {
      name: 'Brayden Scott',
      email: 'bray.scott1994@mailbox.org',
      phone: '+1-555-4773',
      address: {
        line1: '221 Pine Hollow Rd',
        city: 'Denver',
        state: 'CO',
        postal_code: '80201',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_discover' },
  },
  {
    amount: 6599,
    currency: 'usd',
    billing_details: {
      name: 'Natalie Greer',
      email: 'n.greer87@examplemail.com',
      phone: '+1-555-7712',
      address: {
        line1: '403 Redwood Terrace',
        city: 'Charlotte',
        state: 'NC',
        postal_code: '28202',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_amex' },
  },
  {
    amount: 12230,
    currency: 'usd',
    billing_details: {
      name: 'Jalen Brooks',
      email: 'jalen.brooks@safeinbox.com',
      phone: '+1-555-6230',
      address: {
        line1: '1190 Rolling Oaks Dr',
        city: 'Atlanta',
        state: 'GA',
        postal_code: '30301',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_visa' },
  },
  {
    amount: 8900,
    currency: 'usd',
    billing_details: {
      name: 'Tessa Morgan',
      email: 'tessa.morgan@emailbox.org',
      phone: '+1-555-8445',
      address: {
        line1: '682 Prairie Avenue',
        city: 'Minneapolis',
        state: 'MN',
        postal_code: '55401',
        country: 'US',
      },
    },
    status: 'succeeded',
    payment_method: { type: 'card', token: 'tok_mastercard' },
  }
];
