import { Link } from "react-router-dom";
import { StandardTable } from "@/components/StandardTable";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2, FileJson } from "lucide-react";
import { Document } from "@/services/mockApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentTableProps {
  documents: Document[];
  onDelete?: (documentId: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>;
    case 'reconciled':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>;
    case 'processing':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>;
    case 'not reconcile':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const columns = [
  { key: "select", header: "", className: "w-12" },
  { key: "name", header: "Document Name" },
  { key: "uploadDate", header: "Uploaded Date" },
  { key: "type", header: "Document Type" },
  { key: "status", header: "Status" },
  { key: "relatedTo", header: "Related To" },
  { key: "assignedTo", header: "Assigned To" },
  { key: "extractedData", header: "Extracted Data" },
  { key: "actions", header: "Action" },
];

export const DocumentTable = ({ documents, onDelete }: DocumentTableProps) => {
  const handleDownloadExtractedData = (doc: Document) => {
    const extractedData = doc.extractedData;
    const dataStr = JSON.stringify(extractedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${doc.name || 'document'}_extracted_data.json`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <StandardTable columns={columns}>
      {documents.map((document, index) => (
        <TableRow 
          key={document.id}
          className={`border-b border-border hover:bg-muted/50 ${
            (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-white'
          }`}
        >
          <TableCell>
            <Checkbox />
          </TableCell>
          <TableCell>
            <Link 
              to={`/labeling?documentId=${document.id}`}
              className="font-medium text-foreground hover:text-foreground underline"
            >
              {document.name}
            </Link>
          </TableCell>
          <TableCell className="text-sm text-gray-600">{document.uploadDate}</TableCell>
          <TableCell className="text-sm text-gray-600">{document.type}</TableCell>
          <TableCell>{getStatusBadge(document.status)}</TableCell>
          <TableCell className="text-sm text-gray-600">{document.relatedTo}</TableCell>
          <TableCell className="text-sm text-gray-600">{document.assignedTo}</TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadExtractedData(document)}
              className="text-foreground hover:text-foreground underline text-sm p-0 h-auto"
            >
              <FileJson className="h-4 w-4 mr-1 inline" />
              Download JSON
            </Button>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-1 h-8 w-8 ${(index + 1) % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-100'}`}
              >
                <Download className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`p-1 h-8 w-8 text-destructive hover:text-destructive ${(index + 1) % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-100'}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{document.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete?.(document.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </StandardTable>
  );
};