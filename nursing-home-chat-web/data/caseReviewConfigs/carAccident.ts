/**
 * Car Accident config for the reusable CaseReviewChecker engine.
 *
 * Practice area: car_accident
 * Live route:    /car-accident-case-review
 * GTM page_slug: car-accident
 *
 * All question IDs and answer IDs are stable strings — they are written to the
 * lead payload, sent to GTM, and used by `scoreAnswers` below. Do not rename
 * them lightly.
 */

import type { AnswerMap, CaseReviewConfig, LeadTier } from '@/components/case-review-checker/types';

function scoreCarAccident(a: AnswerMap): LeadTier {
  const incident = a['incident_type'];
  const injury = a['injury'];
  const treatment = a['treatment'];
  const timing = a['timing'];
  const fault = a['fault'];
  const damage = a['vehicle_damage'];
  const insurance = a['other_driver_insurance'];
  const helpWith = a['help_with'];

  const injured = injury === 'yes';
  const someoneDied = injury === 'death';
  const noInjury = injury === 'no';
  const painUnsure = injury === 'pain-unsure';

  const treatedNow =
    treatment === 'er-ambulance' || treatment === 'urgent-doctor';
  const treatmentPending = treatment === 'scheduled';
  const noTreatment = treatment === 'not-yet' || treatment === 'none';

  const withinTwoYears =
    timing === 'last-7-days' ||
    timing === 'last-30-days' ||
    timing === 'last-year' ||
    timing === '1-to-2-years';
  const recent = timing === 'last-7-days' || timing === 'last-30-days';
  const outsideSol = timing === '2-plus-years';

  const notAtFault = fault === 'no' || fault === 'not-sure';
  const clearlyAtFault = fault === 'yes';

  const seriousDamage = damage === 'major' || damage === 'moderate';
  const minorDamage = damage === 'minor';

  const insuranceAvailable = insurance === 'yes' || insurance === 'not-sure';

  const propertyOnly = helpWith === 'property-damage-only';

  // 1. Death always escalates to priority review.
  if (someoneDied) return 'high_review_priority';

  // 2. Outside California's 2-year statute → likely not a fit.
  if (outsideSol) return 'likely_not_fit';

  // 3. Clearly at fault with no injury → not a fit for plaintiff PI work.
  if (clearlyAtFault && noInjury) return 'likely_not_fit';

  // 4. No injury and only property damage → not the kind of case we handle.
  if (noInjury && propertyOnly) return 'likely_not_fit';

  // 5. High review priority triggers.
  if (
    injured &&
    treatedNow &&
    notAtFault &&
    withinTwoYears
  ) {
    return 'high_review_priority';
  }
  if (seriousDamage && injured) return 'high_review_priority';
  if (
    incident === 'hit-and-run' &&
    (injured || painUnsure) &&
    insuranceAvailable
  ) {
    return 'high_review_priority';
  }

  // 6. Standard review triggers.
  if (painUnsure && (noTreatment || treatmentPending)) return 'standard_review';
  if (injured && (noTreatment || treatmentPending)) return 'standard_review';
  if (treatmentPending) return 'standard_review';
  if (fault === 'not-sure' && (injured || painUnsure)) return 'standard_review';
  if (recent && (injured || painUnsure)) return 'standard_review';

  // 7. Needs more info — weak / ambiguous signals.
  if (painUnsure) return 'needs_more_info';
  if (minorDamage && !injured) return 'needs_more_info';
  if (noTreatment && !injured) return 'needs_more_info';
  if (timing === '1-to-2-years' && !injured) return 'needs_more_info';

  // 8. Fallback: a real injury + recent accident → standard, otherwise needs more info.
  if (injured) return 'standard_review';
  return 'needs_more_info';
}

