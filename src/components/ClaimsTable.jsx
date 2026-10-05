import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Copy, Receipt, CheckCircle, XCircle, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { CATEGORIES } from '../constants/policyRules';

export default function ClaimsTable({ claims, onSelectClaim }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCompliance, setSelectedCompliance] = useState('ALL');

  // Filter logic
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || claim.category === selectedCategory || claim.aiClassification?.suggestedCategory === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || claim.status === selectedStatus;
    const matchesCompliance = selectedCompliance === 'ALL' || claim.deterministicValidation?.overallComplianceStatus === selectedCompliance;

    return matchesSearch && matchesCategory && matchesStatus && matchesCompliance;
  });

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search claimant, description, or Claim ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Filter size={15} /> Filter:
          </div>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: 'auto', fontSize: '0.8rem' }}>
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ width: 'auto', fontSize: '0.8rem' }}>
            <option value="ALL">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Clarification Requested">Clarification Requested</option>
          </select>

          <select value={selectedCompliance} onChange={(e) => setSelectedCompliance(e.target.value)} style={{ width: 'auto', fontSize: '0.8rem' }}>
            <option value="ALL">All AI/Policy Findings</option>
            <option value="Compliant">Compliant</option>
            <option value="Needs Clarification">Needs Clarification</option>
            <option value="Requires Review">Requires Review</option>
            <option value="Policy Violation">Policy Violation</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="claims-table-wrapper">
        <table className="claims-table">
          <thead>
            <tr>
              <th>Claim ID & Date</th>
              <th>Claimant</th>
              <th>Claim Category</th>
              <th>AI Suggested Category</th>
              <th>Amount</th>
              <th>Receipt</th>
              <th>AI & Validation Flags</th>
              <th>Decision Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                  No expense claims found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => {
                const det = claim.deterministicValidation || {};
                const ai = claim.aiClassification || {};
                const isOverridden = ai.overrideCategory;

                return (
                  <tr key={claim.id} onClick={() => onSelectClaim(claim)}>
                    {/* ID & Date */}
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                        {claim.id}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {claim.date}
                      </div>
                    </td>

                    {/* Claimant */}
                    <td>
                      <div style={{ fontWeight: 600 }}>{claim.claimant}</div>
                    </td>

                    {/* Original Claim Category */}
                    <td>
                      <span style={{ fontSize: '0.8rem', color: isOverridden ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isOverridden ? 'line-through' : 'none' }}>
                        {claim.category}
                      </span>
                      {isOverridden && (
                        <div className="badge badge-overridden" style={{ marginTop: '0.2rem', fontSize: '0.675rem' }}>
                          Overridden: {isOverridden}
                        </div>
                      )}
                    </td>

                    {/* AI Suggested Category & Confidence */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={13} color="var(--accent-primary)" />
                        <span style={{ fontWeight: 600, fontSize: '0.825rem' }}>{ai.suggestedCategory}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: ai.isUncertain ? '#f59e0b' : 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        {(ai.confidenceScore * 100).toFixed(0)}% confidence
                        {ai.isUncertain && <span style={{ color: '#f59e0b', fontWeight: 700 }}> (Uncertain)</span>}
                      </div>
                    </td>

                    {/* Amount & USD Conversion */}
                    <td>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {claim.currency} {claim.amount?.toFixed(2)}
                      </div>
                      {claim.currency !== 'USD' && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          ≈ ${det.convertedAmountUSD?.toFixed(2)} USD
                        </div>
                      )}
                    </td>

                    {/* Receipt Status */}
                    <td>
                      {claim.receiptAvailable ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-success)', fontSize: '0.8rem', fontWeight: 600 }}>
                          <Receipt size={14} /> Attached
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: det.isMissingReceipt ? 'var(--color-danger)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: det.isMissingReceipt ? 700 : 400 }}>
                          <XCircle size={14} /> Missing
                        </span>
                      )}
                    </td>

                    {/* Flags */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {det.isDuplicate && (
                          <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.4)' }}>
                            <Copy size={11} /> Duplicate Claim
                          </span>
                        )}
                        {det.exceedsCategoryLimit && (
                          <span className="badge badge-needs-review">
                            <AlertTriangle size={11} /> Exceeds ${det.categoryLimitAmount} Limit
                          </span>
                        )}
                        {ai.isUncertain && !det.isDuplicate && (
                          <span className="badge badge-uncertain">
                            ⚠️ Uncertain Category
                          </span>
                        )}
                        {!det.isDuplicate && !det.exceedsCategoryLimit && !ai.isUncertain && (
                          <span className="badge badge-compliant">
                            <CheckCircle size={11} /> Policy Valid
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Decision Status */}
                    <td>
                      {claim.status === 'Approved' && <span className="badge badge-approved">Approved</span>}
                      {claim.status === 'Rejected' && <span className="badge badge-rejected">Rejected</span>}
                      {claim.status === 'Clarification Requested' && <span className="badge badge-clarification">Clarification Requested</span>}
                      {claim.status === 'Pending Review' && <span className="badge badge-pending">Pending Review</span>}
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClaim(claim);
                        }}
                      >
                        <Eye size={13} />
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
