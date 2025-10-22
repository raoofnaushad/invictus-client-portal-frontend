// Mock Backend Services
export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  type: string;
  status: "Processing" | "Reconciled" | "Approved" | "Rejected" | "Not reconcile" | "Pending";
  relatedTo: string;
  assignedTo: string;
  extractedData?: any;
}

export interface Transaction {
  id: string;
  description: string;
  datePosted: string;
  amount: string;
  balance: string;
  status: "Approved" | "Rejected" | "Reconciled" | "Not reconcile" | "Processing";
  approver: string;
}

export interface FilterOptions {
  status?: string[];
  documentType?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Asas cash citi july.pdf",
    uploadDate: "01-03-2025",
    type: "Bank statement",
    status: "Processing",
    relatedTo: "Bank Account",
    assignedTo: "John Doe"
  },
  {
    id: "2", 
    name: "DEF 1234 document",
    uploadDate: "05-03-2025",
    type: "Capital call notices",
    status: "Reconciled",
    relatedTo: "Investment",
    assignedTo: "-"
  },
  {
    id: "3",
    name: "Investment portfolio",
    uploadDate: "10-03-2025", 
    type: "Investment summaries",
    status: "Approved",
    relatedTo: "Investment",
    assignedTo: "Michael Williams"
  },
  {
    id: "4",
    name: "Q4 Financial Report.pdf",
    uploadDate: "15-03-2025",
    type: "Financial reports",
    status: "Rejected",
    relatedTo: "Reporting",
    assignedTo: "Sarah Johnson"
  },
  {
    id: "5",
    name: "Tax Documents 2024.pdf",
    uploadDate: "20-03-2025",
    type: "Tax documents",
    status: "Pending",
    relatedTo: "Tax",
    assignedTo: "David Miller"
  },
  {
    id: "6",
    name: "Bank reconciliation Jan.xlsx",
    uploadDate: "25-03-2025",
    type: "Bank statement",
    status: "Approved",
    relatedTo: "Bank Account",
    assignedTo: "John Doe"
  },
  {
    id: "7",
    name: "Asas distribution notice.pdf",
    uploadDate: "19-03-2025",
    type: "Distribution notices",
    status: "Processing",
    relatedTo: "Investment",
    assignedTo: "Ahmed Doue",
    extractedData: {
      "fund_name": {
        "value": "BECO Booster Fund III, LP",
        "bbox": [null, null, null, null],
        "confidence": null
      },
      "distribution_date": {
        "value": "2024-03-28",
        "bbox": [194, 314, 370, 341],
        "confidence": 0.968975305557251
      },
      "investor_name": {
        "value": "ASAS Holdings Limited",
        "bbox": [193, 382, 459, 413],
        "confidence": 0.9933110475540161
      },
      "amount_distributed": {
        "value": "USD17,897.99",
        "bbox": [1251, 1102, 1371, 1133],
        "confidence": 0.9967818856239319
      },
      "currency": {
        "value": "USD",
        "bbox": [null, null, null, null],
        "confidence": null
      },
      "transactions": [
        {
          "date": {
            "value": "2024-03-28",
            "bbox": [194, 314, 370, 341],
            "confidence": 0.968975305557251
          },
          "description": {
            "value": "Distribution from BECO Booster Fund III, LP",
            "bbox": [null, null, null, null],
            "confidence": null
          },
          "debit": {
            "value": null,
            "bbox": [null, null, null, null],
            "confidence": null
          },
          "credit": {
            "value": "USD17,897.99",
            "bbox": [1251, 1102, 1371, 1133],
            "confidence": 0.9967818856239319
          },
          "balance": {
            "value": null,
            "bbox": [null, null, null, null],
            "confidence": null
          }
        }
      ]
    }
  }
];

