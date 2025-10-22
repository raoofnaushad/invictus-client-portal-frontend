import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { DocumentViewer } from "@/components/DocumentViewer";
import { ValidationPanel } from "@/components/ValidationPanel";
import { TransactionTable } from "@/components/TransactionTable";
import { DocumentHeader } from "@/components/DocumentHeader";
import { ApprovalSection } from "@/components/ApprovalSection";
import { RightSidebar } from "@/components/RightSidebar";
import { PendingDocumentMessage } from "@/components/PendingDocumentMessage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Share, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ExtractedField, ExtractedTransaction } from "@/services/labelingApi";
import { UnifiedDocumentApi } from "@/services/unifiedDocumentApi";

const LabelingPage = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('documentId') || '1';
  
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(searchParams.get('documentId') || '1');
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [labelingData, setLabelingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [extractedData, setExtractedData] = useState<Record<string, any>>({});
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchLabelingData(selectedDocumentId);
  }, [selectedDocumentId]);

  useEffect(() => {
    if (documentId && documentId !== selectedDocumentId) {
      setSelectedDocumentId(documentId);
    }
  }, [documentId]);

  useEffect(() => {
    if (labelingData) {
      updateCurrentPageData();
    }
  }, [labelingData, currentPage]);

  const fetchLabelingData = async (docId: string) => {
    setLoading(true);
    try {
      const doc = await UnifiedDocumentApi.getDocumentById(docId);
      if (doc) {
        const transformedData = UnifiedDocumentApi.transformToLabelingData(doc);
        setLabelingData(transformedData);
        setCurrentPage(0);
      } else {
        setLabelingData(null);
      }
    } catch (error) {
      console.error('Failed to fetch labeling data:', error);
      setLabelingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setCurrentPage(0);
    setEditLabelId(null);
  };

  const updateCurrentPageData = () => {
    if (!labelingData || !labelingData.parse_data || labelingData.parse_data.length === 0) return;
    if (!labelingData.parse_data[currentPage]) return;
    
    const pageData = labelingData.parse_data[currentPage];
    const extractedFields: Record<string, any> = {};
    const pageTransactions: any[] = [];

    // Extract dynamic fields from extracted_data
    Object.entries(pageData.extracted_data).forEach(([key, field]) => {
      if (key === 'transactions') {
        // Handle transactions separately
        const transactionData = field as ExtractedTransaction[];
        transactionData.forEach((transaction, index) => {
          const transactionObj: any = { 
            id: index + 1, 
            verified: false,
            transactionIndex: index 
          };
          
          // Extract all available fields dynamically from each transaction, including null values
          Object.entries(transaction).forEach(([transField, transFieldData]) => {
            const fieldData = transFieldData as ExtractedField;
            // Include field even if value is null, but display as "-"
            transactionObj[transField] = fieldData.value || "-";
          });
          
          pageTransactions.push(transactionObj);
        });
      } else {
        // Regular fields - include even null values
        const fieldData = field as ExtractedField;
        extractedFields[key] = fieldData.value || "-";
      }
    });

    console.log('Processed transactions:', pageTransactions);
    console.log('Processed extracted fields:', extractedFields);
    
    setExtractedData(extractedFields);
    setTransactions(pageTransactions);
  };

  const handleFieldUpdate = (field: string, value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTransactionUpdate = (id: number, field: string, value: string | boolean) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, [field]: value }
          : transaction
      )
    );
  };

  const [editLabelId, setEditLabelId] = useState<string | null>(null);

  const handleEditDocumentBbox = (field: string) => {
    // Find the label for this field in document labels
    const currentLabels = getCurrentPageLabels;
    const labelToEdit = currentLabels.find(label => label.field === field);
    if (labelToEdit) {
      setEditLabelId(labelToEdit.id);
      console.log(`Triggering edit mode for document field: ${field}, labelId: ${labelToEdit.id}`);
    }
  };

  const handleEditTransactionBbox = (field: string, transactionIndex: number) => {
    // Find the label for this field and transaction in line item labels
    const currentLabels = getCurrentPageTransactionLabels;
    const labelToEdit = currentLabels.find(label => 
      label.field === field && label.itemIndex === transactionIndex
    );
    if (labelToEdit) {
      setEditLabelId(labelToEdit.id);
      console.log(`Triggering edit mode for transaction field: ${field}, transaction: ${transactionIndex}, labelId: ${labelToEdit.id}`);
    }
  };

  const handleEditLabel = (labelId: string, field: string, type: "document" | "lineItem") => {
    console.log(`Edit label requested: ${labelId}, field: ${field}, type: ${type}`);
    // Clear the edit state when editing is done
    setEditLabelId(null);
  };

  const handleApprovalSubmit = async (status: string) => {
    if (!labelingData) return;
    
    try {
      // Update document with current field values, transactions, and status
      await UnifiedDocumentApi.updateDocument(selectedDocumentId, {
        extractedData,
        transactions,
        status,
        currentPage
      });
      
      toast.success("Document updated successfully!");
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("Failed to update document");
    }
  };

  const handleNextPage = () => {
    if (labelingData && currentPage < labelingData.parse_data.length - 1) {
      setCurrentPage(prev => prev + 1);
      setEditLabelId(null); // Clear edit mode when changing pages
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setEditLabelId(null); // Clear edit mode when changing pages
    }
  };

  const getFieldColor = (fieldName: string): string => {
    const fieldColors: Record<string, string> = {
      "fund_name": "#3B82F6",
      "call_date": "#8B5CF6", 
      "investor_name": "#10B981",
      "amount_due": "#F59E0B",
      "currency": "#EF4444",
      "date": "#06B6D4",
      "description": "#8B5CF6",
      "debit": "#10B981",
      "credit": "#F59E0B",
      "balance": "#EF4444"
    };
    return fieldColors[fieldName] || "#9CA3AF";
  };

  const getCurrentPageLabels = useMemo(() => {
    if (!labelingData || !labelingData.parse_data[currentPage]) return [];
    
    const pageData = labelingData.parse_data[currentPage];
    const labels: any[] = [];

    // Convert extracted fields to label format for display
    Object.entries(pageData.extracted_data).forEach(([key, field]) => {
      if (key === 'transactions') return; // Handle transactions separately
      
      const fieldData = field as ExtractedField;
      // Show labels for all fields, including those with null values but valid bboxes
      if (fieldData.bbox[0] !== null) {
        // Convert absolute bbox to percentage coordinates for LabelStudio
        const [xmin, ymin, xmax, ymax] = fieldData.bbox as [number, number, number, number];
        // Assuming image dimensions (you may need to adjust these)
        const imageWidth = 1200;
        const imageHeight = 1600;
        
        labels.push({
          id: `field-${key}`,
          text: fieldData.value || "-",
          x: (xmin / imageWidth) * 100,
          y: (ymin / imageHeight) * 100,
          width: ((xmax - xmin) / imageWidth) * 100,
          height: ((ymax - ymin) / imageHeight) * 100,
          field: key,
          color: getFieldColor(key)
        });
      }
    });

    return labels;
  }, [labelingData, currentPage]);

  const getCurrentPageTransactionLabels = useMemo(() => {
    if (!labelingData || !labelingData.parse_data[currentPage]) return [];
    
    const pageData = labelingData.parse_data[currentPage];
    const labels: any[] = [];

    if (pageData.extracted_data.transactions) {
      const transactionData = pageData.extracted_data.transactions as ExtractedTransaction[];
      
      transactionData.forEach((transaction, transactionIndex) => {
        Object.entries(transaction).forEach(([transField, transFieldData]) => {
          const fieldData = transFieldData as ExtractedField;
          // Show labels for all fields, including those with null values but valid bboxes
          if (fieldData.bbox[0] !== null) {
            const [xmin, ymin, xmax, ymax] = fieldData.bbox as [number, number, number, number];
            const imageWidth = 1200;
            const imageHeight = 1600;
            
            labels.push({
              id: `transaction-${transactionIndex}-${transField}`,
              text: fieldData.value || "-",
              x: (xmin / imageWidth) * 100,
              y: (ymin / imageHeight) * 100,
              width: ((xmax - xmin) / imageWidth) * 100,
              height: ((ymax - ymin) / imageHeight) * 100,
              field: transField,
              color: getFieldColor(transField),
              itemIndex: transactionIndex
            });
          }
        });
      });
    }

    return labels;
  }, [labelingData, currentPage]);

  const handleDocumentLabelsChange = async (labels: any[]) => {
    // Transform labels to the requested JSON format: {field_name, field_value, bbox}
    const documentLabelsJson = labels.map(label => {
      const imageWidth = 1200;
      const imageHeight = 1600;
      
      // Convert percentage coordinates back to absolute
      const xmin = Math.round((label.x / 100) * imageWidth);
      const ymin = Math.round((label.y / 100) * imageHeight);
      const xmax = Math.round(((label.x + label.width) / 100) * imageWidth);
      const ymax = Math.round(((label.y + label.height) / 100) * imageHeight);
      
      return {
        field_name: label.field || label.label,
        field_value: label.text || label.ocr_text || "",
        bbox: [xmin, ymin, xmax, ymax]
      };
    });
    
    console.log("Document Labels JSON:", documentLabelsJson);
    
    // Update extracted data based on labels
    const updatedExtractedData = { ...extractedData };
    documentLabelsJson.forEach(labelData => {
      const fieldName = labelData.field_name;
      const textValue = labelData.field_value;
      
      if (textValue && textValue !== "Click to edit...") {
        updatedExtractedData[fieldName] = textValue;
      }
    });
    setExtractedData(updatedExtractedData);
    
    try {
      await UnifiedDocumentApi.saveLabels(selectedDocumentId, currentPage, documentLabelsJson);
    } catch (error) {
      console.error("Failed to update document labels:", error);
    }
  };

  const handleLineItemLabelsChange = async (labels: any[]) => {
    // Transform line item labels to the requested format
    const lineItemsByTransaction: Record<number, any[]> = {};
    labels.forEach(label => {
      if (label.itemIndex !== undefined) {
        if (!lineItemsByTransaction[label.itemIndex]) {
          lineItemsByTransaction[label.itemIndex] = [];
        }
        
        const imageWidth = 1200;
        const imageHeight = 1600;
        
        // Convert percentage coordinates back to absolute
        const xmin = Math.round((label.x / 100) * imageWidth);
        const ymin = Math.round((label.y / 100) * imageHeight);
        const xmax = Math.round(((label.x + label.width) / 100) * imageWidth);
        const ymax = Math.round(((label.y + label.height) / 100) * imageHeight);
        
        lineItemsByTransaction[label.itemIndex].push({
          field_name: label.field || label.label,
          field_value: label.text || label.ocr_text || "",
          bbox: [xmin, ymin, xmax, ymax]
        });
      }
    });
    
    const lineItemsJson = Object.values(lineItemsByTransaction);
    console.log("Line Items JSON:", lineItemsJson);
    
    // Update transactions based on line item labels
    const updatedTransactions = [...transactions];
    labels.forEach(label => {
      const fieldName = label.field || label.label;
      const textValue = label.text || label.ocr_text;
      
      if (textValue && textValue !== "Click to edit..." && label.itemIndex !== undefined) {
        const transactionIndex = label.itemIndex;
        if (updatedTransactions[transactionIndex]) {
          updatedTransactions[transactionIndex][fieldName] = textValue;
        }
      }
    });
    setTransactions(updatedTransactions);
    
    try {
      await UnifiedDocumentApi.saveLabels(selectedDocumentId, currentPage, lineItemsJson);
    } catch (error) {
      console.error("Failed to update line item labels:", error);
    }
  };

  const handleSaveSession = async () => {
    if (!labelingData) return;
    
    try {
      await UnifiedDocumentApi.saveSession(selectedDocumentId, labelingData);
      toast.success("Session saved successfully!");
    } catch (error) {
      console.error("Failed to save session:", error);
      toast.error("Failed to save session");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-muted-foreground">Loading labeling data...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DocumentSidebar 
        selectedDocumentId={selectedDocumentId}
        onDocumentSelect={handleDocumentSelect}
      />
      
      <div className="flex-1 flex">
        <div className="flex-1 flex">
          {!labelingData || !labelingData.parse_data || labelingData.parse_data.length === 0 ? (
            <PendingDocumentMessage />
          ) : labelingData.parse_data[currentPage] ? (
            <DocumentViewer 
              key={`page-${currentPage}`}
              imageUrl={labelingData.parse_data[currentPage].image_url}
              extractedData={extractedData}
              onDocumentLabelsChange={handleDocumentLabelsChange}
              onLineItemLabelsChange={handleLineItemLabelsChange}
              existingDocumentLabels={getCurrentPageLabels}
              existingLineItemLabels={getCurrentPageTransactionLabels}
              onEditLabel={handleEditLabel}
              editLabelId={editLabelId}
            />
          ) : (
            <PendingDocumentMessage />
          )}

          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex flex-col">
                <h2 className="text-base font-medium text-foreground">
                  {labelingData?.file_name || "Document"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {labelingData?.parse_data.length || 1}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!labelingData || currentPage >= labelingData.parse_data.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-foreground text-background"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ValidationPanel 
                extractedData={extractedData}
                onFieldUpdate={handleFieldUpdate}
                onEditBbox={handleEditDocumentBbox}
                documentStatus={labelingData?.status}
              />
              
              <TransactionTable 
                transactions={transactions}
                onTransactionUpdate={handleTransactionUpdate}
                onEditBbox={handleEditTransactionBbox}
                documentStatus={labelingData?.status}
              />
            </div>

            <ApprovalSection
              approvalStatus={approvalStatus}
              assignedTo={assignedTo}
              priority={priority}
              documentStatus={labelingData?.status}
              onApprovalStatusChange={setApprovalStatus}
              onAssignedToChange={setAssignedTo}
              onPriorityChange={setPriority}
              onSubmit={handleApprovalSubmit}
              selectedDocumentId={selectedDocumentId}
              extractedData={extractedData}
              transactions={transactions}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      <RightSidebar 
        isOpen={rightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
        onOpen={() => setRightSidebarOpen(true)}
      />
    </div>
  );
};

export default LabelingPage;