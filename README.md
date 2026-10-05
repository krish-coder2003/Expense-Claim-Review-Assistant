# PolicyGuard — Expense Claim Policy Review Assistant

An enterprise internal application built to automatically review employee expense claims against organizational policy rules using a hybrid **AI Workflow & Deterministic Compliance Engine**.

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or higher

### Installation
```bash
# 1. Clone the repository
git clone <repository-url>
cd "Expense Claim Review Assistant"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# OR
npm start
```
The dev server will launch locally at `http://localhost:5173/`.

### Running Unit Tests
```bash
npm test
```
Runs the Vitest suite covering deterministic validation algorithms, currency conversions, receipt threshold checks, and AI classification logic.

### Building for Production
```bash
npm run build
```
Generates optimized static distribution files in the `/dist` directory.

---

## 🏗 System Architecture

```
src/
├── constants/
│   └── policyRules.js       # Policy sections (POL-101 to POL-105), thresholds, currency exchange rates & sample dataset
├── services/
│   ├── policyEngine.js      # Deterministic Validator & AI Workflow Classification Engine
│   └── policyEngine.test.js # Vitest automated test suite (8 unit tests)
├── components/
│   ├── Navbar.jsx           # Sticky header, stats status indicator & modal triggers
│   ├── StatsOverview.jsx    # Executive analytics cards (total spend, violations, duplicates, clarification)
│   ├── ClaimsTable.jsx      # Filterable & searchable claim matrix with status badges
│   ├── ClaimDetailModal.jsx # Split-view review drawer (Deterministic checklist + AI analysis + Reviewer action bar)
│   ├── NewClaimModal.jsx    # Submission modal with real-time AI classification preview as description is typed
│   ├── PolicyEditorModal.jsx# Live editor for per-claim spending limits & receipt requirement thresholds
│   ├── DuplicateDetectorView.jsx # Side-by-side claim comparison for flagged duplicate claims
│   └── AuditLogModal.jsx    # System-wide audit trail of reviewer decisions and overrides
├── App.jsx                  # Main application state, localStorage persistence & modal orchestrator
├── index.css                # Custom CSS design system (Dark glassmorphism theme, typography, animations)
└── main.jsx                 # React root entry point
```

---

## ✅ Completed Scope

### 1. Standardized Expense Claim Format
- `claimant`, `date`, `category`, `amount`, `currency`, `description`, `receiptAvailable` (yes/no).
- Multi-currency support (`USD`, `EUR`, `GBP`, `CAD`, `INR`, `JPY`) with real-time exchange rate conversion to base USD.

### 2. AI Workflow Engine
- **Ambiguous Description Categorization**: Classifies ambiguous descriptions into standard policy categories.
- **Uncertainty Detector**: Flags vague descriptions with `⚠️ Uncertain AI Classification` badges when confidence is <80%.
- **Policy Citation Snippet**: Quotes exact policy rules (e.g. `POL-101 Meals & Entertainment`, `POL-103 SaaS Tools`) for each claim.
- **AI Narrative Explanation**: Generates plain-English findings explaining compliance or policy breaches.
- **Missing Info Prompts**: Identifies missing receipts or attendee lists for business dining.

### 3. Deterministic Validation Engine
- **Duplicate Claim Detection**: Flags duplicate claims (matching claimant, date, amount, currency) and displays side-by-side comparison.
- **Category Limit Checker**: Compares converted USD amounts against policy thresholds.
- **Missing Receipt Identifier**: Enforces receipt requirements based on per-category dollar thresholds.
- **Date & Field Validation**: Validates mandatory fields, invalid dates, future dates, and stale claims (> 60 days old).

### 4. Reviewer Actions & Decision History
- ✅ **Approve Claim**: Approves claims with audit log entry and visual celebratory feedback.
- ❌ **Reject Claim**: Prompts reviewer for non-compliance rationale.
- 💬 **Request Clarification**: Generates customizable pre-filled message prompts for the claimant.
- ✏️ **Override AI Classification**: Allows reviewers to change categories with an explicit reason, immediately re-evaluating policy limits.
- 📜 **Audit History**: Complete chronological history of AI evaluations and reviewer decisions saved per claim and system-wide.

---

## 🚫 Intentionally Excluded Scope

Per application specifications, the following non-core workflows were intentionally excluded:
- ❌ **Actual Reimbursement & Payment Processing**: Does not connect to banking APIs or Stripe payouts.
- ❌ **Payroll System Integration**: No synchronization with external HRMS or payroll services.
- ❌ **Receipt OCR Parsing**: Uses receipt availability toggle and metadata instead of image OCR processing.
- ❌ **Tax Advice & Tax Deductibility Calculation**: Evaluates corporate policy limits rather than region-specific tax codes.

---

## 🧪 Unit Tests

Automated testing is implemented using Vitest. Run tests using `npm test`.

Passes **8 test suites** in `policyEngine.test.js`:
- Currency conversion math (EUR to USD).
- Mandatory receipt threshold detection for SaaS and meals.
- Per-claim category spending limit overflow flags.
- Duplicate claim identification against historical database.
- Stale date validation (> 60 days).
- AI keyword intent mapping and section retrieval.
- AI confidence scoring and uncertainty flag trigger.

---

## ⚠️ Current Limitations

1. **Storage Persistence**: Uses browser `localStorage` for data persistence across page reloads. For multi-user concurrent editing, a centralized database backend (e.g., PostgreSQL / MongoDB) would be integrated.
2. **AI Inference Model**: Uses an algorithmic keyword-intent NLP classifier to evaluate claim descriptions locally without requiring external API keys or incurring LLM API costs.

---

## 🌐 Deployment Details

### Build Static Assets
```bash
npm run build
```
This generates production-ready minified static bundle files in the `/dist` directory.

### Host Provider Compatibility
The contents of `/dist` can be directly deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **GitHub Pages**: Deploy `/dist` using `gh-pages` branch
- **Cloudflare Pages**: Connect repo and select Vite build output `/dist`
