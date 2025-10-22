
import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StandardTable } from "@/components/StandardTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import LinkAccountModal from "@/components/LinkAccountModal";
import { 
  Building2, 
  CheckCircle, 
  Receipt, 
  Calendar,
  TrendingUp,
  Cloud,
  Mail,
  HardDrive
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Mock data with status toggle functionality
const mockAccounts = [
  {
    id: 1,
    name: "Investment BCA",
    bankName: "Bank Central Asia",
    type: "Depository",
    subType: "money market",
    linkedDate: "03/04/2025",
    status: "Active",
    balance: 122500
  },
  {
    id: 2,
    name: "Investment ABC",
    bankName: "ABC Bank",
    type: "Credit",
    subType: "Paypal",
    linkedDate: "29/03/2025",
    status: "Inactive",
    balance: 11975500
  },
  {
    id: 3,
    name: "Bank xyz",
    bankName: "XYZ Bank",
    type: "Investment",
    subType: "401k",
    linkedDate: "10/03/2025",
    status: "Inactive",
    balance: 9945000
  },
  {
    id: 4,
    name: "Bank abc",
    bankName: "ABC Bank",
    type: "Other",
    subType: "Other",
    linkedDate: "18/02/2025",
    status: "Active",
    balance: 153120675
  }
];

const chartData = [
  { month: 'January', value: 200000000 },
  { month: 'February', value: 250000000 },
  { month: 'March', value: 300000000 },
  { month: 'April', value: 400000000 },
  { month: 'May', value: 535000000 },
  { month: 'June', value: 875000000 }
];

const IntegrationSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("financial");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accounts, setAccounts] = useState(mockAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState(mockAccounts);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const { toast } = useToast();

  // Calculate totals
  const totalImportedAssets = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(acc => acc.status === "Active").length;
  const totalTransactions = 110;
  const lastImportDate = "03/04/2025";

  useEffect(() => {
    let filtered = accounts;
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(account => 
        account.type.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(account => 
        account.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredAccounts(filtered);
  }, [categoryFilter, statusFilter, accounts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(0)}M`;
    }
    return formatCurrency(num);
  };

  const handleStatusToggle = (accountId: number) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === accountId 
          ? { ...account, status: account.status === "Active" ? "Inactive" : "Active" }
          : account
      )
    );
    
    toast({
      title: "Status Updated",
      description: "Account status has been successfully updated.",
    });
  };

  const handleLinkSuccess = (publicToken: string, product: string, metadata: any) => {
    console.log('Success!', publicToken, product, metadata);
    
    // Add new mock account
    const newAccount = {
      id: Date.now(),
      name: `New ${product} Account`,
      bankName: metadata.institution?.name || "New Bank",
      type: product,
      subType: "linked",
      linkedDate: new Date().toLocaleDateString('en-GB'),
      status: "Active",
      balance: Math.floor(Math.random() * 1000000)
    };
    
    setAccounts(prev => [...prev, newAccount]);
    
    toast({
      title: "Account Linked Successfully",
      description: "Your new account has been successfully linked.",
    });
  };

  const tableColumns = [
    { key: 'name', header: 'Account Name' },
    { key: 'bank', header: 'Bank Name' },
    { key: 'type', header: 'Type' },
    { key: 'subtype', header: 'Sub Type' },
    { key: 'linked', header: 'Linked Date' },
    { key: 'status', header: 'Status' },
    { key: 'balance', header: 'Balance', className: 'text-right' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integration Settings</h1>
          <p className="text-gray-600">This section will allow you to integrate your client portal with third party systems.</p>
        </div>
      </div>

      {/* Tabs with Link Button */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between w-full">
            <TabsList>
              <TabsTrigger value="financial">Financial Accounts Integration</TabsTrigger>
              <TabsTrigger value="email">Email Integration</TabsTrigger>
              <TabsTrigger value="data-room">Data Room Integration</TabsTrigger>
            </TabsList>
            <Button 
              onClick={() => setIsLinkModalOpen(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              Link a new account
            </Button>
          </div>

          {/* Financial Accounts Integration Tab */}
          <TabsContent value="financial" className="space-y-6">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Chart Card */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Imported Assets</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-semibold">{formatLargeNumber(totalImportedAssets)}</span>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +13.8%
                    </div>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#9E9E9E' }}
                        />
                        <YAxis hide />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4ade80" 
                          strokeWidth={2}
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="rounded-2xl bg-blue-50 p-5">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">No. Of Accounts Linked</span>
                      <Building2 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="text-2xl font-semibold">{totalAccounts}</div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-purple-50 p-5">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">No. Of Active Linked Account</span>
                      <CheckCircle className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="text-2xl font-semibold">{activeAccounts}</div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-green-50 p-5">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">No. Of Transactions Imported</span>
                      <Receipt className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="text-2xl font-semibold">{totalTransactions}</div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-blue-50 p-5">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Last Imported Date</span>
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="text-2xl font-semibold">{lastImportDate}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Linked Accounts Table */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Linked Accounts</h3>
                  <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="depository">Depository</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <StandardTable columns={tableColumns}>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.bankName}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell>{account.subType}</TableCell>
                      <TableCell>{account.linkedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusToggle(account.id)}
                            className={`w-9 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                              account.status === 'Active' ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full transition-transform ${
                              account.status === 'Active' ? 'bg-green-500 translate-x-4' : 'bg-gray-400'
                            }`} />
                          </button>
                          <span className="text-sm">{account.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(account.balance)}</TableCell>
                    </TableRow>
                  ))}
                </StandardTable>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Integration Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email Integration</h3>
                  <p className="text-gray-600 mb-4">Connect your email services to streamline communication.</p>
                  <Button>Configure Email Integration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Room Integration Tab */}
          <TabsContent value="data-room" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Services</CardTitle>
                <p className="text-sm text-gray-600">Connect to storage services you already use to make attaching files easy.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Drive */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Cloud className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Google Drive</span>
                  </div>
                  <Button variant="outline">Link account</Button>
                </div>

                {/* OneDrive */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Cloud className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">One Drive for Business</div>
                      <div className="text-sm text-gray-500">Linked as user@example.com</div>
                    </div>
                  </div>
                  <Button variant="outline">Link account</Button>
                </div>

                {/* Dropbox */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <HardDrive className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Drop Box</span>
                  </div>
                  <Button variant="outline">Link account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Link Account Modal */}
      <LinkAccountModal
        open={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSuccess={handleLinkSuccess}
      />
    </div>
  );
};

export default IntegrationSettingsPage;
