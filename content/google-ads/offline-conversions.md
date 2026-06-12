# Offline Conversion + Lead-Quality Implementation Notes

These notes describe how the firm's CRM can return qualified-lead and
signed-lead signals to Google Ads (and any other approved ad platform)
**without** violating the sensitive-audience policy described in
`sensitive-audience-policy.md`.

## Identifiers captured at submission

The new slip-and-fall funnel already POSTs the following with each lead
(see `/js/slip-fall-funnel.js`, function `submit`):

- `gclid` (when available)
- `gbraid` / `wbraid` (when available)
- `msclkid` (when present in the URL)
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- First and last name (separate fields), phone, email — for Enhanced
  Conversions for Leads
- `landing_variant` (`variant_a` / `variant_b`)
- `landing_page`, `landing_url`, `referrer`, `submitted_at`
- `priority_tag` (internal — `PL_A_PRIORITY`, `PL_B_REVIEW`,
  `PL_C_EDU`)
- `lead_tags` (internal — location, injury, evidence, liability)

These identifiers go to the **form backend** (currently
`formsubmit.co/ial.leads.2024@gmail.com`) and from there into the CRM.
They are **never** put into the dataLayer or any other analytics event.

## Measurement hierarchy

| Tier | Conversion | Source | Used for |
|------|------------|--------|----------|
| Secondary | Assessment start (`pl_assessment_start`)    | dataLayer | Engagement signal only — do **not** use as a primary conversion. |
| Secondary | Assessment complete (`pl_assessment_complete`) | dataLayer | Engagement signal only. |
| Secondary | Video engagement (`pl_video_start`, `pl_video_25/50/75/complete`) | dataLayer | Engagement signal only. |
| Secondary | Checklist print (`pl_checklist_print`)      | dataLayer | Engagement signal only. |
| **Primary (initial)** | Completed case-review submission (`pl_lead_submit_success`) | dataLayer + server POST | Use as primary while volume builds. |
| **Primary (initial)** | Qualified phone call | CallRail rules already in production | Use as primary alongside form submit. |
| **Primary (optimization)** | Qualified lead | Imported from CRM via offline conversion import | Use once volume + CRM disposition data exist. |
| **Primary (optimization)** | Signed / converted lead | Imported from CRM via offline conversion import | Use once volume + CRM disposition data exist. |

> Do **not** count assessment starts as primary conversions. That is the
> fastest way to over-spend on people who do not become real cases.

## CRM lead dispositions to return

Configure the CRM (or attorney intake workflow) so each premises lead
can be tagged with one of the following dispositions. These are imported
back to Google Ads as offline conversions:

| CRM disposition | Google Ads conversion action | Notes |
|-----------------|-----------------------------|-------|
| `qualified_lead`           | "Qualified Lead — Premises"           | Talked with intake, basic facts met threshold for attorney review. |
| `priority_premises_lead`   | "Priority Premises Lead"              | Internal `PL_A_PRIORITY` tag, queued for attorney call. |
| `attorney_reviewed_lead`   | "Attorney Reviewed Lead"              | Attorney looked at facts, decided whether to take next step. |
| `signed_case`              | "Signed Case — Premises"              | Retainer signed. |
| `disqualified_no_case`     | "Disqualified — No Case" *(internal)* | Internal reporting only; not used as a bid signal. |

Google Ads can use the **qualified lead** and **signed case** actions to
bid toward outcomes that actually matter for the firm, instead of paying
for high-volume but low-quality leads.

## Enhanced Conversions for Leads — implementation

1. In Google Ads, enable **Enhanced Conversions for Leads** on the
   primary lead form-submit conversion action.
2. The funnel already collects first name, last name, phone, and email
   in separate fields, which is what EC-Leads needs for hashed user
   data. (See `/js/slip-fall-funnel.js`.)
3. If using GTM, add an Enhanced Conversion tag that reads the form
   fields **only at submit time**, hashes them client-side using the
   tag template, and sends them with the conversion ping. **Do not** push
   the raw values into the dataLayer beyond what the tag template needs
   for that single conversion event.
4. Audit yearly to confirm no audience-list or remarketing tag has been
   wired into the same field-reads.

## Operational reminders

- Quarterly: review the **negative keyword list** for new noise terms.
- Quarterly: review the **disposition mapping** with intake and the
  managing attorney. The Google Ads bid strategy is only as good as the
  signal the CRM sends back.
- Yearly: confirm with privacy counsel that the offline conversion
  pipeline is compliant with current Google policy and any updated
  California privacy obligations.
