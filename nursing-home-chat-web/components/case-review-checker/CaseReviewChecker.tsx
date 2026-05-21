'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { pushDataLayerPayload, trackTelClick } from '@/lib/dataLayer';
import { ContactForm } from './ContactForm';
import { IntroScreen } from './IntroScreen';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';
import type {
  AnswerMap,
  CaseReviewConfig,
  LeadTier,
  QuizDataLayerEvent,
  QuizPhase,
} from './types';

type CaseReviewCheckerProps = {
  config: CaseReviewConfig;
};

/**
 * Reusable multi-step case review quiz.
 *
 * Drives phases: intro → questions → result → contact → sent.
 * All copy + scoring come from the page-specific `config`.
 *
 * GTM events emitted (always include practice_area + page_slug):
 *  - quiz_start
 *  - quiz_question_answered  (question_id, selected_answer)
 *  - quiz_result_viewed      (lead_tier)
 *  - quiz_contact_step_reached (lead_tier)
 *  - quiz_form_submitted     (lead_tier)
 */
export function CaseReviewChecker({ config }: CaseReviewCheckerProps) {
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [tier, setTier] = useState<LeadTier | null>(null);
  const funnelContextPushed = useRef(false);

  const totalQuestions = config.questions.length;

  const pushEvent = useCallback(
    (event: QuizDataLayerEvent, extra?: Record<string, unknown>) => {
      pushDataLayerPayload({
        event,
        practice_area: config.practiceArea,
        page_slug: config.pageSlug,
        ...(extra ?? {}),
      });
    },
    [config.pageSlug, config.practiceArea]
  );

  useEffect(() => {
    if (funnelContextPushed.current) return;
    funnelContextPushed.current = true;
    pushDataLayerPayload({
      event: 'funnel_context',
      funnel_name: `${config.practiceArea}_case_review`,
      practice_area: config.practiceArea,
      page_slug: config.pageSlug,
    });
  }, [config.pageSlug, config.practiceArea]);

  const onCallClick = useCallback(() => trackTelClick(), []);

  const onStart = useCallback(() => {
    pushEvent('quiz_start');
    setStepIndex(0);
    setPhase('questions');
  }, [pushEvent]);

  const currentQuestion = useMemo(
    () => config.questions[stepIndex],
    [config.questions, stepIndex]
  );

  const onSelect = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;
      const nextAnswers: AnswerMap = { ...answers, [currentQuestion.id]: optionId };
      setAnswers(nextAnswers);
      pushEvent('quiz_question_answered', {
        question_id: currentQuestion.id,
        selected_answer: optionId,
      });

      if (stepIndex + 1 < totalQuestions) {
        setStepIndex(stepIndex + 1);
        return;
      }

      const computedTier = config.scoreAnswers(nextAnswers);
      setTier(computedTier);
      pushEvent('quiz_result_viewed', { lead_tier: computedTier });
      setPhase('result');
    },
    [answers, config, currentQuestion, pushEvent, stepIndex, totalQuestions]
  );

  const onBackFromQuestion = useCallback(() => {
    if (stepIndex === 0) {
      setPhase('intro');
      return;
    }
    setStepIndex(stepIndex - 1);
  }, [stepIndex]);

  const onResultContinue = useCallback(() => {
    if (!tier) return;
    pushEvent('quiz_contact_step_reached', { lead_tier: tier });
    setPhase('contact');
  }, [pushEvent, tier]);

  const onResultBack = useCallback(() => {
    setStepIndex(totalQuestions - 1);
    setPhase('questions');
  }, [totalQuestions]);

  const onContactBack = useCallback(() => {
    setPhase('result');
  }, []);

  const onSubmitted = useCallback(() => {
    if (tier) {
      pushEvent('quiz_form_submitted', { lead_tier: tier });
    }
    setPhase('sent');
  }, [pushEvent, tier]);

  const inHero = phase === 'intro';

  return (
    <div className={inHero ? 'w-full' : 'mx-auto w-full max-w-2xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14'}>
      {phase === 'intro' ? (
        <IntroScreen
          headline={config.headline}
          subheadline={config.subheadline}
          startButtonText={config.startButtonText}
          onStart={onStart}
          onCallClick={onCallClick}
        />
      ) : null}

      {phase === 'questions' && currentQuestion ? (
        <QuestionScreen
          question={currentQuestion}
          index={stepIndex}
          total={totalQuestions}
          selectedId={answers[currentQuestion.id]}
          onSelect={onSelect}
          onBack={onBackFromQuestion}
        />
      ) : null}

      {phase === 'result' && tier ? (
        <ResultScreen
          tier={tier}
          message={config.result[tier]}
          onContinue={onResultContinue}
          onBack={onResultBack}
          continueLabel={config.contactFormCta}
        />
      ) : null}

      {phase === 'contact' && tier ? (
        <ContactForm
          config={config}
          questions={config.questions}
          answers={answers}
          tier={tier}
          resultMessage={config.result[tier]}
          onSubmitted={onSubmitted}
          onBack={onContactBack}
          onCallClick={onCallClick}
        />
      ) : null}

      {phase === 'sent' ? (
        <section className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <h2 className="font-display text-2xl font-extrabold text-navy">Thanks — we got it.</h2>
          <p className="mt-2 text-slate-600">
            A team member will reach out shortly. If it&apos;s urgent, call us anytime.
          </p>
        </section>
      ) : null}
    </div>
  );
}

export default CaseReviewChecker;
