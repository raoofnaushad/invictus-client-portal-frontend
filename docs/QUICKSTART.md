# Quick Start Guide

Get your wealth management frontend running in minutes!

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+**: JavaScript runtime
- **npm**: Node package manager (comes with Node.js)
- **Backend services** (optional): For full functionality, or use mock mode
- **Modern browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Step 1: Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd front-client-portal

# Install all dependencies
npm install
```

**Expected output**: Dependencies installed successfully (this may take 2-3 minutes on first run).

## Step 2: Start Development Server

Start the Vite development server:

```bash
npm run dev
```

**Expected output**:
```
VITE v5.4.1  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

The application will automatically open at **http://localhost:5173** (or the next available port).

## Step 3: Access the Application

### Option A: With Backend Running

If you have the backend services running (see [back-client-portal/QUICKSTART.md](../back-client-portal/QUICKSTART.md)):

1. **Navigate to**: http://localhost:5173
2. **Automatic redirect**: You'll be redirected to `/login`
3. **Register a new account**:
   - Click "Don't have an account? Sign up"
   - Or go directly to: http://localhost:5173/onboarding
4. **Complete onboarding**:
   - Enter email
   - Set password
   - Add phone number (optional)
   - Set up MFA (SMS or Authenticator app)
5. **Login**:
   - Use your credentials
   - Enter OTP if MFA is enabled
6. **Access dashboard**: You'll see your portfolio overview

### Option B: Without Backend (Mock Mode)

The frontend has fallback mock APIs for development:

1. **Navigate to**: http://localhost:5173
2. **Login page**: Use any credentials (mock auth bypasses validation)
3. **Explore features**: Mock data is available for:
   - Bank accounts
   - Investment accounts
   - Liabilities
   - Documents
   - Transactions

**Note**: Document upload and Plaid integration require backend services.

## Step 4: Verify Setup

Check that all features are working:

### ✅ Navigation
- Click through the left sidebar menu
- All pages should load without errors

### ✅ Dashboard
- Portfolio summary displays
- Charts render correctly (net worth, asset breakdown, cash flow)
- Stats cards show data

### ✅ Bank Accounts
- Navigate to **"Bank Accounts"** (sidebar)
- Account list displays
- Click an account to view transactions

### ✅ Documents
- Navigate to **"Document Vault"**
- Table displays uploaded documents
- Click "Upload" to test file upload (requires backend)

### ✅ Theme Toggle
- Click the sun/moon icon in the header
- Theme switches between light/dark

## Quick Reference

### Development Commands

```bash
# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Service Ports

| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 5173 | React app (Vite dev server) |
| **Backend Gateway** | 9002 | API endpoint |
| **Keycloak** | 8080 | Authentication (if using backend) |

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/pages/` | Route components (24 pages) |
| `src/components/` | Reusable UI components |
| `src/components/ui/` | shadcn/ui primitives (47 components) |
| `src/services/` | API client layer |
| `src/hooks/` | Custom React hooks |
| `src/types/` | TypeScript interfaces |

## What's Configured?

### Tech Stack
- **React 18**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast dev server with Hot Module Replacement (HMR)
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: 47+ accessible, customizable components
- **TanStack Query**: Server state management with caching
- **React Router v6**: Client-side routing

### Features Available
- **Authentication**: Login, registration, MFA (SMS/Authenticator)
- **Dashboard**: Portfolio overview with interactive charts
- **Bank Accounts**: View accounts and transactions
- **Investment Accounts**: Securities, holdings, transactions
- **Illiquid Investments**: Private equity, VC, real estate tracking
- **Liabilities**: Loans, mortgages, credit cards
- **Document Vault**: Upload documents, view AI-extracted data
- **Document Labeling**: Annotation tool for training data
- **Activity Hub**: Todos, emails, meetings, notes, activity stream
- **Plaid Integration**: Link bank accounts (requires backend)
- **Settings**: Personal profile, account preferences, integrations
- **Dark Mode**: System-wide theme toggle

### API Integration
- **Base URL**: `http://localhost:9002/api`
- **Authentication**: Bearer token in `localStorage.accessToken`
- **Mock Fallback**: Services fall back to mock data if API fails

## Next Steps

### 1. Explore the Dashboard
Navigate to http://localhost:5173/dashboard to see:
- Total net worth
- Asset breakdown (pie chart)
- Portfolio performance (line chart)
- Cash flow analysis
- Recent transactions

### 2. Link a Bank Account (Requires Backend)
1. Click **"Link Account"** button in the header
2. Select **"Bank Account"**
3. Plaid Link window opens
4. Choose a bank (use "Plaid Sandbox" for testing)
5. Login with test credentials:
   - Username: `user_good`
   - Password: `pass_good`
6. Select accounts to link
7. Accounts appear in **"Bank Accounts"** page

### 3. Upload a Document (Requires Backend)
1. Navigate to **"Document Vault"**
2. Click **"Upload"** button
3. Select a PDF file (bank statement, capital call notice, etc.)
4. Document status shows "Processing"
5. Wait for AI extraction (1-2 minutes)
6. Status changes to "Completed"
7. Click document to view extracted data

### 4. Customize Theme
1. Click sun/moon icon in header
2. Theme persists across sessions
3. All components support dark mode
4. Customize colors in `tailwind.config.ts`

