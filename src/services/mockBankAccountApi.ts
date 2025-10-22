import { BankAccount, BankAccountFilters } from '@/types/bankAccount';
import { PaginationParams, PaginatedResponse } from '@/services/bankAccountApi';

const mockBankAccounts: BankAccount[] = [
  {
    "id": "ndze65jW5gCBPovloNAyTR7mlkDLn7CAl7wng",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Plaid Money Market",
    "assetClass": "depository",
    "externalId": "ndze65jW5gCBPovloNAyTR7mlkDLn7CAl7wng",
    "dataSource": null,
    "assetSubclass": "money market",
    "acquisitionDate": null,
    "accountNumber": "4444",
    "currency": "USD",
    "financialInstitution": "Plaid Bank",
    "balance": 43200.0,
    "transactions": [
      {
        "id": "zLQV6mb3mRFo8aQPa1LbtvZWoAaQldClNAgjb",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "ndze65jW5gCBPovloNAyTR7mlkDLn7CAl7wng",
        "date": "2025-09-15",
        "externalId": "zLQV6mb3mRFo8aQPa1LbtvZWoAaQldClNAgjb",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 5850.0,
        "description": "ACH Electronic CreditGUSTO PAY 123456",
        "currency": "USD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Plaid Checking",
    "assetClass": "depository",
    "externalId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
    "dataSource": null,
    "assetSubclass": "checking",
    "acquisitionDate": null,
    "accountNumber": "0000",
    "currency": "USD",
    "financialInstitution": "Plaid Bank",
    "balance": 100.0,
    "transactions": [
      {
        "id": "3joLdgld7AcmW79bkGB9fWr3QvQo3RUZaoRVX",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
        "date": "2025-09-29",
        "externalId": "3joLdgld7AcmW79bkGB9fWr3QvQo3RUZaoRVX",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 6.33,
        "description": "Uber 072515 SF**POOL**",
        "currency": "USD"
      },
      {
        "id": "x4yR5Vb5enujAdgW4xwgslLMWRWEMvt6ElBKL",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
        "date": "2025-09-16",
        "externalId": "x4yR5Vb5enujAdgW4xwgslLMWRWEMvt6ElBKL",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 5.4,
        "description": "Uber 063015 SF**POOL**",
        "currency": "USD"
      },
      {
        "id": "dWBN8V48n6i8qgMPzEjMSKW9wbw697uJ3ganA",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
        "date": "2025-09-14",
        "externalId": "dWBN8V48n6i8qgMPzEjMSKW9wbw697uJ3ganA",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": -500.0,
        "description": "United Airlines",
        "currency": "USD"
      },
      {
        "id": "agKP9Vx9WbcejwkDqlmkiL7oJ6JvogcZ9d3Kl",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
        "date": "2025-09-13",
        "externalId": "agKP9Vx9WbcejwkDqlmkiL7oJ6JvogcZ9d3Kl",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 12.0,
        "description": "McDonald's",
        "currency": "USD"
      },
      {
        "id": "47DpG8qGe5IxqbgARGjgsjQmWwW8moCJxDMR6",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
        "date": "2025-09-13",
        "externalId": "47DpG8qGe5IxqbgARGjgsjQmWwW8moCJxDMR6",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 4.33,
        "description": "Starbucks",
        "currency": "USD"
      },
      {
        "id": "Nz6Mg1kgxDtKmk3RDnZ3tre7515L7Wfy1eKAP",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
        "date": "2025-09-12",
        "externalId": "Nz6Mg1kgxDtKmk3RDnZ3tre7515L7Wfy1eKAP",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 89.4,
        "description": "SparkFun",
        "currency": "USD"
      },
      {
        "id": "P36jopnoaDHJ8xAQDevAiz1l5y5WlMto43vyq",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "nlebwVLwknixVeEJlWqEsRVRWW3QwmCAlmkQ9",
        "date": "2025-08-30",
        "externalId": "P36jopnoaDHJ8xAQDevAiz1l5y5WlMto43vyq",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 6.33,
        "description": "Uber 072515 SF**POOL**",
        "currency": "USD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "bkrwgVdgAWia6Xz8KWgzfjEjGGQMpnFmbvL7K",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Plaid Saving",
    "assetClass": "depository",
    "externalId": "bkrwgVdgAWia6Xz8KWgzfjEjGGQMpnFmbvL7K",
    "dataSource": null,
    "assetSubclass": "savings",
    "acquisitionDate": null,
    "accountNumber": "1111",
    "currency": "USD",
    "financialInstitution": "Plaid Bank",
    "balance": 200.0,
    "transactions": [
      {
        "id": "jyNkPVQPqnf5Jz6o4dB6Fd6ym5mzy1F63pARp",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "bkrwgVdgAWia6Xz8KWgzfjEjGGQMpnFmbvL7K",
        "date": "2025-09-16",
        "externalId": "jyNkPVQPqnf5Jz6o4dB6Fd6ym5mzy1F63pARp",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": 25.0,
        "description": "CREDIT CARD 3333 PAYMENT *//",
        "currency": "USD"
      },
      {
        "id": "7ZmLlAzlMDCZWMeyk5mefVM9818e9EfdGvpbX",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "bkrwgVdgAWia6Xz8KWgzfjEjGGQMpnFmbvL7K",
        "date": "2025-09-11",
        "externalId": "7ZmLlAzlMDCZWMeyk5mefVM9818e9EfdGvpbX",
        "dataSource": "PLAID",
        "type": null,
        "subType": null,
        "amount": -4.22,
        "description": "INTRST PYMNT",
        "currency": "USD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "chase_checking_001",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Chase Total Checking",
    "assetClass": "depository",
    "externalId": "chase_checking_001",
    "dataSource": null,
    "assetSubclass": "checking",
    "acquisitionDate": null,
    "accountNumber": "5678",
    "currency": "USD",
    "financialInstitution": "Chase",
    "balance": 15750.25,
    "transactions": [
      {
        "id": "chase_tx_001",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "chase_checking_001",
        "date": "2025-09-28",
        "externalId": "chase_tx_001",
        "dataSource": "CHASE",
        "type": null,
        "subType": null,
        "amount": 3250.0,
        "description": "Direct Deposit - PAYROLL",
        "currency": "USD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "bofa_savings_001",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Bank of America Advantage Savings",
    "assetClass": "depository",
    "externalId": "bofa_savings_001",
    "dataSource": null,
    "assetSubclass": "savings",
    "acquisitionDate": null,
    "accountNumber": "9876",
    "currency": "USD",
    "financialInstitution": "Bank of America",
    "balance": 85600.00,
    "transactions": [
      {
        "id": "bofa_tx_001",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "bofa_savings_001",
        "date": "2025-09-25",
        "externalId": "bofa_tx_001",
        "dataSource": "BOFA",
        "type": null,
        "subType": null,
        "amount": 45.50,
        "description": "Interest Payment",
        "currency": "USD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "wells_cd_001",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Wells Fargo Certificate of Deposit",
    "assetClass": "depository",
    "externalId": "wells_cd_001",
    "dataSource": null,
    "assetSubclass": "cd",
    "acquisitionDate": null,
    "accountNumber": "2468",
    "currency": "USD",
    "financialInstitution": "Wells Fargo",
    "balance": 50000.00,
    "transactions": [
      {
        "id": "wells_tx_001",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "wells_cd_001",
        "date": "2025-09-01",
        "externalId": "wells_tx_001",
        "dataSource": "WELLS",
        "type": null,
        "subType": null,
        "amount": 125.00,
        "description": "Monthly Interest - CD",
        "currency": "USD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "citi_money_market_001",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Citi Priority Money Market",
    "assetClass": "depository",
    "externalId": "citi_money_market_001",
    "dataSource": null,
    "assetSubclass": "money market",
    "acquisitionDate": null,
    "accountNumber": "1357",
    "currency": "USD",
    "financialInstitution": "Citi",
    "balance": 125000.75,
    "transactions": [
      {
        "id": "citi_tx_001",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "citi_money_market_001",
        "date": "2025-09-20",
        "externalId": "citi_tx_001",
        "dataSource": "CITI",
        "type": null,
        "subType": null,
        "amount": 750.25,
        "description": "Interest Earned",
        "currency": "USD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "hsbc_eur_checking_001",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "HSBC Euro Current Account",
    "assetClass": "depository",
    "externalId": "hsbc_eur_checking_001",
    "dataSource": null,
    "assetSubclass": "checking",
    "acquisitionDate": null,
    "accountNumber": "3691",
    "currency": "EUR",
    "financialInstitution": "HSBC",
    "balance": 25000.00,
    "transactions": [
      {
        "id": "hsbc_tx_001",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "hsbc_eur_checking_001",
        "date": "2025-09-22",
        "externalId": "hsbc_tx_001",
        "dataSource": "HSBC",
        "type": null,
        "subType": null,
        "amount": 2500.00,
        "description": "Wire Transfer Received",
        "currency": "EUR"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "rbc_cad_savings_001",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "RBC High Interest Savings",
    "assetClass": "depository",
    "externalId": "rbc_cad_savings_001",
    "dataSource": null,
    "assetSubclass": "savings",
    "acquisitionDate": null,
    "accountNumber": "7410",
    "currency": "CAD",
    "financialInstitution": "RBC",
    "balance": 45000.00,
    "transactions": [
      {
        "id": "rbc_tx_001",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "rbc_cad_savings_001",
        "date": "2025-09-18",
        "externalId": "rbc_tx_001",
        "dataSource": "RBC",
        "type": null,
        "subType": null,
        "amount": 187.50,
        "description": "Monthly Interest Payment",
        "currency": "CAD"
      }
    ],
    "holdings": null,
    "liabilities": null
  },
  {
    "id": "barclays_gbp_checking_001",
    "createdAt": null,
    "updatedAt": null,
    "lasEventType": null,
    "lastEventAt": null,
    "name": "Barclays Current Account",
    "assetClass": "depository",
    "externalId": "barclays_gbp_checking_001",
    "dataSource": null,
    "assetSubclass": "checking",
    "acquisitionDate": null,
    "accountNumber": "8520",
    "currency": "GBP",
    "financialInstitution": "Barclays",
    "balance": 18500.00,
    "transactions": [
      {
        "id": "barclays_tx_001",
        "createdAt": null,
        "updatedAt": null,
        "lasEventType": null,
        "lastEventAt": null,
        "assetId": "barclays_gbp_checking_001",
        "date": "2025-09-26",
        "externalId": "barclays_tx_001",
        "dataSource": "BARCLAYS",
        "type": null,
        "subType": null,
        "amount": 1850.00,
        "description": "Salary Deposit",
        "currency": "GBP"
      }
    ],
    "holdings": null,
    "liabilities": null
  }
];

class MockBankAccountApiService {
  async getBankAccounts(
    pagination: PaginationParams,
    filters?: BankAccountFilters
  ): Promise<PaginatedResponse<BankAccount>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredAccounts = [...mockBankAccounts];
    
    // Apply filters
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredAccounts = filteredAccounts.filter(account =>
        account.name.toLowerCase().includes(searchLower) ||
        account.accountNumber.includes(searchLower) ||
        account.financialInstitution.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.assetSubclass?.length) {
      filteredAccounts = filteredAccounts.filter(account =>
        filters.assetSubclass!.includes(account.assetSubclass)
      );
    }

    if (filters?.currency?.length) {
      filteredAccounts = filteredAccounts.filter(account =>
        filters.currency!.includes(account.currency)
      );
    }

    if (filters?.financialInstitution?.length) {
      filteredAccounts = filteredAccounts.filter(account =>
        filters.financialInstitution!.includes(account.financialInstitution)
      );
    }

    if (filters?.balanceRange) {
      filteredAccounts = filteredAccounts.filter(account =>
        account.balance >= filters.balanceRange!.min &&
        account.balance <= filters.balanceRange!.max
      );
    }

    // Apply pagination
    const totalItems = filteredAccounts.length;
    const totalPages = Math.ceil(totalItems / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

    return {
      data: paginatedAccounts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        totalItems,
      },
    };
  }

  async getBankAccountById(id: string): Promise<BankAccount> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const account = mockBankAccounts.find(acc => acc.id === id);
    if (!account) {
      throw new Error('Bank account not found');
    }
    
    return account;
  }

  getFilterOptions() {
    return {
      assetSubclasses: ['checking', 'savings', 'money market', 'cd'],
      currencies: ['USD', 'EUR', 'GBP', 'CAD'],
      financialInstitutions: ['Plaid Bank', 'Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'HSBC', 'RBC', 'Barclays']
    };
  }
}

export const mockBankAccountApi = new MockBankAccountApiService();