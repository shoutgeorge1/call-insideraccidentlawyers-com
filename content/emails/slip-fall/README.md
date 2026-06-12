# Slip & Fall Case Guide — Email Nurture Sequence

**Audience.** People who completed the California Slip & Fall Case Check
(`/slip-and-fall-case-check-california` or `/california-slip-and-fall-case-guide`)
and **opted in** to receive the educational guide by email.

**Sender.** Insider Accident Lawyers — using the firm's already-approved
sending domain.

**Status.** These templates are written and stored here for compliance
review. They are NOT automatically activated. They should only be queued
into the firm's approved transactional / nurture ESP once compliance has
reviewed the wording, subject lines, headers, and unsubscribe handling.

**Header / footer requirements (apply to every email).**

- Accurate sender identity (Insider Accident Lawyers).
- Physical mailing address: 3435 Wilshire Blvd., Suite 1620, Los Angeles,
  CA 90010.
- "Attorney Advertising" disclosure.
- Privacy Policy link: https://call.insideraccidentlawyers.com/privacy-policy.html
- Working unsubscribe link or ESP-provided unsubscribe token
  (e.g. `{{ unsubscribe_url }}`).
- No deceptive subject lines.
- No guarantees, no fake urgency, no fabricated settlement values, no
  statement that the recipient definitely has a claim.

If the email content shifts toward a targeted offer of representation
that goes beyond the user's requested information, place
**"Advertisement"** at the top and bottom in the footer area as required
by the firm's compliance process.

## File map

| File | Purpose | Delay |
|------|---------|-------|
| `email-0-immediate.md` | Deliver the educational guide | Immediately on opt-in |
| `email-1-day-1.md`     | Evidence that can disappear first | T + 1 day |
| `email-2-day-3.md`     | Why where the fall happened matters | T + 3 days |
| `email-3-day-5.md`     | Does "open and obvious" automatically end a case? | T + 5 days |
| `email-4-day-7.md`     | Why injury severity and treatment matter | T + 7 days |
| `email-5-day-10.md`    | Still have questions? | T + 10 days |

Tokens used in templates (replace with ESP equivalents):

- `{{ first_name }}`
- `{{ phone_number }}`
- `{{ guide_url }}`     → `https://call.insideraccidentlawyers.com/california-slip-and-fall-case-guide`
- `{{ results_url }}`   → `https://call.insideraccidentlawyers.com/slip-and-fall-case-guide-results`
- `{{ checklist_url }}` → `https://call.insideraccidentlawyers.com/slip-and-fall-case-guide-results#sf-checklist`
- `{{ video_url }}`     → `https://www.youtube.com/watch?v=oYZyaWdl1mg`
- `{{ unsubscribe_url }}`
