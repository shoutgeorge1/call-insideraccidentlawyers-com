/**
 * Generates 5 premises-liability PPC landings from nursing-home-neglect/index.html.
 * Run from repo root: node scripts/generate-premises-landings.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const basePath = path.join(root, "nursing-home-neglect", "index.html");
let base = fs.readFileSync(basePath, "utf8");

function escAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

const IMG = {
  cracked: "/images/premises-lp/cracked_tile_outside_shopping.png",
  wet: "/images/premises-lp/wet_stone_outdoor_shopping.png",
  attorney: "/images/premises-lp/middle_aged_man_ankle_cast_attorney.png",
  grocery: "/images/premises-lp/grocery_store_water_woman_hurt_clerk_helping.png",
  walker: "/images/premises-lp/older_woman_daughter_foot_cast_walker.png",
  knee: "/images/premises-lp/middle_aged_man_with_wife_hurt_knee.png",
};

const PLANNED_IMAGE_DIR = "/images/premises-lp/";

function publicPathExists(publicPath) {
  if (!publicPath) return false;
  return fs.existsSync(path.join(root, publicPath.replace(/^\//, "")));
}

function getImage(slot, fallback) {
  if (!slot) return fallback;
  const publicPath = slot.startsWith("/") ? slot : `${PLANNED_IMAGE_DIR}${slot}`;
  return publicPathExists(publicPath) ? publicPath : fallback;
}

const HERO_CONFIG = {
  heroAttorneyPreferred: getImage(
    "shawn-premises-hero.png",
    publicPathExists("/images/la/Male-Attorney-Reviewing-Paperwork-with-injured-male-client.png")
      ? "/images/la/Male-Attorney-Reviewing-Paperwork-with-injured-male-client.png"
      : publicPathExists("/images/la/shawn-hero-temp.jpg")
        ? "/images/la/shawn-hero-temp.jpg"
        : publicPathExists("/images/la/attorney-hero-400.webp")
        ? "/images/la/attorney-hero-400.webp"
        : null
  ),
  heroTeamPreferred: getImage("attorney-team-premises-hero.png", null),
  heroConsultationFallback: getImage("attorneys-consultation-premises-hero.png", IMG.attorney),
};

function heroImageForPage(page) {
  const pageSpecific = getImage(page.heroPlannedImage, page.heroHazardFallback || page.heroImg);
  const selected = page.heroUseAttorney
    ? HERO_CONFIG.heroAttorneyPreferred ||
      HERO_CONFIG.heroTeamPreferred ||
      HERO_CONFIG.heroConsultationFallback ||
      pageSpecific
    : pageSpecific ||
      HERO_CONFIG.heroConsultationFallback ||
      HERO_CONFIG.heroAttorneyPreferred ||
      page.heroHazardFallback ||
      page.heroImg;
  return {
    src: selected,
    alt:
      selected === HERO_CONFIG.heroAttorneyPreferred
        ? "Attorney reviewing unsafe property injury case with injured client"
        : selected === HERO_CONFIG.heroConsultationFallback
          ? "Attorney speaking with injured client after property accident"
          : page.heroImgAlt,
  };
}

function icon(name, className = "prem-icon") {
  const icons = {
    storefront:
      '<path d="M4 10h16l-1-5H5l-1 5Z"/><path d="M6 10v9h12v-9"/><path d="M9 19v-5h6v5"/><path d="M4 10c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2"/>',
    shoppingCart:
      '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H7"/>',
    droplet: '<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/>',
    warningTriangle: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    box: '<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
    doorway: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M10 12h.01"/><path d="M4 21h16"/>',
    car: '<path d="M5 16h14"/><path d="M7 16l1.4-5.2A2.5 2.5 0 0 1 10.8 9h2.4a2.5 2.5 0 0 1 2.4 1.8L17 16"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/><path d="M6 13h12"/>',
    building: '<path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16"/><path d="M9 21v-5h3v5"/><path d="M8 7h1"/><path d="M12 7h1"/><path d="M8 11h1"/><path d="M12 11h1"/><path d="M2 21h20"/>',
    clipboard: '<path d="M9 4h6l1 2h2v15H6V6h2l1-2Z"/><path d="M9 10h6"/><path d="M9 14h6"/><path d="M9 18h4"/>',
    fileText: '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h4"/><path d="M9 13h6"/><path d="M9 17h6"/>',
    camera: '<path d="M4 8h4l1.5-2h5L16 8h4v11H4V8Z"/><circle cx="12" cy="13.5" r="3"/>',
    video: '<path d="M4 7h11v10H4V7Z"/><path d="m15 11 5-3v8l-5-3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="8" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.8"/><path d="M16 4.2a4 4 0 0 1 0 7.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.1 5.1L3 18l3 3 6.6-6.6a4 4 0 0 0 5.1-5.1l-2.8 2.8-3-3 2.8-2.8Z"/>',
    shieldCheck: '<path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
    gavel: '<path d="m14 5 5 5"/><path d="m12 7 5 5"/><path d="M4 20h7"/><path d="m2 22 7-7"/><path d="m7 10 5-5 7 7-5 5-7-7Z"/>',
    medicalCross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"/>',
    ambulance: '<path d="M4 17V7h9v10"/><path d="M13 10h4l3 4v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M8 10h3"/><path d="M9.5 8.5v3"/>',
    bone: '<path d="M7 6a3 3 0 1 1 3 3l5 5a3 3 0 1 1 3 3 3 3 0 1 1-3 3l-5-5a3 3 0 1 1-3-3 3 3 0 1 1 0-6Z"/>',
    hospital: '<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/><path d="M9 21v-6h6v6"/><path d="M12 7v5"/><path d="M9.5 9.5h5"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 6.5C15.9 5.5 14.3 5 12.7 5 10 5 8 6.3 8 8.4c0 4.2 8.5 2 8.5 6.6 0 2.1-2 3.5-4.7 3.5-1.9 0-3.6-.6-4.8-1.8"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    mapPin: '<path d="M12 21s7-5.3 7-11a7 7 0 0 0-14 0c0 5.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8 14a6 6 0 1 1 8 0c-.8.7-1 1.5-1 2H9c0-.5-.2-1.3-1-2Z"/>',
    stairs: '<path d="M4 19h16"/><path d="M4 19v-4h4v-4h4V7h4V3h4"/>',
    insurance: '<path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    fileSearch: '<path d="M6 3h8l4 4v7"/><path d="M14 3v5h4"/><path d="M9 13h4"/><circle cx="15" cy="17" r="3"/><path d="m18 20 2 2"/>',
  };
  return `<svg class="${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.warningTriangle}</svg>`;
}

function inferIcon(text) {
  const t = text.toLowerCase();
  if (t.includes("grocery") || t.includes("cart")) return "shoppingCart";
  if (t.includes("store") || t.includes("retail")) return "storefront";
  if (t.includes("wet") || t.includes("spill")) return "droplet";
  if (t.includes("merchandise") || t.includes("box") || t.includes("falling")) return "box";
  if (t.includes("entrance") || t.includes("door")) return "doorway";
  if (t.includes("parking") || t.includes("pavement") || t.includes("pothole")) return "car";
  if (t.includes("hotel") || t.includes("restaurant") || t.includes("apartment") || t.includes("property") || t.includes("business") || t.includes("building")) return "building";
  if (t.includes("incident") || t.includes("report") || t.includes("clipboard")) return "clipboard";
  if (t.includes("surveillance") || t.includes("video")) return "video";
  if (t.includes("photo") || t.includes("camera")) return "camera";
  if (t.includes("witness")) return "users";
  if (t.includes("maintenance") || t.includes("repair")) return "wrench";
  if (t.includes("insurance") || t.includes("coverage") || t.includes("recovery")) return "shieldCheck";
  if (t.includes("medical") || t.includes("treatment") || t.includes("hospital")) return "medicalCross";
  if (t.includes("surgery") || t.includes("fracture") || t.includes("broken")) return "bone";
  if (t.includes("lighting") || t.includes("light")) return "lightbulb";
  if (t.includes("stairs") || t.includes("handrail") || t.includes("rail")) return "stairs";
  if (t.includes("responsibility") || t.includes("trial") || t.includes("negligence")) return "gavel";
  if (t.includes("third-party") || t.includes("subcontractor") || t.includes("vendor")) return "building";
  if (t.includes("documentation") || t.includes("osha")) return "clipboard";
  return "warningTriangle";
}

function accidentGrid(items, accentImages = [], caseCardImages = null) {
  return items
    .map((t, i) => {
      const cardImg = caseCardImages && caseCardImages[i];
      const accent = accentImages[i % accentImages.length];
      if (cardImg) {
        return `                <div class="accident-item premium-service-card accident-item--photo-card">
                    <div class="accident-item-photo-wrap">
                        <img src="${cardImg.src}" alt="${escAttr(
                          cardImg.alt
                        )}" class="accident-item-photo" loading="lazy" decoding="async" width="640" height="400">
                    </div>
                    <div class="accident-item-body">
                        <div class="premium-icon-badge">${icon(inferIcon(t))}</div>
                        <div class="accident-item-text">${t}</div>
                    </div>
                </div>`;
      }
      return `                <div class="accident-item premium-service-card">
                    <div class="premium-icon-badge">${icon(inferIcon(t))}</div>
                    <div class="accident-item-text">${t}</div>${
                      accent
                        ? `
                    <img src="${accent.src}" alt="${escAttr(
                            accent.alt
                          )}" loading="lazy" decoding="async" width="96" height="64" style="margin-left:auto;border-radius:10px;object-fit:cover;width:96px;height:64px;box-shadow:0 8px 16px rgba(12,35,52,.14);">`
                        : ""
                    }
                </div>`;
    })
    .join("\n");
}

/** Premium case cards: 16:9 image, title, one-line description (construction PPC). */
function accidentGridFromCasesCards(cards) {
  return cards
    .map(
      (c) => `                <div class="accident-item premium-service-card accident-item--photo-card accident-item--case-detail">
                    <div class="accident-item-photo-wrap accident-item-photo-wrap--169">
                        <img src="${c.image.src}" alt="${escAttr(
        c.image.alt
      )}" class="accident-item-photo" loading="lazy" decoding="async" width="640" height="360">
                    </div>
                    <div class="accident-item-body accident-item-body--stack">
                        <div class="accident-item-title-row">
                            <div class="premium-icon-badge">${icon(inferIcon(`${c.title} ${c.description || ""}`))}</div>
                            <div class="accident-item-text accident-item-text--title">${c.title}</div>
                        </div>
                        <p class="accident-item-desc">${c.description}</p>
                    </div>
                </div>`
    )
    .join("\n");
}

function buildCompensationDamagesSection(p) {
  const img = p.compHeroImage;
  const items = p.compDamageItems;
  const gallery = Array.isArray(p.compGalleryImages)
    ? p.compGalleryImages
        .map(
          (g) => `                    <figure class="comp-damage-gallery__item">
                        <img src="${g.src}" alt="${escAttr(g.alt)}" loading="lazy" decoding="async" width="640" height="360">
                    </figure>`
        )
        .join("\n")
    : "";
  return `    <section class="section-with-bg">
        <div class="container">
            <div class="section-content comp-damage-lead-section">
                <h2 style="text-align: center;">${p.compH2}</h2>
                <p class="lead-text subtext-muted" style="text-align: center; margin-bottom: 28px; max-width: 820px; margin-left: auto; margin-right: auto;">${p.compLead}</p>
                <figure class="comp-damage-hero-figure" style="max-width: 720px; margin: 0 auto 32px;">
                    <img src="${img.src}" alt="${escAttr(img.alt)}" width="960" height="540" loading="lazy" decoding="async" style="width:100%;height:auto;border-radius: var(--card-radius); object-fit: cover; aspect-ratio: 16/9;">
                </figure>
                ${gallery ? `                <div class="comp-damage-gallery">
${gallery}
                </div>` : ""}
                <div class="comp-damage-grid">
${items
  .map(
    ([title, body]) => `                    <div class="comp-damage-card">
                        <h3 class="comp-damage-card__h">${title}</h3>
                        <p class="comp-damage-card__p">${body}</p>
                    </div>`
  )
  .join("\n")}
                </div>
                <p class="comp-damage-disclaimer" style="text-align:center;font-size:14px;color:var(--brand-gray-600);max-width:800px;margin:24px auto 0;line-height:1.6;">${p.compDisclaimer}</p>
                ${compactCta(p)}
            </div>
        </div>
    </section>`;
}

function htmlWhySection(p) {
  return `    <section class="core-trust section-with-bg section-alt">
        <div class="container">
            <h2 style="text-align: center; font-size: 42px; margin-bottom: 24px;">${p.whyH2}</h2>
            <p class="subtext-muted" style="text-align: center; font-size: 20px; color: var(--brand-gray-700); margin-bottom: 56px; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.7;">${p.whyIntro}</p>
            <div class="trust-grid">
${buildWhyCards(p.whyCards)}
            </div>
        </div>
    </section>`;
}

function htmlProcessSection(p) {
  const featH3 = p.investigationFeatureH3 || "Evidence-first case review";
  const featP =
    p.investigationFeatureP ||
    "Property injury claims often turn on fast evidence preservation, medical documentation, and identifying the business, owner, landlord, or maintenance company that controlled the hazard.";
  const footer =
    p.processFooterHint ||
    `Questions about your jobsite incident? Call <a href="tel:844-467-4335" style="color: var(--brand-blue); text-decoration: none; font-weight: 800; font-size: 1.2em; letter-spacing: 0.02em;"${phoneDataAttr(
      p
    )}><span data-callrail-phone="844-467-4335">844-467-4335</span></a> | Available 24/7`;
  return `    <section class="process-section section-with-bg">
        <div class="container">
            <h2 style="text-align: center;">${p.investigateH2}</h2>
            <p class="lead-text subtext-muted" style="text-align: center; margin-bottom: 32px;">${p.investigateIntro}</p>
            <div class="investigation-feature">
                <img src="${getImage(p.investigationPlannedImage || "attorneys-consultation-premises-hero.png", HERO_CONFIG.heroConsultationFallback)}" alt="${escAttr(
                  p.investigationFeatureAlt || "Attorney reviewing unsafe property injury evidence with client"
                )}" width="420" height="315" loading="lazy" decoding="async">
                <div>
                    <h3>${featH3}</h3>
                    <p>${featP}</p>
                </div>
            </div>
            <div class="process-steps process-steps--with-images">
${buildInvestigateSteps(p.investigateSteps)}
            </div>
            ${compactCta(p)}
            <div style="text-align: center; margin-top: 48px;">
                <p style="margin-top: 16px; color: var(--brand-gray-700);">${footer}</p>
            </div>
        </div>
    </section>`;
}

function processStep(n, title, body, imgSrc, imgAlt) {
  const stepIcon = inferIcon(`${title} ${body}`);
  return `                <div class="process-step premium-process-card">
                    <div class="process-card-head">
                        <div class="process-step-number">${n}</div>
                        <div class="premium-icon-badge">${icon(stepIcon)}</div>
                    </div>
                    <h3>${title}</h3>
                    <p>${body}</p>
                </div>`;
}

