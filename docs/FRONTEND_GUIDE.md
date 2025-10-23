# Frontend Architecture & Developer Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Page Breakdown](#page-breakdown)
5. [Services Layer](#services-layer)
6. [UI Component Library](#ui-component-library)
7. [Custom Components](#custom-components)
8. [Styling System](#styling-system)
9. [State Management](#state-management)
10. [Routing Configuration](#routing-configuration)
11. [Integration with Backend](#integration-with-backend)
12. [Plaid Integration](#plaid-integration)
13. [Development Patterns](#development-patterns)
14. [Dependencies & Libraries](#dependencies--libraries)

---

## Overview

### Purpose
**front-client-portal** is a React 18 + TypeScript single-page application that provides the user interface for the Invictus wealth management SaaS platform. It handles:

- **Portfolio Dashboard** - Real-time net worth, asset allocation, performance
- **Account Management** - Bank accounts, investments, liabilities
- **Document Processing** - Upload, view, and validate AI-extracted document data
- **Transaction Tracking** - Unified view of all financial transactions
- **Plaid Integration** - Connect external bank and investment accounts
- **Activity Hub** - Todos, emails, meetings, notes, activity streams
- **User Settings** - Profile, preferences, integrations

### Role in the Platform
This frontend serves as the **user-facing interface** for the wealth management platform. It communicates with the backend microservices through the API gateway:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│   Browser    │      │   Frontend   │      │   Backend        │
│              │─────▶│  (React/TS)  │─────▶│  Microservices   │
│              │      │  Port 5173   │      │  Gateway: 9002   │
│              │◀─────│              │◀─────│                  │
└──────────────┘      └──────────────┘      └──────────────────┘
   User input         Vite HMR + SPA        REST API + OAuth2
```

### Technology Stack Summary
- **Language**: TypeScript 5.5.3
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.1 (ESM-native, fast HMR)
- **Styling**: Tailwind CSS 3.4.11 + shadcn/ui
- **Routing**: React Router 6.26.2
- **State Management**: TanStack Query 5.56.2 (server state)
- **Forms**: React Hook Form 7.53.0 + Zod 3.23.8
- **Charts**: Highcharts 12.3.0 + Recharts 2.12.7

---

## Architecture

### Design Patterns

#### 1. **Component-Based Architecture**
**What**: Organize UI into reusable, self-contained components
**Why**:
- **Reusability**: Write once, use everywhere (e.g., `StandardTable`, `StatsCard`)
- **Maintainability**: Small components are easier to debug and test
- **Composition**: Combine simple components to build complex UIs
- **Separation of concerns**: Each component has a single responsibility

**Example Structure**:
```
BankAccountsPage (container)
├── PageHeader (layout)
├── BankAccountTable (data display)
│   ├── BankAccountCard (individual item)
│   │   ├── Card (ui primitive)
│   │   ├── Badge (ui primitive)
│   │   └── Button (ui primitive)
│   └── StandardPagination (navigation)
└── LinkAccountModal (action)
```

#### 2. **Service Layer Pattern**
**What**: Separate data fetching logic from UI components
**Why**:
- **Testability**: Services can be tested independently
- **Reusability**: Multiple components can use the same service
- **Flexibility**: Easy to swap implementations (real API ↔ mock)
- **Type safety**: Centralized TypeScript interfaces

**Flow**:
```
Component → Service → API → Backend
   ↓          ↓        ↓
useQuery   fetch()   REST  → Gateway → Microservice
```

**Example**:
```typescript
// Service layer
export const bankAccountApi = {
  async getBankAccounts(pagination, filters) {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
};

// Component
const { data } = useQuery({
  queryKey: ['bankAccounts', page],
  queryFn: () => bankAccountApi.getBankAccounts({ page, limit })
});
```

#### 3. **Container/Presentational Pattern**
**What**: Separate stateful logic (containers) from UI rendering (presentational)
**Why**:
- **Clarity**: Easy to understand data flow
- **Reusability**: Presentational components work with any data
- **Testability**: Presentational components are pure functions

**Example**:
```typescript
// Container (stateful)
function BankAccountsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['accounts', page],
    queryFn: () => api.getAccounts(page)
  });

  return <BankAccountTable accounts={data} onPageChange={setPage} />;
}

// Presentational (stateless)
function BankAccountTable({ accounts, onPageChange }) {
  return (
    <Table>
      {accounts.map(account => <AccountRow account={account} />)}
      <Pagination onChange={onPageChange} />
    </Table>
  );
}
```

#### 4. **React Router for Navigation**
**What**: Client-side routing without full page reloads
**Why**:
- **SPA behavior**: Fast navigation (no page refresh)
- **Nested routes**: Layout components wrap child routes
- **URL state**: Bookmarkable URLs, browser history
- **Lazy loading**: Load route components on demand

**Structure**:
```
App.tsx (BrowserRouter)
├── /login (public)
├── /onboarding (public)
└── /* (protected)
    ├── AppLayout wrapper
    │   ├── LeftSidebar
    │   ├── AppHeader
    │   └── MainContent
    │       └── {page component}
    └── Routes
        ├── /dashboard
        ├── /bank-accounts
        ├── /documents
        └── ...
```

#### 5. **Server State Management with TanStack Query**
**What**: Declarative data fetching with automatic caching and background updates
**Why**:
- **Automatic caching**: No manual cache management
- **Background refetching**: Keep data fresh without user action
- **Loading states**: Built-in `isLoading`, `isError`, `isSuccess`
- **Deduplication**: Same query runs once even if multiple components request it
- **Stale-while-revalidate**: Show cached data while fetching fresh data

**Benefits**:
```typescript
// Without TanStack Query (manual)
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/accounts')
    .then(res => res.json())
    .then(data => { setData(data); setLoading(false); })
    .catch(err => { setError(err); setLoading(false); });
}, []);

// With TanStack Query (declarative)
const { data, isLoading, error } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => api.getAccounts()
});
```

#### 6. **TypeScript for Type Safety**
**What**: Static type checking at compile time
**Why**:
- **Catch errors early**: TypeScript errors caught before runtime
- **IntelliSense**: Auto-complete, jump to definition, refactoring
- **Documentation**: Types serve as inline documentation
- **Refactoring confidence**: Rename safely across entire codebase

**Example**:
```typescript
// Define interface
interface BankAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

// Type-safe component
function AccountCard({ account }: { account: BankAccount }) {
  return (
    <div>
      <h3>{account.name}</h3>
      <p>{account.balance} {account.currency}</p>
    </div>
  );
}

// TypeScript catches errors
<AccountCard account={{ id: '123', name: 'Chase', balance: 1000 }} />
// Error: Property 'currency' is missing
```

---

## Project Structure

### Directory Layout

```
front-client-portal/
├── public/                  # Static assets (favicon, images)
├── src/
│   ├── App.tsx              # Root component + routing
│   ├── main.tsx             # Entry point (ReactDOM.render)
│   ├── index.css            # Global styles + Tailwind imports
│   ├── pages/               # Route components (24 pages)
│   │   ├── Dashboard.tsx
│   │   ├── BankAccountsPage.tsx
│   │   ├── DocumentVault.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   └── ...
│   ├── components/          # Reusable components
│   │   ├── ui/              # shadcn/ui primitives (47 components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── onboarding/      # Multi-step onboarding flow
│   │   │   ├── EmailStep.tsx
│   │   │   ├── PasswordStep.tsx
│   │   │   ├── VerificationStep.tsx
│   │   │   └── ...
│   │   ├── mfa/             # MFA setup components
│   │   │   ├── MfaSetupModal.tsx
│   │   │   └── MfaConfirmationStep.tsx
│   │   ├── labeling/        # Document labeling tool
│   │   │   ├── LabelBox.tsx
│   │   │   └── LabelingToolbar.tsx
│   │   ├── AppLayout.tsx    # Main layout wrapper
│   │   ├── LeftSidebar.tsx  # Navigation sidebar
│   │   ├── AppHeader.tsx    # Top header
│   │   ├── BankAccountCard.tsx
│   │   ├── DashboardCharts.tsx
│   │   ├── DocumentTable.tsx
│   │   └── ...
│   ├── services/            # API client layer
│   │   ├── documentApi.ts   # Document API
│   │   ├── bankAccountApi.ts # Bank accounts
│   │   ├── plaidApi.ts      # Plaid integration
│   │   ├── investmentApi.ts # Investments
│   │   ├── liabilityApi.ts  # Liabilities
│   │   ├── onboardingApi.ts # User registration
│   │   ├── profileApi.ts    # User profile
│   │   ├── mockApi.ts       # Mock data
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── use-toast.ts
│   │   ├── useDashboardData.ts
│   │   └── ...
│   ├── types/               # TypeScript interfaces
│   │   ├── bankAccount.ts
│   │   ├── investmentAccount.ts
│   │   ├── document.ts
│   │   ├── dashboard.ts
│   │   └── ...
│   └── lib/                 # Utility functions
│       └── utils.ts         # Class name utilities
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind + theme
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint rules
└── postcss.config.js        # PostCSS plugins

```

**Why this structure?**
- **Pages**: Top-level route components (one per URL)
- **Components**: Reusable UI pieces (used across multiple pages)
- **Services**: API logic (keep components clean)
- **Types**: TypeScript interfaces (shared across app)
- **Hooks**: Custom React hooks (reusable stateful logic)

---

## Page Breakdown

### Dashboard & Overview

#### **Dashboard** (`src/pages/Dashboard.tsx`)
**Purpose**: Portfolio summary and key metrics

**Features**:
- Total net worth with trend indicator
- Asset breakdown pie chart (stocks, bonds, real estate, cash)
- Portfolio performance line chart (6-month history)
- Cash flow bar chart (income vs expenses)
- Recent transactions table
- Quick stats cards (assets, liabilities, liquid assets, illiquid assets)

**API Calls**:
- `GET /api/v1/portfolios/all/accounts` - All accounts
- `GET /api/v1/portfolios/all/liabilities` - All liabilities
- `GET /api/v1/documents` - Recent documents

**Components Used**:
- `DashboardStatsCards` - Key metrics
- `DashboardCharts` - Visualizations
- `TotalNetWorthChart` - Net worth over time
- `AssetBreakdownChart` - Asset allocation
- `CashFlowChart` - Income/expenses
- `PortfolioPerformanceChart` - Performance line chart

#### **AllTransactionsPage** (`src/pages/AllTransactionsPage.tsx`)
**Purpose**: Unified view of all transactions (bank, investment, liability)

**Features**:
- Combined transaction list from all sources
- Advanced filtering (date range, type, amount, institution)
- Search by description
- Export to CSV
- Pagination

**API Calls**:
- `GET /api/v1/portfolios/all/transactions` - Unified transactions

**Components Used**:
- `TransactionTable` - Transaction list
- `TransactionFilterDialog` - Advanced filters
- `StandardPagination` - Page navigation

---

### Bank Accounts

#### **BankAccountsPage** (`src/pages/BankAccountsPage.tsx`)
**Purpose**: View all connected bank accounts

**Features**:
- Account list with balances
- Account type badges (checking, savings, money market)
- Filter by institution, currency, account type
- Search by account name/number
- Click account to view transactions
- Link new account via Plaid

**API Calls**:
- `GET /api/v1/portfolios/all/accounts` - Bank accounts

**Components Used**:
- `BankAccountCard` - Individual account card
- `BankAccountFilterDialog` - Filter UI
- `LinkAccountModal` - Plaid integration
- `StandardPagination` - Pagination

**Routing**:
```typescript
<Route path="/bank-accounts" element={<AppLayout><BankAccountsPage /></AppLayout>} />
```

#### **BankTransactionsPage** (`src/pages/BankTransactionsPage.tsx`)
**Purpose**: View transactions for a specific bank account

**Features**:
- Transaction list (date, description, amount, balance)
- Filter by date range, transaction type
- Search by description
- Sort by date, amount
- Account summary card at top
- Export to CSV

**API Calls**:
- `GET /api/v1/portfolios/all/accounts/{id}` - Account details
- Account includes transactions in response

**Components Used**:
- `BankAccountCard` - Account summary
- `TransactionTable` - Transaction list
- `BankTransactionFilterDialog` - Filters

**Routing**:
```typescript
<Route path="/bank-transactions/:id" element={<AppLayout><BankTransactionsPage /></AppLayout>} />
```

**URL Parameter**: `id` - Account ID

---

### Investment Accounts

#### **InvestmentAccountsPage** (`src/pages/InvestmentAccountsPage.tsx`)
**Purpose**: View all investment accounts (brokerage, 401k, IRA)

**Features**:
- Account list with current value
- Account type badges (brokerage, 401k, IRA, HSA)
- Performance indicators (gain/loss)
- Filter by account type, institution
- Click account to view securities
- Link new account via Plaid

**API Calls**:
- `GET /api/v1/portfolios/all/investment-accounts` - Investment accounts

**Components Used**:
- `InvestmentAccountCard` - Account card
- `InvestmentAccountFilterDialog` - Filters
- `LinkAccountModal` - Plaid

**Routing**:
```typescript
<Route path="/investment-accounts" element={<AppLayout><InvestmentAccountsPage /></AppLayout>} />
```

#### **InvestmentSecuritiesPage** (`src/pages/InvestmentSecuritiesPage.tsx`)
**Purpose**: View securities/holdings for a specific investment account

**Features**:
- Securities table (ticker, name, quantity, price, value, gain/loss)
- Filter by security type (stock, bond, mutual fund, ETF)
- Search by ticker or name
- Sort by value, gain/loss
- Click security to view transactions

**API Calls**:
- `GET /api/v1/portfolios/all/investment-accounts/{id}/securities` - Securities

**Components Used**:
- `InvestmentAccountCard` - Account summary
- `SecuritiesTable` - Holdings list
- `SecurityFilterDialog` - Filters

**Routing**:
```typescript
<Route path="/investment-accounts/:accountId/securities"
       element={<AppLayout><InvestmentSecuritiesPage /></AppLayout>} />
```

#### **SecurityTransactionsPage** (`src/pages/SecurityTransactionsPage.tsx`)
**Purpose**: View transactions for a specific security

**Features**:
- Transaction list (date, type, quantity, price, total)
- Transaction types (buy, sell, dividend, split, transfer)
- Filter by date range, transaction type
- Running total of shares

**API Calls**:
- `GET /api/v1/portfolios/all/securities/{id}/transactions` - Security transactions

**Components Used**:
- `TransactionTable` - Transaction list
- `SecurityFilterDialog` - Filters

**Routing**:
```typescript
<Route path="/investment-accounts/:accountId/securities/:securityId/transactions"
       element={<AppLayout><SecurityTransactionsPage /></AppLayout>} />
```

#### **InvestmentTransactionsPage** (`src/pages/InvestmentTransactionsPage.tsx`)
**Purpose**: View all transactions for an investment account

**Features**:
- All transactions across all securities
- Filter by security, transaction type, date
- Search by description

**API Calls**:
- `GET /api/v1/portfolios/all/investment-accounts/{id}/transactions` - All transactions

**Components Used**:
- `InvestmentAccountCard` - Account summary
- `TransactionTable` - Transaction list
- `TransactionFilterDialog` - Filters

**Routing**:
```typescript
<Route path="/investment-accounts/:accountId/transactions"
       element={<AppLayout><InvestmentTransactionsPage /></AppLayout>} />
```

---

### Illiquid Investments

#### **IlliquidInvestmentsPage** (`src/pages/IlliquidInvestmentsPage.tsx`)
**Purpose**: Track private equity, VC, real estate, and other illiquid investments

**Features**:
- Investment list (name, type, commitment, called, distributed, NAV)
- Investment types (private equity, venture capital, real estate, hedge fund)
- Filter by type, vintage year, status
- Search by name
- Click investment to view details
- Add manual investment

**API Calls**:
- `GET /api/v1/illiquid-investments` - Illiquid investments

**Components Used**:
- `IlliquidInvestmentCard` - Investment card
- `IlliquidInvestmentFilterDialog` - Filters
- `IlliquidInvestmentSummaryCard` - Aggregate stats

**Routing**:
```typescript
<Route path="/illiquid-investments" element={<AppLayout><IlliquidInvestmentsPage /></AppLayout>} />
```

**Why separate from investment accounts?**
- Different data model (commitment, capital calls, distributions)
- Different valuation methods (NAV, IRR, multiples)
- Different reporting frequency (quarterly vs real-time)

#### **IlliquidInvestmentDetailsPage** (`src/pages/IlliquidInvestmentDetailsPage.tsx`)
**Purpose**: Detailed view of a single illiquid investment

**Features**:
- Investment overview (commitment, called, distributed, NAV, IRR, TVPI)
- Capital call history (date, amount, status)
- Distribution history (date, amount, type)
- Transaction timeline
- Document attachments (capital call notices, statements)
- Performance charts (NAV over time, cash flows)

**API Calls**:
- `GET /api/v1/illiquid-investments/{id}` - Investment details
- `GET /api/v1/illiquid-investments/{id}/transactions` - Capital calls + distributions

**Components Used**:
- `IlliquidInvestmentHeader` - Investment summary
- `IlliquidInvestmentTransactionTable` - Capital calls/distributions
- `PortfolioPerformanceChart` - Performance visualization

**Routing**:
```typescript
<Route path="/illiquid-investments/:investmentId/details"
       element={<AppLayout><IlliquidInvestmentDetailsPage /></AppLayout>} />
```

---

### Liabilities

#### **LiabilitiesPage** (`src/pages/LiabilitiesPage.tsx`)
**Purpose**: View all liabilities (loans, mortgages, credit cards)

**Features**:
- Liability list (name, type, balance, APR, monthly payment)
- Liability types (mortgage, auto loan, student loan, credit card, personal loan)
- Total liabilities summary
- Filter by type, institution, APR range
- Click liability to view transactions
- Link new account via Plaid

**API Calls**:
- `GET /api/v1/portfolios/all/liabilities` - All liabilities

**Components Used**:
- `LiabilityAccountCard` - Liability card
- `LiabilityFilterDialog` - Filters
- `TotalLiabilitiesCard` - Summary
- `LiabilitiesChart` - Breakdown by type
- `LinkAccountModal` - Plaid

**Routing**:
```typescript
<Route path="/liabilities" element={<AppLayout><LiabilitiesPage /></AppLayout>} />
```

#### **LiabilityTransactionsPage** (`src/pages/LiabilityTransactionsPage.tsx`)
**Purpose**: View transactions for a specific liability

**Features**:
- Transaction list (date, description, payment, interest, principal, balance)
- Filter by date range, transaction type
- Amortization chart (principal vs interest over time)
- Payment history

**API Calls**:
- `GET /api/v1/portfolios/all/liabilities/{id}` - Liability details
- Includes transactions in response

**Components Used**:
- `LiabilityAccountCard` - Liability summary
- `LiabilityTransactionTable` - Transaction list
- `LiabilityTransactionFilterDialog` - Filters

**Routing**:
```typescript
<Route path="/liabilities/:liabilityId/transactions"
       element={<AppLayout><LiabilityTransactionsPage /></AppLayout>} />
```

---

### Documents

#### **DocumentVault** (`src/pages/DocumentVault.tsx`)
**Purpose**: Manage uploaded documents with AI extraction

**Features**:
- Document list (name, type, status, upload date)
- Document status badges (Pending, Processing, Completed, Failed)
- Upload new document (drag-drop or file picker)
- Filter by type, status, date
- Search by name
- Click document to view details + extracted data
- Delete documents
- Download original file

**API Calls**:
- `GET /api/v1/documents?page={page}&size={size}` - Document list
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents/{id}` - Document details
- `DELETE /api/v1/documents/{id}` - Delete document

**Components Used**:
- `DocumentTable` - Document list
- `DocumentViewer` - PDF/image viewer
- `ValidationPanel` - AI extraction validation
- `DocumentHeader` - Upload + filters

**Document Status Flow**:
```
Pending → Processing → Completed
                     ↓
                   Failed
```

**Routing**:
```typescript
<Route path="/document-vault" element={<AppLayout><DocumentVault /></AppLayout>} />
```

**Integration with AI Service**:
1. User uploads PDF
2. Frontend calls `POST /api/v1/documents/upload`
3. Backend saves file and returns 202 Accepted
4. Backend calls AI service (`client-portal-data`)
5. AI service processes document (1-2 minutes)
6. AI service saves JSON results alongside PDF
7. Frontend polls `GET /api/v1/documents/{id}` for status
8. When status is "Completed", extracted data is available

**Extracted Data Structure**:
```json
{
  "num_pages": 2,
  "category": "bank_statement",
  "extracted_data": [
    {
      "image_url": "https://...",
      "extracted_data": {
        "account_holder": {
          "value": "John Doe",
          "bbox": [120.5, 80.3, 320.8, 95.7],
          "confidence": 0.98
        },
        "account_number": {
          "value": "1234567890",
          "bbox": [150.2, 120.5, 250.3, 135.8],
          "confidence": 0.95
        }
      }
    }
  ]
}
```

#### **LabelingPage** (`src/pages/LabelingPage.tsx`)
**Purpose**: Annotate documents for training AI models

**Features**:
- Document canvas with zoom/pan
- Bounding box drawing tool
- Label assignment (account_holder, account_number, date, etc.)
- Keyboard shortcuts (undo, redo, delete)
- Save annotations as JSON
- Load existing annotations
- Export training dataset

**API Calls**:
- `GET /api/v1/documents` - Documents to label
- `POST /api/v1/labels` - Save annotations

**Components Used**:
- `LabelBox` - Bounding box annotation
- `LabelingToolbar` - Tool selection
- `UnifiedLabelViewer` - Annotation viewer

**Routing**:
```typescript
<Route path="/labeling" element={<AppLayout><LabelingPage /></AppLayout>} />
```

**Why labeling tool?**
- Generate training data for AI models
- Validate AI extraction quality
- Human-in-the-loop workflow
- Export to Label Studio format

---

### Activity Hub

#### **ActivityPage** (`src/pages/ActivityPage.tsx`)
**Purpose**: Task/todo management

**Features**:
- Todo list with checkboxes
- Add new tasks
- Mark complete/incomplete
- Filter by status (all, active, completed)
- Due date tracking
- Priority levels

**API Calls**:
- `GET /api/v1/activities/todos` - Todo list
- `POST /api/v1/activities/todos` - Create todo
- `PUT /api/v1/activities/todos/{id}` - Update todo
- `DELETE /api/v1/activities/todos/{id}` - Delete todo

**Components Used**:
- Custom todo list components

**Routing**:
```typescript
<Route path="/activity/todo" element={<AppLayout><ActivityPage /></AppLayout>} />
```

#### **ActivityEmailPage** (`src/pages/ActivityEmailPage.tsx`)
**Purpose**: Email management interface

**Features**:
- Email inbox
- Compose new email
- Reply/forward
- Search emails
- Filter by folder (inbox, sent, drafts)

**API Calls**:
- `GET /api/v1/activities/emails` - Email list
- `POST /api/v1/activities/emails` - Send email

**Components Used**:
- `EmailTable` - Email list
- `CreateEmailModal` - Compose dialog

**Routing**:
```typescript
<Route path="/activity/email" element={<AppLayout><ActivityEmailPage /></AppLayout>} />
```

#### **ActivityMeetingsPage** (`src/pages/ActivityMeetingsPage.tsx`)
**Purpose**: Meeting scheduling

**Features**:
- Calendar view
- Schedule new meeting
- Meeting invitations
- Meeting reminders

**API Calls**:
- `GET /api/v1/activities/meetings` - Meeting list

**Routing**:
```typescript
<Route path="/activity/meetings" element={<AppLayout><ActivityMeetingsPage /></AppLayout>} />
```

#### **ActivityNotesPage** (`src/pages/ActivityNotesPage.tsx`)
**Purpose**: Note-taking

**Features**:
- Note list
- Create new note
- Rich text editor
- Search notes
- Tag organization

**API Calls**:
- `GET /api/v1/activities/notes` - Note list

**Routing**:
```typescript
<Route path="/activity/notes" element={<AppLayout><ActivityNotesPage /></AppLayout>} />
```

#### **ActivityStreamPage** (`src/pages/ActivityStreamPage.tsx`)
**Purpose**: Activity feed/timeline

**Features**:
- Chronological activity list
- Activity types (document uploaded, transaction added, account linked)
- Filter by type, date
- Activity details

**API Calls**:
- `GET /api/v1/activities/stream` - Activity feed

**Routing**:
```typescript
<Route path="/activity/stream" element={<AppLayout><ActivityStreamPage /></AppLayout>} />
```

---

### Settings

#### **PersonalSettings** (`src/pages/PersonalSettings.tsx`)
**Purpose**: User profile management

**Features**:
- Edit name, email, phone
- Profile photo upload
- Change password
- MFA settings (enable/disable, change method)
- Notification preferences

**API Calls**:
- `GET /api/v1/principals/profile` - User profile
- `PUT /api/v1/principals/settings` - Update profile

**Components Used**:
- Form components (Input, Button, Label)
- `MfaSetupModal` - MFA configuration

**Routing**:
```typescript
<Route path="/personal-settings" element={<AppLayout><PersonalSettings /></AppLayout>} />
```

#### **AccountSettings** (`src/pages/AccountSettings.tsx`)
**Purpose**: Account preferences

**Features**:
- Theme selection (light, dark, system)
- Language preference
- Currency preference
- Date/time format
- Export data

**API Calls**:
- `GET /api/v1/principals/settings` - Account settings
- `PUT /api/v1/principals/settings` - Update settings

**Routing**:
```typescript
<Route path="/account-settings" element={<AppLayout><AccountSettings /></AppLayout>} />
```

#### **IntegrationSettingsPage** (`src/pages/IntegrationSettingsPage.tsx`)
**Purpose**: Manage external integrations

**Features**:
- Connected accounts list (Plaid)
- Link new account (Plaid Link button)
- Disconnect account
- Refresh data
- Integration status indicators

**API Calls**:
- `GET /api/v1/integrations/plaid` - Connected integrations
- `POST /api/v1/integrations/plaid/link-token` - Get Plaid link token
- `POST /api/v1/integrations/plaid/exchange-token` - Exchange public token
- `DELETE /api/v1/integrations/plaid/{id}` - Disconnect account

**Components Used**:
- `LinkAccountModal` - Plaid Link

**Routing**:
```typescript
<Route path="/integration-settings" element={<AppLayout><IntegrationSettingsPage /></AppLayout>} />
```

---

### Authentication

#### **LoginPage** (`src/pages/LoginPage.tsx`)
**Purpose**: User authentication

**Features**:
- Email + password login
- OTP input (if MFA enabled)
- "Remember me" checkbox
- "Forgot password" link
- "Sign up" link (redirects to onboarding)

**API Calls**:
- `POST /api/v1/principals/public/login` - Authenticate user

**Flow**:
```
1. User enters email + password
2. Frontend calls login API
3. Backend validates credentials with Keycloak
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. If MFA enabled:
   a. Frontend shows OTP input
   b. User enters OTP
   c. Frontend calls OTP validation API
   d. Backend validates OTP
   e. Backend returns final JWT
7. Frontend redirects to /dashboard
```

**Components Used**:
- Form components (Input, Button)
- `InputOTP` - OTP input

**Routing**:
```typescript
<Route path="/login" element={<LoginPage />} />  {/* No AppLayout wrapper */}
```

**Why no AppLayout?**
- Login page is public (no authentication required)
- No sidebar/header needed

#### **OnboardingPage** (`src/pages/OnboardingPage.tsx`)
**Purpose**: Multi-step user registration

**Features**:
- Step 1: Email input
- Step 2: Email verification (OTP)
- Step 3: Password creation
- Step 4: Phone number (optional)
- Step 5: MFA setup (SMS or Authenticator app)
- Step 6: Success screen
- Progress indicator
- Back button (return to previous step)

**API Calls**:
- `POST /api/v1/principals/public` - Create user
- `POST /api/v1/principals/public/activate` - Activate account
- `POST /api/v1/principals/public/activateMfaByToken` - Enable MFA
- `POST /api/v1/principals/public/activateMfaByToken/confirm` - Confirm MFA

**Flow**:
```
1. User enters email → Create user in backend
2. Backend sends activation token to email
3. User enters activation token → Verify email
4. User creates password → Set password in Keycloak
5. User enters phone number → Store in profile
6. User chooses MFA method (SMS or Authenticator)
7. If SMS: Backend sends OTP to phone
   If Authenticator: Backend generates secret, frontend shows QR code
8. User enters OTP → Verify and enable MFA
9. Success! Redirect to /login
```

**Components Used**:
- `EmailStep` - Email input
- `VerificationStep` - OTP verification
- `PasswordStep` - Password creation
- `PhoneNumberStep` - Phone input
- `SecurityMethodStep` - MFA choice
- `SuccessStep` - Completion message

**Routing**:
```typescript
<Route path="/onboarding" element={<OnboardingPage />} />  {/* No AppLayout wrapper */}
```

**Why multi-step?**
- Break complex process into digestible steps
- Reduce cognitive load
- Provide clear progress indication
- Allow users to go back and fix mistakes

---

## Services Layer

### API Client Pattern

**Purpose**: Centralize all API calls in service modules

**Benefits**:
- **Single source of truth** for API endpoints
- **Type safety** with TypeScript interfaces
- **Mock fallback** for development without backend
- **Reusability** across components
- **Error handling** in one place

### Service Files

#### **documentApi.ts**
```typescript
const API_BASE_URL = 'http://localhost:9002/api';

export const DocumentApiService = {
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/v1/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  },

  async getDocuments(page: number, pageSize: number): Promise<DocumentListResponse> {
    const response = await fetch(
      `${API_BASE_URL}/v1/documents?page=${page}&size=${pageSize}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }

    return await response.json();
  }
};
```

**Usage in component**:
```typescript
function DocumentVault() {
  const { data, isLoading } = useQuery({
    queryKey: ['documents', page],
    queryFn: () => DocumentApiService.getDocuments(page, 20)
  });

  const uploadMutation = useMutation({
    mutationFn: DocumentApiService.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  return (
    <div>
      {isLoading ? <Spinner /> : <DocumentTable documents={data} />}
      <Button onClick={() => uploadMutation.mutate(file)}>Upload</Button>
    </div>
  );
}
```

#### **bankAccountApi.ts**
```typescript
class BankAccountApiService {
  private baseUrl = 'http://localhost:9002/api/v1/portfolios/all';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getBankAccounts(
    pagination: PaginationParams,
    filters?: BankAccountFilters
  ): Promise<PaginatedResponse<BankAccount>> {
    try {
      const response = await fetch(`${this.baseUrl}/accounts`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bank accounts');
      }

      const accounts: BankAccount[] = await response.json();

      // Apply filters
      let filteredAccounts = accounts;

      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredAccounts = filteredAccounts.filter(account =>
          account.name.toLowerCase().includes(searchLower) ||
          account.accountNumber.includes(searchLower) ||
          account.financialInstitution.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const totalItems = filteredAccounts.length;
      const totalPages = Math.ceil(totalItems / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + pagination.limit);

      return {
        data: paginatedAccounts,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalPages,
          totalItems,
        },
      };
    } catch (error) {
      console.error('Error fetching bank accounts from API, using mock data:', error);

      // Fallback to mock data
      return {
        data: mockBankAccounts.slice(0, pagination.limit),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalPages: 1,
          totalItems: mockBankAccounts.length
        }
      };
    }
  }
}

export const bankAccountApi = new BankAccountApiService();
```

**Why class-based?**
- Private methods for auth headers
- Instance configuration (base URL)
- Easier to mock for testing

#### **plaidApi.ts**
```typescript
const API_BASE_URL = 'http://localhost:9002/api/v1';

export const plaidApi = {
  async getLinkToken(type: string): Promise<PlaidLinkTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/integrations/plaid/link-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Plaid link token: ${response.statusText}`);
    }

    return response.json();
  },

  async exchangeToken(data: PlaidExchangeTokenRequest): Promise<PlaidExchangeTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/integrations/plaid/exchange-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange Plaid token: ${response.statusText}`);
    }

    return response.json();
  },
};
```

**Used in Plaid integration** (see [Plaid Integration](#plaid-integration) section).

#### **Mock Services**

**mockBankAccountApi.ts**:
```typescript
const mockBankAccounts: BankAccount[] = [
  {
    id: "ndze65jW5gCBPovloNAyTR7mlkDLn7CAl7wng",
    name: "Plaid Money Market",
    assetClass: "depository",
    assetSubclass: "money market",
    accountNumber: "4444",
    currency: "USD",
    financialInstitution: "Plaid Bank",
    balance: 43200.0,
  },
  // ... more mock accounts
];

export const mockBankAccountApi = {
  async getBankAccounts(): Promise<BankAccount[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBankAccounts), 500);
    });
  }
};
```

**Why mock services?**
- Develop frontend without backend
- Faster iteration (no network calls)
- Consistent test data
- Demo environment

---

## UI Component Library

### shadcn/ui

**What is shadcn/ui?**
- Collection of **47 re-usable components**
- Built on **Radix UI** (accessible, unstyled primitives)
- Styled with **Tailwind CSS**
- **Copy-paste** components (not npm package)
- Fully **customizable** (you own the code)

**Why shadcn/ui?**
- ✅ **No dependencies**: Components are copied to your project
- ✅ **Full control**: Modify any component to fit your needs
- ✅ **Accessible**: Built on Radix UI (ARIA compliant)
- ✅ **TypeScript**: Fully typed
- ✅ **Tailwind**: Consistent styling
- ✅ **Dark mode**: Built-in support

**Alternative**: Material-UI, Ant Design, Chakra UI (heavier, less customizable)

### Available Components

#### **Form Inputs** (11 components)
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Select` - Dropdown select
- `Checkbox` - Checkbox input
- `Radio Group` - Radio button group
- `Switch` - Toggle switch
- `Slider` - Range slider
- `Calendar` - Date picker
- `Command` - Command palette / search
- `Input OTP` - One-time password input
- `Form` - Form wrapper with validation

#### **Layout** (10 components)
- `Card` - Container with header, content, footer
- `Separator` - Horizontal/vertical line
- `Tabs` - Tab navigation
- `Accordion` - Collapsible sections
- `Collapsible` - Show/hide content
- `Resizable` - Resizable panels
- `Scroll Area` - Custom scrollbar
- `Aspect Ratio` - Maintain aspect ratio
- `Sidebar` - Application sidebar
- `Sheet` - Slide-out panel

#### **Feedback** (8 components)
- `Alert` - Static notification
- `Toast` - Temporary notification (sonner)
- `Dialog` - Modal dialog
- `Alert Dialog` - Confirmation dialog
- `Drawer` - Bottom drawer (mobile)
- `Progress` - Progress bar
- `Skeleton` - Loading placeholder
- `Spinner` - Loading spinner (custom)

#### **Navigation** (7 components)
- `Button` - Clickable button
- `Dropdown Menu` - Dropdown with actions
- `Navigation Menu` - Top navigation
- `Menubar` - Menu bar (File, Edit, etc.)
- `Context Menu` - Right-click menu
- `Breadcrumb` - Breadcrumb navigation
- `Pagination` - Page navigation

#### **Data Display** (6 components)
- `Table` - Data table
- `Badge` - Status badge
- `Avatar` - User avatar
- `Tooltip` - Hover tooltip
- `Hover Card` - Hover popover
- `Chart` - Chart wrapper (Recharts)

#### **Overlays** (5 components)
- `Popover` - Click popover
- `Hover Card` - Hover popover
- `Tooltip` - Hover tooltip
- `Context Menu` - Right-click menu
- `Command` - Command palette

### Component Usage Examples

#### **Button**
```typescript
import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

**Variants**: default, destructive, outline, secondary, ghost, link

#### **Card**
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Bank Account</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Balance: $1,234.56</p>
  </CardContent>
</Card>
```

#### **Table**
```typescript
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Balance</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {accounts.map(account => (
      <TableRow key={account.id}>
        <TableCell>{account.name}</TableCell>
        <TableCell>${account.balance}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### **Dialog**
```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Upload Document</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload a Document</DialogTitle>
    </DialogHeader>
    <input type="file" onChange={handleUpload} />
  </DialogContent>
</Dialog>
```

#### **Form with Validation**
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await loginApi.login(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
```

**Why this pattern?**
- Declarative validation with Zod
- Type-safe form data
- Automatic error messages
- No manual state management

---

## Custom Components

### Dashboard Components

#### **DashboardStatsCards**
**Purpose**: Display key portfolio metrics

**Props**:
```typescript
interface DashboardStatsCardsProps {
  totalAssets: number;
  totalLiabilities: number;
  liquidAssets: number;
  illiquidAssets: number;
}
```

**Renders**: 4 stat cards with trend indicators

#### **DashboardCharts**
**Purpose**: Portfolio visualizations

**Charts**:
- Total Net Worth (line chart)
- Asset Breakdown (pie chart)
- Cash Flow (bar chart)
- Portfolio Performance (line chart)

**Libraries**: Highcharts + Recharts

#### **AssetBreakdownChart**
**Purpose**: Pie chart of asset allocation

**Data**:
```typescript
{
  stocks: 50000,
  bonds: 20000,
  realEstate: 100000,
  cash: 30000,
  privateEquity: 150000
}
```

**Renders**: Interactive pie chart with hover tooltips

#### **GeographicalDistributionChart**
**Purpose**: World map showing asset distribution by country

**Features**:
- Choropleth map (color intensity = asset value)
- Click country to see details
- Region list on right
- Drill-down to country details

**Library**: Highcharts Maps + @highcharts/map-collection

---

### Financial Components

#### **BankAccountCard**
**Purpose**: Display individual bank account

**Props**:
```typescript
interface BankAccountCardProps {
  account: BankAccount;
  onClick?: () => void;
}
```

**Displays**:
- Account name
- Institution name
- Account type badge (checking, savings, etc.)
- Account number (masked: ****1234)
- Current balance (formatted with currency)
- Last updated timestamp

**Example**:
```typescript
<BankAccountCard
  account={{
    id: "acc-123",
    name: "Chase Checking",
    financialInstitution: "JPMorgan Chase",
    assetSubclass: "checking",
    accountNumber: "1234",
    balance: 5000.0,
    currency: "USD"
  }}
  onClick={() => navigate(`/bank-transactions/${account.id}`)}
/>
```

#### **InvestmentAccountCard**
**Purpose**: Display investment account with performance

**Props**:
```typescript
interface InvestmentAccountCardProps {
  account: InvestmentAccount;
  onClick?: () => void;
}
```

**Displays**:
- Account name
- Account type (brokerage, 401k, IRA)
- Current value
- Gain/loss ($ and %)
- Gain/loss indicator (green up arrow, red down arrow)

#### **TransactionTable**
**Purpose**: Generic transaction table

**Props**:
```typescript
interface TransactionTableProps {
  transactions: Transaction[];
  columns: ColumnDef<Transaction>[];
  onRowClick?: (transaction: Transaction) => void;
}
```

**Features**:
- Sortable columns
- Pagination
- Search
- Filters

**Used by**: BankTransactionsPage, InvestmentTransactionsPage, LiabilityTransactionsPage, AllTransactionsPage

---

### Document Components

#### **DocumentTable**
**Purpose**: List uploaded documents

**Props**:
```typescript
interface DocumentTableProps {
  documents: Document[];
  onUpload: (file: File) => void;
  onDelete: (documentId: string) => void;
  onView: (documentId: string) => void;
}
```

**Columns**:
- Name
- Type (badge)
- Status (badge: Pending, Processing, Completed, Failed)
- Upload date
- Actions (view, delete)

**Status Badges**:
- Pending: gray
- Processing: blue (with spinner)
- Completed: green (with checkmark)
- Failed: red (with error icon)

#### **DocumentViewer**
**Purpose**: Display document with extracted data

**Features**:
- PDF viewer (embedded iframe or PDF.js)
- Image viewer (for JPG/PNG)
- Extracted data panel on right
- Bounding boxes overlaid on document
- Validation controls (approve/reject field)

**Props**:
```typescript
interface DocumentViewerProps {
  document: Document;
  onValidate: (field: string, isValid: boolean) => void;
}
```

**Extracted Data Display**:
```typescript
{
  "account_holder": {
    "value": "John Doe",
    "confidence": 0.98
  }
}

// Renders as:
<div className="extraction-field">
  <label>Account Holder</label>
  <div className="value">John Doe</div>
  <div className="confidence">Confidence: 98%</div>
  <div className="actions">
    <Button size="sm" onClick={() => onValidate('account_holder', true)}>✓ Approve</Button>
    <Button size="sm" variant="destructive" onClick={() => onValidate('account_holder', false)}>✗ Reject</Button>
  </div>
</div>
```

#### **LabelBox**
**Purpose**: Draw bounding boxes for annotation

**Features**:
- Click and drag to draw box
- Resize box by dragging corners
- Move box by dragging center
- Delete box with keyboard shortcut (Del)
- Assign label from dropdown

**Props**:
```typescript
interface LabelBoxProps {
  imageUrl: string;
  boxes: BoundingBox[];
  labels: string[];
  onBoxCreate: (box: BoundingBox) => void;
  onBoxUpdate: (boxId: string, box: BoundingBox) => void;
  onBoxDelete: (boxId: string) => void;
}

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}
```

**Rendering**:
```typescript
<div className="label-canvas">
  <img src={imageUrl} alt="Document" />
  {boxes.map(box => (
    <div
      key={box.id}
      className="bounding-box"
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        border: '2px solid red'
      }}
    >
      <span className="label">{box.label}</span>
      <div className="resize-handle" />
    </div>
  ))}
</div>
```

---

### Layout Components

#### **AppLayout**
**Purpose**: Main application layout wrapper

**Structure**:
```typescript
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <AppHeader />
      <div className="app-body">
        <LeftSidebar />
        <MainContent>{children}</MainContent>
        <RightSidebar />
      </div>
    </div>
  );
}
```

**Why wrapper?**
- Consistent header/sidebar across all pages
- Single place to add authentication check
- Theme provider scope
- Toast notification container

**Used in routing**:
```typescript
<Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
```

#### **LeftSidebar**
**Purpose**: Primary navigation menu

**Menu Items**:
- Dashboard
- Bank Accounts
- Investment Accounts
- Illiquid Investments
- Liabilities
- All Transactions
- Document Vault
- Labeling
- Activity (submenu: Todo, Email, Meetings, Notes, Stream)
- Settings (submenu: Personal, Account, Integrations)

**Features**:
- Active route highlighting
- Collapsible sections
- Icons (Lucide React)
- Responsive (hidden on mobile, drawer on mobile)

**Implementation**:
```typescript
function LeftSidebar() {
  const location = useLocation();

  return (
    <nav className="left-sidebar">
      <ul>
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </li>
        {/* ... more menu items */}
      </ul>
    </nav>
  );
}
```

#### **AppHeader**
**Purpose**: Top navigation bar

**Elements**:
- Logo
- Breadcrumb navigation
- Link Account button
- Notifications icon
- Theme toggle (light/dark)
- User menu (profile, settings, logout)

**Responsive**:
- Mobile: Hamburger menu (opens left sidebar)
- Desktop: Full navigation

---

### Onboarding Components

Multi-step registration flow (6 steps):

#### **EmailStep**
- Email input field
- Validation (Zod schema)
- "Next" button
- Calls `POST /api/v1/principals/public`

#### **VerificationStep**
- OTP input (6 digits)
- Resend OTP button
- Calls `POST /api/v1/principals/public/activate`

#### **PasswordStep**
- Password input
- Confirm password input
- Password strength indicator
- Validation (min 8 chars, uppercase, lowercase, number, special char)

#### **PhoneNumberStep**
- Phone number input (international format)
- Country code selector
- Optional skip button

#### **SecurityMethodStep**
- Choose MFA method:
  - SMS (send OTP to phone)
  - Authenticator App (TOTP)
- If SMS: Enter OTP sent to phone
- If Authenticator: Scan QR code, enter OTP

#### **SuccessStep**
- Success message
- "Go to Dashboard" button
- Confetti animation 🎉

**State Management**:
```typescript
function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    activationToken: '',
    password: '',
    phoneNumber: '',
    mfaMethod: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="onboarding">
      <ProgressIndicator currentStep={step} totalSteps={6} />
      {step === 1 && <EmailStep onNext={nextStep} formData={formData} setFormData={setFormData} />}
      {step === 2 && <VerificationStep onNext={nextStep} onBack={prevStep} formData={formData} />}
      {/* ... other steps */}
    </div>
  );
}
```

---

## Styling System

### Tailwind CSS

**What is Tailwind?**
- Utility-first CSS framework
- Compose styles from small utility classes
- No custom CSS needed (mostly)
- JIT (Just-In-Time) compilation

**Example**:
```typescript
// Traditional CSS
<div className="bank-account-card">
  <h3 className="account-name">Chase Checking</h3>
  <p className="account-balance">$5,000.00</p>
</div>

/* styles.css */
.bank-account-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}
.account-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

// Tailwind CSS (no custom CSS file)
<div className="p-4 border border-gray-200 rounded-lg bg-white">
  <h3 className="text-lg font-semibold text-gray-900">Chase Checking</h3>
  <p className="text-gray-600">$5,000.00</p>
</div>
```

**Why Tailwind?**
- ✅ **No naming**: No need to invent class names
- ✅ **Consistency**: Predefined spacing, colors, sizes
- ✅ **Responsive**: Mobile-first utilities (`md:`, `lg:`)
- ✅ **Dark mode**: `dark:` prefix for dark theme
- ✅ **Performance**: Purge unused CSS in production
- ✅ **IntelliSense**: VSCode autocomplete

**Responsive Design**:
```typescript
<div className="
  w-full           /* Mobile: 100% width */
  md:w-1/2         /* Tablet: 50% width */
  lg:w-1/3         /* Desktop: 33.33% width */
  p-4              /* All: padding 1rem */
  md:p-6           /* Tablet+: padding 1.5rem */
">
  Content
</div>
```

**Dark Mode**:
```typescript
<div className="
  bg-white          /* Light mode: white background */
  dark:bg-gray-900  /* Dark mode: dark gray background */
  text-gray-900     /* Light mode: dark text */
  dark:text-white   /* Dark mode: white text */
">
  Content
</div>
```

### Theme Configuration

**tailwind.config.ts**:
```typescript
export default {
  darkMode: ["class"],  // Use class-based dark mode
  content: [
    "./src/**/*.{ts,tsx}",  // Scan all TypeScript files
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors using CSS variables
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        // ... more colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

**CSS Variables** (`src/index.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --sidebar-bg: 240 5.9% 10%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --sidebar-bg: 224 71.4% 4.1%;
    /* ... more variables */
  }
}
```

**Why CSS variables?**
- Easy theme switching (light/dark)
- Runtime color changes
- Tailwind utilities use variables

### Dark Mode

**Implementation**: `next-themes` library

**Setup**:
```typescript
// App.tsx
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* App content */}
    </ThemeProvider>
  );
}
```

**Theme Toggle Component**:
```typescript
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

**How it works**:
1. `next-themes` adds `class="dark"` to `<html>` element
2. Tailwind's `dark:` prefix applies styles when `.dark` class is present
3. CSS variables change values in `.dark` scope
4. All components automatically update

**Persisted**: Theme choice saved to `localStorage`, restored on reload.

---

## State Management

### Server State (TanStack Query)

**Purpose**: Manage data fetched from APIs

**Why TanStack Query?**
- **Automatic caching**: Fetched data cached by query key
- **Background refetching**: Keep data fresh without user action
- **Deduplication**: Same query runs once even if multiple components request it
- **Loading states**: Built-in `isLoading`, `isError`, `isSuccess`
- **Mutations**: Handle POST/PUT/DELETE with optimistic updates
- **Pagination**: Easy page-based data loading
- **Infinite scroll**: Load more data automatically

#### **useQuery** (Data Fetching)

```typescript
import { useQuery } from '@tanstack/react-query';

function BankAccountsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bankAccounts', page],  // Cache key (unique per query)
    queryFn: () => bankAccountApi.getBankAccounts({ page, limit: 20 }),  // Fetch function
    staleTime: 5000,  // Consider data fresh for 5 seconds
    refetchOnWindowFocus: true,  // Refetch when user returns to tab
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return <BankAccountTable accounts={data.data} />;
}
```

**Query Key**: Array that uniquely identifies query
- `['bankAccounts']` - All bank accounts
- `['bankAccounts', page]` - Bank accounts for specific page
- `['bankAccounts', { page, filters }]` - With filters

**Why important?**
- Caching: Same key returns cached data
- Invalidation: Refetch specific queries when data changes

#### **useMutation** (Data Modification)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function DocumentUpload() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => DocumentApiService.uploadDocument(file),
    onSuccess: () => {
      // Invalidate document list query (triggers refetch)
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully');
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  const handleUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {uploadMutation.isPending && <Spinner />}
    </div>
  );
}
```

**Optimistic Updates**:
```typescript
const deleteMutation = useMutation({
  mutationFn: (documentId: string) => DocumentApiService.deleteDocument(documentId),
  onMutate: async (documentId) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ queryKey: ['documents'] });

    // Snapshot current data
    const previousDocuments = queryClient.getQueryData(['documents']);

    // Optimistically update cache
    queryClient.setQueryData(['documents'], (old: Document[]) =>
      old.filter(doc => doc.id !== documentId)
    );

    // Return context with snapshot
    return { previousDocuments };
  },
  onError: (error, documentId, context) => {
    // Rollback on error
    queryClient.setQueryData(['documents'], context.previousDocuments);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  }
});
```

**Why optimistic updates?**
- Instant UI feedback
- Better perceived performance
- Rollback if mutation fails

---

### Form State (React Hook Form + Zod)

**Purpose**: Manage form inputs, validation, submission

**Why React Hook Form?**
- **Minimal re-renders**: Only re-render changed fields
- **Easy validation**: Integrate with Zod schema
- **Type-safe**: TypeScript interfaces
- **Devtools**: Browser extension for debugging

**Why Zod?**
- **Schema validation**: Define validation rules declaratively
- **Type inference**: TypeScript types from schema
- **Composable**: Reuse schemas
- **Error messages**: Custom error messages

#### **Basic Form**

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await loginApi.login(data);
      navigate('/dashboard');
    } catch (error) {
      form.setError('root', { message: error.message });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Email</label>
        <input {...form.register('email')} />
        {form.formState.errors.email && (
          <span className="error">{form.formState.errors.email.message}</span>
        )}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...form.register('password')} />
        {form.formState.errors.password && (
          <span className="error">{form.formState.errors.password.message}</span>
        )}
      </div>

      <button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      {form.formState.errors.root && (
        <div className="error">{form.formState.errors.root.message}</div>
      )}
    </form>
  );
}
```

#### **With shadcn/ui Form Components**

```typescript
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />  {/* Shows error automatically */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Login
        </Button>
      </form>
    </Form>
  );
}
```

**Benefits**:
- `FormMessage` automatically shows errors
- Accessible form labels
- Consistent styling

#### **Complex Validation**

```typescript
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]  // Show error on confirmPassword field
});
```

---

### Theme State (next-themes)

**Purpose**: Manage light/dark theme

**Usage**:
```typescript
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  // theme: 'light', 'dark', or 'system'
  // systemTheme: OS theme preference
  // resolvedTheme: Actual theme being used

  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </Button>
  );
}
```

**Persisted**: Saved to `localStorage.theme`, restored on reload.

---

### Auth State (localStorage)

**Purpose**: Store JWT token for API authentication

**Login**:
```typescript
async function login(email: string, password: string) {
  const response = await fetch('/api/v1/principals/public/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  // Store token
  localStorage.setItem('accessToken', data.token);

  // Redirect to dashboard
  navigate('/dashboard');
}
```

**Logout**:
```typescript
function logout() {
  localStorage.removeItem('accessToken');
  navigate('/login');
}
```

**Protected Routes**:
```typescript
function AppLayout({ children }) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
}
```

**Why localStorage?**
- Simple persistent storage
- Survives page reloads
- Accessible across tabs

**Security Note**: Tokens in `localStorage` are vulnerable to XSS attacks. For production, consider:
- **httpOnly cookies** (not accessible to JavaScript)
- **Refresh token rotation**
- **Short token expiration** (1 hour)

---

## Routing Configuration

### React Router v6

**Setup** (`App.tsx`):
```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public routes (no authentication) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected routes (wrapped in AppLayout) */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/bank-accounts" element={<AppLayout><BankAccountsPage /></AppLayout>} />
        <Route path="/bank-transactions/:id" element={<AppLayout><BankTransactionsPage /></AppLayout>} />
        {/* ... more routes */}

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### URL Parameters

