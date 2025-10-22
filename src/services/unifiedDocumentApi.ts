import { Document, DocumentListResponse } from '@/types/document';
import { DocumentApiService } from './documentApi';

// Unified API service that uses the same /v1/document endpoint for both document vault and labeling
export const UnifiedDocumentApi = {
  // Get all documents with pagination
  async getDocuments(page: number = 0, pageSize: number = 20): Promise<DocumentListResponse> {
    return DocumentApiService.getDocuments(page, pageSize);
  },

  // Get a single document by ID - used by labeling page
  async getDocumentById(documentId: string): Promise<Document | null> {
    return DocumentApiService.getDocumentById(documentId);
  },

  // Get documents list for labeling sidebar
  async getDocumentsForLabeling(): Promise<Array<{
    documentId: string;
    fileName: string;
    status: string;
    uploadDate: string;
    relatedTo: string;
    assignedTo: string;
    type: string;
  }>> {
    const response = await this.getDocuments(0, 100);
    
    return response.content.map(doc => ({
      documentId: doc.id,
      fileName: doc.name || 'Unnamed Document',
      status: doc.documentStatus,
      uploadDate: new Date(doc.createdAt).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      relatedTo: doc.documentType || 'Document',
      assignedTo: 'User',
      type: doc.extractedData.category || 'Unknown'
    }));
  },

  // Transform API document format to labeling format
  transformToLabelingData(doc: Document) {
    const hasExtractedData = doc.extractedData && 
      doc.extractedData.extracted_data && 
      doc.extractedData.extracted_data.length > 0;

    return {
      documentId: doc.id,
      file_name: doc.name || 'Unnamed Document',
      status: doc.documentStatus,
      parse_data: hasExtractedData 
        ? doc.extractedData.extracted_data!.map(page => ({
            image_url: page.image_url,
            extracted_data: page.extracted_data
          }))
        : [],
      currentPage: 0
    };
  },

  // Save label updates
  async saveLabels(documentId: string, pageIndex: number, labels: any): Promise<boolean> {
    // In development, just return success
    if (process.env.NODE_ENV === 'development') {
      console.log('Mock: Saving labels for document', documentId, 'page', pageIndex, labels);
      return Promise.resolve(true);
    }

    // Production implementation would go here
    return true;
  },

  // Save session data
  async saveSession(documentId: string, sessionData: any): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      console.log('Mock: Saving session for document', documentId, sessionData);
      return Promise.resolve(true);
    }

    // Production implementation would go here
    return true;
  },

  // Update document status
  async updateApprovalStatus(documentId: string, status: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      console.log('Mock: Updating approval status for document', documentId, 'to', status);
      return Promise.resolve(true);
    }

    // Production implementation would go here
    return true;
  },

  // Update document data
  async updateDocument(
    documentId: string,
    updateData: {
      extractedData?: Record<string, any>;
      transactions?: any[];
      status?: string;
      currentPage?: number;
    }
  ): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      console.log('Mock: Updating document', documentId, updateData);
      return Promise.resolve(true);
    }

    // Production implementation would go here
    return true;
  }
};
