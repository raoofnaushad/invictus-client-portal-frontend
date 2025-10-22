
import { useState, useEffect } from "react";
import { UnifiedLabelViewer } from "./UnifiedLabelViewer";

interface DocumentViewerProps {
  extractedData?: any;
  onDocumentLabelsChange?: (labels: any[]) => void;
  onLineItemLabelsChange?: (labels: any[]) => void;
  imageUrl?: string;
  existingDocumentLabels?: any[];
  existingLineItemLabels?: any[];
  onEditLabel?: (labelId: string, field: string, type: "document" | "lineItem") => void;
  editLabelId?: string | null;
}

export const DocumentViewer = ({ 
  extractedData = {}, 
  onDocumentLabelsChange = () => {},
  onLineItemLabelsChange = () => {},
  imageUrl = "/lovable-uploads/f52d9ae1-c841-4a49-b4e3-b76c2221bd2e.png",
  existingDocumentLabels = [],
  existingLineItemLabels = [],
  onEditLabel,
  editLabelId
}: DocumentViewerProps) => {
  const [documentLabels, setDocumentLabels] = useState<any[]>(existingDocumentLabels);
  const [lineItemLabels, setLineItemLabels] = useState<any[]>(existingLineItemLabels);

  // Update labels when props change
  useEffect(() => {
    setDocumentLabels(existingDocumentLabels);
  }, [existingDocumentLabels]);

  useEffect(() => {
    setLineItemLabels(existingLineItemLabels);
  }, [existingLineItemLabels]);

  const handleDocumentLabelUpdate = (labelId: string, newBbox: { x: number; y: number; width: number; height: number }) => {
    const updatedLabels = documentLabels.map(label => 
      label.id === labelId 
        ? { ...label, ...newBbox }
        : label
    );
    setDocumentLabels(updatedLabels);
    onDocumentLabelsChange(updatedLabels);
  };

  const handleLineItemLabelUpdate = (labelId: string, newBbox: { x: number; y: number; width: number; height: number }) => {
    const updatedLabels = lineItemLabels.map(label => 
      label.id === labelId 
        ? { ...label, ...newBbox }
        : label
    );
    setLineItemLabels(updatedLabels);
    onLineItemLabelsChange(updatedLabels);
  };

  return (
    <div className="flex-1 bg-gray-100 flex flex-col">
      <UnifiedLabelViewer
        imageUrl={imageUrl}
        documentLabels={documentLabels}
        lineItemLabels={lineItemLabels}
        onDocumentLabelUpdate={handleDocumentLabelUpdate}
        onLineItemLabelUpdate={handleLineItemLabelUpdate}
        onEditLabel={onEditLabel}
        editLabelId={editLabelId}
      />
    </div>
  );
};
