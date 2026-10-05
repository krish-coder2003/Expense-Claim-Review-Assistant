import { describe, it, expect } from 'vitest';
import { runDeterministicValidation, evaluateAIWorkflow, convertToUSD } from './policyEngine';
import { POLICY_SECTIONS } from '../constants/policyRules';

describe('PolicyEngine - Currency Converter', () => {
  it('converts EUR to USD correctly', () => {
    const usd = convertToUSD(100, 'EUR');
    expect(usd).toBe(109);
  });

  it('handles USD default without rate change', () => {
    const usd = convertToUSD(50, 'USD');
    expect(usd).toBe(50);
  });
});

describe('PolicyEngine - Deterministic Validation', () => {
  it('detects missing receipt when amount exceeds category threshold', () => {
    const claim = {
      id: 'CLM-TEST-001',
      claimant: 'Test User',
      date: '2026-10-02',
      category: 'Software & Tools', // Threshold is $0 USD
      amount: 25,
      currency: 'USD',
      description: 'GitHub Copilot subscription',
      receiptAvailable: false
    };

    const res = runDeterministicValidation(claim, [], POLICY_SECTIONS);
    expect(res.isMissingReceipt).toBe(true);
    expect(res.overallComplianceStatus).toBe('Needs Clarification');
  });

  it('detects category limit overflow', () => {
    const claim = {
      id: 'CLM-TEST-002',
      claimant: 'Test User',
      date: '2026-10-02',
      category: 'Meals & Entertainment', // Per claim limit is $75 USD
      amount: 150,
      currency: 'USD',
      description: 'Team lunch',
      receiptAvailable: true
    };

    const res = runDeterministicValidation(claim, [], POLICY_SECTIONS);
    expect(res.exceedsCategoryLimit).toBe(true);
    expect(res.overallComplianceStatus).toBe('Requires Review');
  });

  it('detects duplicate claims', () => {
    const existingClaims = [
      {
        id: 'CLM-ORIGINAL',
        claimant: 'Alice Smith',
        date: '2026-10-02',
        category: 'Travel & Lodging',
        amount: 85,
        currency: 'USD',
        description: 'Uber to airport'
      }
    ];

    const duplicateClaim = {
      id: 'CLM-DUP',
      claimant: 'Alice Smith',
      date: '2026-10-02',
      category: 'Travel & Lodging',
      amount: 85,
      currency: 'USD',
      description: 'Uber to airport'
    };

    const res = runDeterministicValidation(duplicateClaim, existingClaims, POLICY_SECTIONS);
    expect(res.isDuplicate).toBe(true);
    expect(res.duplicateOfClaimId).toBe('CLM-ORIGINAL');
    expect(res.overallComplianceStatus).toBe('Policy Violation');
  });

  it('flags stale claims older than 60 days', () => {
    const claim = {
      id: 'CLM-STALE',
      claimant: 'Bob Vance',
      date: '2026-05-01', // > 60 days old from reference date 2026-10-05
      category: 'Office Supplies',
      amount: 40,
      currency: 'USD',
      description: 'Desk lamp',
      receiptAvailable: true
    };

    const res = runDeterministicValidation(claim, [], POLICY_SECTIONS);
    expect(res.isDateValid).toBe(false);
    expect(res.dateValidationIssue).toContain('exceeds 60-day deadline');
  });
});

describe('PolicyEngine - AI Workflow Evaluator', () => {
  it('correctly maps keywords to suggested category and policy section', () => {
    const claim = {
      category: 'General',
      amount: 45,
      currency: 'USD',
      description: 'Uber ride from office to downtown client meeting'
    };

    const aiRes = evaluateAIWorkflow(claim, POLICY_SECTIONS);
    expect(aiRes.suggestedCategory).toBe('Travel & Lodging');
    expect(aiRes.relevantPolicySectionId).toBe('POL-102');
  });

  it('marks uncertainty on vague or conflicting descriptions', () => {
    const claim = {
      category: 'Meals & Entertainment',
      amount: 30,
      currency: 'USD',
      description: 'Stuff'
    };

    const aiRes = evaluateAIWorkflow(claim, POLICY_SECTIONS);
    expect(aiRes.isUncertain).toBe(true);
    expect(aiRes.confidenceScore).toBeLessThan(0.8);
  });
});
