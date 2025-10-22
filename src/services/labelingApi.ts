// Labeling API Services

export interface ExtractedField {
  value: string | null;
  bbox: [number, number, number, number] | [null, null, null, null];
  confidence: number;
}

export interface ExtractedTransaction {
  date: ExtractedField;
  description: ExtractedField;
  debit: ExtractedField;
  credit: ExtractedField;
  balance: ExtractedField;
}

export interface ExtractedData {
  [key: string]: ExtractedField | ExtractedTransaction[];
}

export interface PageData {
  image_url: string;
  extracted_data: ExtractedData & {
    transactions?: ExtractedTransaction[];
  };
}

export interface LabelingData {
  documentId: string;
  file_name: string;
  status: string;
  parse_data: PageData[];
  currentPage: number;
}

// Mock data with proper TypeScript typing - matches mockApi documents
const mockDocuments = [
  { 
    documentId: "1",
    fileName: "Asas cash citi july.pdf",
    status: "processing",
    uploadDate: "01-03-2025",
    relatedTo: "Bank Account",
    assignedTo: "John Doe",
    type: "Bank statement",
    parseData: [
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_1.jpg",
        extracted_data: {
          account_holder: {
            value: "639B801915E ASAS HOLDINGS LIMITED",
            bbox: [247, 218, 570, 235] as [number, number, number, number],
            confidence: 1.0
          },
          account_number: {
            value: "639C821894G",
            bbox: [247, 242, 350, 259] as [number, number, number, number],
            confidence: 1.0
          },
          currency: {
            value: "USD",
            bbox: [622, 242, 648, 259] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-05-31",
                bbox: [665, 500, 739, 517] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Balance carried forward to your credit",
                bbox: [223, 495, 464, 512] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              credit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              balance: {
                value: "0.00",
                bbox: [1071, 500, 1128, 517] as [number, number, number, number],
                confidence: 1.0
              }
            }
          ]
        }
      },
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_2.jpg",
        extracted_data: {
          account_holder: {
            value: "639B801915E ASAS HOLDINGS LIMITED",
            bbox: [247, 218, 570, 235] as [number, number, number, number],
            confidence: 1.0
          },
          account_number: {
            value: "639C984570X",
            bbox: [247, 242, 365, 259] as [number, number, number, number],
            confidence: 1.0
          },
          currency: {
            value: "USD",
            bbox: [478, 242, 499, 259] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-06-01",
                bbox: [664, 504, 739, 521] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Wire Transfer - Investment Fund",
                bbox: [222, 504, 464, 521] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: "50,000.00",
                bbox: [832, 540, 857, 557] as [number, number, number, number],
                confidence: 1.0
              },
              credit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              balance: {
                value: "950,000.00",
                bbox: [1070, 540, 1128, 557] as [number, number, number, number],
                confidence: 1.0
              }
            }
          ]
        }
      },
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_3.jpg",
        extracted_data: {
          account_holder: {
            value: "639B801915E ASAS HOLDINGS LIMITED",
            bbox: [247, 218, 570, 235] as [number, number, number, number],
            confidence: 1.0
          },
          account_number: {
            value: "639C655401W Standard Loan - 2 USD",
            bbox: [247, 242, 540, 259] as [number, number, number, number],
            confidence: 1.0
          },
          currency: {
            value: "USD",
            bbox: [488, 242, 510, 259] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-06-02",
                bbox: [665, 505, 739, 522] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Loan Interest Payment",
                bbox: [222, 505, 464, 522] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: "2,500.00",
                bbox: [832, 540, 857, 557] as [number, number, number, number],
                confidence: 1.0
              },
              credit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              balance: {
                value: "947,500.00",
                bbox: [1070, 540, 1127, 557] as [number, number, number, number],
                confidence: 1.0
              }
            }
          ]
        }
      }
    ]
  },
  { 
    documentId: "2",
    fileName: "DEF 1234 document",
    status: "reconciled",
    uploadDate: "05-03-2025",
    relatedTo: "Investment",
    assignedTo: "-",
    type: "Capital call notices",
    parseData: [
      {
        image_url: "https://huggingface.co/datasets/ahmed-pro/demo-asbi/resolve/main/testPdf2_page_1.jpg",
        extracted_data: {
          fundName: {
            value: "Prime Storage Fund III SCA RAIF",
            bbox: [95, 120, 436, 145] as [number, number, number, number],
            confidence: 1.0
          },
          callDate: {
            value: "2024-03-18",
            bbox: [143, 335, 277, 350] as [number, number, number, number],
            confidence: 1.0
          },
          investor_name: {
            value: "WP PCC Limited PSG Cell",
            bbox: [143, 375, 362, 390] as [number, number, number, number],
            confidence: 1.0
          },
          amount_due: {
            value: "USD 1,863,315",
            bbox: [205, 685, 338, 695] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-03-29",
                bbox: [557, 685, 699, 695] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Capital Contribution for Prime Storage Fund III SCA RAIF - Sub Fund V",
                bbox: [168, 655, 1115, 670] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: "1,863,315",
                bbox: [805, 875, 950, 890] as [number, number, number, number],
                confidence: 1.0
              },
              credit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 0.0
              },
              balance: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 0.0
              }
            }
          ]
        }
      },
      {
        image_url: "https://huggingface.co/datasets/ahmed-pro/demo-asbi/resolve/main/testPdf2_page_2.jpg",
        extracted_data: {
          fund_name: {
            value: "Prime Storage Fund III SCA RAIF",
            bbox: [95, 120, 436, 144] as [number, number, number, number],
            confidence: 1.0
          },
          call_date: {
            value: "2024-03-29",
            bbox: [575, 208, 718, 222] as [number, number, number, number],
            confidence: 1.0
          },
          investorName: {
            value: "WP PCC Limited PSG Cell - Additional Details",
            bbox: [143, 375, 362, 390] as [number, number, number, number],
            confidence: 1.0
          },
          amountDue: {
            value: "USD 1,863,315",
            bbox: [234, 208, 367, 222] as [number, number, number, number],
            confidence: 1.0
          },
          currency: {
            value: "USD",
            bbox: [234, 208, 264, 222] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-03-29",
                bbox: [575, 208, 718, 222] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Capital Call - Prime SF III Sub Fund V - Page 2",
                bbox: [565, 271, 751, 285] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: "1,863,315",
                bbox: [380, 249, 495, 263] as [number, number, number, number],
                confidence: 1.0
              },
              credit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 0.0
              },
              balance: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 0.0
              }
            }
          ]
        }
      }
    ]
  },
  { 
    documentId: "3",
    fileName: "Investment portfolio",
    status: "approved",
    uploadDate: "10-03-2025",
    relatedTo: "Investment",
    assignedTo: "Michael Williams",
    type: "Investment summaries",
    parseData: [
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_2.jpg",
        extracted_data: {
          portfolio_name: {
            value: "Growth Investment Portfolio",
            bbox: [95, 120, 436, 145] as [number, number, number, number],
            confidence: 1.0
          },
          total_value: {
            value: "USD 2,500,000",
            bbox: [205, 685, 338, 695] as [number, number, number, number],
            confidence: 1.0
          },
          date: {
            value: "2024-03-10",
            bbox: [143, 335, 277, 350] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-03-10",
                bbox: [557, 685, 699, 695] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Portfolio Valuation Update",
                bbox: [168, 655, 1115, 670] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 0.0
              },
              credit: {
                value: "2,500,000",
                bbox: [805, 875, 950, 890] as [number, number, number, number],
                confidence: 1.0
              },
              balance: {
                value: "2,500,000",
                bbox: [805, 875, 950, 890] as [number, number, number, number],
                confidence: 1.0
              }
            }
          ]
        }
      }
    ]
  },
  { 
    documentId: "4",
    fileName: "Q4 Financial Report.pdf",
    status: "rejected",
    uploadDate: "15-03-2025",
    relatedTo: "Reporting",
    assignedTo: "Sarah Johnson",
    type: "Financial reports",
    parseData: [
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_3.jpg",
        extracted_data: {
          report_title: {
            value: "Q4 2024 Financial Report",
            bbox: [95, 120, 436, 145] as [number, number, number, number],
            confidence: 1.0
          },
          reporting_period: {
            value: "Q4 2024",
            bbox: [143, 335, 277, 350] as [number, number, number, number],
            confidence: 1.0
          },
          total_revenue: {
            value: "USD 5,200,000",
            bbox: [205, 685, 338, 695] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-12-31",
                bbox: [557, 685, 699, 695] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Q4 Revenue Summary",
                bbox: [168, 655, 1115, 670] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 0.0
              },
              credit: {
                value: "5,200,000",
                bbox: [805, 875, 950, 890] as [number, number, number, number],
                confidence: 1.0
              },
              balance: {
                value: "5,200,000",
                bbox: [805, 875, 950, 890] as [number, number, number, number],
                confidence: 1.0
              }
            }
          ]
        }
      }
    ]
  },
  { 
    documentId: "5",
    fileName: "Tax Documents 2024.pdf",
    status: "pending",
    uploadDate: "20-03-2025",
    relatedTo: "Tax",
    assignedTo: "David Miller",
    type: "Tax documents",
    parseData: [
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_4.jpg",
        extracted_data: {}
      }
    ]
  },
  { 
    documentId: "6",
    fileName: "Bank reconciliation Jan.xlsx",
    status: "approved",
    uploadDate: "25-03-2025",
    relatedTo: "Bank Account",
    assignedTo: "John Doe",
    type: "Bank statement",
    parseData: [
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_4.jpg",
        extracted_data: {
          account_holder: {
            value: "639B801915E ASAS HOLDINGS LIMITED",
            bbox: [247, 218, 570, 234] as [number, number, number, number],
            confidence: 1.0
          },
          account_number: {
            value: "639C223053A",
            bbox: [247, 242, 360, 258] as [number, number, number, number],
            confidence: 1.0
          },
          currency: {
            value: "USD",
            bbox: [508, 466, 536, 480] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-06-04",
                bbox: [119, 536, 200, 552] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Debit - Outgoing payment (317413327) In favour of WP PCC Limited - NEL Cell St Peter Port GG",
                bbox: [219, 536, 459, 608] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: "60,045.00",
                bbox: [788, 536, 878, 552] as [number, number, number, number],
                confidence: 1.0
              },
              credit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              balance: {
                value: "67,118.00",
                bbox: [1070, 536, 1128, 552] as [number, number, number, number],
                confidence: 1.0
              }
            }
          ]
        }
      },
      {
        image_url: "https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/testPdf_page_5.jpg",
        extracted_data: {
          account_holder: {
            value: "639B801915E ASAS HOLDINGS LIMITED",
            bbox: [247, 218, 570, 235] as [number, number, number, number],
            confidence: 1.0
          },
          account_number: {
            value: "639C717847J",
            bbox: [247, 242, 360, 259] as [number, number, number, number],
            confidence: 1.0
          },
          currency: {
            value: "USD",
            bbox: [468, 242, 495, 259] as [number, number, number, number],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-06-12",
                bbox: [119, 628, 200, 644] as [number, number, number, number],
                confidence: 1.0
              },
              description: {
                value: "Partial redemption (322494628) ACCESS FUND SPC",
                bbox: [219, 628, 412, 664] as [number, number, number, number],
                confidence: 1.0
              },
              debit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              credit: {
                value: "65,159.73",
                bbox: [948, 628, 1018, 644] as [number, number, number, number],
                confidence: 1.0
              },
              balance: {
                value: "132,277.73",
                bbox: [1070, 628, 1128, 644] as [number, number, number, number],
                confidence: 1.0
              }
            }
          ]
        }
      }
    ]
  },
  { 
    documentId: "7",
    fileName: "Asas distribution notice.pdf",
    status: "processing",
    uploadDate: "19-03-2025",
    relatedTo: "Investment",
    assignedTo: "Ahmed Doue",
    type: "Distribution notices",
    parseData: [
      {
        image_url: "https://huggingface.co/datasets/ahmed-pro/demo-asbi/resolve/main/doc138.png",
        extracted_data: {
          fund_name: {
            value: "BECO Booster Fund III, LP",
            bbox: [null, null, null, null] as [null, null, null, null],
            confidence: 1.0
          },
          distribution_date: {
            value: "2024-03-28",
            bbox: [194, 314, 370, 341] as [number, number, number, number],
            confidence: 0.968975305557251
          },
          investor_name: {
            value: "ASAS Holdings Limited",
            bbox: [193, 382, 459, 413] as [number, number, number, number],
            confidence: 0.9933110475540161
          },
          amount_distributed: {
            value: "USD17,897.99",
            bbox: [1251, 1102, 1371, 1133] as [number, number, number, number],
            confidence: 0.9967818856239319
          },
          currency: {
            value: "USD",
            bbox: [null, null, null, null] as [null, null, null, null],
            confidence: 1.0
          },
          transactions: [
            {
              date: {
                value: "2024-03-28",
                bbox: [194, 314, 370, 341] as [number, number, number, number],
                confidence: 0.968975305557251
              },
              description: {
                value: "Distribution from BECO Booster Fund III, LP",
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              debit: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              },
              credit: {
                value: "USD17,897.99",
                bbox: [1251, 1102, 1371, 1133] as [number, number, number, number],
                confidence: 0.9967818856239319
              },
              balance: {
                value: null,
                bbox: [null, null, null, null] as [null, null, null, null],
                confidence: 1.0
              }
            }
          ]
        }
      }
    ]
  }
];

