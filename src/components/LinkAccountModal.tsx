import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Building2, 
  CreditCard, 
  TrendingUp, 
  Bitcoin, 
  Home, 
  MoreHorizontal,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { usePlaidLink } from 'react-plaid-link';
import { plaidApi } from '../services/plaidApi';
import { mockPlaidApi } from '../services/mockPlaidApi';
import { useToast } from '@/hooks/use-toast';

interface LinkAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (publicToken: string, product: string, metadata: any) => void;
}

type AccountCategory = 'Depository' | 'Credit' | 'Investment' | 'Cryptocurrency' | 'Houses & Car' | 'Other';
type PlaidProduct = 'auth' | 'transactions' | 'investments' | 'liabilities' | 'assets';

// Use mock API in development
//const isDevelopment = import.meta.env.DEV;
const isDevelopment = false;
const api = isDevelopment ? mockPlaidApi : plaidApi;

function mapAccountCategoryToPlaidProduct(category: AccountCategory): PlaidProduct {
  switch (category) {
    case 'Depository':
      return 'auth'; // Could also use 'transactions' depending on use case
    case 'Credit':
      return 'liabilities'; 
    case 'Investment':
      return 'investments';
    case 'Cryptocurrency':
      return 'investments'; // Plaid has limited crypto support through investments
    case 'Houses & Car':
      return 'assets'; // Or 'liabilities' if focusing on loans
    case 'Other':
      return 'transactions'; // Default to transactions as it's the most general
    default:
      return 'transactions';
  }
}

const LinkAccountModal: React.FC<LinkAccountModalProps> = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { open: openPlaidLink } = usePlaidLink({
    token: linkToken || '',
    onSuccess: async (publicToken, metadata) => {
      console.log('Plaid onSuccess response:', { publicToken, metadata });
      
      try {
        // Exchange public token for access token
        const plaidProduct = mapAccountCategoryToPlaidProduct(selectedCategory || 'Investment');
        await api.exchangeToken({
          products: [plaidProduct],
          institutionName: metadata.institution?.name || 'Unknown Institution',
          publicToken: publicToken,
        });

        toast({
          title: "Account Connected",
          description: `Successfully connected ${metadata.institution?.name || 'account'}`,
        });
        
        onSuccess(publicToken, selectedCategory || 'Investment', metadata);
      } catch (error) {
        console.error('Error exchanging token:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to complete account connection. Please try again.",
        });
      }
      
      resetState();
      onClose();
    },
    onExit: (err) => {
      if (err) {
        console.error('Plaid Link exit error:', err);
        setError(err.error_message || 'Connection was cancelled');
      }
      resetState();
      onClose();
    },
    onLoad: () => {
      console.log('Plaid Link loaded');
    },
  });

  const resetState = () => {
    setActiveStep(0);
    setSelectedCategory(null);
    setLinkToken(null);
    setIsLoading(false);
    setError(null);
  };

  const fetchLinkToken = async (category: AccountCategory) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getLinkToken(category);
      console.log('Link token response:', response);
      setLinkToken(response.linkToken);
      setActiveStep(1);
    } catch (err) {
      console.error('Error fetching link token:', err);
      setError(err instanceof Error ? err.message : 'Failed to get link token');
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to initialize account connection. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: AccountCategory) => {
    setSelectedCategory(category);
    fetchLinkToken(category);
  };

  // Open Plaid Link when token is available
  useEffect(() => {
    if (linkToken && activeStep === 1) {
      openPlaidLink();
    }
  }, [linkToken, activeStep, openPlaidLink]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  const categories = [
    {
      id: 'Depository',
      title: 'Depository',
      description: 'Depository Accounts (Cash Holding)',
      icon: Building2,
    },
    {
      id: 'Credit',
      title: 'Credit',
      description: 'Credit card or Revolving Credit',
      icon: CreditCard,
    },
    {
      id: 'Investment',
      title: 'Investment',
      description: 'Investment/Brokerage accounts',
      icon: TrendingUp,
    },
    {
      id: 'Cryptocurrency',
      title: 'Cryptocurrency',
      description: 'Invest in digital currencies',
      icon: Bitcoin,
    },
    {
      id: 'Houses & Car',
      title: 'Houses & Car',
      description: 'Real Estate and Vehicles',
      icon: Home,
    },
    {
      id: 'Other',
      title: 'Other',
      description: 'Other account types',
      icon: MoreHorizontal,
    },
  ];

  const steps = ['Select Category', 'Connect Account', 'Verify', 'Complete'];

  return (
    <Dialog open={open && activeStep === 0} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            Link New Account
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">Select Category</p>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="flex gap-1 px-6 py-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full flex-1 ${
                index <= activeStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mx-4 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Connecting to your bank...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleCategorySelect(category.id as AccountCategory)}
                >
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <div>
                      <h3 className="font-semibold text-sm">{category.title}</h3>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="flex justify-end">
                      <IconComponent className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LinkAccountModal;