export const carAccidentConfig: CaseReviewConfig = {
  practiceArea: 'car_accident',
  pageSlug: 'car-accident',
  headline:
    'Injured in a Car Accident? Check If You May Qualify for a Free Case Review',
  subheadline: 'Answer a few quick questions. It takes less than a minute.',
  startButtonText: 'Start Free Case Review',
  contactFormCta: 'Request My Free Review',
  contactSubject: 'Car Accident – Case Review request',
  questions: [
    {
      id: 'incident_type',
      text: 'What happened?',
      options: [
        { id: 'car-accident', label: 'Car accident' },
        { id: 'rideshare', label: 'Rideshare accident' },
        { id: 'hit-and-run', label: 'Hit and run' },
        { id: 'multi-car', label: 'Multi-car crash' },
        { id: 'passenger', label: 'Passenger injury' },
        { id: 'other', label: 'Other' },
      ],
    },
    {
      id: 'injury',
      text: 'Were you injured?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'pain-unsure', label: 'I have pain but I’m not sure how serious' },
        { id: 'no', label: 'No' },
        { id: 'death', label: 'Someone died' },
      ],
    },
    {
      id: 'treatment',
      text: 'Did you receive medical treatment?',
      options: [
        { id: 'er-ambulance', label: 'Yes, emergency room or ambulance' },
        { id: 'urgent-doctor', label: 'Yes, urgent care or doctor' },
        { id: 'scheduled', label: 'I have an appointment scheduled' },
        { id: 'not-yet', label: 'Not yet' },
        { id: 'none', label: 'No treatment' },
      ],
    },
    {
      id: 'timing',
      text: 'When did the accident happen?',
      options: [
        { id: 'last-7-days', label: 'Within the last 7 days' },
        { id: 'last-30-days', label: 'Within the last 30 days' },
        { id: 'last-year', label: 'Within the last year' },
        { id: '1-to-2-years', label: 'More than 1 year ago' },
        { id: '2-plus-years', label: 'More than 2 years ago' },
      ],
    },
    {
      id: 'fault',
      text: 'Were you at fault?',
      options: [
        { id: 'no', label: 'No' },
        { id: 'not-sure', label: 'I’m not sure' },
        { id: 'partly', label: 'Partly' },
        { id: 'yes', label: 'Yes' },
      ],
    },
    {
      id: 'vehicle_damage',
      text: 'Was there visible vehicle damage?',
      options: [
        { id: 'major', label: 'Major damage' },
        { id: 'moderate', label: 'Moderate damage' },
        { id: 'minor', label: 'Minor damage' },
        { id: 'none', label: 'No visible damage' },
        { id: 'not-sure', label: 'Not sure' },
      ],
    },
    {
      id: 'other_driver_insurance',
      text: 'Do you have insurance information for the other driver?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'hit-and-run', label: 'Hit and run' },
        { id: 'not-sure', label: 'Not sure' },
      ],
    },
    {
      id: 'help_with',
      text: 'What would you like help with?',
      options: [
        { id: 'medical-bills', label: 'Medical bills' },
        { id: 'insurance-company', label: 'Insurance company' },
        { id: 'lost-wages', label: 'Lost wages' },
        { id: 'pain-injury', label: 'Pain/injury' },
        { id: 'property-damage-only', label: 'Property damage only' },
        { id: 'not-sure', label: 'Not sure' },
      ],
    },
  ],
  result: {
    high_review_priority: {
      headline: 'Your case may be worth a closer look soon.',
      body: 'Based on your answers, this may be worth reviewing with our team as soon as possible.',
      formIntro: 'Share your contact info and a team member will reach out shortly.',
    },
    standard_review: {
      headline: 'Your situation may be worth a free review.',
      body: 'Your situation may be worth a free review. A few details can help us understand your options.',
      formIntro: 'Tell us how to reach you and we’ll follow up.',
    },
    needs_more_info: {
      headline: 'A few more details would help.',
      body: 'We may need a few more details to understand whether this is something our team can help with.',
      formIntro: 'Share your contact info and a brief note. A team member will reach out.',
    },
    likely_not_fit: {
      headline: 'This may not be a typical case for us — you can still send it over.',
      body: 'This may not be the type of case we usually handle, but you can still send the details for review.',
      formIntro: 'If you’d like a confidential review, leave your details below.',
    },
  },
  scoreAnswers: scoreCarAccident,
};

export default carAccidentConfig;
