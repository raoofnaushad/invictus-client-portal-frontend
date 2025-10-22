
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DocumentVault from "./pages/DocumentVault";
import LabelingPage from "./pages/LabelingPage";
import InvestmentAccountsPage from "./pages/InvestmentAccountsPage";
import InvestmentSecuritiesPage from "./pages/InvestmentSecuritiesPage";
import SecurityTransactionsPage from "./pages/SecurityTransactionsPage";
import InvestmentTransactionsPage from "./pages/InvestmentTransactionsPage";
import BankAccountsPage from "./pages/BankAccountsPage";
import BankTransactionsPage from "./pages/BankTransactionsPage";
import LiabilitiesPage from "./pages/LiabilitiesPage";
import LiabilityTransactionsPage from "./pages/LiabilityTransactionsPage";
import IlliquidInvestmentsPage from "./pages/IlliquidInvestmentsPage";
import IlliquidInvestmentDetailsPage from "./pages/IlliquidInvestmentDetailsPage";
import AllTransactionsPage from "./pages/AllTransactionsPage";
import ActivityPage from "./pages/ActivityPage";
import ActivityEmailPage from "./pages/ActivityEmailPage";
import ActivityMeetingsPage from "./pages/ActivityMeetingsPage";
import ActivityNotesPage from "./pages/ActivityNotesPage";
import ActivityStreamPage from "./pages/ActivityStreamPage";
import IntegrationSettingsPage from "./pages/IntegrationSettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import PersonalSettings from "./pages/PersonalSettings";
import AccountSettings from "./pages/AccountSettings";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/document-transactions" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/document-vault" element={<AppLayout><DocumentVault /></AppLayout>} />
          <Route path="/labeling" element={<AppLayout><LabelingPage /></AppLayout>} />
          <Route path="/investment-accounts" element={<AppLayout><InvestmentAccountsPage /></AppLayout>} />
          <Route path="/investment-accounts/:accountId/securities" element={<AppLayout><InvestmentSecuritiesPage /></AppLayout>} />
          <Route path="/investment-accounts/:accountId/securities/:securityId/transactions" element={<AppLayout><SecurityTransactionsPage /></AppLayout>} />
          <Route path="/investment-accounts/:accountId/transactions" element={<AppLayout><InvestmentTransactionsPage /></AppLayout>} />
          <Route path="/bank-accounts" element={<AppLayout><BankAccountsPage /></AppLayout>} />
          <Route path="/bank-transactions/:id" element={<AppLayout><BankTransactionsPage /></AppLayout>} />
          <Route path="/liabilities" element={<AppLayout><LiabilitiesPage /></AppLayout>} />
          <Route path="/liabilities/:liabilityId/transactions" element={<AppLayout><LiabilityTransactionsPage /></AppLayout>} />
          <Route path="/illiquid-investments" element={<AppLayout><IlliquidInvestmentsPage /></AppLayout>} />
          <Route path="/illiquid-investments/:investmentId/details" element={<AppLayout><IlliquidInvestmentDetailsPage /></AppLayout>} />
          <Route path="/all-transactions" element={<AppLayout><AllTransactionsPage /></AppLayout>} />
          <Route path="/activity/todo" element={<AppLayout><ActivityPage /></AppLayout>} />
          <Route path="/activity/email" element={<AppLayout><ActivityEmailPage /></AppLayout>} />
          <Route path="/activity/meetings" element={<AppLayout><ActivityMeetingsPage /></AppLayout>} />
          <Route path="/activity/notes" element={<AppLayout><ActivityNotesPage /></AppLayout>} />
          <Route path="/activity/stream" element={<AppLayout><ActivityStreamPage /></AppLayout>} />
          <Route path="/integration-settings" element={<AppLayout><IntegrationSettingsPage /></AppLayout>} />
          <Route path="/personal-settings" element={<AppLayout><PersonalSettings /></AppLayout>} />
          <Route path="/account-settings" element={<AppLayout><AccountSettings /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
