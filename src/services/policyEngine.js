// Policy Engine: Deterministic Validation & AI Workflow Reasoning Simulator

import { POLICY_SECTIONS, CURRENCY_RATES, BASE_CURRENCY } from '../constants/policyRules';

/**
 * Convert any currency amount to USD equivalent
 */
export function convertToUSD(amount, currency) {
  const rate = CURRENCY_RATES[currency?.toUpperCase()] || 1.0;
  return Number((amount * rate).toFixed(2));
}

/**
 * Deterministic Validation Engine
 * Evaluates duplicate claims, category limits, missing receipts, date validity, and required fields.
 */
export function runDeterministicValidation(claim, allClaims = [], currentPolicySections = POLICY_SECTIONS) {
  const missingFields = [];
  if (!claim.claimant?.trim()) missingFields.push('claimant');
  if (!claim.date) missingFields.push('date');
  if (!claim.category) missingFields.push('category');
  if (claim.amount === undefined || claim.amount === null || isNaN(claim.amount) || claim.amount <= 0) {
    missingFields.push('amount');
  }
  if (!claim.currency) missingFields.push('currency');
  if (!claim.description?.trim()) missingFields.push('description');

  const convertedAmountUSD = convertToUSD(claim.amount || 0, claim.currency || 'USD');

  // Find relevant policy section based on effective category (or override category)
  const activeCategory = claim.aiClassification?.overrideCategory || claim.category;
  const policySection = currentPolicySections.find(p => p.category === activeCategory) ||
                        currentPolicySections.find(p => p.id === 'POL-105') ||
                        POLICY_SECTIONS[4];

  // 1. Receipt Validation
  const receiptRequired = convertedAmountUSD > (policySection.receiptRequiredThresholdUSD ?? 50);
  const isMissingReceipt = receiptRequired && !claim.receiptAvailable;

  // 2. Category Limit Validation
  const limitAmount = policySection.perClaimLimitUSD ?? 500;
  const exceedsCategoryLimit = convertedAmountUSD > limitAmount;

  // 3. Date & Stale Check
  let isDateValid = true;
  let dateValidationIssue = null;
  if (claim.date) {
    const claimDate = new Date(claim.date);
    const currentDate = new Date('2026-10-05'); // reference current system date
    const diffDays = Math.floor((currentDate - claimDate) / (1000 * 60 * 60 * 24));

    if (isNaN(claimDate.getTime())) {
      isDateValid = false;
      dateValidationIssue = 'Invalid date format.';
    } else if (diffDays < 0) {
      isDateValid = false;
      dateValidationIssue = 'Future claim date is not allowed.';
    } else if (diffDays > 60) {
      isDateValid = false;
      dateValidationIssue = `Claim date is ${diffDays} days old (exceeds 60-day deadline).`;
    }
  } else {
    isDateValid = false;
    dateValidationIssue = 'Date is required.';
  }

  // 4. Duplicate Check
  let isDuplicate = false;
  let duplicateOfClaimId = null;
  let duplicateReason = null;

  if (allClaims && allClaims.length > 0) {
    const existingDuplicate = allClaims.find(other => {
      if (other.id === claim.id) return false;
      // Match exact claimant, date, amount and currency
      const sameClaimant = other.claimant.toLowerCase().trim() === claim.claimant.toLowerCase().trim();
      const sameDate = other.date === claim.date;
      const sameAmount = Math.abs(other.amount - claim.amount) < 0.01;
      const sameCurrency = (other.currency || 'USD').toUpperCase() === (claim.currency || 'USD').toUpperCase();
      
      // Or very similar description
      const descMatch = other.description.toLowerCase().slice(0, 20) === claim.description.toLowerCase().slice(0, 20);

      return sameClaimant && sameDate && sameAmount && sameCurrency;
    });

    if (existingDuplicate) {
      isDuplicate = true;
      duplicateOfClaimId = existingDuplicate.id;
      duplicateReason = `Matches existing claim ${existingDuplicate.id} (${existingDuplicate.claimant}, ${existingDuplicate.date}, ${existingDuplicate.currency} ${existingDuplicate.amount}).`;
    }
  }

  // Overall Compliance Status
  let overallComplianceStatus = 'Compliant';
  if (missingFields.length > 0 || isDuplicate || !isDateValid) {
    overallComplianceStatus = 'Policy Violation';
  } else if (exceedsCategoryLimit) {
    overallComplianceStatus = 'Requires Review';
  } else if (isMissingReceipt) {
    overallComplianceStatus = 'Needs Clarification';
  }

  return {
    convertedAmountUSD,
    missingFields,
    isMissingReceipt,
    receiptRequiredThresholdUSD: policySection.receiptRequiredThresholdUSD,
    exceedsCategoryLimit,
    categoryLimitAmount: limitAmount,
    isDateValid,
    dateValidationIssue,
    isDuplicate,
    duplicateOfClaimId,
    duplicateReason,
    overallComplianceStatus,
    policySectionId: policySection.id,
    policySectionTitle: policySection.title
  };
}

/**
 * AI Workflow Engine: Classification, Policy Citation, Reasoning & Missing Info Detector
 */