export class LabelingApiService {
  static async fetchLabelingData(documentId: string): Promise<LabelingData | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const document = mockDocuments.find(doc => doc.documentId === documentId);
    if (!document) return null;
    
    return {
      documentId: document.documentId,
      file_name: document.fileName,
      status: document.status,
      parse_data: document.parseData.map(page => ({
        image_url: page.image_url,
        extracted_data: page.extracted_data
      })),
      currentPage: 0
    };
  }

  static async getDocumentsList(): Promise<Array<{
    documentId: string;
    fileName: string;
    status: string;
    uploadDate: string;
    relatedTo: string;
    assignedTo: string;
    type: string;
  }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockDocuments.map(doc => ({
      documentId: doc.documentId,
      fileName: doc.fileName,
      status: doc.status,
      uploadDate: doc.uploadDate,
      relatedTo: doc.relatedTo,
      assignedTo: doc.assignedTo,
      type: doc.type
    }));
  }

  static async saveLabels(documentId: string, pageIndex: number, labels: any): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Saving labels for document ${documentId}, page ${pageIndex}:`, labels);
    
    // Find the document and update bbox coordinates
    const document = mockDocuments.find(doc => doc.documentId === documentId);
    if (!document || !document.parseData[pageIndex]) {
      console.warn(`Document ${documentId} or page ${pageIndex} not found`);
      return false;
    }
    
    const pageData = document.parseData[pageIndex];
    
    // Handle different label formats
    if (Array.isArray(labels)) {
      // Direct labels array (from document labels change)
      labels.forEach((labelData: any) => {
        const fieldName = labelData.field_name;
        const bbox = labelData.bbox;
        
        if (fieldName && bbox && pageData.extracted_data[fieldName]) {
          // Update bbox for regular fields
          (pageData.extracted_data[fieldName] as ExtractedField).bbox = bbox;
          // Also update the value if provided
          if (labelData.field_value && labelData.field_value !== "-") {
            (pageData.extracted_data[fieldName] as ExtractedField).value = labelData.field_value;
          }
        }
      });
    } else if (Array.isArray(labels) && labels.every(Array.isArray)) {
      // Nested arrays (from line items change)
      if ('transactions' in pageData.extracted_data) {
        const transactionData = pageData.extracted_data.transactions as ExtractedTransaction[];
        if (transactionData) {
          labels.forEach((transactionLabels: any[], transactionIndex: number) => {
            if (transactionData[transactionIndex]) {
              transactionLabels.forEach((labelData: any) => {
                const fieldName = labelData.field_name;
                const bbox = labelData.bbox;
                
                if (fieldName && bbox && transactionData[transactionIndex][fieldName]) {
                  // Update bbox for transaction fields
                  (transactionData[transactionIndex][fieldName] as ExtractedField).bbox = bbox;
                  // Also update the value if provided
                  if (labelData.field_value && labelData.field_value !== "-") {
                    (transactionData[transactionIndex][fieldName] as ExtractedField).value = labelData.field_value;
                  }
                }
              });
            }
          });
        }
      }
    }
    
    console.log(`Successfully updated bbox coordinates for document ${documentId}, page ${pageIndex}`);
    return true;
  }

  static async saveSession(documentId: string, sessionData: any): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Saving session for document ${documentId}:`, sessionData);
    return true;
  }

  static async updateApprovalStatus(documentId: string, status: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const docIndex = mockDocuments.findIndex(doc => doc.documentId === documentId);
    if (docIndex !== -1) {
      mockDocuments[docIndex].status = status;
      console.log(`Updated document ${documentId} status to ${status}`);
      return true;
    }
    return false;
  }

  static async updateDocument(documentId: string, updateData: {
    extractedData?: Record<string, any>;
    transactions?: any[];
    status?: string;
    currentPage?: number;
  }): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const docIndex = mockDocuments.findIndex(doc => doc.documentId === documentId);
    if (docIndex === -1) return false;

    const document = mockDocuments[docIndex];
    
    // Update status if provided
    if (updateData.status) {
      document.status = updateData.status;
      
      // Also update the MockApiService documents for Document Vault sync
      try {
        const { MockApiService } = await import('./mockApi');
        await MockApiService.updateDocument(documentId, { 
          status: updateData.status as any,
          extractedData: updateData.extractedData 
        });
      } catch (error) {
        console.error('Failed to sync with MockApiService:', error);
      }
    }

    // Update extracted data and transactions for the current page
    if (updateData.currentPage !== undefined && document.parseData[updateData.currentPage]) {
      const currentPageData = document.parseData[updateData.currentPage];
      
      // Update extracted fields
      if (updateData.extractedData) {
        Object.entries(updateData.extractedData).forEach(([key, value]) => {
          if (currentPageData.extracted_data[key] && value !== "-" && typeof value === 'string') {
            (currentPageData.extracted_data[key] as ExtractedField).value = value;
          }
        });
      }

      // Update transaction data
      if (updateData.transactions && 'transactions' in currentPageData.extracted_data && currentPageData.extracted_data.transactions) {
        const existingTransactions = currentPageData.extracted_data.transactions as ExtractedTransaction[];
        updateData.transactions.forEach((updatedTransaction, index) => {
          if (existingTransactions[index]) {
            // Update each transaction field
            Object.entries(updatedTransaction).forEach(([field, value]) => {
              if (field !== 'id' && field !== 'verified' && field !== 'transactionIndex' && 
                  field in existingTransactions[index] && 
                  value !== "-" && typeof value === 'string') {
                (existingTransactions[index][field as keyof ExtractedTransaction] as ExtractedField).value = value;
              }
            });
          }
        });
      }
    }

    console.log(`Updated document ${documentId} with new data:`, updateData);
    return true;
  }

  // Legacy support - map old documentId format
  static async fetchLabelingDataLegacy(documentId: string): Promise<LabelingData | null> {
    // Handle legacy doc1, doc2 format by mapping to new IDs
    const legacyMap: Record<string, string> = {
      'doc1': '1',
      'doc2': '2',
      'doc3': '3',
      'doc4': '4',
      'doc5': '5',
      'doc6': '6',
      'doc7': '7'
    };
    
    const mappedId = legacyMap[documentId] || documentId;
    return this.fetchLabelingData(mappedId);
  }
}