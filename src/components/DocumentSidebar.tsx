
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { File, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedDocumentApi } from "@/services/unifiedDocumentApi";

interface Document {
  documentId: string;
  fileName: string;
  status: string;
  uploadDate: string;
  relatedTo: string;
  assignedTo: string;
  type: string;
}

interface DocumentSidebarProps {
  selectedDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
}

export const DocumentSidebar = ({ selectedDocumentId, onDocumentSelect }: DocumentSidebarProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await UnifiedDocumentApi.getDocumentsForLabeling();
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const endIndex = startIndex + documentsPerPage;
  const paginatedDocuments = documents.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-500 px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {paginatedDocuments.map((doc) => (
          <div
            key={doc.documentId}
            onClick={() => onDocumentSelect(doc.documentId)}
            className={cn(
              "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
              selectedDocumentId === doc.documentId && "bg-blue-50 border-blue-200"
            )}
          >
            <div className="flex items-start space-x-3">
              <File className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {doc.fileName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {doc.uploadDate}
                </p>
                <p className="text-xs text-gray-500">
                  {doc.type.replace('_', ' ')} • {doc.relatedTo.replace('_', ' ')}
                </p>
                <div className="flex items-center mt-2">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    doc.status === "approved" 
                      ? "bg-green-100 text-green-800"
                      : doc.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : doc.status === "reconciled"
                      ? "bg-blue-100 text-blue-800"  
                      : doc.status === "pending"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  )}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Assigned to: {doc.assignedTo}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