export function evaluateAIWorkflow(claim, currentPolicySections = POLICY_SECTIONS) {
  const descriptionText = (claim.description || '').toLowerCase();
  const rawCategory = claim.category || 'General';

  // Keyword score matching across all policy sections
  let bestMatch = null;
  let maxScore = 0;
  let keywordMatches = [];
  let runnerUpScore = 0;

  currentPolicySections.forEach(section => {
    let score = 0;
    const matched = [];
    section.keywords.forEach(kw => {
      if (descriptionText.includes(kw)) {
        score += 1;
        matched.push(kw);
      }
    });

    if (score > maxScore) {
      runnerUpScore = maxScore;
      maxScore = score;
      bestMatch = section;
      keywordMatches = matched;
    } else if (score > runnerUpScore) {
      runnerUpScore = score;
    }
  });

  // Default to mapped category or General if no strong keyword hit
  if (!bestMatch) {
    bestMatch = currentPolicySections.find(p => p.category === rawCategory) || currentPolicySections[4];
  }

  const suggestedCategory = bestMatch.category;
  
  // Calculate AI Confidence score
  let confidenceScore = 0.92;
  let isUncertain = false;

  if (maxScore === 0) {
    confidenceScore = 0.55;
    isUncertain = true;
  } else if (maxScore === 1 && runnerUpScore === 1) {
    // Description contains keywords belonging to two different categories (e.g. "Airport taxi and snack")
    confidenceScore = 0.65;
    isUncertain = true;
  } else if (suggestedCategory !== rawCategory && rawCategory !== 'Uncategorized/Ambiguous') {
    confidenceScore = 0.72;
    isUncertain = true;
  } else if (descriptionText.length < 15) {
    confidenceScore = 0.60;
    isUncertain = true;
  }

  // Policy Citation Evidence
  const policyEvidence = bestMatch.rules.join(' | ');

  // Formulate AI Narrative Explanation
  const convertedUSD = convertToUSD(claim.amount || 0, claim.currency || 'USD');
  let reasoning = '';
  let missingInformationPrompt = null;

  if (suggestedCategory !== rawCategory && rawCategory !== 'Uncategorized/Ambiguous') {
    reasoning += `AI detected that description keywords ("${keywordMatches.join(', ')}") align closely with category "${suggestedCategory}" rather than user-selected "${rawCategory}". `;
  } else {
    reasoning += `Claim description matches policy criteria for ${suggestedCategory} (${bestMatch.id}). `;
  }

  // Check specific policy requirement breaches
  const missingPrompts = [];

  if (suggestedCategory === 'Meals & Entertainment') {
    // Check for attendee names or explicit client detail in description
    if (!descriptionText.includes('client') && !descriptionText.includes('with') && !descriptionText.includes('team') && !descriptionText.includes('vp')) {
      missingPrompts.push('Please specify list of attendees (names & titles) and the business purpose of the meal.');
    }
  }

  if (bestMatch.receiptRequiredThresholdUSD !== undefined && convertedUSD > bestMatch.receiptRequiredThresholdUSD && !claim.receiptAvailable) {
    missingPrompts.push(`Itemized receipt is mandatory for ${suggestedCategory} claims exceeding $${bestMatch.receiptRequiredThresholdUSD} USD.`);
  }

  if (convertedUSD > bestMatch.perClaimLimitUSD) {
    reasoning += `Claim amount of $${convertedUSD} USD exceeds the configured per-claim policy threshold of $${bestMatch.perClaimLimitUSD} USD for ${suggestedCategory}. Manager/Reviewer sign-off is required. `;
  }

  if (missingPrompts.length > 0) {
    missingInformationPrompt = missingPrompts.join(' ');
    reasoning += `Missing info detected: ${missingInformationPrompt}`;
  } else {
    reasoning += `All mandatory documentation checks satisfied under ${bestMatch.id}.`;
  }

  return {
    originalCategory: rawCategory,
    suggestedCategory,
    confidenceScore: Number(confidenceScore.toFixed(2)),
    isUncertain,
    relevantPolicySectionId: bestMatch.id,
    relevantPolicySectionTitle: bestMatch.title,
    policyEvidence,
    reasoning,
    missingInformationPrompt
  };
}

/**
 * Full Pipeline Evaluator: Enriches claim with deterministic validation & AI workflow details
 */
export function evaluateClaim(claim, allClaims = [], policySections = POLICY_SECTIONS) {
  const aiResult = evaluateAIWorkflow(claim, policySections);
  const detResult = runDeterministicValidation({ ...claim, aiClassification: aiResult }, allClaims, policySections);

  return {
    ...claim,
    aiClassification: {
      ...aiResult,
      overrideCategory: claim.aiClassification?.overrideCategory || null,
      overrideReason: claim.aiClassification?.overrideReason || null
    },
    deterministicValidation: detResult,
    auditHistory: claim.auditHistory || [
      {
        timestamp: claim.submittedAt || new Date().toISOString(),
        actor: 'AI Policy Assistant',
        action: 'AI Evaluated',
        notes: `Initial AI classification: ${aiResult.suggestedCategory} (${(aiResult.confidenceScore * 100).toFixed(0)}% confidence). Compliance status: ${detResult.overallComplianceStatus}.`
      }
    ]
  };
}