### 5. Learn More
- **Architecture Guide**: [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) - Comprehensive technical documentation
- **Backend Setup**: [../back-client-portal/QUICKSTART.md](../back-client-portal/QUICKSTART.md)
- **Component Library**: shadcn/ui components in `src/components/ui/`

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant updates without full page reload:
- Edit any `.tsx` file
- Save the file
- Browser updates instantly (preserves component state)

### TypeScript Intellisense
Use VSCode or WebStorm for best experience:
- Hover over components for prop types
- Cmd/Ctrl + Click to jump to definitions
- Auto-complete for imports and props

### Component Development
Reusable components are in `src/components/`:
```bash
src/components/
├── ui/                    # shadcn/ui primitives
├── BankAccountCard.tsx    # Bank account summary
├── DashboardCharts.tsx    # Dashboard visualizations
├── DocumentTable.tsx      # Document list
└── ...
```

### API Service Pattern
Services are in `src/services/`:
```bash
src/services/
├── documentApi.ts         # Real API
├── bankAccountApi.ts      # Real API with mock fallback
├── plaidApi.ts            # Plaid integration
├── mockApi.ts             # Mock data
└── ...
```

**Example API call**:
```typescript
import { DocumentApiService } from '@/services/documentApi';

const documents = await DocumentApiService.getDocuments(page, pageSize);
```

### Routing
All routes are defined in `src/App.tsx`:
- Public routes: `/login`, `/onboarding`
- Protected routes: Everything else (wrapped in `AppLayout`)

**Add a new route**:
```typescript
<Route path="/new-page" element={<AppLayout><NewPage /></AppLayout>} />
```

### State Management
- **Server state**: Use TanStack Query (`useQuery`, `useMutation`)
- **Form state**: Use React Hook Form + Zod validation
- **Theme state**: Use `next-themes` (`useTheme()`)
- **Auth state**: Stored in `localStorage.accessToken`

## Troubleshooting

### Issue: Port 5173 already in use
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or start on different port
npm run dev -- --port 5174
```

### Issue: Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails with TypeScript errors
```bash
# Check TypeScript configuration
cat tsconfig.json

# TypeScript strict mode is disabled for rapid development
# If you see errors, they're warnings - build should still work
npm run build
```

### Issue: API calls return 401 Unauthorized
**Solution**: Authentication token expired or missing
1. Check if backend is running: http://localhost:9002/actuator/health
2. Clear `localStorage.accessToken` and re-login
3. Verify token in browser DevTools → Application → Local Storage

### Issue: Plaid Link doesn't open
**Solution**:
1. Ensure backend `integration-ms` is running (port 8083)
2. Check console for errors
3. Verify Plaid credentials are configured in backend
4. Try using mock Plaid (`mockPlaidApi.ts`)

### Issue: Charts not rendering
**Solution**:
1. Check console for errors
2. Ensure Highcharts library loaded: `npm list highcharts`
3. Verify mock data exists if backend is down
4. Check browser compatibility (use latest Chrome/Firefox)

### Issue: Dark mode not working
**Solution**:
1. Check if `next-themes` is installed: `npm list next-themes`
2. Verify theme provider in `App.tsx`
3. Clear browser cache and localStorage
4. Check CSS variables in browser DevTools

### Issue: Build size too large
```bash
# Analyze bundle size
npm run build

# Output shows size breakdown
# Optimize by lazy-loading routes or removing unused dependencies
```

## Building for Production

### Create Production Build

```bash
# Build optimized bundle
npm run build
```

**Output**: `dist/` directory with:
- `index.html` - Entry point
- `assets/` - JS, CSS, images (with hash for caching)

**Expected size**: ~800KB gzipped (React + dependencies)

### Preview Production Build

```bash
# Serve production build locally
npm run preview
```

Opens at http://localhost:4173

### Serve with Backend

Production frontend should be served from the same domain as backend to avoid CORS issues:

**Option 1: Nginx reverse proxy**
```nginx
server {
  listen 80;

  # Frontend (static files)
  location / {
    root /var/www/front-client-portal/dist;
    try_files $uri $uri/ /index.html;
  }

  # Backend API
  location /api {
    proxy_pass http://localhost:9002;
  }
}
```

**Option 2: Spring Boot static resources**
Copy `dist/` contents to `back-client-portal/gateway/src/main/resources/static/`

### Environment Variables

Create `.env.production`:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_PLAID_ENV=production
```

Update `src/services/documentApi.ts` to use environment variables:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9002/api';
```

## Performance Optimization

### Code Splitting

Lazy load routes for better initial load time:
```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

<Route path="/dashboard" element={
  <AppLayout>
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  </AppLayout>
} />
```

### Image Optimization

- Use WebP format for images
- Compress images before uploading
- Use `loading="lazy"` for images below the fold

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer()]
});

# Build and open stats.html
npm run build
```

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- No IE11 support

**Check compatibility**: Run `npx browserslist` to see supported browsers.

## Support

Having issues not covered here?

1. **Check logs**: Browser DevTools → Console
2. **Verify backend**: Ensure all microservices are running
3. **Read detailed docs**: [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) has comprehensive guide
4. **Check API responses**: Network tab in DevTools

---

**Success!** You should now have a running wealth management frontend. Start exploring the features or read [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) for in-depth documentation.
