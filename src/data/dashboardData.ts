
import { AllocationData } from "@/types/dashboard";

export const getAllAssetAllocationData = (): AllocationData[] => [
  {
    name: 'Private Equity',
    amount: 245,
    percentage: 28,
    subclasses: [
      { name: 'Growth Equity', amount: 120, percentage: 48.9 },
      { name: 'Buyout Funds', amount: 80, percentage: 32.7 },
      { name: 'Venture Capital', amount: 45, percentage: 18.4 }
    ]
  },
  {
    name: 'Real Estate',
    amount: 70,
    percentage: 8,
    subclasses: [
      { name: 'Commercial RE', amount: 40, percentage: 57.1 },
      { name: 'Residential RE', amount: 20, percentage: 28.6 },
      { name: 'REITs', amount: 10, percentage: 14.3 }
    ]
  },
  {
    name: 'Private Debt',
    amount: 105,
    percentage: 12,
    subclasses: [
      { name: 'Direct Lending', amount: 60, percentage: 57.1 },
      { name: 'Mezzanine', amount: 30, percentage: 28.6 },
      { name: 'Distressed Debt', amount: 15, percentage: 14.3 }
    ]
  },
  {
    name: 'Liquid Investment',
    amount: 96,
    percentage: 11,
    subclasses: [
      { name: 'Money Market', amount: 50, percentage: 52.1 },
      { name: 'Short-term Bonds', amount: 30, percentage: 31.2 },
      { name: 'Cash Equivalents', amount: 16, percentage: 16.7 }
    ]
  },
  {
    name: 'Equities',
    amount: 61,
    percentage: 7,
    subclasses: [
      { name: 'Large Cap', amount: 35, percentage: 57.4 },
      { name: 'Small Cap', amount: 15, percentage: 24.6 },
      { name: 'International', amount: 11, percentage: 18.0 }
    ]
  },
  {
    name: 'Fixed Income (Bonds)',
    amount: 70,
    percentage: 8,
    subclasses: [
      { name: 'Government Bonds', amount: 40, percentage: 57.1 },
      { name: 'Corporate Bonds', amount: 20, percentage: 28.6 },
      { name: 'Municipal Bonds', amount: 10, percentage: 14.3 }
    ]
  },
  {
    name: 'Cash and Cash Equivalents',
    amount: 52,
    percentage: 6,
    subclasses: [
      { name: 'Savings Account', amount: 30, percentage: 57.7 },
      { name: 'Checking Account', amount: 15, percentage: 28.8 },
      { name: 'CDs', amount: 7, percentage: 13.5 }
    ]
  },
  {
    name: 'Commodities',
    amount: 52,
    percentage: 6,
    subclasses: [
      { name: 'Gold', amount: 25, percentage: 48.1 },
      { name: 'Oil', amount: 15, percentage: 28.8 },
      { name: 'Agricultural', amount: 12, percentage: 23.1 }
    ]
  },
  {
    name: 'Alternate Investments',
    amount: 70,
    percentage: 8,
    subclasses: [
      { name: 'Hedge Funds', amount: 40, percentage: 57.1 },
      { name: 'Collectibles', amount: 20, percentage: 28.6 },
      { name: 'Cryptocurrencies', amount: 10, percentage: 14.3 }
    ]
  }
];

export const getWatarManagedData = (): AllocationData[] => [
  {
    name: 'Private Equity',
    amount: 180,
    percentage: 48,
    subclasses: [
      { name: 'Growth Equity', amount: 90, percentage: 50 },
      { name: 'Buyout Funds', amount: 60, percentage: 33.3 },
      { name: 'Venture Capital', amount: 30, percentage: 16.7 }
    ]
  },
  {
    name: 'Real Estate',
    amount: 95,
    percentage: 25,
    subclasses: [
      { name: 'Commercial RE', amount: 60, percentage: 63.2 },
      { name: 'Residential RE', amount: 25, percentage: 26.3 },
      { name: 'REITs', amount: 10, percentage: 10.5 }
    ]
  },
  {
    name: 'Private Debt',
    amount: 75,
    percentage: 20,
    subclasses: [
      { name: 'Direct Lending', amount: 45, percentage: 60 },
      { name: 'Mezzanine', amount: 20, percentage: 26.7 },
      { name: 'Distressed Debt', amount: 10, percentage: 13.3 }
    ]
  },
  {
    name: 'Alternate Investments',
    amount: 25,
    percentage: 7,
    subclasses: [
      { name: 'Hedge Funds', amount: 20, percentage: 80 },
      { name: 'Collectibles', amount: 5, percentage: 20 }
    ]
  }
];

