/**
 * Shared types for the reusable CaseReviewChecker quiz engine.
 *
 * One engine component (CaseReviewChecker.tsx) consumes a CaseReviewConfig and
 * powers any practice-area landing page (car accident, truck accident, etc.).
 *
 * Internal LeadTier ids are tracked for GTM / lead scoring only. The public
 * UI never displays these strings — the config supplies friendly result copy.
 */

export type LeadTier =
  | 'high_review_priority'
  | 'standard_review'
  | 'needs_more_info'
  | 'likely_not_fit';

export type QuestionOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  text: string;
  helper?: string;
  options: QuestionOption[];
};

export type ResultMessage = {
  /** Friendly headline shown on the result screen. */
  headline: string;
  /** One-paragraph friendly explanation. */
  body: string;
  /** Optional helper line shown above the contact form. */
  formIntro?: string;
};

export type ResultMessages = Record<LeadTier, ResultMessage>;

export type AnswerMap = Record<string, string>;

export type CaseReviewConfig = {
  /** GTM practice_area, e.g. "car_accident". */
  practiceArea: string;
  /** GTM page_slug, e.g. "car-accident". */
  pageSlug: string;
  /** Hero headline shown before the quiz starts. */
  headline: string;
  /** Hero subheadline. */
  subheadline: string;
  /** Label on the start button (e.g. "Start Free Case Review"). */
  startButtonText: string;
  /** Ordered list of single-select questions. */
  questions: Question[];
  /** Friendly result copy by tier. */
  result: ResultMessages;
  /** Pure function: answers → tier. Must be deterministic. */
  scoreAnswers: (answers: AnswerMap) => LeadTier;
  /** Contact form CTA button label, e.g. "Request my free review". */
  contactFormCta: string;
  /** Optional override for the formsubmit subject line. */
  contactSubject?: string;
};

export type QuizPhase = 'intro' | 'questions' | 'result' | 'contact' | 'sent';

export type QuizDataLayerEvent =
  | 'quiz_start'
  | 'quiz_question_answered'
  | 'quiz_result_viewed'
  | 'quiz_contact_step_reached'
  | 'quiz_form_submitted';
