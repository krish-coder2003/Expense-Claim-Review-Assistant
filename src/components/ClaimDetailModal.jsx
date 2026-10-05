import React, { useState } from 'react';
import { 
  X, CheckCircle, XCircle, AlertTriangle, Sparkles, BookOpen, 
  Receipt, Calendar, User, DollarSign, FileText, HelpCircle, 
  Check, Edit3, History, MessageSquare, Copy, ShieldAlert, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../constants/policyRules';

export default function ClaimDetailModal({ 
  claim, 
  onClose, 
  onApprove, 
  onReject, 
  onRequestClarification, 
  onOverrideCategory,
  onViewDuplicate
}) {
  if (!claim) return null;

  const det = claim.deterministicValidation || {};
  const ai = claim.aiClassification || {};

  const [isOverriding, setIsOverriding] = useState(false);
  const [newCategory, setNewCategory] = useState(ai.overrideCategory || ai.suggestedCategory || claim.category);
  const [overrideReason, setOverrideReason] = useState(ai.overrideReason || '');

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [showClarificationInput, setShowClarificationInput] = useState(false);
  const [clarificationMessage, setClarificationMessage] = useState(
    ai.missingInformationPrompt || 'Please provide additional receipt documentation or itemized breakdown for this expense.'
  );

  const handleApproveClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onApprove(claim.id);
    onClose();
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejecting this claim.');
      return;
    }
    onReject(claim.id, rejectionReason);
    onClose();
  };

  const handleConfirmClarification = () => {
    if (!clarificationMessage.trim()) {
      alert('Please specify what clarification is required.');
      return;
    }
    onRequestClarification(claim.id, clarificationMessage);
    onClose();
  };

  const handleConfirmOverride = () => {
    if (!overrideReason.trim()) {
      alert('Please state a valid business reason for overriding the AI classification.');
      return;
    }
    onOverrideCategory(claim.id, newCategory, overrideReason);
    setIsOverriding(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ width: '95%', maxWidth: '1050px' }} onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-primary)',
              background: 'rgba(99, 102, 241, 0.15)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              {claim.id}
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Expense Claim Review
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Submitted by <strong>{claim.claimant}</strong> on {claim.date}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {claim.status === 'Approved' && <span className="badge badge-approved" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>Approved</span>}
            {claim.status === 'Rejected' && <span className="badge badge-rejected" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>Rejected</span>}
            {claim.status === 'Clarification Requested' && <span className="badge badge-clarification" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>Clarification Requested</span>}
            {claim.status === 'Pending Review' && <span className="badge badge-pending" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>Pending Review</span>}

            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          
          {/* Left Column: Claim Raw Fields & Deterministic Validation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Claim Summary Card */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                📋 Submitted Claim Fields
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Claimant</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={14} color="var(--accent-primary)" /> {claim.claimant}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transaction Date</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} color="var(--accent-primary)" /> {claim.date}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Claimed Amount</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                    {claim.currency} {claim.amount?.toFixed(2)}
                  </div>
                  {claim.currency !== 'USD' && (
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                      Converted: ${det.convertedAmountUSD?.toFixed(2)} USD
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receipt Status</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', color: claim.receiptAvailable ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    <Receipt size={14} /> {claim.receiptAvailable ? 'Receipt Attached (Yes)' : 'No Receipt Provided'}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Submitted Category</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {claim.category}
                </div>
              </div>

              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Description / Expense Notes</div>
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}>
                  "{claim.description}"
                </div>
              </div>
            </div>

            {/* Deterministic Validation Checklist */}
            <div className="glass-card" style={{ padding: '1.25rem', borderColor: det.overallComplianceStatus === 'Policy Violation' ? 'var(--border-danger)' : 'var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                  ⚙️ Deterministic Policy Checks
                </h3>
                <span className={`badge ${
                  det.overallComplianceStatus === 'Compliant' ? 'badge-compliant' :
                  det.overallComplianceStatus === 'Needs Clarification' ? 'badge-needs-clarification' :
                  det.overallComplianceStatus === 'Requires Review' ? 'badge-needs-review' : 'badge-policy-violation'
                }`}>
                  {det.overallComplianceStatus}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* 1. Duplicate Detection */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.65rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                  {det.isDuplicate ? (
                    <XCircle size={18} color="var(--color-danger)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  ) : (
                    <CheckCircle size={18} color="var(--color-success)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      Duplicate Claim Check: {det.isDuplicate ? <span style={{ color: 'var(--color-danger)' }}>FLAGGED DUPLICATE</span> : <span style={{ color: 'var(--color-success)' }}>Passed</span>}
                    </div>
                    {det.isDuplicate ? (
                      <div style={{ fontSize: '0.75rem', color: '#f472b6', marginTop: '0.2rem' }}>
                        {det.duplicateReason}
                        {det.duplicateOfClaimId && (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            style={{ marginTop: '0.4rem', fontSize: '0.7rem' }}
                            onClick={() => onViewDuplicate(det.duplicateOfClaimId)}
                          >
                            <Copy size={12} /> View Duplicate ({det.duplicateOfClaimId})
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        No prior claims match claimant, date, and amount.
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Category Limit Check */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.65rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                  {det.exceedsCategoryLimit ? (
                    <AlertTriangle size={18} color="var(--color-warning)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  ) : (
                    <CheckCircle size={18} color="var(--color-success)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      Configured Category Limit: {det.exceedsCategoryLimit ? <span style={{ color: 'var(--color-warning)' }}>EXCEEDS THRESHOLD</span> : <span style={{ color: 'var(--color-success)' }}>Within Limit</span>}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Claim: <strong>${det.convertedAmountUSD} USD</strong> vs Max Policy Threshold: <strong>${det.categoryLimitAmount} USD</strong> for {det.policySectionTitle}.
                    </div>
                  </div>
                </div>

                {/* 3. Receipt Requirement Check */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.65rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                  {det.isMissingReceipt ? (
                    <XCircle size={18} color="var(--color-danger)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  ) : (
                    <CheckCircle size={18} color="var(--color-success)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      Receipt Requirement: {det.isMissingReceipt ? <span style={{ color: 'var(--color-danger)' }}>MISSING REQUIRED RECEIPT</span> : <span style={{ color: 'var(--color-success)' }}>Verified</span>}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Receipt mandatory for claims exceeding ${det.receiptRequiredThresholdUSD} USD in this category.
                    </div>
                  </div>
                </div>

                {/* 4. Date & Stale Check */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.65rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                  {!det.isDateValid ? (
                    <XCircle size={18} color="var(--color-danger)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  ) : (
                    <CheckCircle size={18} color="var(--color-success)" style={{ marginTop: '0.1rem', shrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                      Claim Freshness & Date Check: {!det.isDateValid ? <span style={{ color: 'var(--color-danger)' }}>DATE INVALID</span> : <span style={{ color: 'var(--color-success)' }}>Within 60-Day Policy Window</span>}
                    </div>
                    {!det.isDateValid && (
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-danger)', marginTop: '0.15rem' }}>
                        {det.dateValidationIssue}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: AI Policy Workflow & Evidence Citation & Reviewer Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* AI Classification & Uncertainty Card */}
            <div className="glass-card" style={{ 
              padding: '1.25rem', 
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%)',
              borderColor: ai.isUncertain ? 'var(--border-warning)' : 'var(--border-hover)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', letterSpacing: '0.05em' }}>
                    🤖 AI Workflow Analysis
                  </h3>
                </div>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Confidence: {(ai.confidenceScore * 100).toFixed(0)}%
                </div>
              </div>

              {/* Uncertain Classification Warning */}
              {ai.isUncertain && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-warning)',
                  border: '1px dashed var(--border-warning)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <AlertTriangle size={20} color="#f59e0b" style={{ shrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#f59e0b' }}>
                      ⚠️ Uncertain AI Classification Flagged
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                      The claim description is vague or matches multiple policy categories. Reviewer verification recommended.
                    </div>
                  </div>
                </div>
              )}

              {/* Category Breakdown & Override Badge */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>AI Inferred Category</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {ai.suggestedCategory}
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsOverriding(!isOverriding)}
                  >
                    <Edit3 size={13} /> {isOverriding ? 'Cancel Override' : 'Override Category'}
                  </button>
                </div>

                {/* Overridden callout */}
                {ai.overrideCategory && (
                  <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                    <span className="badge badge-overridden">Overridden by Reviewer</span>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      New Category: {ai.overrideCategory}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                      Reason: "{ai.overrideReason}"
                    </div>
                  </div>
                )}
              </div>

              {/* Category Override Form */}
              {isOverriding && (
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--accent-primary)',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
                    Select New Classification Category
                  </h4>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ marginBottom: '0.75rem' }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <input 
                    type="text" 
                    placeholder="Enter explicit reason for classification override..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    style={{ marginBottom: '0.75rem' }}
                  />

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsOverriding(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleConfirmOverride}>Apply Override</button>
                  </div>
                </div>
              )}

              {/* Policy Citation Evidence */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  <BookOpen size={14} color="var(--accent-primary)" /> Policy Evidence Citation [{ai.relevantPolicySectionId}]
                </div>
                <div style={{ 
                  background: 'rgba(99, 102, 241, 0.08)', 
                  borderLeft: '3px solid var(--accent-primary)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.775rem',
                  color: 'var(--text-primary)',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
                }}>
                  <strong>{ai.relevantPolicySectionTitle}:</strong> {ai.policyEvidence}
                </div>
              </div>

              {/* AI Narrative Explanation */}
              <div>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  AI Finding & Reasoning Narrative
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {ai.reasoning}
                </div>
              </div>

              {/* Missing Information Prompt */}
              {ai.missingInformationPrompt && (
                <div style={{ 
                  marginTop: '0.85rem',
                  padding: '0.75rem',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <HelpCircle size={14} /> Required Action / Missing Information Prompt:
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {ai.missingInformationPrompt}
                  </div>
                </div>
              )}

            </div>

            {/* Decision & Action Panel */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.85rem', letterSpacing: '0.05em' }}>
                ⚖️ Reviewer Decision Actions
              </h3>

              {/* Action Buttons */}
              {!showRejectInput && !showClarificationInput && (
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-success" 
                    style={{ flex: 1 }}
                    onClick={handleApproveClick}
                  >
                    <CheckCircle size={16} /> Approve Claim
                  </button>

                  <button 
                    className="btn btn-danger" 
                    style={{ flex: 1 }}
                    onClick={() => setShowRejectInput(true)}
                  >
                    <XCircle size={16} /> Reject Claim
                  </button>

                  <button 
                    className="btn btn-warning" 
                    style={{ flex: '1 1 100%' }}
                    onClick={() => setShowClarificationInput(true)}
                  >
                    <MessageSquare size={16} /> Request Clarification
                  </button>
                </div>
              )}

              {/* Reject Reason Form */}
              {showRejectInput && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-danger)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f87171', marginBottom: '0.5rem' }}>
                    Specify Rejection Reason
                  </h4>
                  <textarea 
                    rows={3} 
                    placeholder="Provide explicit non-compliance rationale for the claimant..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    style={{ marginBottom: '0.75rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowRejectInput(false)}>Cancel</button>
                    <button className="btn btn-danger btn-sm" onClick={handleConfirmReject}>Confirm Rejection</button>
                  </div>
                </div>
              )}

              {/* Clarification Prompt Form */}
              {showClarificationInput && (
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-info)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.5rem' }}>
                    Compose Information Request to Claimant
                  </h4>
                  <textarea 
                    rows={3} 
                    placeholder="Enter request details..."
                    value={clarificationMessage}
                    onChange={(e) => setClarificationMessage(e.target.value)}
                    style={{ marginBottom: '0.75rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowClarificationInput(false)}>Cancel</button>
                    <button className="btn btn-warning btn-sm" onClick={handleConfirmClarification}>Send Clarification Request</button>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Review & Decision History Timeline */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <History size={16} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                  📜 Audit & Decision History
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                {(claim.auditHistory || []).map((entry, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.2rem',
                    padding: '0.6rem 0.75rem', 
                    background: 'rgba(0,0,0,0.25)', 
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--accent-primary)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--accent-primary)' }}>{entry.actor}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                      {entry.action}
                    </div>
                    {entry.notes && (
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                        {entry.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