const mockTransactions: Transaction[] = [
  {
    id: "AJG245718SGSA",
    description: "Opening Balance Transfer",
    datePosted: "18JAN24",
    amount: "$700,000.00",
    balance: "$0.007000.00",
    status: "Approved",
    approver: "John Doe"
  },
  {
    id: "67HGJAJDBFKJ",
    description: "Wire Transfer In",
    datePosted: "20JAN24",
    amount: "$50,000.00",
    balance: "$750,000.00",
    status: "Rejected", 
    approver: "James Smith"
  },
  {
    id: "6273GJKJAH91",
    description: "Opening Balance",
    datePosted: "22JAN24",
    amount: "$100,000.00",
    balance: "$850,000.00",
    status: "Reconciled",
    approver: "Michael Williams"
  },
  {
    id: "01JAN23",
    description: "AL TUWAIJRY SALWA",
    datePosted: "25JAN24",
    amount: "$3,000,000.00",
    balance: "$3,850,000.00", 
    status: "Not reconcile",
    approver: "David Miller"
  },
  {
    id: "01NOV23",
    description: "BUTTERFIELD BANK (GU)",
    datePosted: "01NOV23",
    amount: "$(30.00)",
    balance: "$3,849,970.00",
    status: "Rejected",
    approver: "Mike Jordan"
  },
  {
    id: "02NOV23", 
    description: "BUTTERFIELD BANK (GU)",
    datePosted: "02NOV23",
    amount: "$(300,000.00)",
    balance: "$3,549,970.00",
    status: "Processing",
    approver: "Nickel Jr"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
export class MockApiService {
  // Documents API
  static async getDocuments(filters?: FilterOptions): Promise<Document[]> {
    await delay(300); // Simulate network delay
    
    let filteredDocs = [...mockDocuments];
    
    if (filters) {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredDocs = filteredDocs.filter(doc => 
          doc.name.toLowerCase().includes(searchLower) ||
          doc.type.toLowerCase().includes(searchLower) ||
          doc.assignedTo.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.status && filters.status.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.status!.includes(doc.status)
        );
      }
      
      if (filters.documentType && filters.documentType.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.documentType!.includes(doc.type)
        );
      }
      
      if (filters.assignedTo && filters.assignedTo.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.assignedTo!.includes(doc.assignedTo)
        );
      }
    }
    
    return filteredDocs;
  }

  static async getDocument(id: string): Promise<Document | null> {
    await delay(200);
    return mockDocuments.find(doc => doc.id === id) || null;
  }

  static async createDocument(document: Omit<Document, 'id'>): Promise<Document> {
    await delay(500);
    const newDoc: Document = {
      id: Date.now().toString(),
      ...document
    };
    mockDocuments.unshift(newDoc);
    return newDoc;
  }

  static async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    await delay(300);
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index !== -1) {
      mockDocuments[index] = { ...mockDocuments[index], ...updates };
      console.log(`MockApiService: Updated document ${id} with status: ${updates.status}`);
      return mockDocuments[index];
    }
    return null;
  }

  static async deleteDocument(id: string): Promise<boolean> {
    await delay(300);
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index !== -1) {
      mockDocuments.splice(index, 1);
      return true;
    }
    return false;
  }

  // Transactions API
  static async getTransactions(filters?: FilterOptions): Promise<Transaction[]> {
    await delay(300);
    
    let filteredTransactions = [...mockTransactions];
    
    if (filters) {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredTransactions = filteredTransactions.filter(txn => 
          txn.description.toLowerCase().includes(searchLower) ||
          txn.id.toLowerCase().includes(searchLower) ||
          txn.approver.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.status && filters.status.length > 0) {
        filteredTransactions = filteredTransactions.filter(txn => 
          filters.status!.includes(txn.status)
        );
      }
    }
    
    return filteredTransactions;
  }

  // Filter options
  static async getFilterOptions(): Promise<{
    statuses: string[];
    documentTypes: string[];
    assignees: string[];
  }> {
    await delay(100);
    
    const statuses = [...new Set(mockDocuments.map(doc => doc.status))];
    const documentTypes = [...new Set(mockDocuments.map(doc => doc.type))];
    const assignees = [...new Set(mockDocuments.map(doc => doc.assignedTo).filter(assignee => assignee !== '-'))];
    
    return {
      statuses,
      documentTypes,
      assignees
    };
  }

  // Analytics
  static async getAnalytics(): Promise<{
    totalDocuments: number;
    processingCount: number;
    approvedCount: number;
    rejectedCount: number;
    reconciledCount: number;
  }> {
    await delay(200);
    
    return {
      totalDocuments: mockDocuments.length,
      processingCount: mockDocuments.filter(doc => doc.status === 'Processing').length,
      approvedCount: mockDocuments.filter(doc => doc.status === 'Approved').length,
      rejectedCount: mockDocuments.filter(doc => doc.status === 'Rejected').length,
      reconciledCount: mockDocuments.filter(doc => doc.status === 'Reconciled').length,
    };
  }

  // Simulate file upload
  static async uploadFile(file: File, metadata: {
    documentType: string;
    assignedTo: string;
    relatedTo: string;
  }): Promise<Document> {
    await delay(2000); // Simulate processing time
    
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      uploadDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      type: metadata.documentType,
      status: "Processing",
      relatedTo: metadata.relatedTo,
      assignedTo: metadata.assignedTo
    };
    
    mockDocuments.unshift(newDocument);
    return newDocument;
  }
}