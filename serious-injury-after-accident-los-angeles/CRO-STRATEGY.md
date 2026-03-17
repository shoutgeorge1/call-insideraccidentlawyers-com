# Serious Injury LA — CRO Strategy & Landing Page Architecture

**URL:** `/serious-injury-after-accident-los-angeles/`  
**Primary goal:** Phone call (free consultation)  
**Secondary goal:** Short form submission  
**Tone:** Calm, credible, human. No settlement hype. No cheesy lawyer marketing.

---

## 1. Headline variations (A/B-ready)

**Hero H1 — confirm relevance immediately:**
- **A (current):** "Seriously Injured In An Accident?"
- **B:** "Already Went To The Hospital After A Crash?"
- **C:** "Hurt Badly And Not Sure What Happens Next?"

**Hero subhead (lock):**  
"You did the right thing getting medical care. Now let's talk about what comes next."

**Supporting trust line:**  
"You already did the right thing by getting medical help. Now protect your case."

---

## 2. Section wireframe & copy guidance

| Section | Purpose | Wireframe | CTA |
|--------|---------|-----------|-----|
| **Hero** | Confirm relevance, reduce anxiety, capture call/form | H1 + subhead + trust line → Large call + form → Attorney visual + trust strip | Primary: Call. Secondary: Form. Sticky phone on scroll. |
| **Trust / stats** | Authority, years, results | Headline + 4 stat blocks + tagline + "Trusted & Recognized By" logos | None (credibility only). |
| **What Happens After** | Timeline psychology; name their reality | H2 + intro → 4–5 icon blocks (insurance, bills, pain, work, family) | Inline: "Get answers" or "Free consultation" link. |
| **Types We Handle** | Expand consideration (car, truck, pedestrian, etc.) | H2 + intro → modular cards (6–8 types) | CTA bar: Call + Free Review. |
| **Real Consequences** | Lost income, medical debt, long recovery, emotional toll + proof | H2 + 4 consequence bullets → 1–2 testimonial-style quotes | "Talk to us" / Call. |
| **Why Our Firm** | Trial readiness, serious injury experience, no fee, local | H2 + 5 credibility cards (dark background) | Call. |
| **Urgency block** | "Insurance companies act fast. So should you." | Single message + single CTA (call). | One big call button. |
| **FAQ** | Objection handling, clarity | 4 questions: Who pays bills? How long do I have? What if insurance called? Can I still get help? | After last answer: "Call for a free consultation." |
| **Final CTA** | Minimal friction, big phone | Headline + one short reassurance line + phone number + optional secondary CTA | Big click-to-call only (or Call + Form). |

---

## 3. CTA placement strategy

- **Above the fold:** One primary (Call) + one secondary (Form). Trust strip near CTAs.
- **After every major section:** Repeat call CTA (button or inline link). No more than one primary + one secondary per section.
- **Sticky:** Mobile-only sticky bar with phone number and "Call Now" or "Free Consultation."
- **Urgency block:** Single CTA (call). No form.
- **Final CTA:** One headline, one line of copy, one big phone CTA. Optional small "Or submit form" link.
- **Button hierarchy:** Primary = yellow (Call or Free Case Review). Secondary = blue (other action). Always high contrast.

---

## 4. Image placement & visual narrative

| Narrative stage | Section | Image | Path (save to `/images/la/`) |
|-----------------|---------|--------|------------------------------|
| 1. Pain realization | Hero (or sidebar) | Person touching neck/shoulder in mirror, warm LA apartment | `woman-mirror-neck-pain.png` |
| — | Hero background (optional) | Wet LA street at night, lights blur, palm trees | `hero-wet-street-la.png` |
| 2. Financial stress | What Happens After | Person reviewing bills at table, concerned, natural home | `woman-worry-bills.png` |
| 3. Recovery uncertainty | Types We Handle | Person walking, arm sling, SoCal sidewalk, palms | `injured-woman-walking-sling.png` |
| 4. Life disruption | Real Consequences | Person in neck brace by window, contemplation, palms outside | `woman-neck-brace-contemplation.png` |
| 5. Legal guidance | Why Our Firm / trust | Attorney or calm office (existing) | — |
| Atmosphere | Section backgrounds | SoCal sunset gradient (subtle) | `sunset-background.png` |
| Location context | Optional | LA freeway interchange, dusk, traffic trails | `downtown-la-traffic.png` |