export const getExternallyManagedData = (): AllocationData[] => [
  {
    name: 'Equities',
    amount: 65,
    percentage: 58,
    subclasses: [
      { name: 'Large Cap', amount: 35, percentage: 53.8 },
      { name: 'Small Cap', amount: 18, percentage: 27.7 },
      { name: 'International', amount: 12, percentage: 18.5 }
    ]
  },
  {
    name: 'Fixed Income (Bonds)',
    amount: 35,
    percentage: 31,
    subclasses: [
      { name: 'Government Bonds', amount: 20, percentage: 57.1 },
      { name: 'Corporate Bonds', amount: 10, percentage: 28.6 },
      { name: 'Municipal Bonds', amount: 5, percentage: 14.3 }
    ]
  },
  {
    name: 'Liquid Investment',
    amount: 12,
    percentage: 11,
    subclasses: [
      { name: 'Money Market', amount: 8, percentage: 66.7 },
      { name: 'Short-term Bonds', amount: 3, percentage: 25 },
      { name: 'Cash Equivalents', amount: 1, percentage: 8.3 }
    ]
  }
];

export const getUnmanagedData = (): AllocationData[] => [
  {
    name: 'Cash and Cash Equivalents',
    amount: 85,
    percentage: 55.6,
    subclasses: [
      { name: 'Savings Account', amount: 50, percentage: 58.8 },
      { name: 'Checking Account', amount: 25, percentage: 29.4 },
      { name: 'CDs', amount: 10, percentage: 11.8 }
    ]
  },
  {
    name: 'Commodities',
    amount: 45,
    percentage: 29.4,
    subclasses: [
      { name: 'Gold', amount: 25, percentage: 55.6 },
      { name: 'Oil', amount: 12, percentage: 26.7 },
      { name: 'Agricultural', amount: 8, percentage: 17.8 }
    ]
  },
  {
    name: 'Alternate Investments',
    amount: 23,
    percentage: 15,
    subclasses: [
      { name: 'Cryptocurrencies', amount: 15, percentage: 65.2 },
      { name: 'Collectibles', amount: 8, percentage: 34.8 }
    ]
  }
];

export const sampleLiabilitiesDetails = [
  {
    bank: 'Chase Bank',
    type: 'Mortgage',
    balance: '$2,500,000',
    rate: '3.25%',
    dueDate: '2024-08-15',
    liabilityClass: 'Mortgages'
  },
  {
    bank: 'Wells Fargo',
    type: 'Business Loan',
    balance: '$1,200,000',
    rate: '4.75%',
    dueDate: '2024-07-30',
    liabilityClass: 'Business Loans'
  },
  {
    bank: 'American Express',
    type: 'Credit Card',
    balance: '$45,000',
    rate: '18.99%',
    dueDate: '2024-07-25',
    liabilityClass: 'Credit Cards'
  },
  {
    bank: 'Bank of America',
    type: 'Investment Loan',
    balance: '$850,000',
    rate: '5.50%',
    dueDate: '2024-08-10',
    liabilityClass: 'Investment Loans'
  },
  {
    bank: 'Citibank',
    type: 'Mortgage',
    balance: '$1,800,000',
    rate: '3.75%',
    dueDate: '2024-08-20',
    liabilityClass: 'Mortgages'
  },
  {
    bank: 'Capital One',
    type: 'Credit Card',
    balance: '$25,000',
    rate: '22.99%',
    dueDate: '2024-07-28',
    liabilityClass: 'Credit Cards'
  }
];
