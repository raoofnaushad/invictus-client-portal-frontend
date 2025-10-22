import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Filter,
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Search,
  Loader2
} from "lucide-react";
import { MockApiService, Transaction, FilterOptions } from "@/services/mockApi";

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

interface MainContentProps {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
}

export function MainContent({ leftSidebarOpen, rightSidebarOpen }: MainContentProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load transactions
  useEffect(() => {
    loadTransactions();
  }, [filters, searchTerm]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        ...filters,
        searchTerm: searchTerm || undefined
      };
      const txns = await MockApiService.getTransactions(searchFilters);
      setTransactions(txns);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Pagination calculations
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);
  return (
    <div className="pt-16 pl-14 pr-14 min-h-screen bg-background">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" size="sm" className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Processed Document</span>
        </div>

        {/* Document Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Financial Document Summary</CardTitle>
                <p className="text-sm text-muted-foreground">Placeholder for the descriptions</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Citi
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Bank Name</h3>
                <p className="font-medium">Private Bank</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Account Address</h3>
                <p className="font-medium">Jersey</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Account Name</h3>
                <p className="font-medium">Financial Account</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Statement Period</h3>
                <p className="font-medium">01/01/2023 - 29/01/2024</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Account Number</h3>
                <p className="font-medium">71433559/001</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Transactions</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                   <tr className="border-b border-border bg-muted/30">
                     <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Transaction Date</th>
                     <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Description</th>
                     <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Date Posted</th>
                     <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Amount</th>
                     <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Balance</th>
                     <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                     <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Last Approver</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">Loading transactions...</p>
                      </td>
                    </tr>
                  ) : currentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                     currentTransactions.map((transaction, index) => (
                     <tr key={index} className={`border-b border-border hover:bg-muted/50 ${
                       (index + 1) % 2 === 0 ? 'bg-blue-50' : 'bg-background'
                     }`}>
                       <td className="py-3 px-4 text-sm">{transaction.id}</td>
                       <td className="py-3 px-4 text-sm">{transaction.description}</td>
                       <td className="py-3 px-4 text-sm">{transaction.datePosted}</td>
                       <td className="py-3 px-4 text-sm font-medium">{transaction.amount}</td>
                       <td className="py-3 px-4 text-sm font-medium">{transaction.balance}</td>
                       <td className="py-3 px-4 text-sm">{getStatusBadge(transaction.status)}</td>
                       <td className="py-3 px-4 text-sm">{transaction.approver}</td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>

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
      </div>
    </div>
  );
}