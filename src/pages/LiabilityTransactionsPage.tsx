import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LiabilityAccount } from "@/types/liabilityAccount";
import { LiabilityApiService } from "@/services/liabilityApi";
import { LiabilityTransactionTable } from "@/components/LiabilityTransactionTable";
import { LiabilityTransactionFilterDialog, LiabilityTransactionFilters } from "@/components/LiabilityTransactionFilterDialog";

const LiabilityTransactionsPage = () => {
  const { liabilityId } = useParams<{ liabilityId: string }>();
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState("6M");
  const [liability, setLiability] = useState<LiabilityAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LiabilityTransactionFilters>({});

  useEffect(() => {
    if (liabilityId) {
      fetchLiability(liabilityId);
    }
  }, [liabilityId]);

  const fetchLiability = async (id: string) => {
    try {
      setLoading(true);
      const data = await LiabilityApiService.getLiability(id);
      setLiability(data);
    } catch (err) {
      setError('Failed to fetch liability details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !liability) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-red-600 mb-4">{error || "Liability Not Found"}</div>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: liability.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (assetClass: string) => {
    switch (assetClass.toLowerCase()) {
      case 'credit':
        return 'bg-blue-100 text-blue-800';
      case 'loan':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter liability details based on filters
  const applyFilters = (liabilityDetails: any[], filters: LiabilityTransactionFilters) => {
    let filtered = [...liabilityDetails];

    if (filters.liabilityClass) {
      filtered = filtered.filter(detail => 
        detail.liabilityClass?.toLowerCase().includes(filters.liabilityClass!.toLowerCase())
      );
    }
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(detail => 
        (detail.principalAmount || 0) >= filters.minAmount!
      );
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(detail => 
        (detail.principalAmount || 0) <= filters.maxAmount!
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(detail => 
        !detail.nextPaymentDate || new Date(detail.nextPaymentDate) >= new Date(filters.dateFrom!)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(detail => 
        !detail.nextPaymentDate || new Date(detail.nextPaymentDate) <= new Date(filters.dateTo!)
      );
    }
    if (filters.interestRateRange?.min !== undefined) {
      filtered = filtered.filter(detail => 
        (detail.interestPercentage || 0) >= filters.interestRateRange!.min!
      );
    }
    if (filters.interestRateRange?.max !== undefined) {
      filtered = filtered.filter(detail => 
        (detail.interestPercentage || 0) <= filters.interestRateRange!.max!
      );
    }
    if (filters.dataSource) {
      filtered = filtered.filter(detail => 
        detail.dataSource?.toLowerCase().includes(filters.dataSource!.toLowerCase())
      );
    }

    return filtered;
  };

  const handleFiltersChange = (newFilters: LiabilityTransactionFilters) => {
    setFilters(newFilters);
  };

  const primaryLiability = liability?.liabilities[0];
  const filteredLiabilityDetails = liability ? applyFilters(liability.liabilities, filters) : [];
  const principalAmount = primaryLiability?.principalAmount || 0;
  const paidPrincipalAmount = primaryLiability?.paidPrincipalAmount || 0;
  const remainingBalance = principalAmount - paidPrincipalAmount;
  const usagePercentage = principalAmount > 0 ? (paidPrincipalAmount / principalAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{liability.name}</h1>
              <p className="text-sm text-gray-500">{liability.assetSubclass} • {liability.financialInstitution}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tabs value={timeFrame} onValueChange={setTimeFrame}>
              <TabsList>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="6M">6M</TabsTrigger>
                <TabsTrigger value="YTD">YTD</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
                <TabsTrigger value="5Y">5Y</TabsTrigger>
                <TabsTrigger value="Custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Liability Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Liability Details</CardTitle>
                <p className="text-3xl font-bold mt-2">{formatCurrency(principalAmount)}</p>
              </div>
              <Badge className={getStatusColor(liability.assetClass)}>
                {liability.assetClass}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-sm text-gray-500">Next Payment Date</span>
                <p className="font-medium text-sm">{primaryLiability?.nextPaymentDate || 'N/A'}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Interest Rate</span>
                <p className="font-medium text-sm">{primaryLiability?.interestPercentage || 0}%</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Data Source</span>
                <p className="font-medium text-sm">{primaryLiability?.dataSource || 'N/A'}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Account Number</span>
                <p className="font-medium text-sm">{liability.accountNumber}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Start Date</span>
                <p className="font-medium text-sm">{primaryLiability?.originalDate || 'N/A'}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Maturity Date</span>
                <p className="font-medium text-sm">{primaryLiability?.maturityDate || 'N/A'}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Last Payment Amount</span>
                <p className="font-medium text-sm">{formatCurrency(primaryLiability?.lastPaymentAmount || 0)}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Interest Type</span>
                <p className="font-medium text-sm">{primaryLiability?.interestType || 'N/A'}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Payment Progress</span>
                <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={usagePercentage} className="h-3" />
              <div className="flex justify-between text-sm mt-2 text-gray-500">
                <span>{formatCurrency(paidPrincipalAmount)} Paid</span>
                <span>{formatCurrency(remainingBalance)} Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liability Details Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Liability Details</CardTitle>
              <LiabilityTransactionFilterDialog 
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </CardHeader>
          
          <CardContent>
            <LiabilityTransactionTable liabilityDetails={filteredLiabilityDetails} />
            {filteredLiabilityDetails.length === 0 && Object.keys(filters).length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No liability details match the current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        {(primaryLiability?.loanType || primaryLiability?.propertyAddress) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {primaryLiability?.loanType && (
                <div>
                  <span className="text-sm text-gray-500">Loan Type</span>
                  <p className="font-medium text-sm">{primaryLiability.loanType}</p>
                </div>
              )}
              
              {primaryLiability?.propertyAddress && (
                <div>
                  <span className="text-sm text-gray-500">Property Address</span>
                  <p className="font-medium text-sm">{primaryLiability.propertyAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LiabilityTransactionsPage;