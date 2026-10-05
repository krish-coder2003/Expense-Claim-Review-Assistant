import React from 'react';
import { ShieldAlert, Plus, BookOpen, RefreshCw, FileSpreadsheet, History } from 'lucide-react';

export default function Navbar({ onOpenNewClaim, onOpenPolicyEditor, onOpenAuditLog, onResetDemoData }) {
  return (
    <header style={{
      background: 'rgba(17, 24, 39, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.9rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <ShieldAlert size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PolicyGuard Expense Reviewer
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            AI-Powered Policy Verification & Deterministic Compliance Engine
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenPolicyEditor}
          title="Configure organizational expense policies and limits"
        >
          <BookOpen size={15} />
          Policy Rules
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenAuditLog}
          title="View full audit & decision history"
        >
          <History size={15} />
          Audit Log
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetDemoData}
          title="Reset claims to initial benchmark dataset"
        >
          <RefreshCw size={15} />
          Reset Demo Claims
        </button>

        <button 
          className="btn btn-primary"
          onClick={onOpenNewClaim}
        >
          <Plus size={16} />
          Submit New Claim
        </button>
      </div>
    </header>
  );
}