**Define parameter in route**:
```typescript
<Route path="/bank-transactions/:id" element={<BankTransactionsPage />} />
```

**Access parameter in component**:
```typescript
import { useParams } from "react-router-dom";

function BankTransactionsPage() {
  const { id } = useParams();  // Type: string | undefined

  const { data } = useQuery({
    queryKey: ['bankAccount', id],
    queryFn: () => bankAccountApi.getBankAccountById(id!)
  });

  return <div>Account ID: {id}</div>;
}
```

### Navigation

**Programmatic navigation**:
```typescript
import { useNavigate } from "react-router-dom";

function BankAccountCard({ account }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/bank-transactions/${account.id}`);
  };

  return <div onClick={handleClick}>{account.name}</div>;
}
```

**Link component**:
```typescript
import { Link } from "react-router-dom";

<Link to="/dashboard">Go to Dashboard</Link>
```

**Navigate with state**:
```typescript
navigate('/documents', { state: { uploadSuccess: true } });

// In destination component
const location = useLocation();
const uploadSuccess = location.state?.uploadSuccess;
```

### Query Parameters

**Read query params**:
```typescript
import { useSearchParams } from "react-router-dom";

function BankAccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page') || '1';
  const filter = searchParams.get('filter');

  return (
    <div>
      <p>Page: {page}</p>
      <button onClick={() => setSearchParams({ page: '2' })}>
        Go to Page 2
      </button>
    </div>
  );
}
```

**URL**: `/bank-accounts?page=2&filter=checking`

---

## Integration with Backend

### API Gateway

**Base URL**: `http://localhost:9002/api`

