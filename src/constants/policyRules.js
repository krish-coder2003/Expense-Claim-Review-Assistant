// Organizational Expense Policy & Base Configurations

export const BASE_CURRENCY = 'USD';

export const CURRENCY_RATES = {
  USD: 1.0,
  EUR: 1.09,
  GBP: 1.31,
  CAD: 0.74,
  INR: 0.012,
  JPY: 0.0068,
};

export const POLICY_SECTIONS = [
  {
    id: 'POL-101',
    title: 'Meals & Client Entertainment',
    category: 'Meals & Entertainment',
    description: 'Guidelines for business meals, client entertainment, and group dining.',
    perClaimLimitUSD: 75,
    groupMealLimitUSD: 150,
    receiptRequiredThresholdUSD: 25,
    rules: [
      'Individual meals are capped at $75 USD per person.',
      'Group dining or client entertainment capped at $150 USD total without prior VP approval.',
      'Receipts are mandatory for all meals exceeding $25 USD.',
      'Itemized receipt showing food and beverage details is required.',
      'Description MUST include attendee full names and business justification.'
    ],
    keywords: ['dinner', 'lunch', 'breakfast', 'meal', 'restaurant', 'coffee', 'food', 'catering', 'bistro', 'client entertainment', 'drinks', 'dining']
  },
  {
    id: 'POL-102',
    title: 'Ground Transportation & Air Travel',
    category: 'Travel & Lodging',
    description: 'Rules governing rideshare, taxis, mileage, car rentals, and airfare.',
    perClaimLimitUSD: 100,
    airfareEconomyOnly: true,
    receiptRequiredThresholdUSD: 50,
    rules: [
      'Rideshare (Uber/Lyft) and taxi charges are capped at $100 USD per single trip.',
      'Airfare must be booked in Economy Class; Premium or Business Class requires advance approval.',
      'Receipts are required for any transport expense exceeding $50 USD.',
      'Claims must be submitted within 30 days of trip completion.',
      'Personal travel deviations are strictly non-reimbursable.'
    ],
    keywords: ['uber', 'lyft', 'taxi', 'cab', 'flight', 'airfare', 'airline', 'hotel', 'lodging', 'parking', 'toll', 'train', 'transit', 'rental car', 'gas', 'mileage']
  },
  {
    id: 'POL-103',
    title: 'Software & Cloud Subscriptions',
    category: 'Software & Tools',
    description: 'Purchases of developer software, SaaS tools, AI subscriptions, and dev licenses.',
    perClaimLimitUSD: 50,
    receiptRequiredThresholdUSD: 0, // Mandatory for all software
    rules: [
      'Monthly recurring SaaS/Software tools are capped at $50 USD per claim.',
      'Annual software subscriptions require IT Procurement pre-authorization.',
      'Receipts are strictly MANDATORY for ALL software tools regardless of amount.',
      'Software licenses must be registered under company email domain.',
      'Personal tools or non-work subscriptions are strictly non-reimbursable.'
    ],
    keywords: ['software', 'saas', 'github', 'chatgpt', 'openai', 'subscription', 'licence', 'license', 'figma', 'jetbrains', 'aws', 'cloud', 'hosting', 'domain', 'slack', 'zoom', 'adobe']
  },
  {
    id: 'POL-104',
    title: 'Office Supplies & Ergonomics',
    category: 'Office Supplies',
    description: 'Work-from-home supplies, monitor stands, desk accessories, and stationery.',
    perClaimLimitUSD: 200,
    receiptRequiredThresholdUSD: 30,
    rules: [
      'Equipment and office supplies capped at $200 USD per claim.',
      'Receipts mandatory for supplies exceeding $30 USD.',
      'Capital assets (laptops, phones) must go through Central IT procurement, not expense claims.',
      'Items must be directly used for official work responsibilities.'
    ],
    keywords: ['office', 'supplies', 'stationery', 'desk', 'keyboard', 'mouse', 'monitor', 'headphones', 'paper', 'cables', 'adapter', 'chair', 'ergonomic']
  },
  {
    id: 'POL-105',
    title: 'General Expense Compliance',
    category: 'General',
    description: 'Overarching compliance rules on duplicates, receipt validity, and claim freshness.',
    perClaimLimitUSD: 500,
    receiptRequiredThresholdUSD: 50,
    rules: [
      'Any claim above $50 USD requires an itemized receipt regardless of category.',
      'Claims older than 60 days from the current date are ineligible for reimbursement.',
      'Duplicate submissions (same date, claimant, and amount) will be automatically flagged for fraud check.',
      'Currency conversions are calculated using the transaction date exchange rate.'
    ],
    keywords: ['reimbursement', 'general', 'misc', 'miscellaneous', 'fee', 'charge']
  }
];

