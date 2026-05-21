/**
 * Car Accident — Free Case Review (Next.js + reusable CaseReviewChecker engine).
 *
 * Source:
 *   ./nursing-home-chat-web/app/car-accident-case-review/page.tsx
 *   ./nursing-home-chat-web/components/case-review-checker/CaseReviewChecker.tsx
 *   ./nursing-home-chat-web/data/caseReviewConfigs/carAccident.ts
 *
 * Engine: components/case-review-checker/* is the reusable quiz engine.
 *         Add new practice areas by dropping a config in
 *         data/caseReviewConfigs/<area>.ts and mounting it in a new app route.
 *
 * Live URL:  https://call.insideraccidentlawyers.com/car-accident-case-review
 * GTM:       practice_area = car_accident, page_slug = car-accident
 *
 * Build:     cd nursing-home-chat-web && npm run build
 * Deploy:    copy nursing-home-chat-web/out/car-accident-case-review/
 *            to ./car-accident-case-review/ at repo root (matches existing
 *            /nursing-home-chat-check and /injury-help deploy pattern).
 */
export const route = '/car-accident-case-review';
export const sourceComponent =
  './nursing-home-chat-web/app/car-accident-case-review/page.tsx';
export default null;
