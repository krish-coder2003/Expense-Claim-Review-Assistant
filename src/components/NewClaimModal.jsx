import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, Plus, Receipt } from 'lucide-react';
import { CATEGORIES, CURRENCY_RATES } from '../constants/policyRules';
import { evaluateAIWorkflow } from '../services/policyEngine';

export default function NewClaimModal({ onClose, onSubmitClaim }) {
  const [claimant, setClaimant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Meals & Entertainment');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [receiptAvailable, setReceiptAvailable] = useState(true);

  // Real-time AI preview state
  const [aiPreview, setAiPreview] = useState(null);

  useEffect(() => {
    if (description.trim().length > 3) {
      const evaluation = evaluateAIWorkflow({ category, amount: Number(amount) || 0, currency, description });
      setAiPreview(evaluation);
    } else {
      setAiPreview(null);
    }
  }, [description, category, amount, currency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!claimant.trim() || !amount || !description.trim()) {
      alert('Please fill in claimant name, amount, and description.');
      return;
    }

    const newClaim = {
      id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
      claimant: claimant.trim(),
      date,
      category,
      amount: parseFloat(amount),
      currency,
      description: description.trim(),
      receiptAvailable,
      status: 'Pending Review',
      submittedAt: new Date().toISOString()
    };

    onSubmitClaim(newClaim);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Plus size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Submit New Employee Expense Claim</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Claimant Name *
              </label>
              <input 
                type="text" 
                placeholder="e.g. Sarah Jenkins" 
                value={claimant} 
                onChange={e => setClaimant(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Expense Date *
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Currency
              </label>
              <select value={currency} onChange={e => setCurrency(e.target.value)}>
                {Object.keys(CURRENCY_RATES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Amount *
              </label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Selected Expense Category
            </label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Expense Description & Business Justification *
            </label>
            <textarea 
              rows={3} 
              placeholder="Detailed description (e.g. Uber ride home after client meeting, dinner with Acme team)..." 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
            />
          </div>

          {/* Receipt Available Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
            <input 
              type="checkbox" 
              id="receiptCheck" 
              checked={receiptAvailable} 
              onChange={e => setReceiptAvailable(e.target.checked)} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="receiptCheck" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Receipt size={16} color="var(--accent-primary)" /> Itemized Receipt Available (Yes)
            </label>
          </div>

          {/* Real-time AI Assistant Classification Preview */}
          {aiPreview && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} /> AI Classifier Live Preview
                </div>
                <div style={{ fontSize: '0.725rem', color: aiPreview.isUncertain ? '#f59e0b' : 'var(--text-secondary)' }}>
                  {(aiPreview.confidenceScore * 100).toFixed(0)}% Confidence {aiPreview.isUncertain && '(Uncertain)'}
                </div>
              </div>

              <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                Suggested Category: <strong>{aiPreview.suggestedCategory}</strong> (Policy {aiPreview.relevantPolicySectionId})
              </div>

              {aiPreview.isUncertain && (
                <div style={{ fontSize: '0.725rem', color: '#f59e0b', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertTriangle size={12} /> Description may be ambiguous; reviewer will verify category.
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit for AI Review</button>
          </div>

        </form>
      </div>
    </div>
  );
}
