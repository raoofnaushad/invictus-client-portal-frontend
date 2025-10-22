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

export interface PageExtractedData {
  image_url: string;
  extracted_data: {
    [key: string]: ExtractedField | ExtractedTransaction[];
    transactions?: ExtractedTransaction[];
  };
}

export interface DocumentExtractedData {
  num_pages?: number;
  category?: string;
  occurrences?: number;
  classification_results?: Array<{
    image_url: string;
    extracted_data: {
      category: string;
    };
  }>;
  extracted_data?: PageExtractedData[];
}

export interface Document {
  id: string;
  createdAt: string;
  updatedAt: string;
  lasEventType: string | null;
  lastEventAt: string | null;
  name: string | null;
  description: string | null;
  filePath: string;
  documentType: string | null;
  documentStatus: string;
  clientId: string;
  extractedData: DocumentExtractedData;
  isNew: boolean;
}

export interface DocumentUploadResponse {
  id: string;
  status: number;
  message: string;
}

export interface DocumentListResponse {
  content: Document[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
