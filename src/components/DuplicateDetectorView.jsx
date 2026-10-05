import React from 'react';
import { X, Copy, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DuplicateDetectorView({ currentClaim, duplicateClaim, onClose }) {
  if (!currentClaim || !duplicateClaim) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(236, 72, 153, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
            <Copy size={20} color="#f472b6" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f472b6' }}>
                Duplicate Claim Inspection Comparison
              </h2>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                Comparing active claim <strong>{currentClaim.id}</strong> against duplicate match <strong>{duplicateClaim.id}</strong>
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Comparison Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontSize: '0.825rem',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} shrink={0} />
            <div>
              <strong>Duplicate Flag Reason:</strong> Potential duplicate submission detected with identical claimant ("{currentClaim.claimant}"), date ({currentClaim.date}), and matching amount ({currentClaim.currency} {currentClaim.amount}).
            </div>
          </div>

          {/* Side by Side Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* Current Claim Card */}
            <div className="glass-card" style={{ padding: '1.25rem', borderColor: 'var(--accent-primary)' }}>
              <div className="badge badge-pending" style={{ marginBottom: '0.75rem' }}>Active Claim ({currentClaim.id})</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Claimant:</span>
                  <div style={{ fontWeight: 700 }}>{currentClaim.claimant}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Date:</span>
                  <div style={{ fontWeight: 700 }}>{currentClaim.date}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Amount:</span>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>
                    {currentClaim.currency} {currentClaim.amount?.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Category:</span>
                  <div style={{ fontWeight: 600 }}>{currentClaim.category}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Description:</span>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    "{currentClaim.description}"
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Receipt:</span>
                  <div>{currentClaim.receiptAvailable ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>

            {/* Matching Previous Claim Card */}
            <div className="glass-card" style={{ padding: '1.25rem', borderColor: '#f472b6' }}>
              <div className="badge badge-rejected" style={{ marginBottom: '0.75rem' }}>Existing Match ({duplicateClaim.id})</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Claimant:</span>
                  <div style={{ fontWeight: 700 }}>{duplicateClaim.claimant}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Date:</span>
                  <div style={{ fontWeight: 700 }}>{duplicateClaim.date}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Amount:</span>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>
                    {duplicateClaim.currency} {duplicateClaim.amount?.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Category:</span>
                  <div style={{ fontWeight: 600 }}>{duplicateClaim.category}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Description:</span>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    "{duplicateClaim.description}"
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Receipt:</span>
                  <div>{duplicateClaim.receiptAvailable ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close Comparison</button>
          </div>

        </div>

      </div>
    </div>
  );
}