**Endpoints**:
- `GET /v1/documents` - Document list
- `POST /v1/documents/upload` - Upload document
- `GET /v1/portfolios/all/accounts` - Bank accounts
- `POST /v1/integrations/plaid/link-token` - Plaid link token
- `POST /v1/principals/public/login` - Login

### Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend: POST /api/v1/principals/public/login
   ↓
3. Gateway forwards to client-ms (port 8081)
   ↓
4. client-ms validates with Keycloak
   ↓
5. Keycloak returns JWT
   ↓
6. client-ms returns JWT to frontend
   ↓
7. Frontend stores JWT in localStorage
   ↓
8. Subsequent API calls include JWT:
   Authorization: Bearer <JWT>
   ↓
9. Gateway validates JWT with Keycloak
   ↓
10. Gateway extracts user ID from JWT
   ↓
11. Gateway adds X-User-ID header
   ↓
12. Gateway forwards to microservice
```

### Request Example

```typescript
const response = await fetch('http://localhost:9002/api/v1/documents', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
});
```

**Headers sent**:
```
GET /api/v1/documents
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Gateway adds** (before forwarding to document-ms):
```
X-User-ID: faa9bc97-0904-4b4f-858f-6713c0e01d83
```

**Microservice receives**:
```
GET /api/v1/documents
X-User-ID: faa9bc97-0904-4b4f-858f-6713c0e01d83
Content-Type: application/json
```

