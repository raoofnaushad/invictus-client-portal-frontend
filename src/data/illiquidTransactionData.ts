
export interface Transaction {
  id: string;
  date: string;
  quantity: number;
  amount: number;
  currency: string;
  direction: 'Buy' | 'Sell';
  senderRecipient: string;
  description: string;
}

// Mock transaction data matching the design
export const mockTransactions: Record<string, Transaction[]> = {
  "1": [
    {
      id: "t1",
      date: "03/04/2025",
      quantity: 2500,
      amount: 50000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "John Doe",
      description: "Buy for diversification"
    },
    {
      id: "t2",
      date: "29/03/2025",
      quantity: 500,
      amount: -5000,
      currency: "USD",
      direction: "Sell",
      senderRecipient: "James Smith",
      description: "Sell because of major news event"
    },
    {
      id: "t3",
      date: "10/03/2025",
      quantity: 1000,
      amount: 20000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "Michael Williams",
      description: "Buy for low entry point"
    },
    {
      id: "t4",
      date: "18/02/2025",
      quantity: 2000,
      amount: 30000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "David Miller",
      description: "Buy for diversification"
    }
  ],
  "2": [
    {
      id: "t5",
      date: "01/04/2025",
      quantity: 1500,
      amount: 15000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "Sarah Johnson",
      description: "Initial investment"
    }
  ],
  "3": [
    {
      id: "t6",
      date: "15/03/2025",
      quantity: 800,
      amount: 12000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "Robert Brown",
      description: "Portfolio expansion"
    }
  ],
  "4": [
    {
      id: "t7",
      date: "03/04/2025",
      quantity: 2500,
      amount: 50000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "John Doe",
      description: "Buy for diversification"
    },
    {
      id: "t8",
      date: "29/03/2025",
      quantity: 500,
      amount: -5000,
      currency: "USD",
      direction: "Sell",
      senderRecipient: "James Smith",
      description: "Sell because of major news event"
    },
    {
      id: "t9",
      date: "10/03/2025",
      quantity: 1000,
      amount: 20000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "Michael Williams",
      description: "Buy for low entry point"
    },
    {
      id: "t10",
      date: "18/02/2025",
      quantity: 2000,
      amount: 30000,
      currency: "USD",
      direction: "Buy",
      senderRecipient: "David Miller",
      description: "Buy for diversification"
    }
  ]
};