function buildPages() {
  return [
    {
      slug: "retail-store-injury-lawyer-california",
      bodyAttrs: 'data-page-type="retail_store_injury" data-ad-group="AG | Retail Store Injury"',
      title: "Store Injury Lawyer California | Retail & Grocery Injury Claims",
      metaDesc:
        "Seriously injured at a grocery store, retail business, Target, Walmart, restaurant, or hotel? Free case review for unsafe property injuries. No fee unless we win.",
      canonical: "https://call.insideraccidentlawyers.com/retail-store-injury-lawyer-california",
      h1: "Injured At A Store Or Business?",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Hurt at a store or business?</span> We review serious injury cases with medical treatment and a clear property connection.',
      heroReframe:
        "We look for the hazard, the evidence, and the insurance path.",
      heroImg: IMG.grocery,
      heroImgAlt: "Injured shopper after wet floor hazard in grocery store",
      heroPlannedImage: "retail-store-injury-hero.png",
      heroHazardFallback: IMG.grocery,
      heroUseAttorney: true,
      heroCaption: "Retail & grocery store injury claims",
      trustH2: "Retail Store Injury Attorneys",
      trustSub:
        "Grocery stores, big-box retailers, restaurants, and hotels owe visitors a reasonably safe premises.<br><br>When spills, broken mats, unsafe entrances, or falling stock contribute to a serious injury, we review liability, insurance, and evidence.",
      formSubject: "New Retail / Store Injury Lead (CA)",
      formH2: "Free Case Review — Store Or Retail Injury",
      formIntro:
        "Tell us where you were hurt and what treatment you received. An attorney reviews serious store and retail injury matters at no cost.",
      situationOptions: [
        ["Grocery store injury", "Grocery store injury"],
        ["Retail store injury", "Retail store injury"],
        ["Big-box store injury", "Big-box store injury"],
        ["Restaurant or hotel injury", "Restaurant or hotel injury"],
        ["Wet floor or spill", "Wet floor or spill"],
        ["Falling merchandise", "Falling merchandise"],
        ["Unsafe entrance", "Unsafe entrance"],
        ["Parking lot connected to a business", "Parking lot connected to a business"],
        ["Broken hip / fracture / surgery", "Broken hip / fracture / surgery"],
        ["Other serious store injury", "Other serious store injury"],
      ],
      casesH2: "Business Injury Cases We Review",
      casesLead: "Commercial insurance may apply when a business controls the property. We review high-impact injuries—not minor bumps with no care.",
      casesItems: [
        "Grocery and retail stores",
        "Big-box and national chains",
        "Restaurants and hotels",
        "Wet floors, spills, and broken mats",
        "Unsafe entrances tied to the business",
        "Falling merchandise and cluttered aisles",
      ],
      hazardsH2: "Common Store And Retail Hazards",
      hazardsLead: "Dangerous conditions are often preventable when staff inspect, clean, repair, and warn in a reasonable time.",
      hazardsFigure: {
        src: IMG.attorney,
        alt: "Attorney speaking with injured client after property accident",
        caption: "We review reports, footage, and maintenance practices tied to the incident.",
      },
      hazardsSecondFigure: {
        src: IMG.walker,
        alt: "Family member supporting injured adult after serious fall",
        caption: "Serious store injuries often mean surgery, bracing, and a long recovery—we review medical records with your story.",
      },
      signsH2: "Signs You May Have A Store Injury Case",
      signsIntro: "Tap what applies. Stronger cases usually combine a clear hazard, a business connection, and documented injury.",
      signsItems: [
        "There was a dangerous condition you could photograph or describe (spill, trip hazard, poor lighting, broken flooring)",
        "The injury happened on store, restaurant, hotel, or connected business property",
        "You received medical treatment (ER, urgent care, hospital, surgery, or ongoing care)",
        "The injury is serious (fracture, head injury, back injury, broken hip, knee/ankle injury with treatment)",
        "You have photos, witnesses, an incident report, or possible surveillance",
        "It appears the business failed to clean, repair, inspect, or warn within a reasonable time",
        "There may be commercial insurance or a clear path to pursue damages",
      ],
      checklistDefault:
        "Strong store cases often hinge on timing: when the hazard existed, when staff knew or should have known, and what they did next.",
      checklistOne:
        "If one or more items apply, speak with an attorney about preserving video and records.",
      checklistMany:
        "Multiple items often support a serious retail or business injury claim. Request a free case review.",
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "Premises cases are stronger when harm is serious and documented. Hospitalization, surgery, fractures, broken hips, head or back injuries, ambulance or ER visits, and ongoing treatment usually warrant deeper fact and insurance review.",
      evidenceTitle: "Evidence That Can Matter",
      evidenceItems: [
        "Photos of the hazard and scene",
        "Store or business incident reports",
        "Witness names and statements",
        "Surveillance video (request preservation early)",
        "Maintenance, inspection, and repair records",
        "Prior complaints about the same area",
        "Property ownership and tenant information",
        "Business or property insurance identifiers",
        "Medical records and treatment timeline",
        "Timeline of notice and failure to fix or warn",
      ],
      investigateH2: "How We Investigate Store Injury Claims",
      investigateIntro: "We build a structured factual picture before talking resolution with insurers.",
      investigateSteps: [
        {
          title: "Accident or incident report review",
          body: "We obtain and review reports you filed or that the business generated.",
          img: IMG.grocery,
          alt: "Injured shopper after wet floor hazard in grocery store",
        },
        {
          title: "Photo and video evidence",
          body: "Scene images, store footage, and body-worn or bystander video when available.",
          img: IMG.attorney,
          alt: "Attorney speaking with injured client after property accident",
        },
        {
          title: "Surveillance preservation",
          body: "We work to prevent loss of critical footage that may auto-delete.",
          img: null,
          alt: "",
        },
        {
          title: "Witness statements",
          body: "Employees, shoppers, and first responders may corroborate conditions and response time.",
          img: null,
          alt: "",
        },
        {
          title: "Maintenance and repair history",
          body: "Cleaning logs, work orders, and vendor contracts can show what the business knew.",
          img: null,
          alt: "",
        },
        {
          title: "Responsibility analysis",
          body: "We analyze store operator, landlord, and maintenance roles when multiple parties are involved.",
          img: null,
          alt: "",
        },
        {
          title: "Medical record review",
          body: "Treatment records help tie the mechanism of injury to the incident.",
          img: IMG.walker,
          alt: "Family member supporting injured adult after serious fall",
        },
        {
          title: "Insurance and recovery path",
          body: "We map commercial coverage and realistic recovery paths under California law.",
          img: null,
          alt: "",
        },
      ],
      compH2: "Compensation In Store Injury Cases",
      compLead:
        "Depending on facts, damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, and wrongful death damages where applicable. Every case depends on its facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after injury"],
        ["Lost income", "/images/la/attorney-paperwork.png", "Attorney reviewing case documents with client"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after serious injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "How we handle serious property and business injury matters:",
      whyCards: [
        ["Trial-ready strategy from day one", "We prepare for trial so insurers and corporate defendants take the claim seriously."],
        ["No fee unless we win", "Contingency fees—no upfront attorney fees unless we recover for you."],
        ["Direct attorney access", "You work with experienced attorneys focused on evidence and treatment timelines."],
        ["Evidence preservation", "Reports, footage, and maintenance documents are time-sensitive—we act quickly."],
        ["Serious injury focus", "We prioritize cases with real treatment, clear hazards, and identifiable coverage."],
        ["Insurers and property owners", "Former insurance-side insight helps us anticipate defense and coverage arguments."],
      ],
      howMuchTitle: "No Two Store Injury Cases Are The Same",
      howMuchBody:
        "Value depends on medical needs, lost earnings, strength of liability, available coverage, and how clearly the hazard and notice are proven. We give honest guidance after reviewing your records and the scene information.",
      finalH2: "Speak With A Store Injury Lawyer Today",
      finalP:
        "If you were seriously hurt at a store or retail business, request a free case review before evidence disappears. We explain options in plain English—no pressure.",
      footerBlurb:
        "California personal injury attorneys for serious store, retail, and business property injuries. Attorney advertising.",
      preloadHref: IMG.grocery,
      checklistResultId: "case-checklist-result",
    },
    {
      slug: "parking-lot-walkway-injury-lawyer-california",
      bodyAttrs: 'data-page-type="parking_walkway_injury" data-ad-group="AG | Parking Lot Walkway Injury"',
      title: "Parking Lot Injury Lawyer California | Unsafe Walkway Claims",
      metaDesc:
        "Injured in a parking lot, unsafe walkway, cracked pavement, poor lighting, or business entrance hazard? Free case review. No fee unless we win.",
      canonical: "https://call.insideraccidentlawyers.com/parking-lot-walkway-injury-lawyer-california",
      h1: "Hurt In A Parking Lot Or Walkway?",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Hurt in a lot or walkway?</span> We review serious injuries tied to hazards, poor lighting, and unsafe entrances.',
      heroReframe:
        "We focus on private and commercial property with a realistic insurance path.",
      heroImg: IMG.wet,
      heroImgAlt: "Wet walkway outside a commercial property",
      heroPlannedImage: "parking-lot-injury-hero.png",
      heroHazardFallback: IMG.wet,
      heroUseAttorney: true,
      heroCaption: "Parking lot and walkway injury claims",
      trustH2: "Parking Lot Injury Attorneys",
      trustSub:
        "Stores, apartments, hotels, and businesses must maintain reasonably safe exterior areas.<br><br>When potholes, poor lighting, broken pavement, or wet surfaces cause serious harm, we review ownership, maintenance contracts, and coverage.",
      formSubject: "New Parking Lot / Walkway Injury Lead (CA)",
      formH2: "Free Case Review — Parking Lot Or Walkway",
      formIntro:
        "Describe the hazard, where it happened, and your medical treatment. We review serious parking lot and walkway injuries.",
      situationOptions: [
        ["Parking lot injury", "Parking lot injury"],
        ["Unsafe walkway", "Unsafe walkway"],
        ["Uneven pavement", "Uneven pavement"],
        ["Poor lighting", "Poor lighting"],
        ["Wet outdoor surface", "Wet outdoor surface"],
        ["Business entrance injury", "Business entrance injury"],
        ["Apartment parking lot injury", "Apartment parking lot injury"],
        ["Hotel parking lot injury", "Hotel parking lot injury"],
        ["Broken hip / fracture / surgery", "Broken hip / fracture / surgery"],
        ["Other serious parking lot injury", "Other serious parking lot injury"],
      ],
      casesH2: "Parking Lot And Walkway Cases We Review",
      casesLead: "We look for serious injury tied to a condition the owner or contractor should have addressed—not scrapes with no care.",
      casesItems: [
        "Store and retail parking areas",
        "Hotel and restaurant lots",
        "Apartment and condo parking",
        "Cracked pavement and potholes",
        "Poor lighting along paths and stairs",
        "Wet or uneven walking surfaces",
      ],
      hazardsH2: "Common Parking Lot And Walkway Hazards",
      hazardsLead: "Exterior hazards often repeat until inspection, repair, or warning fixes the risk.",
      hazardsFigure: {
        src: IMG.cracked,
        alt: "Broken tile near a business entrance",
        caption: "Broken pavement, failed drains, and uneven transitions cause preventable falls.",
      },
      signsH2: "Signs You May Have A Parking Lot Injury Case",
      signsIntro: "Select what fits your situation. Documentation and timing matter for exterior claims.",
      signsItems: [
        "A clear hazard (pothole, uneven concrete, broken surface, pooled water, missing lighting)",
        "The fall occurred on private or commercial property you were invited to use",
        "Medical treatment documents a serious injury",
        "You needed ER, imaging, surgery, hospitalization, or ongoing therapy",
        "Photos, incident reports, witnesses, or security footage may exist",
        "The condition appears neglected—no repair, poor lighting, or no warning",
        "A business, landlord, hotel, or contractor may carry liability insurance",
      ],
      checklistDefault:
        "Exterior cases often turn on maintenance records, prior complaints, and lighting or drainage design.",
      checklistOne: "If an item applies, consider a free review before repairs erase the condition.",
      checklistMany: "Several factors may support a serious parking lot or walkway claim. Request a free case review.",
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "Premises cases are stronger when harm is serious and documented. Hospitalization, surgery, fractures, broken hips, head or back injuries, ambulance or ER visits, and ongoing treatment usually warrant deeper fact and insurance review.",
      evidenceTitle: "Evidence That Can Matter",
      evidenceItems: [
        "Photos of the hazard and lighting at the time of day of the fall",
        "Incident or security reports",
        "Witness names",
        "Surveillance from lot or entrance cameras",
        "Maintenance, sweeping, and repair logs",
        "Prior complaints to management",
        "Property ownership and management contracts",
        "Commercial or landlord insurance information",
        "Medical records",
        "Timeline of notice and failure to repair or warn",
      ],
      investigateH2: "How We Investigate Parking Lot Injury Claims",
      investigateIntro: "We focus on conditions, control, and coverage—not generic blame.",
      investigateSteps: [
        { title: "Accident or incident report review", body: "Police, store, or property reports and EMS run sheets.", img: IMG.wet, alt: "Wet walkway outside a commercial property" },
        { title: "Photo and video evidence", body: "Scene photos, cell video, and available lot cameras.", img: IMG.cracked, alt: "Broken tile near a business entrance" },
        { title: "Surveillance preservation", body: "We seek to stop auto-deletion of critical footage.", img: null, alt: "" },
        { title: "Witness statements", body: "Patrons, tenants, and employees who saw the area or response.", img: null, alt: "" },
        { title: "Maintenance and inspection records", body: "Contracts, work orders, and prior repairs for the lot or walkway.", img: null, alt: "" },
        { title: "Responsibility analysis", body: "Owner, management company, snow/landscape vendor, or contractor roles.", img: null, alt: "" },
        { title: "Medical record review", body: "Mechanism of injury and treatment linked to the fall.", img: IMG.attorney, alt: "Attorney speaking with injured client after property accident" },
        { title: "Insurance and recovery path", body: "Commercial, landlord, or umbrella coverage review under the facts.", img: null, alt: "" },
      ],
      compH2: "Compensation In Parking Lot Injury Cases",
      compLead:
        "Potential damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, and wrongful death damages where applicable. Every case depends on its facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after injury"],
        ["Lost income", "/images/la/attorney-paperwork.png", "Attorney reviewing case documents with client"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after serious injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "Serious exterior injury claims need fast action and trial discipline:",
      whyCards: [
        ["Trial-ready strategy from day one", "We prepare for trial so property defendants and insurers engage seriously."],
        ["No fee unless we win", "Contingency representation—no upfront attorney fees unless we recover for you."],
        ["Direct attorney access", "Attorneys who focus on scene evidence, standards, and medical proof."],
        ["Evidence preservation", "We prioritize photos, video holds, and maintenance requests early."],
        ["Serious injury focus", "We review cases with real treatment—not soreness alone."],
        ["Insurers and property owners", "Experience negotiating with carriers and corporate counsel."],
      ],
      howMuchTitle: "What Your Case May Involve",
      howMuchBody:
        "Outcomes depend on liability strength, injury severity, lost earnings, and available policy limits. We discuss realistic ranges after reviewing facts and records.",
      finalH2: "Speak With A Parking Lot Injury Lawyer Today",
      finalP:
        "If a lot or walkway hazard caused a serious injury, ask for a free case review. Early steps help preserve footage and maintenance history.",
      footerBlurb:
        "California attorneys for serious parking lot and walkway injuries on commercial and private property. Attorney advertising.",
      preloadHref: IMG.wet,
      checklistResultId: "case-checklist-result",
    },
    {
      slug: "unsafe-stairs-flooring-injury-lawyer-california",
      bodyAttrs: 'data-page-type="unsafe_stairs_flooring_injury" data-ad-group="AG | Unsafe Stairs Flooring Injury"',
      title: "Unsafe Stairs Injury Lawyer California | Broken Flooring Claims",
      metaDesc:
        "Seriously injured by unsafe stairs, broken flooring, loose handrails, poor lighting, or uneven walkways? Free case review. No fee unless we win.",
      canonical: "https://call.insideraccidentlawyers.com/unsafe-stairs-flooring-injury-lawyer-california",
      h1: "Injured By Unsafe Stairs Or Flooring?",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Unsafe stairs or flooring caused an injury?</span> We review defects, notice, treatment, and coverage.',
      heroReframe:
        "Broken flooring, poor lighting, and loose rails need quick evidence review.",
      heroImg: IMG.cracked,
      heroImgAlt: "Broken tile near a business entrance",
      heroPlannedImage: "unsafe-stairs-injury-hero.png",
      heroHazardFallback: IMG.cracked,
      heroUseAttorney: true,
      heroCaption: "Unsafe stairs, flooring, and lighting claims",
      trustH2: "Unsafe Stairs And Flooring Injury Attorneys",
      trustSub:
        "Apartments, hotels, stores, and offices must address broken stairs, loose rails, failed lighting, and floor defects.<br><br>When those failures cause fractures, head injuries, or surgery, we investigate standards, notice, and repair timelines.",
      formSubject: "New Unsafe Stairs / Flooring Injury Lead (CA)",
      formH2: "Free Case Review — Stairs, Flooring, Or Lighting",
      formIntro:
        "Describe the defect, where you fell, and your medical care. We review serious stair and flooring injury cases.",
      situationOptions: [
        ["Unsafe stairs", "Unsafe stairs"],
        ["Broken stairs", "Broken stairs"],
        ["Loose handrail", "Loose handrail"],
        ["Broken flooring", "Broken flooring"],
        ["Uneven floor", "Uneven floor"],
        ["Poor lighting", "Poor lighting"],
        ["Unsafe entrance", "Unsafe entrance"],
        ["Apartment stairs", "Apartment stairs"],
        ["Broken hip / fracture / surgery", "Broken hip / fracture / surgery"],
        ["Other serious flooring/stairs injury", "Other serious flooring/stairs injury"],
      ],
      casesH2: "Unsafe Stairs, Flooring, And Lighting Cases We Review",
      casesLead: "We prioritize defects someone in charge should have fixed or warned about—and injuries that required real treatment.",
      casesItems: [
        "Broken or uneven stairs",
        "Loose or missing handrails",
        "Cracked tile and failed transitions",
        "Worn or torn carpeting",
        "Poor lighting on steps and landings",
        "Hotel, retail, and apartment common areas",
      ],
      hazardsH2: "Dangerous Property Conditions That Cause Falls",
      hazardsLead: "Building codes, leases, and maintenance contracts often show who must inspect and repair.",
      hazardsFigure: {
        src: IMG.knee,
        alt: "Adult at home recovering from knee injury with family support",
        caption: "Serious fall injuries often require surgery, bracing, and rehabilitation.",
      },
      signsH2: "Signs You May Have An Unsafe Stairs Or Flooring Case",
      signsIntro: "Tap items that match. Strong cases connect a visible defect to serious harm and treatment.",
      signsItems: [
        "A specific defect (broken step, loose rail, uneven tile, torn carpet, burned-out lights)",
        "The location is stairs, hallway, entrance, or interior common area of a business or residential building",
        "Medical records show fracture, head injury, surgery, hospitalization, or ongoing care",
        "The injury is serious and tied to the fall mechanism",
        "Photos, video, or witnesses document the condition",
        "There are signs the owner knew or should have known (prior complaints, worn materials, missing bulbs)",
        "Liability or property insurance may respond for the responsible party",
      ],
      checklistDefault:
        "Stair and flooring cases often rely on building standards, maintenance logs, and prior inspections.",
      checklistOne: "If a defect matches your fall, speak with counsel about preserving the scene.",
      checklistMany: "Multiple items may support a serious unsafe property claim. Request a free case review.",
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "Premises cases are stronger when harm is serious and documented. Hospitalization, surgery, fractures, broken hips, head or back injuries, ambulance or ER visits, and ongoing treatment usually warrant deeper fact and insurance review.",
      evidenceTitle: "Evidence That Can Matter",
      evidenceItems: [
        "Photos of the defect, lighting, and measurements when safe to capture",
        "Incident reports",
        "Witness statements",
        "Surveillance from hallways or entrances",
        "Maintenance tickets and vendor invoices",
        "Repair history and prior complaints",
        "Ownership and management documents",
        "Insurance information",
        "Medical records",
        "Timeline of notice and failure to fix or warn",
      ],
      investigateH2: "How We Investigate Unsafe Stairs And Flooring Claims",
      investigateIntro: "We align defect evidence with California negligence standards.",
      investigateSteps: [
        { title: "Accident or incident report review", body: "Property, employer, or EMS documentation of the fall.", img: IMG.cracked, alt: "Broken tile near a business entrance" },
        { title: "Photo and video evidence", body: "Scene capture, building cameras, and body-worn video if any.", img: IMG.knee, alt: "Adult at home recovering from knee injury with family support" },
        { title: "Surveillance preservation", body: "Hallway and lobby footage requests before overwrite.", img: null, alt: "" },
        { title: "Witness statements", body: "Residents, guests, staff, or contractors who saw the defect.", img: null, alt: "" },
        { title: "Maintenance and repair history", body: "Work orders, invoices, and capital improvement records.", img: null, alt: "" },
        { title: "Responsibility analysis", body: "Landlord, hotel operator, retailer, HOA, or maintenance vendor roles.", img: null, alt: "" },
        { title: "Medical record review", body: "Orthopedic, neuro, and imaging records tied to the mechanism.", img: IMG.attorney, alt: "Attorney speaking with injured client after property accident" },
        { title: "Insurance and recovery path", body: "General liability, excess, or residential policies as applicable.", img: null, alt: "" },
      ],
      compH2: "Compensation In Unsafe Property Injury Cases",
      compLead:
        "Potential damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, and wrongful death damages where applicable. Every case depends on its facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after injury"],
        ["Lost income", "/images/la/attorney-paperwork.png", "Attorney reviewing case documents with client"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after serious injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "Defect cases need technical diligence and courtroom credibility:",
      whyCards: [
        ["Trial-ready strategy from day one", "We build cases insurers know can be tried."],
        ["No fee unless we win", "Contingency fees—pay no attorney fees unless we recover."],
        ["Direct attorney access", "Attorneys who coordinate experts and site documentation."],
        ["Evidence preservation", "Rapid letters and inspections to lock in conditions."],
        ["Serious injury focus", "We prioritize fractures, head injuries, and surgical cases."],
        ["Insurers and property owners", "Negotiation informed by insurance defense experience."],
      ],
      howMuchTitle: "Valuation Depends On The Full Picture",
      howMuchBody:
        "Medical needs, permanency, lost earnings, and how clearly the defect and notice are proven all affect outcomes. We give straightforward guidance after a detailed review.",
      finalH2: "Speak With An Unsafe Property Injury Lawyer Today",
      finalP:
        "If unsafe stairs, flooring, or lighting caused a serious injury, request a free case review. We respond with compassion and clarity.",
      footerBlurb:
        "California attorneys for unsafe stairs, flooring, and lighting injury claims. Attorney advertising.",
      preloadHref: IMG.cracked,
      checklistResultId: "case-checklist-result",
    },
    {
      slug: "apartment-complex-injury-lawyer-california",
      bodyAttrs: 'data-page-type="apartment_complex_injury" data-ad-group="AG | Apartment Property Injury"',
      title: "Apartment Complex Injury Lawyer California | Landlord Negligence Injury",
      metaDesc:
        "Seriously injured at an apartment complex, stairway, walkway, parking lot, or common area? Free case review for unsafe property injuries. No fee unless we win.",
      canonical: "https://call.insideraccidentlawyers.com/apartment-complex-injury-lawyer-california",
      h1: "Hurt At An Apartment Complex?",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Hurt in an apartment common area?</span> We review serious injury cases, not rent or eviction disputes.',
      heroReframe:
        "Unsafe stairs, walkways, railings, lighting, and parking areas may support a claim.",
      heroImg: IMG.walker,
      heroImgAlt: "Family member supporting injured adult after serious fall",
      heroPlannedImage: "apartment-injury-hero.png",
      heroHazardFallback: IMG.walker,
      heroUseAttorney: true,
      heroCaption: "Apartment and rental property injury claims",
      trustH2: "Apartment Complex Injury Attorneys",
      trustSub:
        "Landlords and managers must maintain common areas and respond to known hazards.<br><br>When ignored repairs, dark stairwells, or broken walkways cause hospital-level injuries, we review liability and insurance.",
      formSubject: "New Apartment Complex Injury Lead (CA)",
      formH2: "Free Case Review — Apartment Or Rental Property Injury",
      formIntro:
        "Describe the common-area hazard, your injury, and medical treatment. We review serious apartment complex injury cases—not general tenant disputes.",
      situationOptions: [
        ["Apartment stairs injury", "Apartment stairs injury"],
        ["Apartment walkway injury", "Apartment walkway injury"],
        ["Apartment parking lot injury", "Apartment parking lot injury"],
        ["Unsafe common area", "Unsafe common area"],
        ["Loose railing", "Loose railing"],
        ["Poor lighting", "Poor lighting"],
        ["Broken walkway", "Broken walkway"],
        ["Ignored repair caused injury", "Ignored repair caused injury"],
        ["Broken hip / fracture / surgery", "Broken hip / fracture / surgery"],
        ["Other serious apartment injury", "Other serious apartment injury"],
      ],
      casesH2: "Apartment Injury Cases We Review",
      casesLead: "We handle negligence leading to physical injury—not habitability-only claims without harm.",
      casesItems: [
        "Stairwells and landings",
        "Walkways and pool decks",
        "Parking structures and speed bumps",
        "Broken gates tied to a fall or crush injury",
        "Lighting failures in common areas",
        "Ignored written repair requests before injury",
      ],
      hazardsH2: "Dangerous Conditions Landlords May Be Responsible For",
      hazardsLead: "Notice and opportunity to repair matter under California negligence law.",
      hazardsFigure: {
        src: IMG.cracked,
        alt: "Broken tile near a business entrance",
        caption: "Trip hazards in common areas should be fixed or clearly warned.",
      },
      signsH2: "Signs You May Have An Apartment Complex Injury Case",
      signsIntro: "Select what applies. We need a physical injury with treatment—not a lease argument alone.",
      signsItems: [
        "A dangerous common-area condition (stairs, rail, lighting, pavement, gate)",
        "The injury occurred on property the landlord or HOA controls",
        "You received medical care for a serious injury",
        "There may be emails, texts, or portal requests showing prior notice of the hazard",
        "Photos, witnesses, or incident documentation exist",
        "The condition appears unreasonably unsafe without timely repair or warning",
        "Renter’s or commercial liability coverage may apply",
      ],
      checklistDefault:
        "Apartment injury cases need a clear link between the defect, notice, and physical harm.",
      checklistOne: "If you were hurt in a common area, consider a free review of notice and maintenance.",
      checklistMany: "Several factors may support a negligence claim—not a rent dispute. Request a free case review.",
      seriousTitle: "This Is For Serious Physical Injury Cases",
      seriousBody:
        "We review fractures, head injuries, surgeries, hospitalizations, and similar harm from unsafe common areas. Minor soreness without treatment is usually not a fit.",
      evidenceTitle: "Evidence That Can Matter",
      evidenceItems: [
        "Photos of the hazard and lighting",
        "Emails or maintenance tickets showing prior complaints",
        "Witness names",
        "Surveillance from lobbies or lots",
        "Property management records",
        "Lease and HOA documents where relevant",
        "Insurance for landlord or association",
        "Medical records",
        "Timeline of notice and failure to repair",
      ],
      investigateH2: "How We Investigate Apartment Complex Injury Claims",
      investigateIntro: "We separate injury negligence from ordinary landlord-tenant friction.",
      investigateSteps: [
        { title: "Accident or incident report review", body: "Police, EMS, or property incident forms.", img: IMG.walker, alt: "Family member supporting injured adult after serious fall" },
        { title: "Photo and video evidence", body: "Scene photos and available security footage.", img: IMG.cracked, alt: "Broken tile near a business entrance" },
        { title: "Surveillance preservation", body: "Requests to preserve lobby, garage, and lot video.", img: null, alt: "" },
        { title: "Witness statements", body: "Neighbors and staff who knew about the hazard.", img: null, alt: "" },
        { title: "Maintenance and repair history", body: "Work orders, vendor visits, and capital repairs.", img: null, alt: "" },
        { title: "Responsibility analysis", body: "Landlord, management company, HOA, or contractor roles.", img: null, alt: "" },
        { title: "Medical record review", body: "Treatment tied to the fall and future needs.", img: IMG.attorney, alt: "Attorney speaking with injured client after property accident" },
        { title: "Insurance and recovery path", body: "Liability policies for owners and operators.", img: null, alt: "" },
      ],
      compH2: "Compensation In Apartment Injury Cases",
      compLead:
        "Potential damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, and wrongful death damages where applicable. Every case depends on its facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after injury"],
        ["Lost income", "/images/la/attorney-paperwork.png", "Attorney reviewing case documents with client"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after serious injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "Complex residential properties need focused investigation:",
      whyCards: [
        ["Trial-ready strategy from day one", "We prepare for litigation when carriers stall."],
        ["No fee unless we win", "Contingency representation for injury claims."],
        ["Direct attorney access", "Attorneys who read leases, notices, and maintenance trails."],
        ["Evidence preservation", "We push to document hazards before quick fixes."],
        ["Serious injury focus", "Hospital-level injuries—not noise complaints."],
        ["Insurers and property owners", "Experience with landlord carriers and defense counsel."],
      ],
      howMuchTitle: "Straight Answers About Value",
      howMuchBody:
        "We do not promise outcomes. We explain how liability, coverage, and damages drivers interact after we review your file.",
      finalH2: "Request A Free Case Review",
      finalP:
        "If a common-area hazard at an apartment complex caused a serious injury, call or submit the form. We do not handle eviction defense or deposit-only disputes on this intake path.",
      footerBlurb:
        "California attorneys for serious apartment and rental property injury cases. Attorney advertising.",
      preloadHref: IMG.walker,
      checklistResultId: "case-checklist-result",
      extraNotForSection: true,
    },
    {
      slug: "unsafe-property-serious-injury-lawyer-california",
      bodyAttrs: 'data-page-type="unsafe_property_serious_injury" data-ad-group="AG | Unsafe Property Serious Injury"',
      title: "Premises Liability Lawyer California | Serious Unsafe Property Injury",
      metaDesc:
        "Seriously injured because of unsafe stairs, broken flooring, poor lighting, wet floors, parking lot hazards, or negligent maintenance? Free case review. No fee unless we win.",
      canonical: "https://call.insideraccidentlawyers.com/unsafe-property-serious-injury-lawyer-california",
      h1: "Seriously Injured On Unsafe Property?",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Unsafe property caused a serious injury?</span> We review treatment, evidence, responsibility, and coverage.',
      heroReframe:
        "A strong claim needs more than a fall. It needs facts that show why the hazard mattered.",
      heroImg: IMG.knee,
      heroImgAlt: "Adult at home recovering from knee injury with family support",
      heroPlannedImage: "unsafe-property-injury-hero.png",
      heroHazardFallback: IMG.knee,
      heroUseAttorney: true,
      heroCaption: "Serious unsafe property injury claims",
      trustH2: "Unsafe Property Injury Attorneys",
      trustSub:
        "California property owners and businesses must keep premises reasonably safe for visitors and tenants in common areas.<br><br>We review high-stakes injury cases across retail, hospitality, apartments, and commercial sites.",
      formSubject: "New Unsafe Property / Premises Serious Injury Lead (CA)",
      formH2: "Free Case Review — Unsafe Property Injury",
      formIntro:
        "Share what happened, where, and your treatment plan. We review serious unsafe property injuries statewide.",
      situationOptions: [
        ["Retail store injury", "Retail store injury"],
        ["Grocery store injury", "Grocery store injury"],
        ["Parking lot injury", "Parking lot injury"],
        ["Unsafe walkway", "Unsafe walkway"],
        ["Unsafe stairs / loose handrail", "Unsafe stairs / loose handrail"],
        ["Broken flooring / uneven floor", "Broken flooring / uneven floor"],
        ["Poor lighting", "Poor lighting"],
        ["Apartment complex injury", "Apartment complex injury"],
        ["Hotel or restaurant injury", "Hotel or restaurant injury"],
        ["Broken hip / fracture / surgery", "Broken hip / fracture / surgery"],
        ["Other serious property injury", "Other serious property injury"],
      ],
      casesH2: "Unsafe Property Cases We Review",
      casesLead: "We prioritize documented injuries on property someone controlled—with a path to liability coverage.",
      casesItems: [
        "Retail, grocery, and big-box sites",
        "Hotels and restaurants",
        "Apartments and condos—common areas",
        "Parking lots and walkways",
        "Stairs, rails, lighting, and flooring defects",
        "Negligent maintenance vendors where applicable",
      ],
      hazardsH2: "Dangerous Conditions That May Support A Claim",
      hazardsLead: "Not every fall is legally actionable—we look for unreasonable risks and notice.",
      hazardsFigure: {
        src: IMG.wet,
        alt: "Wet walkway outside a commercial property",
        caption: "Outdoor and indoor hazards both require timely inspection and response.",
      },
      hazardsSecondFigure: {
        src: IMG.cracked,
        alt: "Broken tile near a business entrance",
        caption: "Broken flooring and trip edges are common where repairs were delayed.",
      },
      signsH2: "Signs You May Have An Unsafe Property Injury Case",
      signsIntro: "Tap items that describe your situation. This is a screening guide, not legal advice.",
      signsItems: [
        "A dangerous property condition you can describe or photograph",
        "A clear connection to a business, landlord, hotel, store, or maintenance role",
        "Medical treatment for a serious injury",
        "Hospital, surgery, fracture, head injury, back injury, or ongoing care",
        "Photos, reports, witnesses, or surveillance may exist",
        "Facts suggest failure to repair or warn within a reasonable time",
        "Commercial, landlord, or general liability insurance may apply—not workers’ comp as the only path",
      ],
      checklistDefault:
        "We decline cases with no treatment, no hazard, or no property connection—including many comp-only workplace falls.",
      checklistOne: "If several screening items fit, a free review can clarify next steps.",
      checklistMany: "Multiple factors may support a serious premises claim. Request a free case review.",
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "Premises cases are stronger when harm is serious and documented. Hospitalization, surgery, fractures, broken hips, head or back injuries, ambulance or ER visits, and ongoing treatment usually warrant deeper fact and insurance review.",
      evidenceTitle: "Evidence That Can Matter",
      evidenceItems: [
        "Photos of the hazard",
        "Incident reports",
        "Witness names",
        "Surveillance video",
        "Maintenance records",
        "Repair history",
        "Prior complaints",
        "Property ownership",
        "Business or property insurance",
        "Medical records",
        "Timeline of notice and failure to fix or warn",
      ],
      investigateH2: "How We Investigate Premises Liability Claims",
      investigateIntro: "Structured review before we discuss resolution with insurers.",
      investigateSteps: [
        { title: "Accident or incident report review", body: "Business, property, or police documentation.", img: IMG.knee, alt: "Adult at home recovering from knee injury with family support" },
        { title: "Photo and video evidence", body: "Scene capture and available recordings.", img: IMG.wet, alt: "Wet walkway outside a commercial property" },
        { title: "Surveillance preservation", body: "Hold requests to carriers and custodians of video.", img: null, alt: "" },
        { title: "Witness statements", body: "Employees, guests, and contractors.", img: null, alt: "" },
        { title: "Maintenance record investigation", body: "Logs, invoices, and vendor scopes.", img: null, alt: "" },
        { title: "Property owner / business / landlord analysis", body: "Who controlled the area and owed a duty.", img: null, alt: "" },
        { title: "Medical record review", body: "Treatment course and future needs.", img: IMG.cracked, alt: "Broken tile near a business entrance" },
        { title: "Insurance and recovery path review", body: "Coverage layers and realistic recovery routes.", img: IMG.attorney, alt: "Attorney speaking with injured client after property accident" },
      ],
      compH2: "Compensation In Unsafe Property Injury Cases",
      compLead:
        "Potential damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, and wrongful death damages where applicable. Every case depends on its facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after injury"],
        ["Lost income", "/images/la/attorney-paperwork.png", "Attorney reviewing case documents with client"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after serious injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "Serious premises claims demand urgency and courtroom credibility:",
      whyCards: [
        ["Trial-ready strategy from day one", "We build for trial so settlement offers respect your risk."],
        ["No fee unless we win", "Contingency fees—no recovery, no attorney fee."],
        ["Direct attorney access", "Attorneys who own the facts and the client relationship."],
        ["Evidence preservation", "Scene, video, and maintenance holds are prioritized."],
        ["Serious injury case review", "We focus on cases with medical proof and liability angles."],
        ["Insurers and property owners", "Negotiation informed by insurance industry experience."],
      ],
      howMuchTitle: "Every Case Depends On The Facts",
      howMuchBody:
        "Past results do not guarantee a similar outcome. We evaluate your records, coverage, and liability strength before discussing numbers.",
      finalH2: "See If You Have A Case",
      finalP:
        "If an unsafe property condition caused serious injury, request a free case review. Not a fit for workers’ comp-only questions or free legal advice unrelated to a claim.",
      footerBlurb:
        "California premises liability attorneys for serious unsafe property injuries. Attorney advertising.",
      preloadHref: IMG.knee,
      checklistResultId: "case-checklist-result",
    },
    {
      slug: "construction-injury-lawyer-california",
      bodyAttrs: 'data-page-type="construction_injury_serious" data-ad-group="AG | Construction Injury California"',
      title: "Construction Injury Lawyer California | Construction Accident Attorney",
      metaDesc:
        "Injured on a construction site in California? You may have a claim beyond workers’ comp. Free construction injury case review. No fee unless we win.",
      ogTitle: "Construction Injury Lawyer California",
      ogDesc:
        "Construction site accident? We review serious injury cases involving falls, falling objects, equipment, unsafe jobsites, contractors, and third-party liability.",
      canonical: "https://call.insideraccidentlawyers.com/construction-injury-lawyer-california",
      h1: "Injured On A Construction Site?",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">You may have a claim beyond workers’ comp.</span> Free Construction Injury Case Review • Serious Jobsite Injuries Reviewed • Falls, Equipment Accidents, Falling Objects &amp; Unsafe Sites • Hablamos Espa\u00f1ol',
      heroReframe:
        "We review serious construction injury cases across California and identify potential third-party liability paths.",
      heroImg: getImage("hero-injured-construction-worker.png", IMG.attorney),
      heroImgAlt: "Injured construction worker being helped by coworkers on a construction site",
      heroPlannedImage: "hero-injured-construction-worker.png",
      heroHazardFallback: getImage("hero-injured-construction-worker.png", IMG.attorney),
      heroUseAttorney: false,
      heroCaption: "Construction accident and serious injury case review",
      trustH2: "A Construction Injury Case May Involve More Than Workers’ Comp",
      trustSub:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability.<br><br>A third-party claim may exist when someone other than your employer contributed to the accident, such as a subcontractor, property owner, equipment company, negligent driver, vendor, or general contractor.",
      formSubject: "New Construction Injury Lead (CA)",
      formH2: "Free Case Review — Construction Injury",
      formIntro:
        "Tell us what happened, where it happened, and what treatment you received. We review serious construction injury cases statewide.",
      situationOptions: [
        ["Fall from scaffold, ladder, roof, or height", "Fall from scaffold, ladder, roof, or height"],
        ["Falling object injury", "Falling object injury"],
        ["Crane or heavy equipment accident", "Crane or heavy equipment accident"],
        ["Forklift or vehicle accident", "Forklift or vehicle accident"],
        ["Trench, collapse, or excavation accident", "Trench, collapse, or excavation accident"],
        ["Electrical injury", "Electrical injury"],
        ["Burn injury", "Burn injury"],
        ["Machinery or tool injury", "Machinery or tool injury"],
        ["Unsafe jobsite condition", "Unsafe jobsite condition"],
        ["Construction wrongful death", "Construction wrongful death"],
        ["Workers comp only or not sure", "Workers’ comp only / not sure"],
        ["Other serious construction injury", "Other serious construction injury"],
      ],
      casesH2: "Serious Construction Accident Cases We Review",
      casesLead:
        "Construction sites involve many companies and moving parts. We review serious injury cases where a contractor, property owner, equipment company, driver, vendor, or unsafe condition may have contributed.",
      casesItems: [],
      casesCards: [
        {
          title: "Scaffold and ladder falls",
          description:
            "Falls from scaffolds, ladders, roofs, platforms, or elevated work areas may involve missing fall protection, unsafe access, or safety violations.",
          image: {
            src: getImage("broken-leg-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
            alt: "Construction workers assisting an injured worker near scaffolding and a ladder on a jobsite",
          },
        },
        {
          title: "Falling object injuries",
          description:
            "Tools, materials, debris, or equipment falling from above can cause serious head, neck, spine, and orthopedic injuries.",
          image: {
            src: getImage(
              "falling-rock-head-injury-construction.png",
              getImage("hero-injured-construction-worker.png", IMG.attorney)
            ),
            alt: "Construction workers assisting an injured coworker after falling debris on a jobsite",
          },
        },
        {
          title: "Heavy equipment and forklift accidents",
          description:
            "Forklifts, cranes, loaders, trucks, and other heavy equipment can cause severe injuries when work areas and traffic are not controlled safely.",
          image: {
            src: getImage("forklift-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
            alt: "Construction workers assisting an injured worker near a forklift on a jobsite",
          },
        },
        {
          title: "Unsafe jobsite conditions",
          description:
            "Open edges, debris, unstable surfaces, poor lighting, missing warnings, and blocked walkways can create serious trip and fall hazards.",
          image: {
            src: getImage("ankle-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
            alt: "Worker being helped after an unsafe jobsite accident near debris and an open work area",
          },
        },
        {
          title: "Electrical injuries and burns",
          description:
            "Exposed wiring, unsafe panels, power tools, and energized equipment can cause shock injuries, burns, and other serious harm.",
          image: {
            src: getImage("electrical-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
            alt: "Construction worker being helped near exposed electrical wiring on a jobsite",
          },
        },
        {
          title: "Trench, collapse, and excavation injuries",
          description:
            "Excavation accidents may involve cave-ins, unstable soil, missing trench protection, or unsafe site control by contractors.",
          image: {
            src: getImage("trench-collapse.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
            alt: "Workers assisting an injured colleague inside a construction trench or excavation",
          },
        },
        {
          title: "Machinery and tool injuries",
          description:
            "Defective tools, unguarded machinery, maintenance failures, or unsafe equipment use may require a third-party investigation.",
          image: {
            src: getImage(
              "broken-leg-excavator-construction.png",
              getImage("hero-injured-construction-worker.png", IMG.attorney)
            ),
            alt: "Construction worker being helped near tools and heavy machinery on a jobsite",
          },
        },
        {
          title: "Construction wrongful death",
          description:
            "When a construction accident causes a death, families may need urgent review of liability, evidence preservation, and insurance coverage.",
          image: {
            src: getImage(
              "man-unconscious-construction.png",
              getImage("man-severly-wounded-wrongful-death-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney))
            ),
            alt: "Construction workers responding to a serious jobsite emergency",
          },
        },
      ],
      caseAccentImages: [],
      hazardsH2: "Construction Accident Attorneys",
      hazardsLead:
        "When a serious construction accident happens, identifying who controlled the hazard and who may be legally responsible can be critical to the recovery path.",
      hazardsFigure: {
        src: getImage("cell-phone-capture-equipment-on-floor.png", getImage("background-construction-site.png", IMG.attorney)),
        alt: "Documenting construction accident evidence including hard hat and safety vest on a jobsite floor",
        caption: "Potentially responsible parties can include contractors, subcontractors, owners, equipment companies, and vendors.",
      },
      hazardsSecondFigure: {
        src: getImage("injured-construction-worker-hispanic.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
        alt: "Injured construction worker being helped near heavy equipment",
        caption: "We can review whether your case is workers’ comp only, a third-party injury claim, or another recovery path.",
      },
      signsH2: "Signs You May Have A Construction Injury Case",
      signsIntro:
        "Not every jobsite injury is a personal injury claim. But certain facts may suggest there is more to review than a standard workers’ compensation issue.",
      signsChecklistExtraClass: "case-checklist--signs-six",
      signsItems: [],
      signsCards: [
        {
          heading: "Someone Other Than Your Employer May Be Responsible",
          body: "A subcontractor, property owner, equipment company, driver, vendor, or general contractor may have created or failed to fix the hazard.",
        },
        {
          heading: "The Injury Was Serious",
          body: "Fractures, surgery, head injuries, back or spine trauma, burns, crush injuries, amputations, or hospitalization may require deeper investigation.",
        },
        {
          heading: "The Accident Involved A Dangerous Jobsite Condition",
          body: "Falls, missing guardrails, open edges, debris, falling objects, unstable surfaces, trench hazards, exposed wiring, or unsafe equipment may all matter.",
        },
        {
          heading: "There Were Multiple Companies On Site",
          body: "Construction sites often involve several contractors and vendors. Liability may depend on who controlled the area, equipment, or safety condition.",
        },
        {
          heading: "Evidence May Disappear Quickly",
          body: "Photos, video, incident reports, witness names, OSHA records where applicable, equipment logs, and subcontractor information can be important.",
        },
        {
          heading: "You Are Not Sure If It Is Only Workers’ Comp",
          body: "Many injured workers are told their only option is workers’ comp. That may be true in some cases, but serious accidents may deserve a third-party liability review.",
        },
      ],
      signsCallout:
        "If you are unsure, it is worth having the facts reviewed. We can help identify whether the case appears to be workers’ comp only, a third-party injury claim, or another possible recovery path.",
      checklistDefault:
        "Not every construction injury supports a third-party claim. We screen for serious injury, factual evidence, and who may have controlled the hazard.",
      checklistOne:
        "If one of these applies, a free case review can help clarify whether there may be a claim beyond workers’ comp.",
      checklistMany:
        "Multiple factors may support a serious construction injury claim. Request a free case review.",
      omitSeriousAndEvidence: true,
      caseValueBeforeComp: true,
      caseValueGridClass: "case-value-grid--construction-factors",
      caseValueFactors: [
        [
          "Injury severity",
          "Fractures, surgery, head or back injuries, crush injuries, and long-term limitations change how a case is evaluated.",
          "medicalCross",
        ],
        [
          "Jobsite complexity",
          "Multiple contractors, equipment vendors, and overlapping work areas can affect who owed a duty and who controlled the hazard.",
          "building",
        ],
        [
          "Evidence",
          "Photos, video, incident documentation, witness names, OSHA filings where applicable, and equipment records may not last long.",
          "camera",
        ],
        [
          "Third-party fault",
          "A claim may be stronger when another company—not only your employer—contributed to unsafe conditions or equipment.",
          "shieldCheck",
        ],
      ],
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "We review severe injuries including fractures, surgery, head and brain injuries, spine and back injuries, burns, amputations, crush injuries, electrocution, wrongful death, and long-term impairment.",
      evidenceTitle: "Evidence Can Disappear Fast",
      evidenceIntro:
        "Construction cases can depend on fast evidence preservation. Photos, video, incident reports, witness names, contractor information, OSHA records where applicable, and equipment records may help determine who was responsible.",
      evidenceItems: [
        "Incident reports",
        "OSHA reports where applicable",
        "Photos and videos",
        "Witness names",
        "Contractor and subcontractor information",
        "Site safety records",
        "Equipment maintenance records",
        "Prior complaints",
        "Jobsite control records",
        "Medical records",
        "Insurance coverage review",
      ],
      investigateH2: "How We Investigate Construction Accident Claims",
      investigateIntro:
        "Construction accident cases often depend on identifying who controlled the worksite, who created the hazard, and what evidence exists before it disappears.",
      investigationPlannedImage: "cell-phone-capture-equipment-on-floor.png",
      investigationFeatureAlt:
        "Phone documenting construction accident evidence including hard hat and safety vest",
      investigationFeatureH3: "Jobsite evidence and liability review",
      investigationFeatureP:
        "We focus on incident documentation, subcontractor roles, equipment involvement, and who had safety responsibility on the project—before records fade and scenes change.",
      investigateSteps: [
        { title: "Review how the accident happened", body: "We start with your account, employer reports, and any immediate documentation from the site.", img: null, alt: "" },
        { title: "Identify all companies on the jobsite", body: "We map general contractors, subcontractors, vendors, equipment providers, and property involvement.", img: null, alt: "" },
        { title: "Review incident reports, photos, video, and witness names", body: "We look for documentation that may support how the work area was controlled and what was unsafe.", img: null, alt: "" },
        { title: "Evaluate jobsite control and safety responsibilities", body: "Liability often turns on who controlled the area, equipment, or condition that contributed to the injury.", img: null, alt: "" },
        { title: "Review equipment, maintenance, and contractor records", body: "Equipment logs, maintenance history, and contractor communications may matter in serious equipment cases.", img: null, alt: "" },
        { title: "Review medical treatment and injury severity", body: "Medical records help connect the mechanism of injury to the harm and future needs.", img: null, alt: "" },
        { title: "Analyze insurance coverage and possible recovery paths", body: "We evaluate liability coverage, additional insureds, and realistic paths under the facts.", img: null, alt: "" },
        {
          title: "Determine workers’ comp only, third-party liability, or both",
          body: "We help identify whether the facts suggest a workers’ comp-only path, a third-party injury claim, or another recovery option to review.",
          img: null,
          alt: "",
        },
      ],
      compH2: "Compensation In Construction Injury Cases",
      compLead:
        "The value of a construction accident case depends on the facts, injuries, insurance coverage, and whether a third party may be legally responsible.",
      compDisclaimer:
        "Every case is different. Past results do not guarantee a similar outcome. The available recovery depends on liability, damages, insurance coverage, and the facts of the accident.",
      compHeroImage: {
        src: getImage("construction-worker-rehab.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
        alt: "Injured construction worker in physical rehabilitation after a serious jobsite injury",
      },
      compGalleryImages: [
        {
          src: getImage("construction-man-stresses-over-bills.png", IMG.attorney),
          alt: "Injured construction worker reviewing medical and household bills at home",
        },
        {
          src: getImage("forklift-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Forklift and equipment hazard on an active construction site",
        },
        {
          src: getImage("laid-off-construction-worker-crutches.png", IMG.attorney),
          alt: "Construction worker on crutches recovering at home after an accident",
        },
        {
          src: getImage("doctor-with-construction-worker.png", IMG.attorney),
          alt: "Doctor reviewing imaging with an injured construction worker",
        },
        {
          src: getImage("injured-construction-worker-looking-out-window.png", IMG.attorney),
          alt: "Injured construction worker at home with arm sling and knee brace",
        },
      ],
      compDamageItems: [
        [
          "Medical Bills & Future Treatment",
          "Construction injuries may require emergency care, imaging, surgery, therapy, specialist visits, medication, or long-term treatment.",
        ],
        ["Lost Income", "A serious jobsite injury can keep you from working temporarily or permanently."],
        [
          "Pain & Suffering",
          "A third-party injury claim may include damages beyond workers’ compensation benefits, depending on the facts.",
        ],
        [
          "Loss Of Earning Capacity",
          "Severe injuries may affect your ability to return to your trade or perform the same type of work.",
        ],
        [
          "Long-Term Impairment",
          "Spine injuries, brain injuries, crush injuries, burns, amputations, and permanent limitations can change the value of a case.",
        ],
        [
          "Wrongful Death",
          "When a construction accident causes a death, surviving family members may have legal rights that should be reviewed quickly.",
        ],
      ],
      compCards: [
        ["Medical bills and future treatment", "/images/premises-lp/hero-injured-construction-worker.png", "Placeholder for generator — compDamageItems used"],
        ["Lost income", "/images/premises-lp/hero-injured-construction-worker.png", "Placeholder"],
        ["Pain and suffering", "/images/premises-lp/hero-injured-construction-worker.png", "Placeholder"],
        ["Long-term impairment", "/images/premises-lp/hero-injured-construction-worker.png", "Placeholder"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "Serious construction injury cases deserve a focused review—not generic intake.",
      whyCards: [
        ["Serious injury case review", "We prioritize major jobsite injuries with documented treatment and clear fact patterns to evaluate."],
        ["Third-party liability analysis", "We review whether another contractor, vendor, owner, or equipment party may share responsibility—not only your employer."],
        ["Evidence preservation", "We emphasize fast action to protect photos, reports, witness information, and site documentation where possible."],
        ["Insurance coverage review", "We evaluate realistic coverage and recovery paths under California injury law."],
        ["No fee unless we win", "Contingency fee representation with no upfront attorney fee."],
        ["Hablamos Español", "Spanish-speaking team members are available to assist when needed."],
        ["Direct attorney review", "Serious inquiries receive attorney-level review of the fact pattern when appropriate."],
      ],
      howMuchTitle: "Why A Construction Injury May Be More Than Workers’ Comp",
      howMuchBody:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability. A third-party claim may exist when someone other than your employer contributed to the injury, such as another contractor, a negligent driver, a property owner, an equipment manufacturer, or a maintenance company. This is a case-by-case review, not legal advice.",
      finalH2: "See If You Have A Construction Injury Case",
      finalP:
        "If you were seriously injured on a construction site, request a free case review. We can review whether the facts suggest a personal injury claim, a workers’ compensation issue, or another recovery path.",
      footerBlurb:
        "California attorneys for serious construction accident and injury cases. Attorney advertising.",
      attorneyBioConstruction: [
        "Shawn Rokni is an experienced California personal injury attorney who represents people seriously injured on construction sites and in other major injury cases statewide.",
        "Prior to representing injured people, Shawn worked with insurance companies. That experience informs how we investigate third-party liability, preserve jobsite evidence, and pursue fair compensation.",
      ],
      resultTypeLabel: "Construction Injury",
      preloadHref: getImage("hero-injured-construction-worker.png", IMG.attorney),
      checklistResultId: "case-checklist-result",
      finalBgImage: "background-construction-site.png",
    },
    {
      slug: "construction-accident-lawyer-los-angeles",
      bodyAttrs: 'data-page-type="construction_accident_los_angeles" data-ad-group="AG | Construction Accident Los Angeles"',
      title: "Construction Accident Lawyer Los Angeles | Jobsite Injury Attorney",
      metaDesc:
        "Injured on a construction site in Los Angeles? You may have a claim beyond workers’ comp. Free construction accident case review.",
      ogTitle: "Construction Accident Lawyer Los Angeles",
      ogDesc:
        "Injured on a Los Angeles construction site? We review serious construction accident cases involving falls, equipment, unsafe jobsites, and third-party liability.",
      canonical: "https://call.insideraccidentlawyers.com/construction-accident-lawyer-los-angeles",
      h1: "Construction Accident Lawyer Los Angeles",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Injured on a Los Angeles construction site?</span> You may have a claim beyond workers’ comp. Free case review.',
      heroReframe:
        "We review serious construction injury cases in Los Angeles and identify potential third-party liability paths.",
      heroImg: getImage("hero-injured-construction-worker.png", IMG.attorney),
      heroImgAlt: "Injured construction worker being helped by coworkers on a construction site",
      heroPlannedImage: "hero-injured-construction-worker.png",
      heroHazardFallback: IMG.attorney,
      heroUseAttorney: false,
      heroCaption: "Construction accident and serious injury case review",
      heroBgImage: "background-construction-site.png",
      trustH2: "A Construction Injury Case May Involve More Than Workers’ Comp",
      trustSub:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability.<br><br>A third-party claim may exist when someone other than your employer contributed to the accident, such as a subcontractor, property owner, equipment company, negligent driver, vendor, or general contractor.",
      formSubject: "New Construction Injury Lead (Los Angeles)",
      formH2: "Free Case Review — Construction Injury",
      formIntro:
        "Tell us what happened, where it happened, and what treatment you received. We review serious construction injury cases statewide.",
      situationOptions: [
        ["Fall from scaffold, ladder, roof, or height", "Fall from scaffold, ladder, roof, or height"],
        ["Falling object injury", "Falling object injury"],
        ["Crane or heavy equipment accident", "Crane or heavy equipment accident"],
        ["Forklift or vehicle accident", "Forklift or vehicle accident"],
        ["Trench, collapse, or excavation accident", "Trench, collapse, or excavation accident"],
        ["Electrical injury", "Electrical injury"],
        ["Burn injury", "Burn injury"],
        ["Machinery or tool injury", "Machinery or tool injury"],
        ["Unsafe jobsite condition", "Unsafe jobsite condition"],
        ["Construction wrongful death", "Construction wrongful death"],
        ["Workers comp only or not sure", "Workers’ comp only / not sure"],
        ["Other serious construction injury", "Other serious construction injury"],
      ],
      casesH2: "Serious Construction Accident Cases We Review",
      casesLead:
        "Construction sites involve many companies and moving parts. We review serious injury cases where a contractor, property owner, equipment company, driver, vendor, or unsafe condition may have contributed.",
      casesItems: [
        "Scaffold and ladder falls",
        "Falling object injuries",
        "Heavy equipment and forklift accidents",
        "Unsafe jobsite conditions",
        "Electrical injuries and burns",
        "Trench, collapse, and excavation injuries",
        "Machinery and tool injuries",
        "Construction wrongful death",
      ],
      caseAccentImages: [],
      caseCardImages: [
        {
          src: getImage("broken-leg-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Construction worker with leg injury beside scaffolding and ladder on a Los Angeles-area jobsite",
        },
        {
          src: getImage("falling-rock-head-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Injured worker after a struck-by or falling object incident on a construction site",
        },
        {
          src: getImage("forklift-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Injured construction worker near a forklift with coworkers responding on the jobsite",
        },
        {
          src: getImage("ankle-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Worker with ankle or foot injury on the ground with debris and safety gear nearby",
        },
        {
          src: getImage("electrical-injury-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Worker being helped after an electrical hazard injury near equipment on a construction site",
        },
        {
          src: getImage("trench-collapse.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Workers responding to an injury in an excavation or trench with heavy equipment nearby",
        },
        {
          src: getImage("broken-leg-excavator-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Worker with leg injury on the ground near heavy equipment and tools",
        },
        {
          src: getImage(
            "man-unconscious-construction.png",
            getImage("man-severly-wounded-wrongful-death-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney))
          ),
          alt: "Construction workers responding to a coworker with grave injuries on the jobsite",
        },
      ],
      hazardsH2: "Construction Accident Attorneys",
      hazardsLead:
        "When a serious construction accident happens, identifying who controlled the hazard and who may be legally responsible can be critical to the recovery path.",
      hazardsFigure: {
        src: getImage(
          "construction-man-looking-up-something-falling.png",
          getImage("hero-injured-construction-worker.png", IMG.attorney)
        ),
        alt: "Construction worker looking up at a possible falling object hazard on a jobsite",
        caption: "Potentially responsible parties can include contractors, subcontractors, owners, equipment companies, and vendors.",
      },
      hazardsSecondFigure: {
        src: getImage("injured-construction-worker-hispanic.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
        alt: "Injured construction worker being helped near heavy equipment",
        caption: "We can review whether your case is workers’ comp only, a third-party injury claim, or another recovery path.",
      },
      signsH2: "Signs You May Have A Construction Injury Case",
      signsIntro:
        "Tap any statement that fits your situation. Many injuries start as workers’ compensation matters—but some also involve a negligence claim against another company on site. This helps us screen serious cases; it is not legal advice.",
      signsItems: [],
      signsCards: [
        {
          heading: "Serious injury or major medical care",
          body: "You needed emergency care, hospitalization, surgery, imaging, or ongoing treatment—and the harm is more than a minor strain or bruise.",
        },
        {
          heading: "Someone other than your employer may share fault",
          body: "A subcontractor, vendor, motorist, equipment provider, property owner, or general contractor—not just your direct employer—may have contributed to what happened.",
        },
        {
          heading: "There may be records to prove it",
          body: "Photos, video, an incident or OSHA report, witness names, site logs, subcontractor lists, or equipment information may still exist.",
        },
        {
          heading: "A high-risk jobsite incident",
          body: "The event involved a fall, falling object, machinery or vehicle strike, trench or collapse, electrical hazard, fire, explosion, trip hazard, or another unsafe condition.",
        },
        {
          heading: "You’re unsure what kind of claim this is",
          body: "You do not know whether this is only workers’ comp, only a third-party case, or both—and you want clarity before evidence disappears.",
        },
      ],
      checklistDefault:
        "Not every construction injury supports a third-party claim. We screen for serious injury, factual evidence, and who may have controlled the hazard.",
      checklistOne:
        "If one of these applies, a free case review can help clarify whether there may be a claim beyond workers’ comp.",
      checklistMany:
        "Multiple factors may support a serious construction injury claim. Request a free case review.",
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "We review severe injuries including fractures, surgery, head and brain injuries, spine and back injuries, burns, amputations, crush injuries, electrocution, wrongful death, and long-term impairment.",
      evidenceTitle: "Evidence Can Disappear Fast",
      evidenceIntro:
        "Construction cases can depend on fast evidence preservation. Photos, video, incident reports, witness names, contractor information, OSHA records where applicable, and equipment records may help determine who was responsible.",
      evidenceItems: [
        "Incident reports",
        "OSHA reports where applicable",
        "Photos and videos",
        "Witness names",
        "Contractor and subcontractor information",
        "Site safety records",
        "Equipment maintenance records",
        "Prior complaints",
        "Jobsite control records",
        "Medical records",
        "Insurance coverage review",
      ],
      investigateH2: "How We Investigate Construction Accident Claims",
      investigateIntro: "Construction injury claims often require fast evidence preservation and a structured liability review.",
      investigationPlannedImage: "cell-phone-capture-equipment-on-floor.png",
      investigationFeatureAlt:
        "Phone documenting construction accident evidence including hard hat and safety vest",
      investigateSteps: [
        { title: "Accident and incident report review", body: "We review reports from the site, employer, and available incident documentation.", img: getImage("cell-phone-capture-equipment-on-floor.png", IMG.attorney), alt: "Phone documenting construction accident evidence including hard hat and safety vest" },
        { title: "Jobsite and subcontractor fact review", body: "We identify who controlled work areas, equipment, and safety procedures.", img: null, alt: "" },
        { title: "Photo and video evidence", body: "Images and footage can help document conditions before evidence changes.", img: null, alt: "" },
        { title: "Witness statements", body: "Coworkers, supervisors, and bystanders may support key facts.", img: null, alt: "" },
        { title: "OSHA and safety record review", body: "Where applicable, we review safety records and reported violations.", img: null, alt: "" },
        { title: "Equipment and maintenance review", body: "Defective tools, machinery, or poor maintenance may create third-party liability.", img: null, alt: "" },
        { title: "Owner / contractor responsibility analysis", body: "We evaluate property owner, general contractor, and subcontractor roles.", img: null, alt: "" },
        { title: "Medical record review", body: "Treatment records help connect injury severity to the mechanism of harm.", img: null, alt: "" },
        { title: "Insurance and recovery path review", body: "We assess potential coverage and realistic recovery pathways under the facts.", img: null, alt: "" },
      ],
      compH2: "Compensation In Construction Injury Cases",
      compLead:
        "Potential damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, loss of earning capacity, and wrongful death damages where applicable. Every case depends on the facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after serious injury"],
        ["Lost income and earning capacity", "/images/la/attorney-paperwork.png", "Attorney reviewing construction injury case documents"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after severe injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "How we approach serious construction injury claims:",
      whyCards: [
        ["Trial-ready strategy from day one", "We prepare claims as if they may need to be tried."],
        ["No fee unless we win", "Contingency fee representation with no upfront attorney fee."],
        ["Direct attorney access", "You work directly with attorneys focused on serious injury facts."],
        ["Evidence preservation", "Fast action can matter in protecting jobsite and incident evidence."],
        ["Serious injury case review", "We focus on major injury cases with documented treatment."],
        ["Insurance and liability analysis", "We evaluate coverage and responsible parties under California law."],
      ],
      howMuchTitle: "Why A Construction Injury May Be More Than Workers’ Comp",
      howMuchBody:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability. A third-party claim may exist when someone other than your employer contributed to the injury, such as another contractor, a negligent driver, a property owner, an equipment manufacturer, or a maintenance company. This is a case-by-case review, not legal advice.",
      finalH2: "See If You Have A Construction Injury Case",
      finalP:
        "If you were seriously injured on a construction site, request a free case review. We can review whether the facts suggest a personal injury claim, a workers’ compensation issue, or another recovery path.",
      footerBlurb:
        "California attorneys for serious construction accident and injury cases. Attorney advertising.",
      preloadHref: getImage("hero-injured-construction-worker.png", IMG.attorney),
      checklistResultId: "case-checklist-result",
      finalBgImage: "background-construction-site.png",
    },
    {
      slug: "construction-site-injury-lawyer-california",
      bodyAttrs: 'data-page-type="construction_site_injury_california" data-ad-group="AG | Construction Site Injury California"',
      title: "Construction Site Injury Lawyer California | Free Case Review",
      metaDesc:
        "Serious construction site injury in California? Free case review. No fee unless we win.",
      ogTitle: "Construction Site Injury Lawyer California",
      ogDesc:
        "Serious construction site injury? We review major jobsite accident claims involving falls, equipment incidents, unsafe sites, and third-party liability.",
      canonical: "https://call.insideraccidentlawyers.com/construction-site-injury-lawyer-california",
      h1: "Construction Site Injury Lawyer California",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Serious construction site injury?</span> Free case review. No fee unless we win.',
      heroReframe:
        "We review serious construction injury cases across California and identify potential third-party liability paths.",
      heroImg: getImage("hero-injured-construction-worker.png", IMG.attorney),
      heroImgAlt: "Injured construction worker being helped by coworkers on a construction site",
      heroPlannedImage: "hero-injured-construction-worker.png",
      heroHazardFallback: IMG.attorney,
      heroUseAttorney: false,
      heroCaption: "Construction accident and serious injury case review",
      trustH2: "A Construction Injury Case May Involve More Than Workers’ Comp",
      trustSub:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability.<br><br>A third-party claim may exist when someone other than your employer contributed to the accident, such as a subcontractor, property owner, equipment company, negligent driver, vendor, or general contractor.",
      formSubject: "New Construction Injury Lead (CA)",
      formH2: "Free Case Review — Construction Injury",
      formIntro:
        "Tell us what happened, where it happened, and what treatment you received. We review serious construction injury cases statewide.",
      situationOptions: [
        ["Fall from scaffold, ladder, roof, or height", "Fall from scaffold, ladder, roof, or height"],
        ["Falling object injury", "Falling object injury"],
        ["Crane or heavy equipment accident", "Crane or heavy equipment accident"],
        ["Forklift or vehicle accident", "Forklift or vehicle accident"],
        ["Trench, collapse, or excavation accident", "Trench, collapse, or excavation accident"],
        ["Electrical injury", "Electrical injury"],
        ["Burn injury", "Burn injury"],
        ["Machinery or tool injury", "Machinery or tool injury"],
        ["Unsafe jobsite condition", "Unsafe jobsite condition"],
        ["Construction wrongful death", "Construction wrongful death"],
        ["Workers comp only or not sure", "Workers’ comp only / not sure"],
        ["Other serious construction injury", "Other serious construction injury"],
      ],
      casesH2: "Serious Construction Accident Cases We Review",
      casesLead:
        "Construction sites involve many companies and moving parts. We review serious injury cases where a contractor, property owner, equipment company, driver, vendor, or unsafe condition may have contributed.",
      casesItems: [
        "Scaffold and ladder falls",
        "Falling object injuries",
        "Heavy equipment and forklift accidents",
        "Unsafe jobsite conditions",
        "Electrical injuries and burns",
        "Trench, collapse, and excavation injuries",
        "Machinery and tool injuries",
        "Construction wrongful death",
      ],
      caseAccentImages: [
        {
          src: getImage("construction-man-looking-up-something-falling.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Construction worker looking up at a possible falling object hazard on a jobsite",
        },
        {
          src: getImage("injured-construction-worker-hispanic.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Injured construction worker being helped near heavy equipment",
        },
        {
          src: getImage("man-severly-wounded-wrongful-death-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Construction workers responding to a serious jobsite injury",
        },
      ],
      hazardsH2: "Construction Accident Attorneys",
      hazardsLead:
        "When a serious construction accident happens, identifying who controlled the hazard and who may be legally responsible can be critical to the recovery path.",
      hazardsFigure: {
        src: getImage("cell-phone-capture-equipment-on-floor.png", getImage("background-construction-site.png", IMG.attorney)),
        alt: "Documenting construction accident evidence including hard hat and safety vest on a jobsite floor",
        caption: "Potentially responsible parties can include contractors, subcontractors, owners, equipment companies, and vendors.",
      },
      hazardsSecondFigure: {
        src: getImage("injured-construction-worker-hispanic.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
        alt: "Injured construction worker being helped near heavy equipment",
        caption: "We can review whether your case is workers’ comp only, a third-party injury claim, or another recovery path.",
      },
      signsH2: "Signs You May Have A Construction Injury Case",
      signsIntro:
        "Tap what applies. Not every workplace injury is a personal injury case. Some are workers’ comp only, and we can review whether there may be a third-party liability path.",
      signsItems: [
        "Serious injury requiring ER care, hospitalization, surgery, imaging, or ongoing treatment",
        "A subcontractor, vendor, driver, equipment company, property owner, or general contractor may have contributed",
        "Photos, video, incident reports, OSHA reports, witnesses, or jobsite records may exist",
        "The accident involved a fall, falling object, machinery, vehicle, collapse, electrical hazard, or unsafe worksite condition",
        "You are unsure whether this is only workers’ comp or also a third-party injury claim",
      ],
      checklistDefault:
        "Not every construction injury supports a third-party claim. We screen for serious injury, factual evidence, and who may have controlled the hazard.",
      checklistOne:
        "If one of these applies, a free case review can help clarify whether there may be a claim beyond workers’ comp.",
      checklistMany:
        "Multiple factors may support a serious construction injury claim. Request a free case review.",
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "We review severe injuries including fractures, surgery, head and brain injuries, spine and back injuries, burns, amputations, crush injuries, electrocution, wrongful death, and long-term impairment.",
      evidenceTitle: "Evidence Can Disappear Fast",
      evidenceIntro:
        "Construction cases can depend on fast evidence preservation. Photos, video, incident reports, witness names, contractor information, OSHA records where applicable, and equipment records may help determine who was responsible.",
      evidenceItems: [
        "Incident reports",
        "OSHA reports where applicable",
        "Photos and videos",
        "Witness names",
        "Contractor and subcontractor information",
        "Site safety records",
        "Equipment maintenance records",
        "Prior complaints",
        "Jobsite control records",
        "Medical records",
        "Insurance coverage review",
      ],
      investigateH2: "How We Investigate Construction Accident Claims",
      investigateIntro: "Construction injury claims often require fast evidence preservation and a structured liability review.",
      investigationPlannedImage: "cell-phone-capture-equipment-on-floor.png",
      investigationFeatureAlt:
        "Phone documenting construction accident evidence including hard hat and safety vest",
      investigateSteps: [
        { title: "Accident and incident report review", body: "We review reports from the site, employer, and available incident documentation.", img: getImage("cell-phone-capture-equipment-on-floor.png", IMG.attorney), alt: "Phone documenting construction accident evidence including hard hat and safety vest" },
        { title: "Jobsite and subcontractor fact review", body: "We identify who controlled work areas, equipment, and safety procedures.", img: null, alt: "" },
        { title: "Photo and video evidence", body: "Images and footage can help document conditions before evidence changes.", img: null, alt: "" },
        { title: "Witness statements", body: "Coworkers, supervisors, and bystanders may support key facts.", img: null, alt: "" },
        { title: "OSHA and safety record review", body: "Where applicable, we review safety records and reported violations.", img: null, alt: "" },
        { title: "Equipment and maintenance review", body: "Defective tools, machinery, or poor maintenance may create third-party liability.", img: null, alt: "" },
        { title: "Owner / contractor responsibility analysis", body: "We evaluate property owner, general contractor, and subcontractor roles.", img: null, alt: "" },
        { title: "Medical record review", body: "Treatment records help connect injury severity to the mechanism of harm.", img: null, alt: "" },
        { title: "Insurance and recovery path review", body: "We assess potential coverage and realistic recovery pathways under the facts.", img: null, alt: "" },
      ],
      compH2: "Compensation In Construction Injury Cases",
      compLead:
        "Potential damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, loss of earning capacity, and wrongful death damages where applicable. Every case depends on the facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after serious injury"],
        ["Lost income and earning capacity", "/images/la/attorney-paperwork.png", "Attorney reviewing construction injury case documents"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after severe injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "How we approach serious construction injury claims:",
      whyCards: [
        ["Trial-ready strategy from day one", "We prepare claims as if they may need to be tried."],
        ["No fee unless we win", "Contingency fee representation with no upfront attorney fee."],
        ["Direct attorney access", "You work directly with attorneys focused on serious injury facts."],
        ["Evidence preservation", "Fast action can matter in protecting jobsite and incident evidence."],
        ["Serious injury case review", "We focus on major injury cases with documented treatment."],
        ["Insurance and liability analysis", "We evaluate coverage and responsible parties under California law."],
      ],
      howMuchTitle: "Why A Construction Injury May Be More Than Workers’ Comp",
      howMuchBody:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability. A third-party claim may exist when someone other than your employer contributed to the injury, such as another contractor, a negligent driver, a property owner, an equipment manufacturer, or a maintenance company. This is a case-by-case review, not legal advice.",
      finalH2: "See If You Have A Construction Injury Case",
      finalP:
        "If you were seriously injured on a construction site, request a free case review. We can review whether the facts suggest a personal injury claim, a workers’ compensation issue, or another recovery path.",
      footerBlurb:
        "California attorneys for serious construction accident and injury cases. Attorney advertising.",
      preloadHref: getImage("hero-injured-construction-worker.png", IMG.attorney),
      checklistResultId: "case-checklist-result",
      finalBgImage: "background-construction-site.png",
    },
    {
      slug: "scaffold-accident-lawyer-california",
      bodyAttrs: 'data-page-type="scaffold_accident_california" data-ad-group="AG | Scaffold Accident California"',
      title: "Scaffold Accident Lawyer California | Construction Fall Attorney",
      metaDesc:
        "Injured in a scaffold, ladder, roof, or elevated work fall? Free case review.",
      ogTitle: "Scaffold Accident Lawyer California",
      ogDesc:
        "Injured in a scaffold or elevated work fall in California? We review serious construction fall and third-party liability claims.",
      canonical: "https://call.insideraccidentlawyers.com/scaffold-accident-lawyer-california",
      h1: "Scaffold Accident Lawyer California",
      heroSub:
        '<span class="hero-tagline">Free Case Review • No Fee Unless We Win.</span> <span class="hero-highlight">Injured in a scaffold, ladder, roof, or elevated work fall?</span> Free case review.',
      heroReframe:
        "We review serious scaffold and construction fall injuries across California and identify potential third-party liability paths.",
      heroImg: getImage("hero-injured-construction-worker.png", IMG.attorney),
      heroImgAlt: "Injured construction worker being helped by coworkers on a construction site",
      heroPlannedImage: "hero-injured-construction-worker.png",
      heroHazardFallback: IMG.attorney,
      heroUseAttorney: false,
      heroCaption: "Construction accident and serious injury case review",
      trustH2: "A Construction Injury Case May Involve More Than Workers’ Comp",
      trustSub:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability.<br><br>A third-party claim may exist when someone other than your employer contributed to the accident, such as a subcontractor, property owner, equipment company, negligent driver, vendor, or general contractor.",
      formSubject: "New Construction Injury Lead (Scaffold CA)",
      formH2: "Free Case Review — Construction Injury",
      formIntro:
        "Tell us what happened, where it happened, and what treatment you received. We review serious construction injury cases statewide.",
      situationOptions: [
        ["Fall from scaffold, ladder, roof, or height", "Fall from scaffold, ladder, roof, or height"],
        ["Falling object injury", "Falling object injury"],
        ["Crane or heavy equipment accident", "Crane or heavy equipment accident"],
        ["Forklift or vehicle accident", "Forklift or vehicle accident"],
        ["Trench, collapse, or excavation accident", "Trench, collapse, or excavation accident"],
        ["Electrical injury", "Electrical injury"],
        ["Burn injury", "Burn injury"],
        ["Machinery or tool injury", "Machinery or tool injury"],
        ["Unsafe jobsite condition", "Unsafe jobsite condition"],
        ["Construction wrongful death", "Construction wrongful death"],
        ["Workers comp only or not sure", "Workers’ comp only / not sure"],
        ["Other serious construction injury", "Other serious construction injury"],
      ],
      casesH2: "Serious Construction Accident Cases We Review",
      casesLead:
        "Construction sites involve many companies and moving parts. We review serious injury cases where a contractor, property owner, equipment company, driver, vendor, or unsafe condition may have contributed.",
      casesItems: [
        "Scaffold and ladder falls",
        "Falling object injuries",
        "Heavy equipment and forklift accidents",
        "Unsafe jobsite conditions",
        "Electrical injuries and burns",
        "Trench, collapse, and excavation injuries",
        "Machinery and tool injuries",
        "Construction wrongful death",
      ],
      caseAccentImages: [
        {
          src: getImage("construction-man-looking-up-something-falling.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Construction worker looking up at a possible falling object hazard on a jobsite",
        },
        {
          src: getImage("injured-construction-worker-hispanic.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Injured construction worker being helped near heavy equipment",
        },
        {
          src: getImage("man-severly-wounded-wrongful-death-construction.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
          alt: "Construction workers responding to a serious jobsite injury",
        },
      ],
      hazardsH2: "Construction Accident Attorneys",
      hazardsLead:
        "When a serious construction accident happens, identifying who controlled the hazard and who may be legally responsible can be critical to the recovery path.",
      hazardsFigure: {
        src: getImage("cell-phone-capture-equipment-on-floor.png", getImage("background-construction-site.png", IMG.attorney)),
        alt: "Documenting construction accident evidence including hard hat and safety vest on a jobsite floor",
        caption: "Potentially responsible parties can include contractors, subcontractors, owners, equipment companies, and vendors.",
      },
      hazardsSecondFigure: {
        src: getImage("injured-construction-worker-hispanic.png", getImage("hero-injured-construction-worker.png", IMG.attorney)),
        alt: "Injured construction worker being helped near heavy equipment",
        caption: "We can review whether your case is workers’ comp only, a third-party injury claim, or another recovery path.",
      },
      signsH2: "Signs You May Have A Construction Injury Case",
      signsIntro:
        "Tap what applies. Not every workplace injury is a personal injury case. Some are workers’ comp only, and we can review whether there may be a third-party liability path.",
      signsItems: [
        "Serious injury requiring ER care, hospitalization, surgery, imaging, or ongoing treatment",
        "A subcontractor, vendor, driver, equipment company, property owner, or general contractor may have contributed",
        "Photos, video, incident reports, OSHA reports, witnesses, or jobsite records may exist",
        "The accident involved a fall, falling object, machinery, vehicle, collapse, electrical hazard, or unsafe worksite condition",
        "You are unsure whether this is only workers’ comp or also a third-party injury claim",
      ],
      checklistDefault:
        "Not every construction injury supports a third-party claim. We screen for serious injury, factual evidence, and who may have controlled the hazard.",
      checklistOne:
        "If one of these applies, a free case review can help clarify whether there may be a claim beyond workers’ comp.",
      checklistMany:
        "Multiple factors may support a serious construction injury claim. Request a free case review.",
      seriousTitle: "Serious Injuries Matter",
      seriousBody:
        "We review severe injuries including fractures, surgery, head and brain injuries, spine and back injuries, burns, amputations, crush injuries, electrocution, wrongful death, and long-term impairment.",
      evidenceTitle: "Evidence Can Disappear Fast",
      evidenceIntro:
        "Construction cases can depend on fast evidence preservation. Photos, video, incident reports, witness names, contractor information, OSHA records where applicable, and equipment records may help determine who was responsible.",
      evidenceItems: [
        "Incident reports",
        "OSHA reports where applicable",
        "Photos and videos",
        "Witness names",
        "Contractor and subcontractor information",
        "Site safety records",
        "Equipment maintenance records",
        "Prior complaints",
        "Jobsite control records",
        "Medical records",
        "Insurance coverage review",
      ],
      investigateH2: "How We Investigate Construction Accident Claims",
      investigateIntro: "Construction injury claims often require fast evidence preservation and a structured liability review.",
      investigationPlannedImage: "cell-phone-capture-equipment-on-floor.png",
      investigationFeatureAlt:
        "Phone documenting construction accident evidence including hard hat and safety vest",
      investigateSteps: [
        { title: "Accident and incident report review", body: "We review reports from the site, employer, and available incident documentation.", img: getImage("cell-phone-capture-equipment-on-floor.png", IMG.attorney), alt: "Phone documenting construction accident evidence including hard hat and safety vest" },
        { title: "Jobsite and subcontractor fact review", body: "We identify who controlled work areas, equipment, and safety procedures.", img: null, alt: "" },
        { title: "Photo and video evidence", body: "Images and footage can help document conditions before evidence changes.", img: null, alt: "" },
        { title: "Witness statements", body: "Coworkers, supervisors, and bystanders may support key facts.", img: null, alt: "" },
        { title: "OSHA and safety record review", body: "Where applicable, we review safety records and reported violations.", img: null, alt: "" },
        { title: "Equipment and maintenance review", body: "Defective tools, machinery, or poor maintenance may create third-party liability.", img: null, alt: "" },
        { title: "Owner / contractor responsibility analysis", body: "We evaluate property owner, general contractor, and subcontractor roles.", img: null, alt: "" },
        { title: "Medical record review", body: "Treatment records help connect injury severity to the mechanism of harm.", img: null, alt: "" },
        { title: "Insurance and recovery path review", body: "We assess potential coverage and realistic recovery pathways under the facts.", img: null, alt: "" },
      ],
      compH2: "Compensation In Construction Injury Cases",
      compLead:
        "Potential damages may include medical bills, future treatment, lost income, pain and suffering, long-term impairment, loss of earning capacity, and wrongful death damages where applicable. Every case depends on the facts. Past results do not guarantee a similar outcome.",
      compCards: [
        ["Medical bills and future treatment", "/images/la/nurse-helping-woman.png", "Medical care and expenses after serious injury"],
        ["Lost income and earning capacity", "/images/la/attorney-paperwork.png", "Attorney reviewing construction injury case documents"],
        ["Pain and suffering", "/images/la/daughter-hold-dads-hand.png", "Family supporting injured loved one"],
        ["Long-term impairment", "/images/la/injured-woman-healing-walking.png", "Adult recovering after severe injury"],
      ],
      whyH2: "Why Choose Insider Accident Lawyers",
      whyIntro: "How we approach serious construction injury claims:",
      whyCards: [
        ["Trial-ready strategy from day one", "We prepare claims as if they may need to be tried."],
        ["No fee unless we win", "Contingency fee representation with no upfront attorney fee."],
        ["Direct attorney access", "You work directly with attorneys focused on serious injury facts."],
        ["Evidence preservation", "Fast action can matter in protecting jobsite and incident evidence."],
        ["Serious injury case review", "We focus on major injury cases with documented treatment."],
        ["Insurance and liability analysis", "We evaluate coverage and responsible parties under California law."],
      ],
      howMuchTitle: "Why A Construction Injury May Be More Than Workers’ Comp",
      howMuchBody:
        "Workers’ compensation may apply after many jobsite injuries, but some construction accidents also involve third-party liability. A third-party claim may exist when someone other than your employer contributed to the injury, such as another contractor, a negligent driver, a property owner, an equipment manufacturer, or a maintenance company. This is a case-by-case review, not legal advice.",
      finalH2: "See If You Have A Construction Injury Case",
      finalP:
        "If you were seriously injured on a construction site, request a free case review. We can review whether the facts suggest a personal injury claim, a workers’ compensation issue, or another recovery path.",
      footerBlurb:
        "California attorneys for serious construction accident and injury cases. Attorney advertising.",
      preloadHref: getImage("hero-injured-construction-worker.png", IMG.attorney),
      checklistResultId: "case-checklist-result",
      finalBgImage: "background-construction-site.png",
    },
  ];
}

function buildSituationOptions(opts) {
  return (
    opts
      .map(
        ([val, label]) =>
          `                            <option value="${escAttr(val)}">${label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</option>`
      )
      .join("\n") + "\n"
  );
}

function buildInvestigateSteps(steps) {
  return steps.map((s, i) => processStep(i + 1, s.title, s.body, s.img, s.alt)).join("\n");
}

function buildWhyCards(cards) {
  return cards
    .map(
      ([h, p]) => `                <div class="trust-card premium-trust-card">
                    <div class="premium-icon-badge">${icon(inferIcon(`${h} ${p}`))}</div>
                    <h3>${h}</h3>
                    <p>${p}</p>
                </div>`
    )
    .join("\n");
}

function buildEvidenceList(items) {
  return items
    .map(
      (t) => `                    <div class="evidence-card">
                        <div class="premium-icon-badge">${icon(inferIcon(t))}</div>
                        <span>${t}</span>
                    </div>`
    )
    .join("\n");
}

function signTitle(label) {
  const t = label.toLowerCase();
  if (t.includes("dangerous") || t.includes("specific defect") || t.includes("clear hazard")) return "Dangerous condition";
  if (t.includes("medical treatment") || t.includes("medical care") || t.includes("medical records")) return "Medical treatment";
  if (t.includes("serious") || t.includes("hospital") || t.includes("surgery") || t.includes("fracture")) return "Serious injury";
  if (t.includes("photos") || t.includes("video") || t.includes("surveillance")) return "Photos, video, or reports";
  if (t.includes("witness")) return "Witnesses";
  if (t.includes("failed") || t.includes("no repair") || t.includes("failure")) return "Failure to fix or warn";
  if (t.includes("insurance") || t.includes("coverage")) return "Insurance path";
  if (
    (t.includes("subcontractor") || t.includes("vendor") || t.includes("equipment company") || t.includes("general contractor")) &&
    (t.includes("contributed") || t.includes("may have"))
  )
    return "Another company may share fault";
  if (t.includes("accident involved") || (t.includes("unsafe worksite") && t.includes("condition")))
    return "Typical high-risk incidents";
  if (t.includes("not sure") || t.includes("unsure")) return "Unsure what type of claim";
  if (t.includes("store") || t.includes("business") || t.includes("landlord") || t.includes("property") || t.includes("common-area") || t.includes("common area")) return "Property or business connection";
  if (t.includes("notice") || t.includes("prior complaints")) return "Notice of the hazard";
  const clean = label.replace(/\s*\([^)]*\)\s*/g, "").trim();
  const beforeDash = clean.split("—")[0].trim();
  const beforeComma = beforeDash.split(",")[0].trim();
  const firstWords = beforeComma.split(/\s+/).slice(0, 5).join(" ");
  return firstWords.replace(/^There was a /i, "").replace(/^A /i, "").replace(/^The /i, "");
}

function buildSignCards(items, signsCardsOverride) {
  if (signsCardsOverride && signsCardsOverride.length) {
    return signsCardsOverride
      .map(
        ({ heading, body }) => `                    <li class="case-checklist-item premium-check-card" role="checkbox" tabindex="0" data-checked="false" aria-checked="false">
                        <span class="premium-icon-badge">${icon(inferIcon(`${heading} ${body}`))}</span>
                        <span class="case-checklist-copy">
                            <span class="case-checklist-heading">${heading}</span>
                            <span class="case-checklist-label">${body}</span>
                        </span>
                    </li>`
      )
      .join("\n");
  }
  return (items || [])
    .map((label) => {
      const heading = signTitle(label);
      return `                    <li class="case-checklist-item premium-check-card" role="checkbox" tabindex="0" data-checked="false" aria-checked="false">
                        <span class="premium-icon-badge">${icon(inferIcon(label))}</span>
                        <span class="case-checklist-copy">
                            <span class="case-checklist-heading">${heading}</span>
                            <span class="case-checklist-label">${label}</span>
                        </span>
                    </li>`;
    })
    .join("\n");
}

function injuryPills() {
  const pills = [
    ["Hospitalization", "hospital"],
    ["Surgery", "medicalCross"],
    ["Fracture or broken bone", "bone"],
    ["Broken hip", "bone"],
    ["Head or back injury", "medicalCross"],
    ["Ambulance / ER care", "ambulance"],
    ["Ongoing treatment", "clipboard"],
  ];
  return pills
    .map(
      ([label, iconName]) => `<span class="injury-signal-pill">${icon(iconName)}${label}</span>`
    )
    .join("");
}

function buildCaseValue(page) {
  const factors = page.caseValueFactors || [
    ["Injury severity", "Fractures, surgery, head or back injuries, and long-term limitations change the stakes.", "medicalCross"],
    ["Medical treatment", "ER care, imaging, specialists, therapy, and ongoing treatment help document harm.", "clipboard"],
    ["Evidence available", "Photos, video, reports, witnesses, and records can prove what happened before it disappears.", "camera"],
    ["Notice and responsibility", "A claim is stronger when a business or owner had a chance to repair or warn.", "building"],
  ];
  const gridClass = page.caseValueGridClass || "";
  return `<div class="case-value-panel">
                <p class="case-value-lead">${page.howMuchBody}</p>
                <div class="case-value-grid${gridClass ? ` ${gridClass}` : ""}">
${factors
  .map(
    ([h, p, iconName]) => `                    <div class="case-value-factor">
                        <div class="premium-icon-badge">${icon(iconName)}</div>
                        <h3>${h}</h3>
                        <p>${p}</p>
                    </div>`
  )
  .join("\n")}
                </div>
                <p class="case-value-disclaimer">Every case depends on the facts. Past results do not guarantee a similar outcome.</p>
                <a href="#case-evaluation" class="btn-primary case-value-cta"${ctaDataAttr(page)}>${reviewCtaLabel(page)}</a>
            </div>`;
}

function reviewCtaLabel(page) {
  if (isConstructionPage(page)) return "Free Construction Injury Review";
  if (page.slug.includes("retail")) return "Free Store Injury Review";
  if (page.slug.includes("parking")) return "Free Parking Lot Injury Review";
  if (page.slug.includes("stairs")) return "Free Unsafe Property Review";
  if (page.slug.includes("apartment")) return "Free Apartment Injury Review";
  return "Free Premises Injury Review";
}

function compactCta(page) {
  return `<div class="compact-cta-row">
                <a href="#case-evaluation" class="btn-primary compact-cta-primary"${ctaDataAttr(page)}>${reviewCtaLabel(page)}</a>
                <a href="tel:844-467-4335" class="btn-secondary compact-cta-secondary" data-callrail-phone="844-467-4335"${phoneDataAttr(page)}>Call Now</a>
            </div>`;
}

function ctaDataAttr(page) {
  return isConstructionPage(page)
    ? ' data-cta="construction-injury-free-case-review"'
    : "";
}

function phoneDataAttr(page) {
  return isConstructionPage(page)
    ? ' data-phone-click="construction-injury-call"'
    : "";
}

function formDataAttr(page) {
  return isConstructionPage(page)
    ? ' data-form="construction-injury-case-review"'
    : "";
}

function isConstructionPage(page) {
  return (
    page.slug.includes("construction-injury") ||
    page.slug.includes("construction-accident") ||
    page.slug.includes("construction-site-injury") ||
    page.slug.includes("scaffold-accident-lawyer-california")
  );
}

function applyPage(html, p) {
  let h = html;
  const heroImage = heroImageForPage(p);

  h = h.replace(
    /<!-- GTM injected at top of head -->/,
    `<style id="premises-lp-hero-mobile">
.hero-section .hero-attorney-wrap{position:relative;filter:drop-shadow(0 20px 34px rgba(0,0,0,.24));}
.hero-section .hero-attorney-img{object-fit:cover;object-position:center center;aspect-ratio:4/3;border:1px solid rgba(255,255,255,.24);box-shadow:0 18px 38px rgba(0,0,0,.25);}
.hero-attorney-wrap::after{content:"Serious Injury Review";position:absolute;left:18px;bottom:52px;background:rgba(251,186,0,.96);color:#0c2334;border-radius:999px;padding:9px 14px;font-size:13px;font-weight:800;letter-spacing:.02em;box-shadow:0 10px 24px rgba(0,0,0,.22);}
.premium-icon-badge{width:50px;height:50px;border-radius:16px;background:linear-gradient(135deg,#eef5ff,#ffffff);color:#01468a;border:1px solid rgba(1,70,138,.16);display:inline-flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(1,54,108,.1);flex:0 0 auto;}
.premium-service-card:nth-child(3n+1) .premium-icon-badge,.evidence-card:nth-child(3n+1) .premium-icon-badge,.premium-check-card:nth-child(3n+1) .premium-icon-badge,.premium-process-card:nth-child(3n+1) .premium-icon-badge,.case-value-factor:nth-child(3n+1) .premium-icon-badge{background:linear-gradient(135deg,#fff8df,#ffffff);color:#01366c;border-color:rgba(251,186,0,.34);}
.premium-service-card:nth-child(3n+2) .premium-icon-badge,.evidence-card:nth-child(3n+2) .premium-icon-badge,.premium-check-card:nth-child(3n+2) .premium-icon-badge,.premium-process-card:nth-child(3n+2) .premium-icon-badge,.case-value-factor:nth-child(3n+2) .premium-icon-badge{background:linear-gradient(135deg,#edf7ff,#ffffff);color:#0c4a6e;}
.prem-icon{width:25px;height:25px;display:block;}
.premium-service-card.accident-item{display:flex;align-items:flex-start;gap:16px;text-align:left;padding:26px;background:linear-gradient(180deg,#fff,#f8fbff);border:1px solid rgba(1,54,108,.1);box-shadow:0 10px 25px rgba(12,35,52,.08);}
.accident-grid.accident-grid--photo-cards{max-width:1100px;}
.accident-item.accident-item--photo-card{flex-direction:column;align-items:stretch;padding:0;overflow:hidden;border-left:none;border:1px solid rgba(1,54,108,.1);}
.accident-item.accident-item--photo-card:hover{border-left:none;border-color:rgba(251,186,0,.4);}
.accident-item-photo-wrap{width:100%;aspect-ratio:16/10;overflow:hidden;background:#e8eef5;}
.accident-item-photo{width:100%;height:100%;object-fit:cover;display:block;}
.accident-item.accident-item--photo-card .accident-item-body{display:flex;align-items:flex-start;gap:16px;padding:20px 22px 22px;text-align:left;}
.accident-item-photo-wrap--169{aspect-ratio:16/9!important;}
.accident-item-body--stack{flex-direction:column;align-items:stretch!important;gap:12px;}
.accident-item-title-row{display:flex;align-items:flex-start;gap:14px;}
.accident-item-text--title{font-size:17px;line-height:1.35;flex:1;min-width:0;}
.accident-item-desc{font-size:15px;line-height:1.55;color:#4b5563;margin:0;}
.comp-damage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;max-width:1000px;margin:0 auto;text-align:left;}
.comp-damage-card{background:#fff;border:1px solid rgba(1,54,108,.1);border-radius:14px;padding:20px 22px;box-shadow:0 8px 20px rgba(12,35,52,.06);}
.comp-damage-card__h{font-size:18px;color:#0c2334;margin:0 0 10px;font-weight:800;}
.comp-damage-card__p{font-size:15px;color:#4b5563;margin:0;line-height:1.55;}
.comp-damage-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:1000px;margin:0 auto 24px;}
.comp-damage-gallery__item{margin:0;border-radius:12px;overflow:hidden;background:#e8eef5;box-shadow:0 8px 20px rgba(12,35,52,.08);}
.comp-damage-gallery__item img{display:block;width:100%;height:100%;object-fit:cover;aspect-ratio:16/9;}
.case-checklist--signs-six{grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;}
@media(max-width:1024px){.case-checklist--signs-six{grid-template-columns:repeat(2,minmax(0,1fr));}}
.signs-callout-note{max-width:760px;margin:28px auto 0;padding:18px 20px;background:#f8fbff;border:1px solid rgba(1,54,108,.12);border-radius:14px;font-size:16px;line-height:1.6;color:#374151;}
@media(min-width:900px){.case-value-grid.case-value-grid--construction-factors{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(min-width:1200px){.case-value-grid.case-value-grid--construction-factors{grid-template-columns:repeat(4,minmax(0,1fr));}}
.construction-hero-with-bg{background-attachment:scroll!important;}
#your-case .case-checklist-wrap{max-width:min(920px,100%);}
.premium-service-card .accident-item-text{font-weight:800;color:#0c2334;line-height:1.35;}
.case-checklist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;list-style:none;padding:0;margin:0;}
.premium-check-card.case-checklist-item{display:flex;gap:16px;align-items:flex-start;text-align:left;padding:22px;background:#fff;border:1px solid rgba(1,54,108,.12);border-radius:14px;box-shadow:0 8px 22px rgba(12,35,52,.08);}
.premium-check-card.checked{border-color:#fbba00;box-shadow:0 12px 28px rgba(251,186,0,.18);}
.case-checklist-copy{display:flex;flex-direction:column;gap:6px;}
.case-checklist-heading{font-weight:800;color:#01366c;font-size:17px;line-height:1.25;}
.premium-check-card .case-checklist-box{display:none;}
.premium-check-card .case-checklist-label{font-size:15px;line-height:1.55;color:#374151;}
.serious-banner{background:linear-gradient(135deg,#0c2334,#01366c 58%,#01468a);border-radius:22px;padding:36px;box-shadow:0 22px 46px rgba(12,35,52,.2);color:#fff;position:relative;overflow:hidden;}
.serious-banner::before{content:"";position:absolute;inset:-80px -20px auto auto;width:220px;height:220px;border-radius:50%;background:rgba(251,186,0,.16);}
.serious-banner__content{position:relative;z-index:1;display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:center;}
.serious-banner .premium-icon-badge{background:rgba(251,186,0,.95);margin-bottom:14px;}
.serious-banner h2{color:#fff;margin-bottom:12px;}
.serious-banner p{color:rgba(255,255,255,.9);max-width:680px;}
.injury-signal-grid{display:flex;flex-wrap:wrap;gap:10px;align-content:center;}
.injury-signal-pill{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;border-radius:999px;padding:10px 12px;font-weight:700;font-size:14px;}
.injury-signal-pill .prem-icon{width:18px;height:18px;color:#fbba00;}
.evidence-board{background:linear-gradient(180deg,#f3f6fa,#fff);border:1px solid rgba(1,54,108,.1);border-radius:22px;padding:36px;box-shadow:0 14px 34px rgba(12,35,52,.1);}
.evidence-board h2{text-align:center;}
.evidence-board__intro{text-align:center;max-width:760px;margin:0 auto 28px;color:#374151;font-size:18px;}
.evidence-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}
.evidence-card{display:flex;align-items:center;gap:14px;background:#fff;border:1px solid rgba(1,54,108,.1);border-radius:14px;padding:16px;box-shadow:0 8px 20px rgba(12,35,52,.06);font-weight:700;color:#0c2334;}
.premium-trust-card .trust-icon{display:none;}
.premium-trust-card{border:1px solid rgba(1,54,108,.1);}
.premium-process-card.process-step{padding:24px;background:#fff;border:1px solid rgba(1,54,108,.1);box-shadow:0 10px 24px rgba(12,35,52,.08);}
.process-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.premium-process-card .process-step-number{margin:0;width:38px;height:38px;border-radius:50%;background:#01366c;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;}
.premium-process-card h3,.premium-process-card p{margin-left:0!important;margin-right:0!important;}
.investigation-feature{display:grid;grid-template-columns:.85fr 1.15fr;gap:24px;align-items:center;background:#f8fbff;border:1px solid rgba(1,54,108,.1);border-radius:20px;padding:20px;margin-bottom:28px;box-shadow:0 12px 28px rgba(12,35,52,.08);}
.investigation-feature img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:16px;display:block;}
.investigation-feature h3{margin-bottom:10px;}
.case-value-panel{background:linear-gradient(180deg,#fff,#f8fbff);border:1px solid rgba(1,54,108,.12);border-radius:22px;padding:34px;box-shadow:0 16px 34px rgba(12,35,52,.1);}
.case-value-lead{max-width:780px;margin:0 auto 24px!important;color:#374151;font-size:18px!important;}
.case-value-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:20px 0 20px;}
.case-value-factor{background:#fff;border:1px solid rgba(1,54,108,.1);border-radius:16px;padding:18px;text-align:left;box-shadow:0 8px 20px rgba(12,35,52,.06);}
.case-value-factor h3{font-size:18px;margin:14px 0 8px;}
.case-value-factor p{font-size:14px;line-height:1.55;color:#4b5563;}
.case-value-disclaimer{font-size:14px!important;color:#6b7280;margin:10px auto 22px!important;max-width:720px;}
.case-value-cta{margin-top:4px;}
.compact-cta-row{display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:28px;}
.compact-cta-row .btn-primary,.compact-cta-row .btn-secondary{font-size:16px!important;padding:13px 20px!important;box-shadow:0 4px 12px rgba(12,35,52,.14)!important;}
.compact-cta-secondary{background:#01468a!important;color:#fff!important;}
.prem-mobile-header-call{display:none;}
.stop-section .stop-section-cta::before{content:"Serious injury review • Evidence preservation • Insurance path";display:block;width:100%;color:rgba(255,255,255,.88);font-weight:700;margin-bottom:16px;}
@media(max-width:768px){.hero-section .hero-attorney-img{object-fit:cover!important;object-position:center center!important;max-height:225px!important;background:rgba(255,255,255,.03);}}
@media(max-width:768px){
  html,body{max-width:100%;overflow-x:hidden;}
  .sticky-header .container,.sticky-header .header-content{max-width:100%!important;box-sizing:border-box!important;}
  .sticky-header .container{padding-left:10px!important;padding-right:10px!important;}
  .sticky-header{overflow:hidden!important;}
  .sticky-header .header-content{display:flex!important;flex-direction:row!important;justify-content:space-between!important;align-items:center!important;position:relative!important;min-height:42px!important;}
  .sticky-header .header-logo{max-width:82px!important;flex:0 0 auto!important;}
  .sticky-header .header-cta-mobile{display:inline-flex!important;position:fixed!important;left:108px!important;top:7px!important;z-index:1400!important;align-items:center!important;justify-content:center!important;width:78px!important;max-width:78px!important;min-width:78px!important;padding:9px 10px!important;white-space:nowrap!important;overflow:hidden!important;text-align:center!important;margin-left:0!important;background:linear-gradient(180deg,#0d9d6b 0%,#059669 55%,#047857 100%)!important;color:#fff!important;border-radius:10px!important;}
  .sticky-header .header-cta-mobile .call-btn-icon{display:none!important;}
  .sticky-header .header-cta-mobile .call-btn-sub{font-size:0!important;line-height:0!important;margin:0!important;}
  .sticky-header .header-cta-mobile .call-btn-sub::after{content:"Call";font-size:15px!important;line-height:1!important;display:inline-block!important;font-weight:800!important;}
  .hero-section .container,.hero-section .hero-content{max-width:100%;min-width:0;overflow:hidden;}
  .hero-section{min-height:auto!important;}
  .hero-section .hero-content{display:flex!important;flex-direction:column!important;align-items:center!important;gap:10px!important;padding-top:8px!important;padding-bottom:12px!important;}
  .hero-section .hero-text{width:100%!important;max-width:100%!important;min-width:0;padding-left:14px!important;padding-right:14px!important;box-sizing:border-box!important;text-align:center!important;}
  .hero-section .hero-text h1,.hero-section .hero-subhead,.hero-section .hero-reframe-line{width:100%;max-width:315px;margin-left:auto!important;margin-right:auto!important;white-space:normal!important;overflow-wrap:break-word;word-break:normal;}
  .hero-section .hero-text h1{font-size:30px!important;line-height:1.1!important;margin-bottom:10px!important;max-width:325px;}
  .hero-section .hero-subhead.hero-subtext{font-size:19px!important;line-height:1.32!important;margin-bottom:8px!important;font-weight:700!important;}
  .hero-section .hero-subhead .hero-tagline{font-size:16px!important;line-height:1.35!important;}
  .hero-section .hero-reframe-line{font-size:16px!important;line-height:1.45!important;margin-top:6px!important;margin-bottom:10px!important;}
  .hero-section .hero-attorney-wrap{width:min(100%,310px);max-width:310px;margin-left:auto;margin-right:auto;overflow:visible;}
  .hero-section .hero-attorney-img{width:100%!important;max-width:310px!important;}
  .hero-section .hero-cta-group{justify-content:center!important;width:100%;max-width:100%;}
  .hero-section .hero-cta-group .call-cta-wrap{width:100%;max-width:340px;}
  .hero-section .hero-cta-group a{width:100%;max-width:100%;text-align:center;}
  .hero-section .hero-cta-group .call-btn-sub::after{content:"Call Now"!important;}
  .hero-section .call-cta-below{display:none!important;}
  .hero-section .hero-review-badges{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;max-width:240px!important;margin-left:auto!important;margin-right:auto!important;justify-items:center!important;}
  .hero-section .hero-review-badge-item{width:100%!important;justify-content:center!important;}
  .hero-attorney-wrap::after{left:10px;bottom:38px;font-size:10px;padding:6px 9px;}
  .case-checklist,.evidence-grid,.case-value-grid{grid-template-columns:1fr;}
  .comp-damage-grid{grid-template-columns:1fr;}
  .comp-damage-gallery{grid-template-columns:1fr;}
  .serious-banner{padding:24px 18px;}
  .serious-banner__content,.investigation-feature{grid-template-columns:1fr;}
  .injury-signal-pill{font-size:13px;}
  .evidence-board,.case-value-panel{padding:24px 18px;}
  .premium-service-card.accident-item,.premium-check-card.case-checklist-item{padding:18px;}
  .premium-service-card.accident-item.accident-item--photo-card{padding:0!important;}
  .accident-item.accident-item--photo-card .accident-item-body{padding:18px!important;}
  .premium-icon-badge{width:40px;height:40px;border-radius:13px;}
  .prem-icon{width:20px;height:20px;}
  .compact-cta-row{margin-top:22px;gap:10px;}
  .compact-cta-row .btn-primary,.compact-cta-row .btn-secondary{width:100%;max-width:320px;font-size:15px!important;padding:13px 16px!important;}
}
.mobile-sticky-cta{padding-bottom:env(safe-area-inset-bottom,0);}
</style>
<!-- GTM injected at top of head -->`
  );

  h = h.replace(/<body>/, `<body ${p.bodyAttrs}>`);

  h = h.replace(/<title>[^<]*<\/title>/, `<title>${escAttr(p.title)}</title>`);
  h = h.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escAttr(p.metaDesc)}"`
  );
  if ((p.ogTitle || p.ogDesc) && !h.includes('property="og:title"')) {
    h = h.replace(
      "</head>",
      `    <meta property="og:title" content="${escAttr(p.ogTitle || p.title)}">
    <meta property="og:description" content="${escAttr(p.ogDesc || p.metaDesc)}">
</head>`
    );
  }
  h = h.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${escAttr(p.canonical)}"`
  );

  h = h.replace(
    /<link rel="preload" as="image" href="\/images\/la\/attorney-hero-400\.webp"[^>]*>/,
    `<link rel="preload" as="image" href="${heroImage.src}" fetchpriority="high">`
  );

  h = h.replace(/<h1>Nursing Home Abuse Attorneys in Los Angeles<\/h1>/, `<h1>${p.h1}</h1>`);
  h = h.replace(
    /<p class="hero-subhead hero-subtext"><span class="hero-tagline">[\s\S]*?<\/span> <span class="hero-highlight">[\s\S]*?<\/span>[\s\S]*?<\/p>/,
    `<p class="hero-subhead hero-subtext">${p.heroSub}</p>`
  );
  h = h.replace(
    /<p class="hero-reframe-line">[\s\S]*?<\/p>/,
    `<p class="hero-reframe-line">${p.heroReframe}</p>`
  );
  h = h.replace(
    /<div class="service-areas">\s*<strong>Serving:<\/strong> Los Angeles County\s*<\/div>/,
    `<div class="service-areas"><strong>Serving:</strong> California</div>`
  );

  h = h.replace(
    /<div class="hero-cta-group hero-cta">\s*\n\s*<div class="call-cta-wrap">\s*\n\s*<a href="tel:844-467-4335" class="btn-primary call-btn" data-callrail-phone="844-467-4335"><span class="call-btn-num">844-467-4335<\/span><span class="call-btn-sub">Free Case Review<\/span><\/a>\s*\n\s*\n\s*<\/div>\s*\n\s*<\/div>/,
    `<div class="hero-cta-group hero-cta" style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;">
                        <div class="call-cta-wrap">
                            <a href="#case-evaluation" class="btn-primary" style="text-align:center;"${ctaDataAttr(p)}>Free Case Review</a>
                        </div>
                        <div class="call-cta-wrap">
                            <a href="tel:844-467-4335" class="btn-secondary call-btn" data-callrail-phone="844-467-4335"${phoneDataAttr(p)}><span class="call-btn-num">844-467-4335</span><span class="call-btn-sub">Call Now</span></a>
                        </div>
                    </div>`
  );

  h = h.replace(
    /<div class="hero-attorney-wrap">\s*<picture>[\s\S]*?<\/picture>\s*<p class="hero-attorney-caption"[^>]*>[\s\S]*?<\/p>\s*<\/div>/,
    `<div class="hero-attorney-wrap">
                    <img src="${heroImage.src}" alt="${escAttr(
                      heroImage.alt
                    )}" class="hero-attorney-img" width="400" height="606" fetchpriority="high" decoding="async" style="object-fit:cover;border-radius:12px;max-height:min(70vh,560px);width:100%;height:auto;">
                <p class="hero-attorney-caption" style="margin-top:8px;font-size:14px;color:rgba(255,255,255,0.9);font-weight:500;">${p.heroCaption}</p>
                </div>`
  );

  if (p.heroBgImage) {
    const bgUrl = getImage(p.heroBgImage, null);
    if (bgUrl) {
      h = h.replace(
        '<section class="hero hero-section">',
        `<section class="hero hero-section construction-hero-with-bg" style="background-image:linear-gradient(105deg,rgba(12,35,52,.93) 0%,rgba(12,35,52,.85) 42%,rgba(1,54,108,.52) 100%),url('${bgUrl}');background-size:cover;background-position:center;background-repeat:no-repeat;">`
      );
    }
  }

  h = h.replace(
    /<h2 style="text-align: center;">Our Legal Team<\/h2>/,
    `<h2 style="text-align: center;">${p.trustH2}</h2>`
  );
  h = h.replace(
    /<p class="section-sub" style="text-align: center;">Holding nursing homes accountable[\s\S]*?<\/p>/,
    `<p class="section-sub" style="text-align: center;">${p.trustSub}</p>`
  );

  h = h.replace(/value="New Nursing Home Neglect Lead"/, `value="${escAttr(p.formSubject)}"`);
  h = h.replace(
    /<h2 class="cta-heading" style="text-align: center;">Get Your Free Case Evaluation<\/h2>/,
    `<h2 class="cta-heading" style="text-align: center;">${p.formH2}</h2>`
  );
  h = h.replace(
    /<p style="text-align: center; font-size: 18px; color: var\(--brand-gray-700\); margin-bottom: 32px;">A few quick questions\.[\s\S]*?<\/p>/,
    `<p style="text-align: center; font-size: 18px; color: var(--brand-gray-700); margin-bottom: 32px;">${p.formIntro}</p>`
  );

  h = h.replace(
    /(<select class="form-input form-select" name="situation_type" id="situation_type" required[^>]*>\s*<option value="">— Select one —<\/option>)[\s\S]*?(<\/select>)/,
    `$1\n${buildSituationOptions(p.situationOptions)}                        $2`
  );

  h = h.replace(
    /placeholder="Describe what happened to your loved one \(e\.g\. when you noticed, facility name, current condition\)"/,
    `placeholder="Where were you injured, what was unsafe, and what treatment did you receive?"`
  );

  h = h.replace(
    /Real reviews from real clients across Los Angeles County/,
    "Real reviews from real clients across California"
  );

  h = h.replace(
    /<section class="accident-types section-with-bg section-alt">[\s\S]*?<\/section>\s*\n\s*<section class="section-with-bg">\s*\n\s*<div class="container">\s*\n\s*<div class="section-content">\s*\n\s*<h2 style="text-align: center;">Pressure Ulcers and Bed Sore Negligence<\/h2>[\s\S]*?<\/section>/,
    `<section class="accident-types section-with-bg section-alt">
        <div class="container">
            <h2>${p.casesH2}</h2>
            <p class="lead-text subtext-muted" style="text-align: center; margin-bottom: 32px; max-width: 700px; margin-left: auto; margin-right: auto;">${p.casesLead}</p>
            <div class="accident-grid${p.casesCards?.length || p.caseCardImages?.length ? " accident-grid--photo-cards" : ""}">
${p.casesCards?.length ? accidentGridFromCasesCards(p.casesCards) : accidentGrid(p.casesItems, p.caseAccentImages, p.caseCardImages)}
            </div>
            ${compactCta(p)}
        </div>
    </section>

    <section class="section-with-bg">
        <div class="container">
            <div class="section-content">
                <h2 style="text-align: center;">${p.hazardsH2}</h2>
                <p class="lead-text subtext-muted" style="text-align: center; max-width: 720px; margin: 0 auto 24px;">${p.hazardsLead}</p>
                <figure style="max-width: 800px; margin: 24px auto 0;">
                    <img src="${p.hazardsFigure.src}" alt="${escAttr(p.hazardsFigure.alt)}" width="1024" height="682" loading="lazy" decoding="async" style="width: 100%; height: auto; border-radius: var(--card-radius); object-fit: cover;">
                    <figcaption style="text-align:center;margin-top:12px;font-size:15px;color:var(--brand-gray-600);">${p.hazardsFigure.caption}</figcaption>
                </figure>
                ${
                  p.hazardsSecondFigure
                    ? `<figure style="max-width: 800px; margin: 32px auto 0;">
                    <img src="${p.hazardsSecondFigure.src}" alt="${escAttr(
                        p.hazardsSecondFigure.alt
                      )}" width="1024" height="682" loading="lazy" decoding="async" style="width: 100%; height: auto; border-radius: var(--card-radius); object-fit: cover;">
                    <figcaption style="text-align:center;margin-top:12px;font-size:15px;color:var(--brand-gray-600);">${p.hazardsSecondFigure.caption}</figcaption>
                </figure>`
                    : ""
                }
            </div>
        </div>
    </section>`
  );

  let notForBlock = "";
  if (p.extraNotForSection) {
    notForBlock = `
    <section class="section-with-bg section-alt">
        <div class="container">
            <div class="section-content">
                <h2 style="text-align: center;">This Is Not For General Landlord-Tenant Disputes</h2>
                <p class="lead-text subtext-muted" style="text-align: center; max-width: 720px; margin: 0 auto 16px;">We do <strong>not</strong> handle on this intake path:</p>
                <ul class="injury-list-remaining" style="max-width:640px;margin:0 auto;text-align:left;">
                    <li><span>•</span> Rent disputes</li>
                    <li><span>•</span> Eviction defense</li>
                    <li><span>•</span> Security deposit disputes</li>
                    <li><span>•</span> Mold-only complaints</li>
                    <li><span>•</span> General habitability complaints</li>
                    <li><span>•</span> Neighbor disputes</li>
                    <li><span>•</span> Noise complaints</li>
                    <li><span>•</span> Maintenance complaints with no injury</li>
                </ul>
            </div>
        </div>
    </section>`;
  }

  const signsChecklistClass = p.signsChecklistExtraClass ? ` ${p.signsChecklistExtraClass}` : "";
  const signsCalloutBlock = p.signsCallout
    ? `
                <p class="signs-callout-note" role="note">${p.signsCallout}</p>
                ${p.signsCalloutShowCta !== false ? `${compactCta(p)}` : ""}`
    : "";

  h = h.replace(
    /<section id="your-case" class="worth-section section-with-bg"[\s\S]*?<\/section>/,
    `<section id="your-case" class="worth-section section-with-bg" style="background: var(--brand-white); padding-top: 100px;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 16px; font-size: 42px;">${p.signsH2}</h2>
            <p class="lead-text subtext-muted" style="text-align: center; margin-bottom: 40px; max-width: 760px; margin-left: auto; margin-right: auto; font-size: 18px;">${p.signsIntro}</p>
            <div class="case-checklist-wrap">
                <ul class="case-checklist${signsChecklistClass}" id="case-checklist">
${buildSignCards(p.signsItems, p.signsCards)}
                </ul>
                <p class="case-checklist-result" id="case-checklist-result" aria-live="polite">${p.checklistDefault}</p>
                <p class="case-checklist-cta" id="case-checklist-cta" style="display: none; text-align: center; margin-top: 24px;">
                    <a href="#case-evaluation" class="btn-primary"${ctaDataAttr(p)}>Free Case Review</a>
                </p>
            </div>${signsCalloutBlock}
        </div>
    </section>`
  );

  const seriousBannerParagraph =
    p.seriousBannerParagraph ||
    (p.seriousTitle === "Serious Injuries Matter" && !isConstructionPage(p)
      ? "Premises liability cases are stronger when the injury is serious, documented, and tied to a dangerous property condition."
      : p.seriousBody);

  const seriousEvidence = p.omitSeriousAndEvidence
    ? ""
    : `
    <section class="section-with-bg">
        <div class="container">
            <div class="serious-banner">
                <div class="serious-banner__content">
                    <div>
                        <div class="premium-icon-badge">${icon("medicalCross")}</div>
                        <h2>${p.seriousTitle}</h2>
                        <p>${seriousBannerParagraph}</p>
                    </div>
                    <div class="injury-signal-grid" aria-label="Serious injury signals">
                        ${injuryPills()}
                    </div>
                </div>
            </div>
        </div>
    </section>
    ${p.extraNotForSection ? notForBlock : ""}

    <section class="section-with-bg section-alt">
        <div class="container">
            <div class="evidence-board">
                <h2>${p.evidenceTitle}</h2>
                <p class="evidence-board__intro">${p.evidenceIntro || "Property injury cases often depend on proof that can disappear quickly. Photos, reports, witnesses, surveillance, and maintenance records may help show what happened and who was responsible."}</p>
                <div class="evidence-grid">
${buildEvidenceList(p.evidenceItems)}
                </div>
                ${compactCta(p)}
            </div>
        </div>
    </section>`;

  const caseValueFrontHtml = p.caseValueBeforeComp
    ? `    <section class="worth-section section-with-bg section-alt" id="why-more-than-workers-comp">
        <div class="container">
            <h2 style="font-size: 42px; margin-bottom: 24px; text-align: center;">${p.howMuchTitle}</h2>
            ${buildCaseValue(p)}
        </div>
    </section>`
    : "";

  const compSectionDefault = `    <section class="section-with-bg">
        <div class="container">
            <div class="section-content">
                <h2 style="text-align: center;">${p.compH2}</h2>
                <p class="lead-text subtext-muted" style="text-align: center; margin-bottom: 24px;">${p.compLead}</p>
                <div class="injury-cards injury-cards--four">
                    <div class="injury-card">
                        <img src="${p.compCards[0][1]}" alt="${escAttr(p.compCards[0][2])}" width="400" height="180" loading="lazy">
                        <div class="premium-icon-badge" style="margin:-28px auto 10px;position:relative;">${icon("medicalCross")}</div>
                        <div class="injury-card-text">${p.compCards[0][0]}</div>
                    </div>
                    <div class="injury-card">
                        <img src="${p.compCards[1][1]}" alt="${escAttr(p.compCards[1][2])}" width="400" height="180" loading="lazy">
                        <div class="premium-icon-badge" style="margin:-28px auto 10px;position:relative;">${icon("dollar")}</div>
                        <div class="injury-card-text">${p.compCards[1][0]}</div>
                    </div>
                    <div class="injury-card">
                        <img src="${p.compCards[2][1]}" alt="${escAttr(p.compCards[2][2])}" width="400" height="180" loading="lazy">
                        <div class="premium-icon-badge" style="margin:-28px auto 10px;position:relative;">${icon("users")}</div>
                        <div class="injury-card-text">${p.compCards[2][0]}</div>
                    </div>
                    <div class="injury-card">
                        <img src="${p.compCards[3][1]}" alt="${escAttr(p.compCards[3][2])}" width="400" height="180" loading="lazy">
                        <div class="premium-icon-badge" style="margin:-28px auto 10px;position:relative;">${icon("shieldCheck")}</div>
                        <div class="injury-card-text">${p.compCards[3][0]}</div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

  const compSectionOut = p.compDamageItems ? buildCompensationDamagesSection(p) : compSectionDefault;

  h = h.replace(
    /<section class="section-with-bg">\s*\n\s*<div class="container">\s*\n\s*<div class="section-content">\s*\n\s*<h2 style="text-align: center;">Compensation in Nursing Home Neglect Cases<\/h2>[\s\S]*?<\/section>/,
    seriousEvidence + caseValueFrontHtml + `

` + compSectionOut
  );

  const coreProcessWorthRegex =
    /<section class="core-trust section-with-bg section-alt">[\s\S]*?<\/section>\s*<section class="process-section section-with-bg">[\s\S]*?<\/section>\s*<section class="worth-section section-with-bg">[\s\S]*?<\/section>/;

  if (p.caseValueBeforeComp) {
    h = h.replace(coreProcessWorthRegex, `${htmlProcessSection(p)}\n\n${htmlWhySection(p)}`);
  } else {
    h = h.replace(
      /<section class="core-trust section-with-bg section-alt">[\s\S]*?<\/section>\s*\n\s*<section class="process-section section-with-bg">[\s\S]*?<\/section>\s*\n\s*<section class="worth-section section-with-bg">\s*\n\s*<div class="container">\s*\n\s*<h2 style="font-size: 42px; margin-bottom: 24px;">How Much Compensation Could You Receive\?<\/h2>/,
      `<section class="core-trust section-with-bg section-alt">
        <div class="container">
            <h2 style="text-align: center; font-size: 42px; margin-bottom: 24px;">${p.whyH2}</h2>
            <p class="subtext-muted" style="text-align: center; font-size: 20px; color: var(--brand-gray-700); margin-bottom: 56px; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.7;">${p.whyIntro}</p>
            <div class="trust-grid">
${buildWhyCards(p.whyCards)}
            </div>
        </div>
    </section>

    <section class="process-section section-with-bg">
        <div class="container">
            <h2 style="text-align: center;">${p.investigateH2}</h2>
            <p class="lead-text subtext-muted" style="text-align: center; margin-bottom: 32px;">${p.investigateIntro}</p>
            <div class="investigation-feature">
                <img src="${getImage(p.investigationPlannedImage || "attorneys-consultation-premises-hero.png", HERO_CONFIG.heroConsultationFallback)}" alt="${escAttr(p.investigationFeatureAlt || "Attorney reviewing unsafe property injury evidence with client")}" width="420" height="315" loading="lazy" decoding="async">
                <div>
                    <h3>Evidence-first case review</h3>
                    <p>Property injury claims often turn on fast evidence preservation, medical documentation, and identifying the business, owner, landlord, or maintenance company that controlled the hazard.</p>
                </div>
            </div>
            <div class="process-steps process-steps--with-images">
${buildInvestigateSteps(p.investigateSteps)}
            </div>
            ${compactCta(p)}
            <div style="text-align: center; margin-top: 48px;">
                <p style="margin-top: 16px; color: var(--brand-gray-700);">Questions about your incident? Call <a href="tel:844-467-4335" style="color: var(--brand-blue); text-decoration: none; font-weight: 800; font-size: 1.2em; letter-spacing: 0.02em;"><span data-callrail-phone="844-467-4335">844-467-4335</span></a> | Available 24/7</p>
            </div>
        </div>
    </section>

    <section class="worth-section section-with-bg">
        <div class="container">
            <h2 style="font-size: 42px; margin-bottom: 24px;">${p.howMuchTitle}</h2>`
    );
  }

  if (!p.caseValueBeforeComp) {
    h = h.replace(
      /<p class="subtext-muted" style="font-size: 20px; color: var\(--brand-gray-700\); max-width: 800px; margin: 0 auto 40px; line-height: 1.7;">There is no set average—every case depends on the severity of harm, the facility's conduct, medical bills, and whether death occurred\.[\s\S]*?<\/p>/,
      buildCaseValue(p)
    );
  }

  h = h.replace(
    /<p>Shawn Rokni is an experienced personal injury attorney in Los Angeles who has represented families in nursing home neglect, elder abuse, and serious injury cases throughout Los Angeles County\.<\/p>/,
    `<p>Shawn Rokni is an experienced California personal injury attorney who represents people seriously injured on unsafe property—including retail, hospitality, apartments, and commercial sites.</p>`
  );

  h = h.replace(
    /<p style="margin-top: 16px;">Prior to representing injured people and families, Shawn worked with insurance companies\. This former insurance attorney experience gives him unique insight into how defendants evaluate and defend claims, helping him build stronger cases and negotiate better settlements for his clients\.<\/p>/,
    `<p style="margin-top: 16px;">Prior to representing injured people, Shawn worked with insurance companies. That experience informs how we preserve evidence, frame liability, and pursue fair compensation from carriers and property defendants.</p>`
  );

  if (p.attorneyBioConstruction) {
    h = h.replace(
      /<p>Shawn Rokni is an experienced California personal injury attorney who represents people seriously injured on unsafe property—including retail, hospitality, apartments, and commercial sites\.<\/p>/,
      `<p>${p.attorneyBioConstruction[0]}</p>`
    );
    h = h.replace(
      /<p style="margin-top: 16px;">Prior to representing injured people, Shawn worked with insurance companies\. That experience informs how we preserve evidence, frame liability, and pursue fair compensation from carriers and property defendants\.<\/p>/,
      `<p style="margin-top: 16px;">${p.attorneyBioConstruction[1]}</p>`
    );
  }

  h = h.replace(
    /<h2>Speak With a Los Angeles Nursing Home Neglect Lawyer Today<\/h2>[\s\S]*?<p style="margin-top: 12px;">Free Consultation • No Fee Unless We Win<\/p>/,
    `<h2>${p.finalH2}</h2>
            <p>${p.finalP}</p>
            <p style="margin-top: 12px;">Free Case Review • Call Now • No Fee Unless We Win</p>`
  );
  if (p.finalBgImage) {
    h = h.replace(
      /<section class="final-cta stop-section">/,
      `<section class="final-cta stop-section" style="background-image:linear-gradient(135deg,rgba(12,35,52,.88),rgba(1,54,108,.78)),url('${getImage(
        p.finalBgImage,
        p.finalBgImage
      )}');background-size:cover;background-position:center;">`
    );
  }

  h = h.replace(
    /<p>Los Angeles personal injury and elder abuse attorneys\. Real trial lawyers, real results\.<\/p>/,
    `<p>${p.footerBlurb}</p>`
  );

  h = h.replace(
    /<div class="result-type">Slip and Fall<\/div>/,
    `<div class="result-type">Unsafe Property Injury</div>`
  );

  if (p.resultTypeLabel) {
    h = h.replace(/<div class="result-type">Unsafe Property Injury<\/div>/, `<div class="result-type">${p.resultTypeLabel}</div>`);
  }

  const ph = JSON.stringify(
    Object.fromEntries(
      p.situationOptions.map(([val]) => [
        val,
        "e.g. date, location, hazard, medical treatment, witnesses",
      ])
    )
  );

  h = h.replace(
    /var placeholders=\{[\s\S]*?\};/,
    `var placeholders=${ph};`
  );

  h = h.replace(
    /detailsTextarea\.placeholder=placeholders\[val\]\|\|'Describe what happened to your loved one'/,
    "detailsTextarea.placeholder=placeholders[val]||'Describe where you were injured and your treatment'"
  );

  h = h.replace(
    /resultEl\.textContent='Many cases stem from understaffing\. We investigate facility care and hold responsible parties accountable\.';/,
    `resultEl.textContent='${p.checklistDefault.replace(/'/g, "\\'")}';`
  );
  h = h.replace(
    /resultEl\.textContent='One or more of these may indicate neglect\. Speak with an attorney to learn your options\.';/,
    `resultEl.textContent='${p.checklistOne.replace(/'/g, "\\'")}';`
  );
  h = h.replace(
    /resultEl\.textContent='If several apply, the facility may be liable\. We can help you understand your options\.';/,
    `resultEl.textContent='${p.checklistMany.replace(/'/g, "\\'")}';`
  );

  h = h.replace(
    /\/\* Slip-and-fall hero: tagline bold on desktop, full subhead below image on mobile \*\//,
    "/* Hero: tagline emphasis on desktop; subhead stacks cleanly on mobile */"
  );
  h = h.replace(/Free Consultation - No Obligation/g, "Free Case Review - No Obligation");
  h = h.replace(
    /<button type="submit" class="btn-primary"[^>]*>Get My Free Review<\/button>/,
    `<button type="submit" class="btn-primary" style="width: 100%; margin-top: 24px;"${ctaDataAttr(p)}>Request Free Case Review</button>`
  );
  h = h.replace(
    /<form action="https:\/\/formsubmit\.co\/ial\.leads\.2024@gmail\.com" method="POST" id="case-evaluation-form">/,
    `<form action="https://formsubmit.co/ial.leads.2024@gmail.com" method="POST" id="case-evaluation-form"${formDataAttr(p)}>`
  );
  h = h.replace(/btn\.textContent='Get My Free Review'/g, "btn.textContent='Request Free Case Review'");
  h = h.replace(
    /Start My Free Review/,
    "Free Case Review"
  );

  return h;
}

const pages = buildPages();
for (const p of pages) {
  let out = applyPage(base, p);
  const dir = path.join(root, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), out, "utf8");
  console.log("Wrote", p.slug);
}