### Error Handling

**401 Unauthorized** (token expired or invalid):
```typescript
if (response.status === 401) {
  // Clear token and redirect to login
  localStorage.removeItem('accessToken');
  navigate('/login');
}
```

**403 Forbidden** (user doesn't have permission):
```typescript
if (response.status === 403) {
  toast.error('You do not have permission to perform this action');
}
```

**500 Internal Server Error**:
```typescript
if (response.status === 500) {
  console.error('Server error:', await response.text());
  toast.error('An error occurred. Please try again later.');
}
```

### CORS

**Configured in Gateway** (`back-client-portal/gateway/src/main/resources/application.yml`):
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:5173"
            allowedMethods: [GET, POST, PUT, DELETE, OPTIONS]
            allowedHeaders: "*"
            allowCredentials: true
```

**Why needed?**
- Frontend (localhost:5173) and backend (localhost:9002) are different origins
- Browsers enforce Same-Origin Policy
- CORS headers tell browser to allow cross-origin requests

---

## Plaid Integration

### Link Account Flow

**1. User clicks "Link Account" button**

**2. Frontend requests link token**:
```typescript
import { plaidApi } from '@/services/plaidApi';

const { data: linkToken } = useQuery({
  queryKey: ['plaidLinkToken'],
  queryFn: () => plaidApi.getLinkToken('bank_account'),
  enabled: false  // Don't fetch until user clicks button
});

const handleLinkAccount = async () => {
  const { linkToken } = await plaidApi.getLinkToken('bank_account');
  // Open Plaid Link...
};
```

**Backend** (`POST /api/v1/integrations/plaid/link-token`):
```java
// integration-ms
public Mono<ResponseEntity<?>> createLinkToken(@RequestHeader("X-User-ID") String userId) {
    return plaidClient.linkTokenCreate(LinkTokenCreateRequest.builder()
            .user(LinkTokenCreateRequestUser.builder()
                .clientUserId(userId)
                .build())
            .clientName("Invictus Wealth Management")
            .products(List.of("transactions", "investments", "liabilities"))
            .countryCodes(List.of(CountryCode.US))
            .language("en")
            .build())
        .map(response -> ResponseEntity.ok(Map.of(
            "linkToken", response.getLinkToken()
        )));
}
```

**3. Frontend opens Plaid Link UI**:
```typescript
import { usePlaidLink } from 'react-plaid-link';

function LinkAccountModal() {
  const [linkToken, setLinkToken] = useState(null);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      // Exchange public token for access token
      await plaidApi.exchangeToken({
        publicToken: public_token,
        institutionName: metadata.institution.name,
        products: ['transactions', 'investments']
      });

      toast.success('Account linked successfully!');
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
    onExit: (error, metadata) => {
      if (error) {
        toast.error(`Failed to link account: ${error.error_message}`);
      }
    }
  });

  return (
    <Button onClick={() => open()} disabled={!ready}>
      Link Bank Account
    </Button>
  );
}
```

**4. User authenticates with bank**:
- Plaid shows bank selector
- User selects bank (e.g., Chase)
- Plaid shows bank login form
- User enters bank credentials
- Bank authenticates user
- User selects accounts to link

**5. Plaid returns public token**:
- Public token is a one-time token
- Valid for 30 minutes
- Must be exchanged for access token

**6. Frontend exchanges token**:
```typescript
const response = await fetch('http://localhost:9002/api/v1/integrations/plaid/exchange-token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    publicToken: public_token,
    institutionName: metadata.institution.name,
    products: ['transactions', 'investments']
  })
});
```

**Backend** (`POST /api/v1/integrations/plaid/exchange-token`):
```java
// integration-ms
public Mono<ResponseEntity<?>> exchangeToken(
    @RequestHeader("X-User-ID") String userId,
    @RequestBody ExchangeTokenRequest request) {

    // Exchange public token for access token
    return plaidClient.itemPublicTokenExchange(ItemPublicTokenExchangeRequest.builder()
            .publicToken(request.getPublicToken())
            .build())
        .flatMap(response -> {
            // Save PlaidIntegration entity
            PlaidIntegration integration = PlaidIntegration.builder()
                .userId(userId)
                .accessToken(response.getAccessToken())  // Store securely!
                .institutionName(request.getInstitutionName())
                .products(request.getProducts())
                .connectedAt(LocalDateTime.now())
                .build();

            return integrationRepository.save(integration);
        })
        .map(integration -> ResponseEntity.ok(Map.of(
            "message", "Integration successful"
        )));
}
```

**7. Portfolio data becomes available**:
- Frontend calls `GET /api/v1/portfolios/all/accounts`
- portfolio-ms fetches access tokens from integration-ms
- portfolio-ms calls Plaid API with access tokens
- Plaid returns real-time account data
- portfolio-ms transforms and returns data to frontend

**Complete Flow Diagram**:
```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │ 1. Request link token
       ▼
