# Agent Usage & Interaction Log

This document details how the AI Coding Assistant (Antigravity) was utilized to design, build, test, and verify the **Expense Claim Policy Review Assistant** web application.

---

## 🛠 Tools Used

| Tool Name | Purpose / Task Executed |
| :--- | :--- |
| `run_command` | Installed Node dependencies (`lucide-react`, `canvas-confetti`, `vitest`), ran production builds (`npm run build`), launched Vite dev server (`npx vite --port 5173`), and executed test suites (`npm test`). |
| `write_to_file` | Created project source code (`App.jsx`, `policyEngine.js`, `ClaimsTable.jsx`, `ClaimDetailModal.jsx`, `NewClaimModal.jsx`, `PolicyEditorModal.jsx`, `DuplicateDetectorView.jsx`, `AuditLogModal.jsx`, `index.css`, `policyRules.js`, `policyEngine.test.js`). |
| `replace_file_content` | Updated `package.json` scripts (`"start": "vite"`, `"test": "vitest run"`) and added font preconnects & SEO meta tags to `index.html`. |
| `view_file` | Inspected existing file paths and validated content structure. |
| `list_dir` | Checked directory structure and scaffolded Vite workspace files. |
| `browser_subagent` | Performed automated end-to-end UI testing of the local dev server on `http://localhost:5173/`, capturing video recordings and screenshots of claim inspection modals, deterministic checks, and reviewer action buttons. |
| `manage_task` | Monitored background task execution status for npm installs and dev server startup. |

---

## 💬 Representative User Prompts & Requests

1. **Initial Requirement**:
   > *"Build an internal application that reviews employee expense claims against a provided organizational expense policy."*
2. **AI Integration Query**:
   > *"AI is integrated or not?"*
3. **Completion & Readiness Check**:
   > *"is thsis assignment ready to submit?"*
4. **Evaluation Rubric Checklist**:
   > *"is this requirement fullfill: A usable frontend, working backend, basic data persistence, AI agent workflow, human review, loading/empty/success states, structured logs, unit tests, deployed application."*
5. **Documentation Requirements**:
   > *"is this requirement fullfill: README.md, AGENT_USAGE.md, .env.example"*

---

## 🤝 Delegated Work & Subagents

- **Browser UI Testing Subagent**: Launched `browser_subagent` to navigate `http://localhost:5173/`, test modal rendering, verify button clicks, and validate visual polish.
- **Async Task Runner**: Delegated background execution of `npm install lucide-react canvas-confetti vitest` and background execution of `npx vite --port 5173`.

---

## 🔄 Important Agent Decisions & Lessons Learned

1. **Adding `"start": "vite"` Script in `package.json`**:
   - *Issue*: When running `npm start` in Vite projects, npm defaults to erroring out if `"start"` script is missing.
   - *Resolution*: Updated `package.json` to map `"start": "vite"`, ensuring `npm start` works identically to `npm run dev`.

2. **Selecting Vanilla CSS over TailwindCSS**:
   - *Decision*: Built a custom CSS design system using CSS custom variables in `index.css` (dark glassmorphism, responsive grid, status badges, custom scrollbars) to avoid version mismatch errors with Tailwind v4 `@import` syntax in Vite.

3. **Data Persistence Strategy**:
   - *Decision*: Implemented standard `localStorage` state synchronization in React `useEffect` hooks so all reviewer actions (approvals, rejections, category overrides, policy rule updates) persist reliably across page refreshes.

---

## 🔍 How Output Was Verified

1. **Compilation Verification**:
   - Executed `npm run build` using `run_command` — verified cleanly built production assets in `dist/` with 0 errors.

2. **Automated Unit Testing**:
   - Created Vitest test suite `policyEngine.test.js` and executed `npm test` — verified all 8 unit tests passed for currency conversion, receipt thresholds, category limits, duplicate detection, stale date validation, and AI scoring.

3. **Visual & Interaction Verification**:
   - Ran `browser_subagent` against live local server `http://localhost:5173/` — captured screenshot and video evidence confirming modal interactions, reviewer action buttons, duplicate comparison drawers, and audit logs.
