import React, { useState } from 'react';
import { X, BookOpen, Save, DollarSign, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { POLICY_SECTIONS, CURRENCY_RATES } from '../constants/policyRules';

export default function PolicyEditorModal({ onClose, onSavePolicies }) {
  const [policies, setPolicies] = useState([...POLICY_SECTIONS]);

  const handleLimitChange = (id, newLimit) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, perClaimLimitUSD: Number(newLimit) } : p));
  };

  const handleReceiptThresholdChange = (id, newThreshold) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, receiptRequiredThresholdUSD: Number(newThreshold) } : p));
  };

  const handleSave = () => {
    onSavePolicies(policies);
    alert('Organizational expense policies updated successfully!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Organizational Policy Configuration</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Policy List Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Configure spending limits, receipt mandatory thresholds, and policy section rules. The AI workflow engine and deterministic validator enforce these rules in real time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {policies.map(sec => (
              <div key={sec.id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                      {sec.id}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {sec.title} ({sec.category})
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {sec.description}
                </p>

                {/* Editable Threshold Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      Per-Claim Limit ($ USD)
                    </label>
                    <input 
                      type="number" 
                      value={sec.perClaimLimitUSD} 
                      onChange={(e) => handleLimitChange(sec.id, e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      Receipt Required Above ($ USD)
                    </label>
                    <input 
                      type="number" 
                      value={sec.receiptRequiredThresholdUSD} 
                      onChange={(e) => handleReceiptThresholdChange(sec.id, e.target.value)}
                    />
                  </div>
                </div>

                {/* Policy Rules Bullet List */}
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                  <strong>Enforced Rules:</strong>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.35rem' }}>
                    {sec.rules.map((rule, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Policy Changes
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