**Rules:** SoCal warm, sunlit, everyday realism. No corporate stock feel. No Seattle/NYC aesthetic. Authentic diverse SoCal appearance.

---

## 5. Full FAQ copy (4 questions)

1. **Who pays my medical bills?**  
   In California, your own health insurance or Med-Pay often pays first. The at-fault party’s insurance may later reimburse or be responsible, depending on your case. A lawyer can explain how this works for your situation and help you avoid paying out of pocket when someone else is at fault.

2. **How long do I have to file a claim?**  
   California has a statute of limitations for personal injury—usually two years from the date of injury, with some exceptions. Filing sooner helps preserve evidence and witnesses. We can tell you the exact deadline for your case during a free consultation.

3. **What if insurance already called me?**  
   It’s common for adjusters to contact you quickly. You are not required to give a recorded statement. What you say can affect your claim. Talking to an attorney before you say anything on the record can protect your rights. We can advise you on how to handle those calls.

4. **Can I still get help if I already gave a statement or signed something?**  
   Yes. Many people talk to insurance or sign forms before speaking with a lawyer. We can still review your case and help you understand your options. The next step is a free consultation so we can see what’s best for you.

---

## 6. Conversion improvement recommendations

- **Phone first:** Ensure the main hero CTA is Call (primary). Form is secondary. Sticky bar = call only on mobile.
- **Reduce form friction:** Keep hero form short (name, phone, what happened). Optional fields (accident type, when, ER, best time) can stay for engagement/qualification without feeling heavy.
- **Urgency without hype:** One clear urgency block (“Insurance companies act fast. So should you.”) with a single call CTA. No countdown timers or aggressive language.
- **Proof near decision points:** Place one strong testimonial or result in or right after “Real Consequences” so proof aligns with emotional low point.
- **FAQ as closer:** End FAQ with a soft CTA (“Call for a free consultation”) so the last thing they read before final CTA is reassurance + next step.
- **Mobile:** Sticky call bar, thumb-friendly buttons (min 44px), scannable headings, one-column layout. No hover-dependent content.

---

## 7. Mobile optimization notes

- **Sticky CTA:** Fixed bottom bar, full-width tap target, “Call Now” + number. No form in sticky bar.
- **Typography:** H1 ≥ 28px, body ≥ 16px. Line height 1.5–1.7. Sufficient contrast (navy/gray on white).
- **Tap targets:** Buttons and links ≥ 44px height. Adequate spacing between links.
- **Images:** Lazy-load below fold. Hero image or background optimized (WebP + fallback). Alt text for accessibility and context.
- **Form:** Single column. Large inputs. Optional fields collapsible or below required if needed.
- **Scroll progression:** One main idea per section. Clear H2s. CTA repeated every 1–2 scrolls.

---

## 8. SEO & structure

- **URL:** `serious-injury-after-accident-los-angeles` (no trailing word salad).
- **Title:** Include primary headline + “Los Angeles” + “Free Case Review” or “Free Consultation.”
- **Meta description:** Post-incident state (ER, pain, bills, insurance) + free consultation + no fee unless win.
- **Headings:** Single H1 (hero). H2 per section. H3 for subsections (cards, FAQ questions). No keyword stuffing.
- **Internal links:** Link to homepage, main contact, and other key LPs (e.g. car accident, serious injury) in footer or nav.

---

## 9. Image file checklist (save into `images/la/`)

Copy your approved assets into the repo with these names so the page can reference them:

| Your asset | Save as |
|------------|---------|
| Rain street lights LA (wet street blur) | `hero-wet-street-la.png` |
| Woman mirror neck pain | `woman-mirror-neck-pain.png` |
| Woman worry bills | `woman-worry-bills.png` |
| Woman neck brace contemplation | `woman-neck-brace-contemplation.png` |
| Injured woman walking (arm sling) | `injured-woman-walking-sling.png` |
| Sunset background (gradient) | `sunset-background.png` (optional) |
| Downtown LA traffic (freeway) | `downtown-la-traffic.png` (optional) |

After saving, the page will show these in the sections above. If a file is missing, the section will still work; the image area can be hidden or show a placeholder.
