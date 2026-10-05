import React, { useState } from 'react';
import { X, History, Filter, CheckCircle, XCircle, Edit3, MessageSquare } from 'lucide-react';

export default function AuditLogModal({ claims, onClose }) {
  const [filterAction, setFilterAction] = useState('ALL');

  // Flatten all audit history across all claims
  const allLogs = claims.flatMap(c => 
    (c.auditHistory || []).map(h => ({
      ...h,
      claimId: c.id,
      claimant: c.claimant
    }))
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredLogs = allLogs.filter(log => {
    if (filterAction === 'ALL') return true;
    return log.action.toLowerCase().includes(filterAction.toLowerCase());
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
            <History size={20} color="var(--accent-primary)" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                System-Wide Audit & Decision History
              </h2>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                Complete chronological log of AI evaluations, classification overrides, and reviewer approvals/rejections
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={14} /> Filter Action:
          </span>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)} style={{ width: 'auto', fontSize: '0.8rem' }}>
            <option value="ALL">All Decision Actions</option>
            <option value="Approved">Approvals</option>
            <option value="Rejected">Rejections</option>
            <option value="Clarification">Clarification Requests</option>
            <option value="Overridden">Category Overrides</option>
            <option value="AI Evaluated">AI Initial Evaluations</option>
          </select>
        </div>

        {/* Audit Log Timeline Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '60vh', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No audit logs found.
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                      {log.claimId}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      ({log.claimant})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}>
                  <span style={{ color: '#ffffff' }}>{log.action}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>by {log.actor}</span>
                </div>

                {log.notes && (
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                    {log.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
