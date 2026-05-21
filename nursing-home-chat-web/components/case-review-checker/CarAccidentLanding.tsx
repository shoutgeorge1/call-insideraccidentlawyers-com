'use client';

import { CaseReviewLanding } from './CaseReviewLanding';
import { carAccidentConfig } from '@/data/caseReviewConfigs/carAccident';

/**
 * Thin client wrapper that binds the car-accident config to the reusable
 * CaseReviewLanding component.
 *
 * This indirection exists because CaseReviewConfig carries a function
 * (`scoreAnswers`), which cannot be serialized across the RSC boundary.
 * Importing the config inside a client component keeps it on the client side.
 *
 * To add another practice area, create a sibling wrapper (e.g.
 * TruckAccidentLanding.tsx) that imports its own config from
 * @/data/caseReviewConfigs/<area>.ts.
 */
export function CarAccidentLanding() {
  return <CaseReviewLanding config={carAccidentConfig} />;
}

export default CarAccidentLanding;
