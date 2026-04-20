import type { FlowAnswers, ValueTier } from './types';

export function computeValueTier(answers: FlowAnswers): ValueTier {
  if (answers.q1 === 'no') return 'low';
  if (answers.q1 === 'not-sure') return 'mid';

  const recent = answers.q3 === '30d' || answers.q3 === '1-6mo';
  const hasQ2 = answers.q2 !== undefined;

  if (answers.q1 === 'yes' && hasQ2 && recent) return 'high';
  return 'mid';
}
