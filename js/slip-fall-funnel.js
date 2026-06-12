/*!
 * Insider Accident Lawyers — California Slip & Fall Case Check
 * Shared assessment engine for:
 *   /slip-and-fall-case-check-california  (Variant A)
 *   /california-slip-and-fall-case-guide  (Variant B)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IMPORTANT — DATA PRIVACY
 * ─────────────────────────────────────────────────────────────────────────────
 * - Do NOT push PII into dataLayer (name, phone, email, exact address,
 *   accident date, injury description, free-text story, treatment, location
 *   notes, priority tag, public-entity status, etc.).
 * - Only generic step counters and non-identifying enum values are tracked.
 * - The "priority tag" (PL_A_PRIORITY / PL_B_REVIEW / PL_C_EDU) is computed
 *   client-side for internal CRM routing and POSTed to the form backend ONLY.
 *   It is never logged via dataLayer.
 * - sessionStorage holds an in-flight assessment so users can resume after a
 *   page refresh; it is cleared on successful submit or by "Start Over".
 *
 * Google Ads policy reminder:
 * - This data may NOT be used to build remarketing lists, Customer Match
 *   audiences, custom segments, or similar personalized targeting based on
 *   the user's injury inquiry. See:
 *   /content/google-ads/sensitive-audience-policy.md
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
  "use strict";

  // ── Constants ──────────────────────────────────────────────────────────────
  var PRACTICE_AREA = "premises_liability";
  var PAGE_TYPE = "slip_fall_case_check";
  var PHONE = "844-467-4335";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/ial.leads.2024@gmail.com";
  var FORM_ENDPOINT_FALLBACK = "https://formsubmit.co/ial.leads.2024@gmail.com";
  var RESULTS_PATH = "/slip-and-fall-case-guide-results";
  var STATE_KEY = "ial_pl_assessment_state_v1";
  var SUBMIT_MARK_KEY = "ial_pl_assessment_submitted_v1";
  var TRACKING_KEYS = [
    "gclid", "gbraid", "wbraid", "msclkid",
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"
  ];

  // ── Assessment definition ──────────────────────────────────────────────────
  // Step order matches the prompt; each step has an id, prompt, optional
  // helper text, and either single-choice or multi-select options.
  var STEPS = [
    {
      id: "when",
      title: "When did the incident happen?",
      help: "Helps identify any time-sensitive deadlines an attorney should review.",
      type: "single",
      options: [
        { v: "lt_7d",  l: "Within the last 7 days" },
        { v: "lt_30d", l: "Within the last 30 days" },
        { v: "lt_6m",  l: "Within the last 6 months" },
        { v: "lt_1y",  l: "Within the last year" },
        { v: "gt_1y",  l: "More than one year ago" },
        { v: "unsure", l: "Not sure" }
      ]
    },
    {
      id: "where",
      title: "Where did it happen?",
      help: "Different property types involve different rules and insurance.",
      type: "single",
      options: [
        { v: "grocery",     l: "Grocery store" },
        { v: "retail",      l: "Retail store" },
        { v: "bigbox",      l: "Big-box store" },
        { v: "restaurant",  l: "Restaurant" },
        { v: "hotel",       l: "Hotel" },
        { v: "rental",      l: "Apartment or rental property" },
        { v: "parking",     l: "Commercial parking lot" },
        { v: "public",      l: "Public sidewalk or government property" },
        { v: "workplace",   l: "Workplace" },
        { v: "private_res", l: "Someone else's private residence" },
        { v: "own_home",    l: "My own home" },
        { v: "other",       l: "Other" }
      ]
    },
    {
      id: "presence",
      title: "What best describes why you were at the property?",
      help: "Different visitor roles can affect what is owed to you.",
      type: "single",
      options: [
        { v: "customer",   l: "Customer" },
        { v: "guest",      l: "Guest" },
        { v: "tenant",     l: "Tenant" },
        { v: "employee",   l: "Employee" },
        { v: "contractor", l: "Contractor" },
        { v: "delivery",   l: "Delivery or service worker" },
        { v: "pedestrian", l: "Pedestrian" },
        { v: "lawful",     l: "Other lawful visitor" },
        { v: "unsure",     l: "Other / not sure" }
      ]
    },
    {
      id: "hazard",
      title: "What caused the incident?",
      help: "Pick the closest match. You can add detail later.",
      type: "single",
      allowOther: true,
      options: [
        { v: "spill",          l: "Spill or liquid" },
        { v: "mopped",         l: "Recently mopped floor" },
        { v: "grease",         l: "Grease or food" },
        { v: "broken_floor",   l: "Broken flooring" },
        { v: "uneven",         l: "Uneven surface" },
        { v: "mat",            l: "Loose mat or rug" },
        { v: "clutter",        l: "Merchandise or clutter" },
        { v: "falling_merch",  l: "Falling merchandise" },
        { v: "lighting",       l: "Poor lighting" },
        { v: "stair_handrail", l: "Broken stair or handrail" },
        { v: "entrance",       l: "Unsafe entrance" },
        { v: "pothole",        l: "Pothole" },
        { v: "parking_defect", l: "Parking-lot defect" },
        { v: "sidewalk_defect",l: "Sidewalk defect" },
        { v: "barrier",        l: "Missing barrier" },
        { v: "other",          l: "Other unsafe condition" }
      ]
    },
    {
      id: "visibility",
      title: "Could you see the dangerous condition before the incident?",
      help: "Whether you could see it can affect — but does not automatically end — a case.",
      type: "single",
      options: [
        { v: "no",        l: "No" },
        { v: "yes",       l: "Yes" },
        { v: "partial",   l: "Partially" },
        { v: "unsure",    l: "I am not sure" }
      ]
    },
    {
      id: "warning",
      title: "Was there a warning sign, cone, barrier, or employee warning?",
      help: "A warning matters only if it actually gave you a fair chance to avoid the danger.",
      type: "single",
      options: [
        { v: "none",       l: "No warning" },
        { v: "hard_see",   l: "Warning was present but difficult to see" },
        { v: "no_block",   l: "Warning was present but did not block the danger" },
        { v: "clear",      l: "Clear warning was present" },
        { v: "unsure",     l: "Not sure" }
      ]
    },
    {
      id: "necessity",
      title: "Did you have to pass through or encounter the area to enter, exit, work, shop, or reach a needed location?",
      help: "Sometimes there is no reasonable way to avoid a hazard. That can matter.",
      type: "single",
      // Only shown when the user could see the danger or warning was present
      showIf: function (a) {
        return (
          a.visibility === "yes" ||
          a.visibility === "partial" ||
          a.warning === "clear" ||
          a.warning === "no_block" ||
          a.warning === "hard_see"
        );
      },
      options: [
        { v: "yes",    l: "Yes" },
        { v: "no",     l: "No" },
        { v: "unsure", l: "Not sure" }
      ]
    },
    {
      id: "notice",
      title: "Which of these applies? (Select all that apply.)",
      help: "Whether the business knew or should have known about the danger is a central question.",
      type: "multi",
      options: [
        { v: "emp_created",   l: "An employee created the condition" },
        { v: "emp_saw",       l: "An employee saw the condition" },
        { v: "emp_passed",    l: "An employee walked past the condition" },
        { v: "staff_admit",   l: "Staff said they already knew about it" },
        { v: "long_existed",  l: "The condition appeared to have existed for a while" },
        { v: "prior_compl",   l: "There had been earlier complaints" },
        { v: "not_inspected", l: "The area had not been inspected recently" },
        { v: "unknown",       l: "I do not know" }
      ]
    },
    {
      id: "report",
      title: "Was an incident report made?",
      type: "single",
      options: [
        { v: "yes_copy",   l: "Yes, and I have a copy" },
        { v: "yes_nocopy", l: "Yes, but I do not have a copy" },
        { v: "verbal",     l: "I reported it verbally" },
        { v: "no",         l: "No" },
        { v: "unsure",     l: "Not sure" }
      ]
    },
    {
      id: "injuries",
      title: "What injuries resulted? (Select all that apply.)",
      help: "Stronger cases usually involve a documented, significant injury.",
      type: "multi",
      options: [
        { v: "fracture",    l: "Fracture or broken bone" },
        { v: "hip",         l: "Hip injury" },
        { v: "head",        l: "Head injury or concussion symptoms" },
        { v: "back_neck",   l: "Back or neck injury" },
        { v: "knee_ankle",  l: "Knee or ankle injury" },
        { v: "upper_limb",  l: "Shoulder, wrist, or hand injury" },
        { v: "surgery",     l: "Surgery was recommended or performed" },
        { v: "visible",     l: "Cuts, scarring, or other visible injury" },
        { v: "pain_only",   l: "Pain without a diagnosis yet" },
        { v: "other",       l: "Other" },
        { v: "none",        l: "No meaningful injury" }
      ]
    },
    {
      id: "treatment",
      title: "What medical treatment have you received?",
      help: "If you are having urgent symptoms, please contact a medical provider or 911.",
      type: "single",
      options: [
        { v: "ambulance_er", l: "Ambulance or emergency room" },
        { v: "hospital",     l: "Hospitalization" },
        { v: "surgery",      l: "Surgery" },
        { v: "urgent_care",  l: "Urgent care or clinic" },
        { v: "primary",      l: "Primary-care doctor" },
        { v: "specialist",   l: "Specialist" },
        { v: "imaging",      l: "Imaging" },
        { v: "pt",           l: "Physical therapy or ongoing treatment" },
        { v: "scheduled",    l: "Appointment scheduled" },
        { v: "none",         l: "No treatment" },
        { v: "other",        l: "Other" }
      ]
    },
    {
      id: "evidence",
      title: "What evidence may be available? (Select all that apply.)",
      help: "Some evidence — especially surveillance video — can disappear quickly.",
      type: "multi",
      options: [
        { v: "photos_hazard", l: "Photos of the hazard" },
        { v: "photos_inj",    l: "Photos of injuries" },
        { v: "video",         l: "Video" },
        { v: "report",        l: "Incident report" },
        { v: "witnesses",     l: "Witnesses" },
        { v: "surveillance",  l: "Store or property surveillance" },
        { v: "receipt",       l: "Receipt or purchase record" },
        { v: "medical",       l: "Medical records" },
        { v: "clothing",      l: "Clothing or shoes" },
        { v: "prior_compl",   l: "Prior complaints" },
        { v: "maint_logs",    l: "Maintenance or inspection records may exist" },
        { v: "none_yet",      l: "None yet" },
        { v: "unsure",        l: "Not sure" }
      ]
    },
    {
      id: "contact",
      title: "Where should the team send your Case Guide?",
      help: "We use this only to contact you about your inquiry. We will not sell your information.",
      type: "contact"
    }
  ];

  // ── Tagging logic ──────────────────────────────────────────────────────────
  // Build the internal priority + location + injury + evidence + liability
  // tags that route the lead inside the CRM. Never logged via dataLayer.
  function buildTags(a) {
    var tags = [];
    var loc = a.where;
    var locMap = {
      grocery:     "LOC_STORE",
      bigbox:      "LOC_STORE",
      retail:      "LOC_RETAIL",
      hotel:       "LOC_HOTEL",
      restaurant:  "LOC_STORE",
      rental:      "LOC_RENTAL",
      parking:     "LOC_PARKING",
      public:      "LOC_PUBLIC",
      workplace:   "LOC_WORK",
      private_res: "LOC_RESIDENCE",
      own_home:    "LOC_OWN_HOME",
      other:       "LOC_OTHER"
    };
    if (locMap[loc]) tags.push(locMap[loc]);

    var inj = arrify(a.injuries);
    if (inj.indexOf("surgery")  > -1) tags.push("INJ_SURGERY");
    if (inj.indexOf("fracture") > -1) tags.push("INJ_FRACTURE");
    if (inj.indexOf("head")     > -1) tags.push("INJ_HEAD");
    if (inj.indexOf("back_neck")> -1) tags.push("INJ_BACK_NECK");
    if (inj.indexOf("hip")      > -1) tags.push("INJ_HIP");
    if (
      inj.indexOf("knee_ankle") > -1 ||
      inj.indexOf("upper_limb") > -1
    ) tags.push("INJ_JOINT");
    if (inj.indexOf("other") > -1)    tags.push("INJ_OTHER");
    if (
      inj.length === 0 ||
      (inj.length === 1 && inj[0] === "none")
    ) tags.push("INJ_NO_TX");

    var ev = arrify(a.evidence);
    if (ev.indexOf("photos_hazard") > -1 || ev.indexOf("photos_inj") > -1) tags.push("EVID_PHOTO");
    if (ev.indexOf("video") > -1)        tags.push("EVID_VIDEO");
    if (ev.indexOf("report") > -1 || a.report === "yes_copy" || a.report === "yes_nocopy") tags.push("EVID_REPORT");
    if (ev.indexOf("witnesses") > -1)    tags.push("EVID_WITNESS");
    if (ev.indexOf("surveillance") > -1) tags.push("EVID_SURVEILLANCE");
    if (ev.indexOf("receipt") > -1)      tags.push("EVID_RECEIPT");
    if (ev.indexOf("none_yet") > -1 && ev.length === 1) tags.push("EVID_NONE");

    var notice = arrify(a.notice);
    if (notice.indexOf("emp_created") > -1) tags.push("EMPLOYEE_CREATED");
    if (notice.indexOf("staff_admit") > -1) tags.push("NOTICE_ACTUAL");
    if (
      notice.indexOf("emp_saw") > -1 ||
      notice.indexOf("emp_passed") > -1 ||
      notice.indexOf("long_existed") > -1 ||
      notice.indexOf("prior_compl") > -1 ||
      notice.indexOf("not_inspected") > -1
    ) tags.push("NOTICE_CONSTRUCTIVE");

    if (a.warning === "none") tags.push("WARN_NONE");
    if (a.warning === "hard_see" || a.warning === "no_block") tags.push("WARN_WEAK");
    if (a.warning === "clear") tags.push("WARN_CLEAR");

    if ((a.visibility === "yes" || a.visibility === "partial") && a.warning === "clear") {
      tags.push("OPEN_OBVIOUS");
    }
    if (a.necessity === "yes") tags.push("NECESSITY_ENCOUNTER");

    if (a.where === "other" || a.where === "private_res") tags.push("CONTROL_UNCLEAR");

    // ── Priority bucket ──
    var serious =
      inj.indexOf("surgery")   > -1 ||
      inj.indexOf("fracture")  > -1 ||
      inj.indexOf("hip")       > -1 ||
      inj.indexOf("head")      > -1 ||
      inj.indexOf("back_neck") > -1 ||
      a.treatment === "hospital" ||
      a.treatment === "surgery" ||
      a.treatment === "ambulance_er";

    var hasTreatment =
      a.treatment &&
      a.treatment !== "none" &&
      a.treatment !== "scheduled" &&
      a.treatment !== "other";

    var meaningfulInjury = inj.length > 0 && !(inj.length === 1 && inj[0] === "none");
    var thirdPartyLocation = ["grocery","retail","bigbox","restaurant","hotel","rental","parking","public","other","private_res"].indexOf(a.where) > -1;
    var evidencePath =
      ev.length > 0 && !(ev.length === 1 && ev[0] === "none_yet") ||
      a.report === "yes_copy" || a.report === "yes_nocopy" ||
      notice.length > 0 && notice.indexOf("unknown") === -1 ||
      a.warning === "none" || a.warning === "hard_see" || a.warning === "no_block";

    var priority = "PL_C_EDU";
    if (serious && hasTreatment && thirdPartyLocation && evidencePath) {
      priority = "PL_A_PRIORITY";
    } else if (
      (meaningfulInjury && (hasTreatment || a.treatment === "scheduled")) &&
      (thirdPartyLocation || a.where === "workplace") &&
      a.where !== "own_home"
    ) {
      priority = "PL_B_REVIEW";
    }
    tags.unshift(priority);

    return { priority: priority, tags: tags };
  }

  function arrify(v) {
    if (!v) return [];
    if (Object.prototype.toString.call(v) === "[object Array]") return v.slice();
    return [v];
  }

  // ── Tracking helpers ───────────────────────────────────────────────────────
  function pushEvent(eventName, payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      var base = {
        event: eventName,
        practice_area: PRACTICE_AREA,
        page_type: PAGE_TYPE,
        page_language: document.documentElement.lang || "en"
      };
      if (payload && typeof payload === "object") {
        // Defensive whitelist — never let PII slip in.
        var allowed = [
          "page_variant", "step_number", "total_steps", "placement",
          "cta_location", "completion_status", "video_percent",
          "traffic_source", "step_id", "selection_count", "form_status",
          "checklist_action", "tab"
        ];
        for (var k in payload) {
          if (allowed.indexOf(k) > -1) base[k] = payload[k];
        }
      }
      window.dataLayer.push(base);
    } catch (e) { /* noop */ }
  }

  function getTrackingParams() {
    var out = {};
    try {
      for (var i = 0; i < TRACKING_KEYS.length; i++) {
        var key = TRACKING_KEYS[i];
        var v = localStorage.getItem("ial_" + key);
        if (v) out[key] = v;
      }
    } catch (e) { /* noop */ }
    return out;
  }

  function captureUrlParams() {
    try {
      if (!window.location.search) return;
      var q = new URLSearchParams(window.location.search);
      for (var i = 0; i < TRACKING_KEYS.length; i++) {
        var key = TRACKING_KEYS[i];
        var val = q.get(key);
        if (val) {
          try { localStorage.setItem("ial_" + key, val); } catch (e) { /* noop */ }
        }
      }
    } catch (e) { /* noop */ }
  }

  // ── State persistence (session only) ───────────────────────────────────────
  function loadState() {
    try {
      var raw = sessionStorage.getItem(STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function saveState(state) {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { /* noop */ }
  }
  function clearState() {
    try { sessionStorage.removeItem(STATE_KEY); } catch (e) { /* noop */ }
  }

  // ── Step filtering ─────────────────────────────────────────────────────────
  function visibleSteps(answers) {
    var out = [];
    for (var i = 0; i < STEPS.length; i++) {
      var s = STEPS[i];
      if (s.showIf && !s.showIf(answers)) continue;
      out.push(s);
    }
    return out;
  }

  // ── Renderers ──────────────────────────────────────────────────────────────
  function renderOption(stepId, opt, isMulti, idx) {
    var type = isMulti ? "checkbox" : "radio";
    var id = "opt-" + stepId + "-" + idx;
    var labelHTML = escapeHtml(opt.l);
    return (
      '<label class="sf-opt" for="' + id + '">' +
        '<input id="' + id + '" type="' + type + '" name="' + stepId + '" value="' + opt.v + '" />' +
        '<span class="sf-opt__box" aria-hidden="true"></span>' +
        '<span class="sf-opt__text">' + labelHTML + '</span>' +
      '</label>'
    );
  }

  function renderStep(step, idx, total, currentAnswers) {
    var html = '';
    html += '<div class="sf-step" role="group" aria-labelledby="sf-step-' + step.id + '-title" data-step-id="' + step.id + '">';
    html += '<div class="sf-step__meta" aria-live="polite">Step ' + (idx + 1) + ' of ' + total + '</div>';
    html += '<h3 id="sf-step-' + step.id + '-title" class="sf-step__title">' + escapeHtml(step.title) + '</h3>';
    if (step.help) {
      html += '<p class="sf-step__help">' + escapeHtml(step.help) + '</p>';
    }

    if (step.type === "contact") {
      html += renderContact(currentAnswers);
    } else {
      var groupTag = step.type === "single" ? "radiogroup" : "group";
      html += '<fieldset class="sf-step__field" role="' + groupTag + '" aria-labelledby="sf-step-' + step.id + '-title">';
      html += '<legend class="sf-sr">' + escapeHtml(step.title) + '</legend>';
      html += '<div class="sf-options sf-options--' + step.type + '">';
      for (var i = 0; i < step.options.length; i++) {
        html += renderOption(step.id, step.options[i], step.type === "multi", i);
      }
      if (step.allowOther) {
        html += '<label class="sf-opt sf-opt--text" for="opt-' + step.id + '-other">' +
                  '<span class="sf-opt__text">If "other", briefly describe (optional)</span>' +
                  '<input id="opt-' + step.id + '-other" class="sf-opt__input" name="' + step.id + '_other" type="text" maxlength="120" autocomplete="off" />' +
                '</label>';
      }
      html += '</div>';
      html += '</fieldset>';
    }

    html += '<div class="sf-step__nav">';
    html += '<button type="button" class="sf-btn sf-btn--ghost" data-act="back"' + (idx === 0 ? ' hidden' : '') + '>&larr; Back</button>';
    var continueLabel = (idx === total - 1)
      ? "Submit my answers"
      : ((step.type === "contact") ? "Submit" : "Continue &rarr;");
    html += '<button type="button" class="sf-btn sf-btn--primary" data-act="next" aria-describedby="sf-helper">' + continueLabel + '</button>';
    html += '</div>';
    html += '<p class="sf-helper" id="sf-helper" aria-live="polite"></p>';
    html += '</div>';
    return html;
  }

  function renderContact(a) {
    a = a || {};
    var html = '';
    html += '<fieldset class="sf-step__field sf-contact">';
    html += '<legend class="sf-sr">Your contact information</legend>';
    html += '<div class="sf-contact__grid">';
    html += '<label class="sf-field"><span class="sf-field__label">First name <em>*</em></span>' +
            '<input class="sf-field__input" name="first_name" autocomplete="given-name" required maxlength="60" value="' + escapeHtml(a.first_name || "") + '" /></label>';
    html += '<label class="sf-field"><span class="sf-field__label">Last name <em>*</em></span>' +
            '<input class="sf-field__input" name="last_name" autocomplete="family-name" required maxlength="60" value="' + escapeHtml(a.last_name || "") + '" /></label>';
    html += '<label class="sf-field"><span class="sf-field__label">Phone number <em>*</em></span>' +
            '<input class="sf-field__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20" placeholder="(555) 555-5555" value="' + escapeHtml(a.phone || "") + '" /></label>';
    html += '<label class="sf-field"><span class="sf-field__label">Email <em class="sf-field__opt">(needed to email the Case Guide)</em></span>' +
            '<input class="sf-field__input" name="email" type="email" autocomplete="email" maxlength="120" placeholder="you@example.com" value="' + escapeHtml(a.email || "") + '" /></label>';
    html += '<label class="sf-field"><span class="sf-field__label">Preferred contact method</span>' +
            '<select class="sf-field__input" name="preferred_contact">' +
              '<option value="phone"' + (a.preferred_contact === "phone" ? " selected" : "") + '>Phone</option>' +
              '<option value="text"'  + (a.preferred_contact === "text"  ? " selected" : "") + '>Text</option>' +
              '<option value="email"' + (a.preferred_contact === "email" ? " selected" : "") + '>Email</option>' +
            '</select></label>';
    html += '<label class="sf-field"><span class="sf-field__label">Best time to contact</span>' +
            '<select class="sf-field__input" name="best_time">' +
              '<option value="any"'      + (a.best_time === "any"      ? " selected" : "") + '>Anytime</option>' +
              '<option value="morning"'  + (a.best_time === "morning"  ? " selected" : "") + '>Morning</option>' +
              '<option value="midday"'   + (a.best_time === "midday"   ? " selected" : "") + '>Midday</option>' +
              '<option value="evening"'  + (a.best_time === "evening"  ? " selected" : "") + '>Evening</option>' +
            '</select></label>';
    html += '</div>';
    html += '<label class="sf-field sf-field--block"><span class="sf-field__label">Short optional description</span>' +
            '<textarea class="sf-field__input" name="story" rows="3" maxlength="800" placeholder="A few sentences about what happened (optional).">' + escapeHtml(a.story || "") + '</textarea></label>';

    // Consents
    html += '<div class="sf-consents">';
    html += '<label class="sf-check sf-check--required">' +
              '<input type="checkbox" name="consent_contact" required ' + (a.consent_contact ? "checked" : "") + ' />' +
              '<span>By submitting this form, you are requesting a free case review and agree that Insider Accident Lawyers may contact you by phone or email regarding your inquiry. Submitting information does not create an attorney-client relationship.</span>' +
            '</label>';
    html += '<label class="sf-check">' +
              '<input type="checkbox" name="consent_email_guide" ' + (a.consent_email_guide ? "checked" : "") + ' />' +
              '<span>Email me the Slip &amp; Fall Case Guide and related educational information. I can unsubscribe at any time.</span>' +
            '</label>';
    html += '<label class="sf-check">' +
              '<input type="checkbox" name="consent_sms" ' + (a.consent_sms ? "checked" : "") + ' />' +
              '<span>By checking this box, I am agreeing to receive transactional/informational text messages from Insider Accident Lawyers. Message frequency will vary. Msg &amp; data rates may apply. Reply HELP for help or STOP to opt-out. (Optional — SMS is not required to receive a case review.)</span>' +
            '</label>';
    html += '</div>';

    html += '<p class="sf-fineprint">This page is attorney advertising. ' +
              '<a href="/privacy-policy.html">Privacy Policy</a> · ' +
              '<a href="/terms-conditions.html">Terms &amp; Conditions</a>. ' +
              'Submitting this form does not create an attorney-client relationship. Communications are not privileged or confidential unless and until an attorney-client relationship is formed.' +
            '</p>';
    html += '</fieldset>';
    return html;
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readStepValue(rootEl, step) {
    if (step.type === "single") {
      var picked = rootEl.querySelector('input[name="' + step.id + '"]:checked');
      var val = picked ? picked.value : "";
      if (step.allowOther) {
        var other = rootEl.querySelector('input[name="' + step.id + '_other"]');
        if (other) return { value: val, other: other.value || "" };
      }
      return { value: val };
    }
    if (step.type === "multi") {
      var picks = rootEl.querySelectorAll('input[name="' + step.id + '"]:checked');
      var arr = [];
      for (var i = 0; i < picks.length; i++) arr.push(picks[i].value);
      return { value: arr };
    }
    if (step.type === "contact") {
      var c = {};
      var names = ["first_name", "last_name", "phone", "email", "preferred_contact", "best_time", "story"];
      for (var n = 0; n < names.length; n++) {
        var el = rootEl.querySelector('[name="' + names[n] + '"]');
        c[names[n]] = el ? (el.value || "").trim() : "";
      }
      c.consent_contact     = !!(rootEl.querySelector('[name="consent_contact"]')     && rootEl.querySelector('[name="consent_contact"]').checked);
      c.consent_email_guide = !!(rootEl.querySelector('[name="consent_email_guide"]') && rootEl.querySelector('[name="consent_email_guide"]').checked);
      c.consent_sms         = !!(rootEl.querySelector('[name="consent_sms"]')         && rootEl.querySelector('[name="consent_sms"]').checked);
      return { value: c };
    }
    return { value: null };
  }

  function validateStep(step, value, answers) {
    if (step.type === "single") {
      var v = value && value.value;
      if (!v) return "Please pick one answer to continue.";
    } else if (step.type === "multi") {
      // Always allow zero selection? The brief says these are multi-select with
      // an "I do not know" / "None yet" option; we require at least one.
      if (!value.value || !value.value.length) return "Please pick at least one option (or the closest match).";
    } else if (step.type === "contact") {
      var c = value.value || {};
      if (!c.first_name || c.first_name.length < 2) return "Please enter your first name.";
      if (!c.last_name || c.last_name.length < 2)   return "Please enter your last name.";
      var digits = (c.phone || "").replace(/\D/g, "");
      if (digits.length < 10) return "Please enter a valid 10-digit phone number.";
      if (c.consent_email_guide && (!c.email || !/.+@.+\..+/.test(c.email))) {
        return "Please enter a valid email to receive the Case Guide.";
      }
      if (c.email && !/.+@.+\..+/.test(c.email)) return "Please enter a valid email or leave it blank.";
      if (!c.consent_contact) return "Please agree to be contacted about your inquiry.";
    }
    return null;
  }

  function buildPersonalizedResults(answers, tagsInfo) {
    var bullets = [];

    // 1. Property and control
    var loc = answers.where;
    var locText = "";
    switch (loc) {
      case "grocery": case "retail": case "bigbox": case "restaurant": case "hotel":
        locText = "A commercial property may have inspection, cleaning, and incident-report records that an attorney would request. Commercial insurance may apply.";
        break;
      case "rental":
        locText = "Apartments and rentals can involve landlord vs. tenant control, common-area maintenance, and prior-notice records.";
        break;
      case "parking":
        locText = "Commercial parking lots can involve the business, a property owner, a management company, or a maintenance vendor.";
        break;
      case "public":
        locText = "This may involve a city, county, school district, transit agency, or another public entity. Special claim procedures and shorter deadlines may apply, so prompt review can be important.";
        break;
      case "workplace":
        locText = "Workers' compensation, a third-party property claim, or both may need to be considered depending on who controlled or created the dangerous condition.";
        break;
      case "private_res":
        locText = "Private residences can still involve homeowner's insurance, contractors, landlords, or maintenance companies depending on the facts.";
        break;
      case "own_home":
        locText = "A traditional claim against a third-party property owner may be less likely when the incident occurred in a home you own and control. However, a contractor, product, landlord, maintenance company, or another party could still matter depending on the facts.";
        break;
      default:
        locText = "An attorney would first identify who owned, leased, managed, maintained, or controlled the area.";
    }
    bullets.push({
      h: "Who controlled the property",
      p: locText
    });

    // 2. Dangerous condition
    bullets.push({
      h: "The dangerous condition",
      p: "An attorney would look at what the condition was, how it formed, and how long it likely existed before the incident."
    });

    // 3. Notice and warning
    var warnText = "";
    if (answers.warning === "none") {
      warnText = "You indicated no warning was present. An attorney would examine whether a reasonable inspection and cleaning routine would have caught and addressed the condition.";
    } else if (answers.warning === "clear") {
      warnText = "A clear warning was present. An attorney would still examine whether you had a practical reason or necessity to encounter the area, and whether a warning alone was a reasonable response to the danger.";
    } else if (answers.warning === "hard_see" || answers.warning === "no_block") {
      warnText = "A warning of limited effectiveness was present. An attorney would look at whether it actually gave a reasonable opportunity to avoid the danger.";
    } else {
      warnText = "An attorney would look at whether any warning was given, how visible it was, and whether it gave a reasonable opportunity to avoid the danger.";
    }
    bullets.push({
      h: "Notice, warning, and repair",
      p: warnText
    });

    // 4. Injury and treatment
    var injArr = arrify(answers.injuries);
    var serious = injArr.indexOf("surgery") > -1 || injArr.indexOf("fracture") > -1 || injArr.indexOf("hip") > -1 || injArr.indexOf("head") > -1 || injArr.indexOf("back_neck") > -1;
    var injText = serious
      ? "You described a significant injury. Documented, significant injuries are generally more viable for contingency representation. An attorney would review medical records, imaging, and continuing limitations."
      : "An attorney would review what was treated, when, by whom, and whether ongoing symptoms or limitations exist. This situation may still warrant review.";
    bullets.push({ h: "Injury severity and medical documentation", p: injText });

    // 5. Evidence
    var ev = arrify(answers.evidence);
    var hasAny = ev.length && !(ev.length === 1 && ev[0] === "none_yet");
    bullets.push({
      h: "Evidence",
      p: hasAny
        ? "You have at least some evidence. Photos, video, witnesses, surveillance, and incident reports can all matter. Some evidence — especially surveillance video — can disappear quickly."
        : "Limited evidence does not necessarily end a case. An attorney can still request inspection logs, cleaning logs, surveillance, and prior-complaint records before they are deleted."
    });

    return bullets;
  }

  // ── Main controller ────────────────────────────────────────────────────────
  function init(opts) {
    opts = opts || {};
    var hostEl = document.getElementById(opts.hostId || "sf-assessment");
    if (!hostEl) return;
    var variant = opts.variant || "A";
    var variantLabel = "variant_" + variant.toLowerCase();

    // capture utm/gclid for downstream form submit
    captureUrlParams();

    var saved = loadState() || { answers: {}, idx: 0, started: false, variant: variant };
    if (!saved.answers) saved.answers = {};
    if (typeof saved.idx !== "number") saved.idx = 0;
    var state = saved;
    state.variant = variant;

    var currentSteps = visibleSteps(state.answers);
    if (state.idx >= currentSteps.length) state.idx = 0;

    pushEvent("pl_lp_view", { page_variant: variantLabel });

    function paint() {
      currentSteps = visibleSteps(state.answers);
      if (state.idx >= currentSteps.length) state.idx = currentSteps.length - 1;
      if (state.idx < 0) state.idx = 0;
      var step = currentSteps[state.idx];
      hostEl.innerHTML = renderStep(step, state.idx, currentSteps.length, state.answers);

      // restore selections
      restoreSelections(hostEl, step, state.answers);

      // wire phone formatting
      var phoneInput = hostEl.querySelector('input[name="phone"]');
      if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
          var v = e.target.value.replace(/\D/g, "").slice(0, 10);
          if (v.length >= 6)      e.target.value = "(" + v.slice(0,3) + ") " + v.slice(3,6) + "-" + v.slice(6);
          else if (v.length >= 3) e.target.value = "(" + v.slice(0,3) + ") " + v.slice(3);
          else                    e.target.value = v;
        });
      }

      hostEl.querySelector('[data-act="back"]').addEventListener("click", onBack);
      hostEl.querySelector('[data-act="next"]').addEventListener("click", onNext);

      // step view event
      var stepNum = state.idx + 1;
      if (step.type === "contact") {
        pushEvent("pl_contact_step_view", {
          page_variant: variantLabel,
          step_number: stepNum,
          total_steps: currentSteps.length
        });
      } else {
        pushEvent("pl_assessment_step", {
          page_variant: variantLabel,
          step_number: stepNum,
          total_steps: currentSteps.length,
          step_id: step.id
        });
      }

      // focus title for screen readers
      var titleEl = hostEl.querySelector(".sf-step__title");
      if (titleEl) titleEl.setAttribute("tabindex", "-1");
      try { titleEl && titleEl.focus({ preventScroll: false }); } catch (e) { /* noop */ }
    }

    function restoreSelections(rootEl, step, answers) {
      if (step.type === "single") {
        var v = answers[step.id];
        if (v) {
          var picked = rootEl.querySelector('input[name="' + step.id + '"][value="' + cssEscape(v) + '"]');
          if (picked) picked.checked = true;
        }
        if (step.allowOther) {
          var other = answers[step.id + "_other"];
          var otherEl = rootEl.querySelector('input[name="' + step.id + '_other"]');
          if (otherEl && other) otherEl.value = other;
        }
      } else if (step.type === "multi") {
        var arr = arrify(answers[step.id]);
        for (var i = 0; i < arr.length; i++) {
          var p = rootEl.querySelector('input[name="' + step.id + '"][value="' + cssEscape(arr[i]) + '"]');
          if (p) p.checked = true;
        }
      }
    }
    function cssEscape(v) { return String(v).replace(/"/g, '\\"'); }

    function onBack() {
      if (state.idx === 0) return;
      saveStepValueIntoState(true);
      state.idx -= 1;
      saveState(state);
      paint();
    }

    function onNext() {
      var step = currentSteps[state.idx];
      var value = readStepValue(hostEl, step);
      var err = validateStep(step, value, state.answers);
      var helper = hostEl.querySelector("#sf-helper");
      if (err) {
        if (helper) {
          helper.textContent = err;
          helper.classList.add("sf-helper--error");
        }
        return;
      } else if (helper) {
        helper.textContent = "";
        helper.classList.remove("sf-helper--error");
      }
      saveStepValueIntoState(false, value);

      if (!state.started) {
        state.started = true;
        pushEvent("pl_assessment_start", { page_variant: variantLabel });
      }

      currentSteps = visibleSteps(state.answers);
      if (state.idx === currentSteps.length - 1 && step.type === "contact") {
        submit(value.value);
      } else {
        state.idx += 1;
        saveState(state);
        paint();
        try {
          hostEl.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) { /* noop */ }
      }
    }

    function saveStepValueIntoState(silent, prefetched) {
      var step = currentSteps[state.idx];
      var value = prefetched || readStepValue(hostEl, step);
      if (step.type === "single") {
        if (value.value) state.answers[step.id] = value.value;
        if (typeof value.other === "string") state.answers[step.id + "_other"] = value.other;
      } else if (step.type === "multi") {
        state.answers[step.id] = value.value || [];
      } else if (step.type === "contact") {
        var c = value.value || {};
        for (var k in c) state.answers["contact_" + k] = c[k];
      }
      saveState(state);
      if (!silent) {
        // nothing
      }
    }

    function submit(contact) {
      var ans = state.answers;
      var tagsInfo = buildTags(ans);
      pushEvent("pl_assessment_complete", {
        page_variant: variantLabel,
        completion_status: "submitted",
        total_steps: currentSteps.length
      });
      pushEvent("pl_lead_submit", { page_variant: variantLabel });

      var btn = hostEl.querySelector('[data-act="next"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      // Build server payload (sensitive — never goes through dataLayer)
      var tracking = getTrackingParams();
      var payload = {
        _subject: "New CA Slip & Fall Case Check Lead [" + tagsInfo.priority + "]",
        _captcha: "false",
        _template: "table",
        landing_variant: variantLabel,
        landing_page: window.location.pathname,
        landing_url: window.location.href,
        page_language: document.documentElement.lang || "en",
        referrer: document.referrer || "",
        submitted_at: new Date().toISOString(),
        priority_tag: tagsInfo.priority,
        lead_tags: tagsInfo.tags.join(","),
        first_name: contact.first_name,
        last_name: contact.last_name,
        full_name: (contact.first_name + " " + contact.last_name).trim(),
        phone: contact.phone,
        email: contact.email,
        preferred_contact: contact.preferred_contact,
        best_time: contact.best_time,
        story: contact.story,
        consent_contact: contact.consent_contact ? "yes" : "no",
        consent_email_guide: contact.consent_email_guide ? "yes" : "no",
        consent_sms: contact.consent_sms ? "yes" : "no"
      };

      // Add answers as flat fields (server-side only — never logged)
      var answerKeys = [
        "when","where","presence","hazard","hazard_other","visibility","warning",
        "necessity","notice","report","injuries","treatment","evidence"
      ];
      for (var i = 0; i < answerKeys.length; i++) {
        var k = answerKeys[i];
        var v = ans[k];
        if (Object.prototype.toString.call(v) === "[object Array]") v = v.join(", ");
        if (v != null && v !== "") payload["q_" + k] = v;
      }

      // Merge tracking params
      for (var t in tracking) payload[t] = tracking[t];

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      }).then(function () {
        pushEvent("pl_lead_submit_success", { page_variant: variantLabel });
        try { sessionStorage.setItem(SUBMIT_MARK_KEY, "1"); } catch (e) { /* noop */ }
        // Pass the bullets via sessionStorage (no PII) for the results page.
        try {
          var bullets = buildPersonalizedResults(ans, tagsInfo);
          sessionStorage.setItem("ial_pl_results_v1", JSON.stringify({
            bullets: bullets,
            location: ans.where,
            consent_email_guide: contact.consent_email_guide ? 1 : 0
          }));
        } catch (e) { /* noop */ }
        clearState();
        window.location.href = RESULTS_PATH;
      }).catch(function () {
        pushEvent("pl_lead_submit_error", { page_variant: variantLabel });
        if (btn) { btn.disabled = false; btn.textContent = "Submit my answers"; }
        var helper = hostEl.querySelector("#sf-helper");
        if (helper) {
          helper.innerHTML = 'We could not submit your request. Please call <a href="tel:' + PHONE + '" data-callrail-phone="' + PHONE + '">' + PHONE + '</a> or try again.';
          helper.classList.add("sf-helper--error");
        }
      });
    }

    paint();

    // Phone click + video tracking, scoped to the page
    document.addEventListener("click", function (e) {
      var t = e.target;
      var a = t && t.closest ? t.closest('a[href^="tel:"]') : null;
      if (a) {
        pushEvent("pl_click_to_call", {
          page_variant: variantLabel,
          placement: a.getAttribute("data-placement") || "page",
          cta_location: a.getAttribute("data-cta-location") || "unknown"
        });
      }
    }, true);
  }

  // ── Video facade ───────────────────────────────────────────────────────────
  function initVideoFacades() {
    var nodes = document.querySelectorAll("[data-video-facade]");
    for (var i = 0; i < nodes.length; i++) (function (el) {
      var id = el.getAttribute("data-video-id");
      if (!id) return;
      var title = el.getAttribute("data-video-title") || "Educational video";
      var btn = el.querySelector("[data-video-play]");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&modestbranding=1&playsinline=1");
        iframe.setAttribute("title", title);
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("frameborder", "0");
        iframe.style.position = "absolute";
        iframe.style.inset = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        el.innerHTML = "";
        el.appendChild(iframe);
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "pl_video_start", placement: el.getAttribute("data-placement") || "page" });
        } catch (e) { /* noop */ }
      }, { once: true });

      // preview view event
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "pl_video_preview", placement: el.getAttribute("data-placement") || "page" });
      } catch (e) { /* noop */ }
    })(nodes[i]);
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.IALSlipFall = {
    init: init,
    initVideoFacades: initVideoFacades,
    buildPersonalizedResults: buildPersonalizedResults,
    pushEvent: pushEvent
  };

  // Auto-init on DOM ready if the host element exists
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoBoot);
  } else {
    autoBoot();
  }
  function autoBoot() {
    var host = document.getElementById("sf-assessment");
    if (host) {
      var variant = host.getAttribute("data-variant") || "A";
      init({ hostId: "sf-assessment", variant: variant });
    }
    initVideoFacades();

    // Engagement signals (no PII)
    var fired30s = false;
    setTimeout(function () { if (!fired30s) { fired30s = true; pushEvent("pl_engaged_30s"); } }, 30000);
    var scroll90Fired = false;
    window.addEventListener("scroll", function () {
      if (scroll90Fired) return;
      var sh = document.documentElement.scrollHeight || 1;
      if ((window.scrollY + window.innerHeight) / sh >= 0.9) {
        scroll90Fired = true;
        pushEvent("pl_scroll_90");
      }
    }, { passive: true });
  }
})();
