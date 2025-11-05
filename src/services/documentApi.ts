import { Document, DocumentUploadResponse, DocumentListResponse } from '@/types/document';

const API_BASE_URL =  'http://localhost:9002/api';

const BEARER_TOKEN = process.env.NODE_ENV === 'development' 
  ? 'mock-token' 
  : 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJuLVlkOEgxWjI1eUVLV0ZiNm9WbWEtVXZWVXRDTW5mRTNVN2Y0LU9kQWJzIn0.eyJleHAiOjE3NTcyMDAyMjMsImlhdCI6MTc1NzE2NDIyMywianRpIjoiNTBjOWY1NjgtNGJjZC00YTMzLWE5YjAtZDlhNjgxNTBkODkwIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jbGllbnQtcG9ydGFsIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImZhYTliYzk3LTA5MDQtNGI0Zi04NThmLTY3MTNjMGUwMWQ4MyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFkbWluLWNsaWVudCIsInNpZCI6IjFjYzU3ZTEwLWQwMTYtNDJhOS04MGQwLTlkN2MwZmY5YWU3MyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtY2xpZW50LXBvcnRhbCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJhaG1lZCBjaGFvdWNoIHRlc3QiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhaG1lZC5jaC5xYUBhc2JpdGVjaC5haSIsImdpdmVuX25hbWUiOiJhaG1lZCBjaGFvdWNoIiwiZmFtaWx5X25hbWUiOiJ0ZXN0IiwiZW1haWwiOiJhaG1lZC5jaC5xYUBhc2JpdGVjaC5haSJ9.nq1WlWCvOaRwPQaN2ah_TDJNsGrLFCzkYlTSOQ-21Guohus8ReC_IlE_jdLU5ezSIFhexgeyGYU2ntZs-sEQL5lQnRIDlh8h-xQADlPmFBGye4JgoFvmfNjpZr8wGsj3UWfesvtYVDApLA_LFWfIWrhIdDx2sv4xMzHCGmFrFc5IW-VKPcD678f-e7YiRboQlk257rpmDCEok68B32owwUVtYuZYzOlvZZzL29bDWb73IfCMhkkSaR4POlUf_jvSQxjUeqQrbwmwoFSICvsTMusQGsQR_lMXDzpLXFXaV5ptH0ab8zbK8S_bg6kQGVGS6lcXkGhVn9TkICpVqwClhw';

// Mock data for development
const mockDocuments: Document[] = [
  {
    id: 'doc-e9289803-c8f2-4689-848d-25181c33bd22',
    createdAt: '2025-10-01T04:42:50.361683',
    updatedAt: '2025-10-01T04:42:50.364694',
    lasEventType: null,
    lastEventAt: null,
    name: 'activity_notice_3aSufMl4m9hOmhagr27Lkb_0xfHq5UR5y81GfpqDFFutQ.pdf',
    description: null,
    filePath: 'uploads/activity_notice.pdf',
    documentType: null,
    documentStatus: 'Processing',
    clientId: 'faa9bc97-0904-4b4f-858f-6713c0e01d83',
    extractedData: {
      num_pages: 2,
      category: 'capital_call',
      occurrences: 2,
      extracted_data: [
        {
          image_url: 'https://huggingface.co/datasets/hmedch/demo-asbi/resolve/main/activity_notice_3aSufMl4m9hOmhagr27Lkb_0xfHq5UR5y81GfpqDFFutQ_page_1.jpg',
          extracted_data: {
            fund_name: {
              value: 'BECO Booster Fund III, L.P.',
              bbox: [75, 146, 473, 172],
              confidence: 1.0
            },
            call_date: {
              value: 'June 26, 2024',
              bbox: [1058, 357, 1185, 373],
              confidence: 1.0
            },
            investor_name: {
              value: 'WP PCC Limited - BBF Cell',
              bbox: [75, 263, 525, 281],
              confidence: 1.0
            },
            amount_due: {
              value: '$353,193.00',
              bbox: [1074, 524, 1185, 539],
              confidence: 1.0
            },
            transactions: [
              {
                date: {
                  value: 'July 12, 2024',
                  bbox: [1066, 398, 1185, 414],
                  confidence: 1.0
                },
                description: {
                  value: 'Capital Call Contribution',
                  bbox: [75, 524, 183, 539],
                  confidence: 1.0
                },
                debit: {
                  value: '$353,193.00',
                  bbox: [1074, 524, 1185, 539],
                  confidence: 1.0
                },
                credit: {
                  value: null,
                  bbox: [null, null, null, null],
                  confidence: 0.0
                },
                balance: {
                  value: null,
                  bbox: [null, null, null, null],
                  confidence: 0.0
                }
              }
            ]
          }
        }
      ]
    },
    isNew: false
  },
  {
    id: 'doc-b2941a05-5df3-4c89-bc25-288a4f578cbe',
    createdAt: '2025-10-01T04:33:36.794449',
    updatedAt: '2025-10-01T04:33:36.795987',
    lasEventType: null,
    lastEventAt: null,
    name: 'VALU_PCO_132351.001_E_P500_20240801144152_5267415_1.pdf',
    description: null,
    filePath: 'uploads/valu_pco.pdf',
    documentType: null,
    documentStatus: 'Pending',
    clientId: 'faa9bc97-0904-4b4f-858f-6713c0e01d83',
    extractedData: {},
    isNew: false
  }
];

export const DocumentApiService = {
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    /*if (process.env.NODE_ENV === 'development') {
      // Mock upload response
      return new Promise((resolve) => {
        setTimeout(() => {
          const newDoc: Document = {
            id: `doc-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lasEventType: null,
            lastEventAt: null,
            name: file.name,
            description: null,
            filePath: `uploads/${file.name}`,
            documentType: null,
            documentStatus: 'Pending',
            clientId: 'faa9bc97-0904-4b4f-858f-6713c0e01d83',
            extractedData: {},
            isNew: true
          };
          mockDocuments.unshift(newDoc);
          
          resolve({
            id: newDoc.id,
            status: 202,
            message: 'Document upload accepted for processing'
          });
        }, 1000);
      });
    }*/

    // Production upload
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/v1/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  },

  async getDocuments(page: number = 0, pageSize: number = 20): Promise<DocumentListResponse> {
    
    // Production API call
    const response = await fetch(`${API_BASE_URL}/v1/documents?page=${page}&size=${pageSize}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }

    return await response.json();
  },

  async getDocumentById(documentId: string): Promise<Document | null> {
    
    // Production API call
    const response = await fetch(`${API_BASE_URL}/v1/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }

    return await response.json();
  },

  async updateDocument(documentId: string, updateData: {
      extractedData?: Record<string, any>;
      status?: string;
    }): Promise<Document | null> {
    
    // Production API call
    const response = await fetch(`${API_BASE_URL}/v1/documents/${documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({documentStatus: updateData.status, extractedData: updateData?.extractedData?.['extracted_data']  })
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }

    return await response.json();
  },

  async deleteDocument(documentId: string): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      // Mock delete
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockDocuments.findIndex(doc => doc.id === documentId);
          if (index > -1) {
            mockDocuments.splice(index, 1);
          }
          resolve();
        }, 500);
      });
    }

    // Production delete
    const response = await fetch(`${API_BASE_URL}/v1/document/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.statusText}`);
    }
  }
};