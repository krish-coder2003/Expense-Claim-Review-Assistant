import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ClaimsTable from './components/ClaimsTable';
import ClaimDetailModal from './components/ClaimDetailModal';
import NewClaimModal from './components/NewClaimModal';
import PolicyEditorModal from './components/PolicyEditorModal';
import DuplicateDetectorView from './components/DuplicateDetectorView';
import AuditLogModal from './components/AuditLogModal';

import { SAMPLE_CLAIMS, POLICY_SECTIONS } from './constants/policyRules';
import { evaluateClaim } from './services/policyEngine';

const STORAGE_KEY_CLAIMS = 'policyguard_claims_v1';
const STORAGE_KEY_POLICIES = 'policyguard_policies_v1';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  // Policy configuration state with localStorage persistence
  const [policies, setPolicies] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POLICIES);
      return saved ? JSON.parse(saved) : POLICY_SECTIONS;
    } catch {
      return POLICY_SECTIONS;
    }
  });

  // Claims state with localStorage persistence
  const [claims, setClaims] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLAIMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(c => evaluateClaim(c, parsed, POLICY_SECTIONS));
      }
    } catch (e) {
      console.warn('LocalStorage load error, using default sample dataset', e);
    }
    return SAMPLE_CLAIMS.map(claim => evaluateClaim(claim, SAMPLE_CLAIMS, POLICY_SECTIONS));
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed to persist claims to localStorage', e);
    }
  }, [claims]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POLICIES, JSON.stringify(policies));
    } catch (e) {
      console.error('Failed to persist policies to localStorage', e);
    }
  }, [policies]);

  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [showPolicyEditorModal, setShowPolicyEditorModal] = useState(false);
  const [showAuditLogModal, setShowAuditLogModal] = useState(false);
  const [duplicateTargetId, setDuplicateTargetId] = useState(null);

  // Active selected claim object
  const activeSelectedClaim = useMemo(() => {
    if (!selectedClaimId) return null;
    return claims.find(c => c.id === selectedClaimId) || null;
  }, [claims, selectedClaimId]);

  // Active duplicate claim for comparison
  const activeDuplicateClaim = useMemo(() => {
    if (!duplicateTargetId) return null;
    return claims.find(c => c.id === duplicateTargetId) || null;
  }, [claims, duplicateTargetId]);

  // Helper to re-evaluate all claims when policies change or claims list updates
  const reEvaluateAllClaims = (claimList, currentPolicies = policies) => {
    return claimList.map(c => evaluateClaim(c, claimList, currentPolicies));
  };

  // Handlers
  const handleApproveClaim = (claimId) => {
    setIsLoading(true);
    setTimeout(() => {
      setClaims(prev => {
        const updated = prev.map(c => {
          if (c.id !== claimId) return c;
          const newHistory = [
            ...(c.auditHistory || []),
            {
              timestamp: new Date().toISOString(),
              actor: 'Reviewer - Management Signoff',
              action: 'Approved Claim',
              notes: 'Claim fully approved for expense reimbursement.'
            }
          ];
          return evaluateClaim({ ...c, status: 'Approved', auditHistory: newHistory }, prev, policies);
        });
        return updated;
      });
      setIsLoading(false);
    }, 200);
  };

  const handleRejectClaim = (claimId, reason) => {
    setIsLoading(true);
    setTimeout(() => {
      setClaims(prev => {
        const updated = prev.map(c => {
          if (c.id !== claimId) return c;
          const newHistory = [
            ...(c.auditHistory || []),
            {
              timestamp: new Date().toISOString(),
              actor: 'Reviewer - Compliance Officer',
              action: 'Rejected Claim',
              notes: `Rejection rationale: ${reason}`
            }
          ];
          return evaluateClaim({ ...c, status: 'Rejected', auditHistory: newHistory }, prev, policies);
        });
        return updated;
      });
      setIsLoading(false);
    }, 200);
  };

  const handleRequestClarification = (claimId, message) => {
    setIsLoading(true);
    setTimeout(() => {
      setClaims(prev => {
        const updated = prev.map(c => {
          if (c.id !== claimId) return c;
          const newHistory = [
            ...(c.auditHistory || []),
            {
              timestamp: new Date().toISOString(),
              actor: 'Reviewer - Policy Audit',
              action: 'Requested Clarification',
              notes: `Clarification prompt sent to claimant: ${message}`
            }
          ];
          return evaluateClaim({ ...c, status: 'Clarification Requested', auditHistory: newHistory }, prev, policies);
        });
        return updated;
      });
      setIsLoading(false);
    }, 200);
  };

  const handleOverrideCategory = (claimId, newCategory, reason) => {
    setIsLoading(true);
    setTimeout(() => {
      setClaims(prev => {
        const updated = prev.map(c => {
          if (c.id !== claimId) return c;
          const previousCat = c.category;
          const newAiClassification = {
            ...c.aiClassification,
            overrideCategory: newCategory,
            overrideReason: reason
          };
          const newHistory = [
            ...(c.auditHistory || []),
            {
              timestamp: new Date().toISOString(),
              actor: 'Reviewer - Lead Auditor',
              action: 'Classification Overridden',
              notes: `Overrode category from "${previousCat}" to "${newCategory}". Reason: ${reason}`
            }
          ];
          return evaluateClaim({
            ...c,
            category: newCategory,
            aiClassification: newAiClassification,
            auditHistory: newHistory
          }, prev, policies);
        });
        return updated;
      });
      setIsLoading(false);
    }, 200);
  };

  const handleCreateClaim = (newClaimRaw) => {
    setIsLoading(true);
    setTimeout(() => {
      setClaims(prev => {
        const newList = [newClaimRaw, ...prev];
        return reEvaluateAllClaims(newList, policies);
      });
      setIsLoading(false);
    }, 300);
  };

  const handleSavePolicies = (newPolicies) => {
    setPolicies(newPolicies);
    setClaims(prev => reEvaluateAllClaims(prev, newPolicies));
  };

  const handleResetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_CLAIMS);
    localStorage.removeItem(STORAGE_KEY_POLICIES);
    setPolicies(POLICY_SECTIONS);
    const resetList = SAMPLE_CLAIMS.map(claim => evaluateClaim(claim, SAMPLE_CLAIMS, POLICY_SECTIONS));
    setClaims(resetList);
    setSelectedClaimId(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar 
        onOpenNewClaim={() => setShowNewClaimModal(true)}
        onOpenPolicyEditor={() => setShowPolicyEditorModal(true)}
        onOpenAuditLog={() => setShowAuditLogModal(true)}
        onResetDemoData={handleResetDemoData}
      />

      {/* Main Body Content */}
      <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        
        {/* Loading Indicator Bar */}
        {isLoading && (
          <div style={{
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            ⚡ AI Engine Processing & Re-evaluating Policy Rules...
          </div>
        )}

        {/* Executive Stats Bar */}
        <StatsOverview claims={claims} />

        {/* Claims Filterable Table */}
        <ClaimsTable 
          claims={claims} 
          onSelectClaim={(claim) => setSelectedClaimId(claim.id)} 
        />

      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '1.25rem 2rem', 
        textAlign: 'center', 
        fontSize: '0.775rem', 
        color: 'var(--text-secondary)',
        background: 'rgba(11, 15, 25, 0.8)'
      }}>
        PolicyGuard Expense Claim Review Assistant — Enforcing Corporate Policy Compliance with AI & Deterministic Validation. (LocalStorage Persistence Active)
      </footer>

      {/* Modals */}
      {activeSelectedClaim && (
        <ClaimDetailModal 
          claim={activeSelectedClaim}
          onClose={() => setSelectedClaimId(null)}
          onApprove={handleApproveClaim}
          onReject={handleRejectClaim}
          onRequestClarification={handleRequestClarification}
          onOverrideCategory={handleOverrideCategory}
          onViewDuplicate={(dupId) => setDuplicateTargetId(dupId)}
        />
      )}

      {showNewClaimModal && (
        <NewClaimModal 
          onClose={() => setShowNewClaimModal(false)}
          onSubmitClaim={handleCreateClaim}
        />
      )}

      {showPolicyEditorModal && (
        <PolicyEditorModal 
          onClose={() => setShowPolicyEditorModal(false)}
          onSavePolicies={handleSavePolicies}
        />
      )}

      {activeDuplicateClaim && (
        <DuplicateDetectorView 
          currentClaim={activeSelectedClaim}
          duplicateClaim={activeDuplicateClaim}
          onClose={() => setDuplicateTargetId(null)}
        />
      )}

      {showAuditLogModal && (
        <AuditLogModal 
          claims={claims}
          onClose={() => setShowAuditLogModal(false)}
        />
      )}

    </div>
  );
}
