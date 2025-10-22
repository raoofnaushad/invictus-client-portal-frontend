
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LabelingApiService } from "@/services/labelingApi";

interface ApprovalSectionProps {
  approvalStatus: string;
  assignedTo: string;
  priority: string;
  documentStatus?: string;
  selectedDocumentId?: string;
  extractedData?: Record<string, any>;
  transactions?: any[];
  currentPage?: number;
  onApprovalStatusChange: (value: string) => void;
  onAssignedToChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSubmit: (status: string) => void;
}

export const ApprovalSection = ({
  approvalStatus,
  assignedTo,
  priority,
  documentStatus = "processing",
  selectedDocumentId,
  extractedData,
  transactions,
  currentPage = 0,
  onApprovalStatusChange,
  onAssignedToChange,
  onPriorityChange,
  onSubmit
}: ApprovalSectionProps) => {
  const navigate = useNavigate();

  const handleStatusChange = async (value: string) => {
    onApprovalStatusChange(value);
    
    // Update document status and show toast
    let statusMessage = "";
    let newDocumentStatus = "";
    
    switch (value) {
      case "approved":
        statusMessage = "Document approved successfully!";
        newDocumentStatus = "approved";
        break;
      case "reject":
        statusMessage = "Document rejected";
        newDocumentStatus = "rejected";
        break;
      case "reconciled":
        statusMessage = "Document marked as reconciled";
        newDocumentStatus = "reconciled";
        break;
      case "not-reconciled":
        statusMessage = "Document marked as not reconciled";
        newDocumentStatus = "not-reconciled";
        break;
      case "move-next":
        statusMessage = "Moving to next file";
        newDocumentStatus = "approved";
        break;
      case "move-prev":
        statusMessage = "Moving to previous stage";
        newDocumentStatus = "pending";
        break;
      case "view-routing":
        statusMessage = "Viewing approval routing";
        return; // Don't redirect for this option
      default:
        return;
    }
    
    // Update document with current field values, transactions, and status
    if (selectedDocumentId && newDocumentStatus) {
      try {
        await LabelingApiService.updateDocument(selectedDocumentId, {
          extractedData,
          transactions,
          status: newDocumentStatus,
          currentPage
        });
        
        // Call the onSubmit callback with the new status
        onSubmit(newDocumentStatus);
        
        toast.success(statusMessage);
        
        // Redirect to document table after a short delay
        setTimeout(() => {
          navigate('/document-vault');
        }, 1500);
      } catch (error) {
        console.error("Failed to update document:", error);
        toast.error("Failed to update document");
      }
    }
  };

  // Don't show approval section for approved documents
  if (documentStatus === "approved") {
    return null;
  }

  return (
    <div className="p-4 border-t border-gray-200 flex justify-end">
      <Select value={approvalStatus} onValueChange={handleStatusChange}>
        <SelectTrigger 
          className="border-0 text-white font-medium [&>svg]:text-white"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 15px',
            gap: '8px',
            width: '149px',
            height: '36px',
            background: '#14CA74',
            borderRadius: '12px'
          }}
        >
          <SelectValue placeholder="Approve File" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg border border-gray-200 z-50">
          {documentStatus === "pending" ? (
            // For pending documents, only show reject option
            <SelectItem value="reject" className="text-red-600">Reject file</SelectItem>
          ) : (
            // For processing/other statuses, show all options
            <>
              <SelectItem value="move-next">Move to next file on approval</SelectItem>
              <SelectItem value="view-routing">View approval routing</SelectItem>
              <SelectItem value="move-prev">Move to prev stage</SelectItem>
              <SelectItem value="reject" className="text-red-600">Reject file</SelectItem>
              <SelectItem value="reconciled">Reconciled</SelectItem>
              <SelectItem value="not-reconciled">Not Reconciled</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