┌──────────────┐      ┌──────────────┐
│integration-ms│─────▶│  Plaid API   │
└──────┬───────┘  2   └──────────────┘
       │ 3. Return link token
       ▼
┌──────────────┐
│   Frontend   │
│  (Open UI)   │
└──────┬───────┘
       │ 4. User authenticates
       ▼
┌──────────────┐
│  Plaid Link  │
│      UI      │
└──────┬───────┘
       │ 5. Return public token
       ▼
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │ 6. Exchange token
       ▼
┌──────────────┐      ┌──────────────┐
│integration-ms│─────▶│  Plaid API   │
└──────┬───────┘  7   └──────────────┘
       │ 8. Return access token
       │ 9. Save to database
       ▼
┌──────────────┐
│   Database   │
└──────────────┘
```

### Fetch Portfolio Data

**Frontend**:
```typescript
const { data: accounts } = useQuery({
  queryKey: ['bankAccounts'],
  queryFn: () => bankAccountApi.getBankAccounts({ page: 1, limit: 20 })
});
```

**Backend** (portfolio-ms):
```java
public Mono<List<Account>> getAccounts(String userId) {
    // 1. Get user's Plaid access tokens from integration-ms
    return integrationClient.getPlaidIntegrations(userId)
        .flatMapMany(Flux::fromIterable)
        .flatMap(integration -> {
            // 2. Fetch accounts from Plaid for each integration
            AccountsGetRequest request = new AccountsGetRequest()
                .accessToken(integration.getAccessToken());

            return plaidClient.accountsGet(request);
        })
        .map(accountMapper::toAccount)
        .collectList();
}
```

**Plaid API Response**:
```json
{
  "accounts": [
    {
      "account_id": "ndze65jW5gCBPovloNAyTR7mlkDLn7CAl7wng",
      "balances": {
        "available": 43200.0,
        "current": 43200.0,
        "iso_currency_code": "USD"
      },
      "name": "Plaid Money Market",
      "official_name": "Plaid Money Market Account",
      "subtype": "money market",
      "type": "depository"
    }
  ]
}
```

---

## Development Patterns

### Component Best Practices

#### **1. Single Responsibility**
Each component should do one thing:
```typescript
// ❌ Bad: Component does too much
function BankAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/accounts').then(r => r.json()).then(setAccounts);
  }, [page, filters]);

  return (
    <div>
      <input onChange={e => setFilters({ ...filters, search: e.target.value })} />
      {accounts.map(account => (
        <div key={account.id}>
          <h3>{account.name}</h3>
          <p>${account.balance}</p>
        </div>
      ))}
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}

