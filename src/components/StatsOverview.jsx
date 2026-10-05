import React from 'react';
import { FileText, AlertTriangle, CopyCheck, DollarSign, Clock, HelpCircle } from 'lucide-react';

export default function StatsOverview({ claims }) {
  const totalClaims = claims.length;

  const totalSpendUSD = claims.reduce((acc, claim) => {
    return acc + (claim.deterministicValidation?.convertedAmountUSD || 0);
  }, 0);

  const pendingReview = claims.filter(c => c.status === 'Pending Review').length;
  const policyViolations = claims.filter(c => c.deterministicValidation?.overallComplianceStatus === 'Policy Violation' || c.deterministicValidation?.overallComplianceStatus === 'Requires Review').length;
  const duplicateCount = claims.filter(c => c.deterministicValidation?.isDuplicate).length;
  const clarificationCount = claims.filter(c => c.status === 'Clarification Requested' || c.deterministicValidation?.overallComplianceStatus === 'Needs Clarification').length;

  const cards = [
    {
      title: 'Total Expense Claims',
      value: totalClaims,
      subtitle: `Value: $${totalSpendUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
      icon: <FileText size={20} color="#6366f1" />,
      borderColor: 'rgba(99, 102, 241, 0.3)'
    },
    {
      title: 'Pending AI Review',
      value: pendingReview,
      subtitle: 'Awaiting reviewer decision',
      icon: <Clock size={20} color="#f59e0b" />,
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    {
      title: 'Flagged Violations / Limits',
      value: policyViolations,
      subtitle: 'Exceeds limits or stale date',
      icon: <AlertTriangle size={20} color="#ef4444" />,
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    {
      title: 'Duplicates Detected',
      value: duplicateCount,
      subtitle: 'Matching date, amount & person',
      icon: <CopyCheck size={20} color="#ec4899" />,
      borderColor: 'rgba(236, 72, 153, 0.3)'
    },
    {
      title: 'Clarification Needed',
      value: clarificationCount,
      subtitle: 'Missing receipts or info',
      icon: <HelpCircle size={20} color="#3b82f6" />,
      borderColor: 'rgba(59, 130, 246, 0.3)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="glass-card" 
          style={{ 
            padding: '1.1rem 1.25rem',
            borderLeft: `4px solid ${card.borderColor.replace('0.3', '0.8')}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{card.title}</span>
            <div style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.04)'
            }}>
              {card.icon}
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {card.value}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {card.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
}
