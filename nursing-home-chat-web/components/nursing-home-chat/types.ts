export type Q1Answer = 'yes' | 'not-sure' | 'no';

export type Q2Answer =
  | 'bed-sores'
  | 'falls'
  | 'malnutrition'
  | 'other';

export type Q3Answer = '30d' | '1-6mo' | '6mo+';

export type Q4Answer = 'yes' | 'no' | 'not-yet';

export type ValueTier = 'high' | 'mid' | 'low';

export type ChatMessage =
  | { id: string; role: 'system'; text: string }
  | { id: string; role: 'user'; text: string };

export type FlowPhase = 'idle' | 'q1' | 'q2' | 'q3' | 'q4' | 'result';

export type FlowAnswers = {
  q1?: Q1Answer;
  q2?: Q2Answer;
  q3?: Q3Answer;
  q4?: Q4Answer;
};