// ✅ Good: Separate concerns
function BankAccountsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data } = useQuery({
    queryKey: ['accounts', page, filters],
    queryFn: () => api.getAccounts(page, filters)
  });

  return (
    <div>
      <AccountFilters filters={filters} onFilterChange={setFilters} />
      <AccountList accounts={data?.accounts} />
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

#### **2. Extract Reusable Logic to Hooks**
```typescript
// Custom hook
function useBankAccounts(page: number, filters: BankAccountFilters) {
  return useQuery({
    queryKey: ['bankAccounts', page, filters],
    queryFn: () => bankAccountApi.getBankAccounts({ page, limit: 20 }, filters)
  });
}

// Usage
function BankAccountsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { data, isLoading, error } = useBankAccounts(page, filters);

  // ... render
}
```

#### **3. Use TypeScript Interfaces for Props**
```typescript
// Define interface
interface BankAccountCardProps {
  account: BankAccount;
  onClick?: (account: BankAccount) => void;
  showDetails?: boolean;
}

// Component
function BankAccountCard({ account, onClick, showDetails = true }: BankAccountCardProps) {
  return (
    <Card onClick={() => onClick?.(account)}>
      <h3>{account.name}</h3>
      {showDetails && <p>${account.balance}</p>}
    </Card>
  );
}
```

#### **4. Compose UI from Small Components**
```typescript
// Small, reusable components
function AccountBalance({ amount, currency }: { amount: number; currency: string }) {
  return <span>{amount.toLocaleString('en-US', { style: 'currency', currency })}</span>;
}

function AccountTypeBadge({ type }: { type: string }) {
  return <Badge variant={type === 'checking' ? 'default' : 'secondary'}>{type}</Badge>;
}

// Compose into larger component
function BankAccountCard({ account }: { account: BankAccount }) {
  return (
    <Card>
      <h3>{account.name}</h3>
      <AccountTypeBadge type={account.assetSubclass} />
      <AccountBalance amount={account.balance} currency={account.currency} />
    </Card>
  );
}
```

### API Call Pattern

#### **Always Use TanStack Query**
```typescript
// ❌ Bad: Manual fetch with useState
function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(data => {
        setDocuments(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{documents.map(/* ... */)}</div>;
}

// ✅ Good: Use TanStack Query
function DocumentList() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => DocumentApiService.getDocuments(0, 20)
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{documents.content.map(/* ... */)}</div>;
}
```

**Benefits**:
- Automatic caching
- Background refetching
- Loading states
- Error handling
- Deduplication

#### **Mutations with Optimistic Updates**
```typescript
const deleteMutation = useMutation({
  mutationFn: DocumentApiService.deleteDocument,
  onMutate: async (documentId) => {
    // Optimistically remove from UI
    await queryClient.cancelQueries({ queryKey: ['documents'] });
    const previous = queryClient.getQueryData(['documents']);

    queryClient.setQueryData(['documents'], (old: Document[]) =>
      old.filter(doc => doc.id !== documentId)
    );

    return { previous };
  },
  onError: (error, documentId, context) => {
    // Rollback on error
    queryClient.setQueryData(['documents'], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  }
});
```

### Form Validation Pattern

```typescript
// Define schema
const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Use in form
const form = useForm<z.infer<typeof passwordSchema>>({
  resolver: zodResolver(passwordSchema)
});
```

### Error Handling

#### **API Service Level**
```typescript
export const bankAccountApi = {
  async getBankAccounts(pagination, filters) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bank accounts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bank accounts, using mock data:', error);
      // Fallback to mock data
      return mockBankAccounts;
    }
  }
};
```

#### **Component Level**
```typescript
function BankAccountsPage() {
  const { data, error } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => bankAccountApi.getBankAccounts()
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return <AccountList accounts={data} />;
}
```

---

## Dependencies & Libraries

### Core Dependencies

#### **React 18.3.1**
**Purpose**: UI library
**Why**:
- **Hooks**: Functional components with state
- **Concurrent rendering**: Better performance
- **Suspense**: Loading states
- **Virtual DOM**: Efficient updates

#### **TypeScript 5.5.3**
**Purpose**: Static type checking
**Why**:
- **Type safety**: Catch errors at compile time
- **IntelliSense**: Better IDE support
- **Refactoring**: Rename safely
- **Documentation**: Types as inline docs

#### **Vite 5.4.1**
**Purpose**: Build tool and dev server
**Why**:
- **Fast HMR**: Instant hot module replacement
- **ESM-native**: No bundling during dev
- **Optimized builds**: Production builds with rollup
- **Plugin ecosystem**: React, TypeScript, etc.

**Alternatives**: Create React App (slower), Next.js (more features, but heavier)

---

### UI & Styling

#### **Tailwind CSS 3.4.11**
**Purpose**: Utility-first CSS framework
**Why**:
- **Rapid development**: No custom CSS needed
- **Consistency**: Predefined spacing, colors
- **Responsive**: Mobile-first utilities
- **Dark mode**: Built-in support

#### **Radix UI** (47 packages)
**Purpose**: Accessible, unstyled UI primitives
**Why**:
- **Accessibility**: ARIA compliant
- **Unstyled**: Full control over styling
- **TypeScript**: Fully typed
- **Composable**: Build complex UIs from primitives

#### **Lucide React 0.462.0**
**Purpose**: Icon library
**Why**:
- **Consistent design**: All icons same style
- **Tree-shakeable**: Import only icons you use
- **Customizable**: Size, color, stroke width
- **SVG**: Scalable, sharp on all screens

#### **next-themes 0.3.0**
**Purpose**: Theme management (light/dark)
**Why**:
- **System preference**: Respect OS theme
- **Persistent**: Save choice to localStorage
- **SSR-safe**: No flash of wrong theme
- **Simple API**: `useTheme()` hook

---

### Data Fetching & State

#### **TanStack Query 5.56.2**
**Purpose**: Server state management
**Why**:
- **Caching**: Automatic data caching
- **Background updates**: Keep data fresh
- **Devtools**: Browser extension for debugging
- **TypeScript**: Fully typed

#### **React Hook Form 7.53.0**
**Purpose**: Form state management
**Why**:
- **Performance**: Minimal re-renders
- **Validation**: Integrate with Zod
- **TypeScript**: Type-safe forms
- **Devtools**: Browser extension

#### **Zod 3.23.8**
**Purpose**: Schema validation
**Why**:
- **Type inference**: TypeScript types from schema
- **Composable**: Reuse schemas
- **Error messages**: Custom messages
- **Runtime validation**: Validate API responses

---

### Routing

#### **React Router 6.26.2**
**Purpose**: Client-side routing
**Why**:
- **Declarative**: Define routes as components
- **Nested routes**: Layout components
- **Hooks**: `useNavigate`, `useParams`, `useLocation`
- **TypeScript**: Type-safe routes

---

### Charts & Visualization

#### **Highcharts 12.3.0 + highcharts-react-official 3.2.2**
**Purpose**: Professional charting library
**Why**:
- **Interactive**: Zoom, pan, hover tooltips
- **Responsive**: Adapts to screen size
- **Many chart types**: Line, bar, pie, map, etc.
- **Exporting**: Save as PNG/PDF
- **Accessibility**: Keyboard navigation, screen readers

**Used for**:
- Portfolio performance (line chart)
- Asset breakdown (pie chart)
- Geographical distribution (world map)

#### **Recharts 2.12.7**
**Purpose**: React-native charting library
**Why**:
- **React components**: Compose charts from components
- **Responsive**: Built-in responsive wrapper
- **Simple API**: Easy to use

**Used for**:
- Cash flow (bar chart)
- Simpler charts where Highcharts is overkill

---

### External Integrations

#### **react-plaid-link 4.1.1**
**Purpose**: Plaid Link integration
**Why**:
- **Official SDK**: Maintained by Plaid
- **Hooks**: `usePlaidLink()` hook
- **TypeScript**: Fully typed
- **Easy integration**: Drop-in component

---

### Utilities

#### **date-fns 3.6.0**
**Purpose**: Date formatting and manipulation
**Why**:
- **Lightweight**: 200 KB (vs Moment.js 300 KB)
- **Immutable**: Doesn't mutate dates
- **Tree-shakeable**: Import only functions you use
- **TypeScript**: Fully typed

**Example**:
```typescript
import { format, parseISO, formatDistanceToNow } from 'date-fns';

format(new Date(), 'MMM dd, yyyy');  // "Jan 01, 2025"
formatDistanceToNow(parseISO('2025-01-01'));  // "2 days ago"
```

#### **clsx + tailwind-merge**
**Purpose**: Conditional class names
**Why**:
- **Conditional**: Apply classes based on state
- **Merge**: Resolve Tailwind class conflicts

**Example**:
```typescript
import { cn } from '@/lib/utils';  // clsx + tailwind-merge

<div className={cn(
  'p-4 border',
  isActive && 'bg-blue-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  Content
</div>
```

#### **sonner 1.5.0**
**Purpose**: Toast notifications
**Why**:
- **Beautiful**: Pre-styled, modern design
- **Accessible**: Keyboard dismissible
- **Promise support**: Show loading → success/error
- **Simple API**: `toast.success()`, `toast.error()`

**Example**:
```typescript
import { toast } from 'sonner';

toast.success('Document uploaded successfully!');
toast.error('Failed to upload document');
toast.promise(uploadDocument(file), {
  loading: 'Uploading...',
  success: 'Uploaded!',
  error: 'Failed to upload'
});
```

---

## Conclusion

This frontend architecture provides a modern, scalable, and maintainable foundation for the Invictus wealth management platform. Key strengths:

- **Component-Based**: Reusable, composable UI components
- **Type-Safe**: TypeScript catches errors at compile time
- **Fast Development**: Vite HMR, Tailwind CSS, shadcn/ui
- **Server State**: TanStack Query for data fetching and caching
- **Form Validation**: React Hook Form + Zod for type-safe forms
- **Routing**: React Router for client-side navigation
- **Plaid Integration**: Seamless bank account linking
- **Dark Mode**: Built-in theme support
- **Accessible**: Radix UI primitives (ARIA compliant)

For setup instructions, see [QUICKSTART.md](QUICKSTART.md).

For backend integration, see [../back-client-portal/BACKEND_GUIDE.md](../back-client-portal/BACKEND_GUIDE.md).