export const CATEGORIES = [
  'Meals & Entertainment',
  'Travel & Lodging',
  'Software & Tools',
  'Office Supplies',
  'General',
  'Uncategorized/Ambiguous'
];

export const SAMPLE_CLAIMS = [
  {
    id: 'CLM-2026-001',
    claimant: 'Sarah Jenkins',
    date: '2026-10-02',
    category: 'Meals & Entertainment',
    amount: 145.50,
    currency: 'USD',
    description: 'Team dinner at Bistro avec clients (Acme Corp VP John & 3 engineers) for Q4 project kickoff',
    receiptAvailable: true,
    status: 'Pending Review',
    submittedAt: '2026-10-02T18:45:00Z'
  },
  {
    id: 'CLM-2026-002',
    claimant: 'Alex Rivera',
    date: '2026-10-04',
    category: 'Travel & Lodging',
    amount: 85.00,
    currency: 'USD',
    description: 'Late night Uber ride home from office after production outage release',
    receiptAvailable: true,
    status: 'Pending Review',
    submittedAt: '2026-10-04T23:10:00Z'
  },
  {
    id: 'CLM-2026-003',
    claimant: 'David Chen',
    date: '2026-10-03',
    category: 'Software & Tools',
    amount: 20.00,
    currency: 'USD',
    description: 'ChatGPT Plus monthly subscription for automated code review script testing',
    receiptAvailable: false, // Violation: Software requires receipt regardless of amount
    status: 'Pending Review',
    submittedAt: '2026-10-03T11:20:00Z'
  },
  {
    id: 'CLM-2026-004',
    claimant: 'Sarah Jenkins',
    date: '2026-10-02',
    category: 'Meals & Entertainment',
    amount: 145.50,
    currency: 'USD',
    description: 'Team dinner at Bistro avec clients Q4 kickoff', // Duplicate of CLM-2026-001!
    receiptAvailable: true,
    status: 'Pending Review',
    submittedAt: '2026-10-02T19:00:00Z'
  },
  {
    id: 'CLM-2026-005',
    claimant: 'Marcus Vance',
    date: '2026-07-15', // Stale date > 60 days ago
    category: 'Office Supplies',
    amount: 180.00,
    currency: 'USD',
    description: 'Ergonomic dual-monitor arm for home workstation',
    receiptAvailable: true,
    status: 'Pending Review',
    submittedAt: '2026-10-01T09:00:00Z'
  },
  {
    id: 'CLM-2026-006',
    claimant: 'Elena Rostova',
    date: '2026-10-01',
    category: 'General', // Ambiguous category selection by user
    amount: 110.00,
    currency: 'EUR', // ~ $119.90 USD (exceeds Uber $100 limit)
    description: 'Airport taxi ride and quick snack while waiting for flight to Berlin tech summit',
    receiptAvailable: true,
    status: 'Pending Review',
    submittedAt: '2026-10-01T14:30:00Z'
  },
  {
    id: 'CLM-2026-007',
    claimant: 'Liam O\'Connor',
    date: '2026-10-04',
    category: 'Software & Tools',
    amount: 299.00,
    currency: 'USD', // Exceeds $50 per-claim SaaS limit
    description: 'Annual IntelliJ IDEA Ultimate developer license renewal',
    receiptAvailable: true,
    status: 'Pending Review',
    submittedAt: '2026-10-04T16:05:00Z'
  },
  {
    id: 'CLM-2026-008',
    claimant: 'Priya Sharma',
    date: '2026-09-28',
    category: 'Meals & Entertainment',
    amount: 45.00,
    currency: 'USD',
    description: 'Coffee and pastries during client onboarding chat', // Missing attendee names
    receiptAvailable: true,
    status: 'Approved',
    submittedAt: '2026-09-28T10:15:00Z'
  }
];
