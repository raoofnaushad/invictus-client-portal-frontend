import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  X, 
  FileText, 
  Check,
  Loader2,
  ArrowLeft,
  Grid,
  List,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { UnifiedDocumentApi } from "@/services/unifiedDocumentApi";
import { Document } from "@/types/document";
import { FilterDialog } from "@/components/FilterDialog";
import { DocumentTable } from "@/components/DocumentTable";
import { cn } from "@/lib/utils";

// Map Document type to the format expected by DocumentTable
interface ApiDocument {
  id: string;
  name: string;
  uploadDate: string;
  type: string;
  status: "Processing" | "Reconciled" | "Approved" | "Rejected" | "Not reconcile" | "Pending";
  relatedTo: string;
  assignedTo: string;
  extractedData?: any;
}

interface FilterOptions {
  status?: string[];
  documentType?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
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

export default function DocumentVault() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(false);
  
  // Tab and UI states
  const [activeTab, setActiveTab] = useState("stored");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showLabelingModal, setShowLabelingModal] = useState(false);
  
  // Upload flow states
  const [uploadStep, setUploadStep] = useState<'upload' | 'processing' | 'labeling' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [storeDocument, setStoreDocument] = useState(true);
  const [extractData, setExtractData] = useState(true);

  // Load documents
  useEffect(() => {
    loadDocuments();
  }, [filters, searchTerm]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await UnifiedDocumentApi.getDocuments(0, 100);
      
      // Map to DocumentTable format
      const mappedDocs: ApiDocument[] = response.content.map((doc: Document) => ({
        id: doc.id,
        name: doc.name || 'Unnamed Document',
        uploadDate: new Date(doc.createdAt).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        type: doc.documentType || 'Document',
        status: doc.documentStatus as any,
        relatedTo: doc.extractedData.category || 'Document',
        assignedTo: 'User',
        extractedData: doc.extractedData
      }));
      
      // Apply filters
      let filteredDocs = mappedDocs;
      
      if (filters.status && filters.status.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.status?.includes(doc.status)
        );
      }
      
      if (filters.documentType && filters.documentType.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.documentType?.includes(doc.type)
        );
      }
      
      if (searchTerm) {
        filteredDocs = filteredDocs.filter(doc => 
          doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setDocuments(filteredDocs);
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
      setUploadStep('processing');
      setShowUploadModal(false);
      setShowProcessingModal(true);
      
      // Simulate processing
      setTimeout(() => {
        setUploadStep('labeling');
        setShowProcessingModal(false);
        setShowLabelingModal(true);
      }, 3000);
    }
  };

  const handleSubmitLabeling = async () => {
    if (!selectedFile) return;
    
    try {
      // Use DocumentApiService for upload
      const { DocumentApiService } = await import('@/services/documentApi');
      await DocumentApiService.uploadDocument(selectedFile);
      
      setShowLabelingModal(false);
      
      toast({
        title: "Document uploaded successfully",
        description: "The document has been processed and added to your vault.",
      });

      // Reload documents
      loadDocuments();

      // Simulate navigation to extracted transactions after a brief delay
      setTimeout(() => {
        navigate('/labeling');
        toast({
          title: "Redirecting to labeling interface",
          description: "Please review and label the extracted data.",
        });
      }, 1500);
      
      // Reset form
      setSelectedFile(null);
      setDocumentName("");
      setDocumentType("");
      setUploadStep('upload');
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Financial Documents</h1>
        <p className="text-gray-600">
          Extracts data from the documents ( Transaction, Assets values, Liabilities etc.) or store important files.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        {/* Tabs Header with Controls */}
        <div className="flex items-center justify-between mb-6">
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="stored" 
              className="pb-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:font-bold bg-transparent"
            >
              Stored Documents
            </TabsTrigger>
            <TabsTrigger 
              value="processed" 
              className="pb-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:font-bold bg-transparent"
            >
              Processed Documents
            </TabsTrigger>
            <TabsTrigger 
              value="shared" 
              className="pb-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:font-bold bg-transparent"
            >
              Shared with me
            </TabsTrigger>
          </TabsList>

          {/* Search and Controls - Only show for processed tab */}
          {activeTab === "processed" && (
            <div className="flex items-center space-x-4">
              <FilterDialog
                currentFilters={filters}
                onFiltersChange={handleFiltersChange}
              />
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white"
                />
              </div>
              
              <div className="flex border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <TabsContent value="stored" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                No Stored Documents
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processed" className="mt-0">
          <Card>
            <CardContent className="p-6">
              {/* Upload and Download Actions */}
              <div className="flex items-center justify-end space-x-3 mb-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                  Upload Files
                </Button>
                <Button 
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  <Download className="w-4 h-4" />
                  Download Extracted Data
                </Button>
              </div>

              {/* Documents Table */}
              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading documents...</p>
                </div>
              ) : currentDocuments.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No documents found
                </div>
              ) : (
                <DocumentTable documents={currentDocuments} />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shared">
          <div className="text-center py-8 text-muted-foreground">
            No shared documents.
          </div>
        </TabsContent>
      </Tabs>

        {/* Upload Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent 
            className="p-0 max-w-none bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.15)]" 
            style={{ 
              width: '543px', 
              height: '556px', 
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '30px 30px 70px',
              gap: '30px'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0px',
              gap: '10px',
              width: '483px',
              height: '53px'
            }}>
               <div style={{
                 display: 'flex',
                 flexDirection: 'row',
                 justifyContent: 'center',
                 alignItems: 'center',
                 padding: '0px',
                 width: '483px',
                 height: '27px'
               }}>
               <h2 className="text-xl font-semibold text-center text-black" style={{
                 width: '308px',
                 height: '27px'
               }}>
                 Import Files
               </h2>
             </div>
           </div>

             {/* File Drop Area */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              padding: '16px 0px',
              gap: '8px',
              width: '483px',
              height: '56px',
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              borderRadius: '16px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0px',
                width: '167px',
                height: '16px',
                borderRadius: '8px'
              }}>
                <span className="text-xs text-gray-400" style={{
                  width: '167px',
                  height: '16px'
                }}>
                  Drop files here or upload files
                </span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4px 8px',
                gap: '4px',
                width: '57px',
                height: '24px',
                background: 'rgba(0, 0, 0, 0.04)',
                borderRadius: '8px'
              }}>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-xs text-black flex items-center text-center" style={{
                    width: '41px',
                    height: '16px'
                  }}>
                    Upload
                  </span>
                </label>
              </div>
            </div>

            {/* Separator */}
            <div style={{
              width: '483px',
              height: '1px',
              background: '#E8E8E8'
            }}></div>

            {/* Connection Options */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '20px',
              width: '483px',
              height: '256px'
            }}>
              {/* Microsoft OneDrive */}
              <div style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '20px',
                gap: '10px',
                width: '483px',
                height: '72px',
                background: '#FFFFFF',
                border: '1px solid #E8E8E8',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
              className="hover:bg-gray-50 transition-colors"
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #E8E8E8',
                  borderRadius: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src="/src/assets/onedrive-icon.png" alt="OneDrive" style={{ width: '24px', height: '24px' }} />
                </div>
                <span className="text-sm text-black" style={{
                  width: '300px',
                  height: '18px'
                }}>
                  Connect to Microsoft OneDrive
                </span>
              </div>

              {/* Google Drive */}
              <div style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '20px',
                gap: '10px',
                width: '483px',
                height: '72px',
                background: '#FFFFFF',
                border: '1px solid #E8E8E8',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
              className="hover:bg-gray-50 transition-colors"
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #E8E8E8',
                  borderRadius: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src="/src/assets/google-drive-icon.png" alt="Google Drive" style={{ width: '24px', height: '24px' }} />
                </div>
                <span className="text-sm text-black" style={{
                  width: '300px',
                  height: '18px'
                }}>
                  Connect to Google Drive
                </span>
              </div>

              {/* Microsoft SharePoint */}
              <div style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '20px',
                gap: '10px',
                width: '483px',
                height: '72px',
                background: '#FFFFFF',
                border: '1px solid #E8E8E8',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
              className="hover:bg-gray-50 transition-colors"
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #E8E8E8',
                  borderRadius: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src="/src/assets/sharepoint-icon.png" alt="SharePoint" style={{ width: '24px', height: '24px' }} />
                </div>
                <span className="text-sm text-black" style={{
                  width: '300px',
                  height: '18px'
                }}>
                  Microsoft Share Point
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Processing Modal */}
        <Dialog open={showProcessingModal} onOpenChange={setShowProcessingModal}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center py-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">The uploaded document is been identified!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                It may take some time. Please wait until it is processed.
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Labeling Modal */}
        <Dialog open={showLabelingModal} onOpenChange={setShowLabelingModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>The document was identified!</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* File Info */}
              <div className="border-2 border-dashed border-border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/pdf-icon.png" alt="PDF" className="w-8 h-8 mr-3" />
                  <span className="text-sm">Attached pdf document</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowLabelingModal(false);
                    setShowUploadModal(true);
                    setSelectedFile(null);
                    setUploadStep('upload');
                  }}
                  className="bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-name">Document Name</Label>
                  <Input
                    id="document-name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Asas cash Citi july"
                  />
                </div>

                <div>
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bank Statement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-statement">Bank Statement</SelectItem>
                      <SelectItem value="investment-summary">Investment Summary</SelectItem>
                      <SelectItem value="capital-call">Capital Call Notice</SelectItem>
                      <SelectItem value="tax-document">Tax Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Options */}
                <div className="flex justify-between pt-4">
                  <div 
                    className={`border cursor-pointer transition-all ${
                      storeDocument 
                        ? 'border-black' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    style={{
                      width: '179px',
                      height: '60px',
                      borderRadius: '16px',
                      padding: '15px',
                      borderWidth: '1px',
                      backgroundColor: storeDocument ? '#E6F1FD' : 'white'
                    }}
                    onClick={() => setStoreDocument(!storeDocument)}
                  >
                    <div className="flex items-center justify-between h-full">
                      <div className={`font-normal leading-none text-xs ${storeDocument ? 'text-black' : 'text-gray-700'}`}>
                        Store the documents
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        storeDocument ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <FileText className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`border cursor-pointer transition-all ${
                      extractData 
                        ? 'border-black' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    style={{
                      width: '179px',
                      height: '60px',
                      borderRadius: '16px',
                      padding: '15px',
                      borderWidth: '1px',
                      backgroundColor: extractData ? '#E6F1FD' : 'white'
                    }}
                    onClick={() => setExtractData(!extractData)}
                  >
                    <div className="flex items-center justify-between h-full">
                      <div className={`font-normal leading-none text-xs ${extractData ? 'text-black' : 'text-gray-700'}`}>
                        Extract data from documents
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        extractData ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <Download className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowLabelingModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-black hover:bg-black/90"
                  onClick={handleSubmitLabeling}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
