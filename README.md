# FreshTake — clickable mockup

A high-fidelity, click-through HTML prototype of **FreshTake**, built from the
"GenAI-Powered Review Categorization System" PRD. FreshTake is a workflow tool
that lets restaurant managers paste or upload a batch of customer reviews,
sends them through a Microsoft-Copilot-driven engineered prompt, and gets back
a structured 5-column table (Sentiment · Aspect Tags · Priority · Suggested
Action · 1st Reply) — with a mandatory human-in-the-loop step before any reply
is ever sent.

## How to open

No build step, no server, no dependencies beyond a browser and an internet
connection (for the Tailwind CDN, Google Fonts and Lucide icon CDN).

```
open index.html
```

…or just double-click `index.html`. From there every screen is one click away
and every screen has a path back to the hub.

## Why "FreshTake"

The PRD doesn't name the product (logged as an assumption below). "FreshTake"
was chosen because it does double duty: a **fresh take** on customer feedback
(a new perspective, fast) and a nod to the "fresh/garden" feel the brief asked
for — pairing naturally with a teal/emerald palette, a leaf mark, and copy that
leans into "refreshing," "in one pass," and "in under a minute."

## Screen → PRD traceability

| # | Screen | Purpose | Traces to |
|---|--------|---------|-----------|
| — | `index.html` | Hub: product framing, North Star metric, persona list, flow map, links to every screen | PRD §1 (North Star), §3.3 (flows), §10 (team/personas) |
| 01 | `01-sign-in.html` | Entry point — email/password + SSO, brand framing panel | Implied entry point; not explicitly specified (assumption) |
| 02 | `02-dashboard.html` | GM home: North Star metric (% replied within 24h), weekly snapshot, pending-batch CTA, high-priority queue summary, response-rate sparkline; toggle reveals the first-run empty state | PRD §1 (North Star + targets), §3.3 Story 1 (batch CTA), Story 2 (high-priority summary) |
| 03 | `03-new-batch.html` | Submit a batch: paste text or pull from Google/Yelp/TripAdvisor/CSV, live ≥10-review validation, AI-fallback reliability notice | FR1–FR3 (ingestion), FR2 (≥10 batch-size minimum), §3.6 P2 (multi-platform), NFR (Copilot-unavailable fallback) |
| 04 | `04-processing.html` | "Copilot AI is processing your batch…" with staged progress checklist and a live <30s promise | §3.3 Story 1 (processing state), §8 (batch processing time target <30s/10 reviews) |
| 05 | `05-batch-results.html` | **Core screen** — the 5-column structured table for ~10 reviews incl. the Cust2024-006 N/A case; sortable/filterable by Priority & Sentiment; High-priority sorted first; row → detail; Export CSV/Excel | §3.3 Story 1 (output table, export), Story 1 acceptance (sorted High-first), the PRD's worked examples (Cust2024-001…010) |
| 06 | `06-review-detail.html` | Single review deep-dive: full text, customer ID/date/source, badges + rationale, "why this priority?" explainer, suggested action, **editable** AI-drafted reply with regenerate / approve & send, approval activity trail, N/A edge-case callout | FR9 (mandatory human approval, no automated send), §3.3 Story 3, the PRD's sample reply patterns (gratitude/apology/acknowledgement) |
| 07 | `07-action-queue.html` | Filtered High-priority items across batches; department assignment (Kitchen/FOH/Management); Open → In Progress → Resolved pipeline with timestamps; ≥80%-actioned-in-48h target | §3.3 Story 2, §8 ("≥80% of High-priority negative reviews with logged follow-up action") |
| 08 | `08-trend-report.html` | Monthly trend monitoring: % positive/negative/neutral by month (CSS bar chart), most-tagged aspects ranked, a live ">30% negative" alert banner, rating trend toward +0.3★ (SVG line chart), per-location comparison | §3.3 Story 5 (P2/V2 trend monitoring), §3.6, §8 ("customer review rating trend +0.3★ within 6 months", "negative reviews >30% of month's volume" alert) |
| 09 | `09-prompt-library.html` | Versioned prompt change log (v1.0→v2.3, what changed & measured effect), weekly 20%-sample accuracy audit vs. ≥90%/≥85% targets, hallucination-rate tracker (0% target), "report a miscategorisation" flow | §3.3 Story 4 (P1 prompt iteration), FR10 (weekly 20% manual audit), §8 (categorisation ≥90%, priority ≥85%, hallucination 0% targets) |
| 10 | `10-settings.html` | Locations list, brand-voice/reply-tone sliders + example replies (the engineered prompt's knobs as friendly controls), team & roles, notification preferences, the **locked** "mandatory human approval" toggle with an explanation | FR9 (approval cannot be disabled — shown as a deliberate constraint), §10 (team), §3.6 (brand-voice customization — also an §11 open question) |

Shared chrome (sidebar, topbar, badges, buttons, modals, toasts, tabs, filters,
table sort) lives in `assets/styles.css` (design tokens + component classes)
and `assets/app.js` (vanilla-JS interactivity via `data-*` attributes), and is
reused with identical markup across every screen so nothing visually drifts.

## States covered (not just the happy path)

- **Empty / first-run** — Dashboard (02) has a toggle that swaps between the
  populated view and a "Welcome to FreshTake" first-run empty state with a
  3-step onboarding explainer.
- **Loading / processing** — Processing screen (04): animated progress bar,
  staged checklist, live percentage readout, and a <30-second promise; auto-
  advances to results to simulate the real flow.
- **Validation error** — New batch (03): a dismissible "needs at least 10
  reviews" error banner plus a live-counting textarea that turns the count red
  below the FR2 threshold; the Yelp source tab also shows a "9 available, below
  minimum" notice.
- **Reliability / fallback error** — New batch (03), Processing (04) and
  Settings (10, Approval & Safety tab) all surface the "Copilot AI unavailable
  → automatic fallback to a secondary engineered prompt" behaviour as a
  designed-for state, not a crash.
- **Ambiguous / N/A handling (Cust2024-006)** — visible in three places: the
  results table (05, row highlighted with an info-colored left border and an
  inline explainer), the review detail screen's edge-case callout (06), and the
  prompt-library audit table and hallucination-rate KPI (09).
- **Filtered-empty** — Both the batch-results table (05) and the action queue
  (07) show a "no items match this filter" empty state when filters combine to
  produce zero rows.
- **Locked / constrained control** — Settings (10) renders the mandatory-
  approval toggle as visibly disabled and explains *why* it's locked, rather
  than just omitting the control.

## Assumptions log

Anything below was decided where the PRD was silent or only implied — flagged
here per the mockup-generator's "operating principles."

1. **Product name — "FreshTake."** The PRD does not name the product; the
   brief invited inventing one in a "fresh/garden, neat, simple, refreshing"
   spirit. Chosen for the double meaning (a fresh perspective + a quick
   "take"/read on feedback) and for pairing naturally with the teal palette
   and leaf mark.
2. **Restaurant brand & locations.** "Harvest Kitchen," a casual-dining chain
   with locations named Riverside, Midtown, and Brookfield Heights, with 12
   locations enrolled in the pilot — chosen to sit inside the PRD's stated
   1–50 location target customer profile.
3. **Persona names.** Maria Reyes (General Manager, primary user), Jordan Tate
   (Front-of-House Supervisor), Dana Okafor (Regional Operations Manager), and
   Sankar Kumar Palaniappan (Prompt Engineer / Admin — the one name the PRD
   itself supplies, in its §10 team section). Email addresses, avatars
   initials, and exact titles are invented but consistent across all screens.
4. **Customer IDs & sample reviews.** `Cust2024-001` through `Cust2024-010`
   follow the PRD's own format; review text for 001–010 either reproduces the
   PRD's worked examples verbatim/near-verbatim (the pasta/waiter review, "Best
   pizza I've ever had," "Nice place," "the wait was 45 minutes," "killed my
   appetite," "I found a hair in my food," the two ambiance reviews at
   different severities) or extends them in the same voice for realism.
5. **Sign-in screen design.** Not specified by the PRD — built as a
   conventional split-panel sign-in (brand story + form) with email/password
   and SSO options, since every real product needs an entry point.
6. **Specific operational numbers** not given verbatim in the PRD and invented
   for realism: batch sizes/timestamps (e.g. "Batch #042 · 14 reviews ·
   27s"), the 71% current North-Star reading and its 8-week trend (28%→71%),
   weekly review volume (412 reviews/month across 12 locations), the 91.4%/
   86.2% current accuracy readings shown against the ≥90%/≥85% *targets* (the
   targets themselves are reproduced exactly from the PRD), the May sentiment
   mix (51/33/16%), the 4.10★ current rating vs. 3.92★ baseline (+0.18★ so
   far, against the PRD's stated +0.3★ / 6-month target), aspect-tag
   frequencies, and per-location comparison figures.
7. **Versioned prompt history (v1.0 → v2.3).** The specific version numbers,
   dates, and "what changed / measured effect" narratives in the prompt
   library (09) are invented to make FR10's "versioned prompt change log"
   tangible — they are designed to plausibly explain *how* the system reached
   today's accuracy numbers (e.g. "v2.3 added the N/A rule that dropped the
   hallucination rate from 4% to 0%").
8. **Brand-voice / reply-tone controls.** The PRD says the "engineered prompt"
   should be tunable but doesn't specify a UI; sliders (formal↔playful,
   brief↔detailed, reserved↔expressive/emoji) plus an example-reply library
   were chosen as a friendly, non-technical way to expose prompt-tuning to
   non-engineers — directly informing one of §11's open questions (brand-voice
   customization).
9. **Status pipeline labels** (Open / In Progress / Resolved) and department
   options (Kitchen / Front-of-House / Management) are taken directly from
   Story 2 in the PRD's flow description.
10. **Notification preferences list** (new batch done, high-priority flagged,
    action nearing 48h, monthly report ready) is an invented but conventional
    set, since the PRD references alerting behaviour (§3.6, the >30%-negative
    alert) without enumerating a settings surface.

## Open questions carried over from PRD §11

These are the PRD's own open questions — reproduced here so reviewers can see
what still needs a human decision. The mockup takes a defensible default stance
on each (see callouts on screens 06, 09, 10) but does not resolve them:

1. **Automated reply-sending threshold.** Should there ever be a confidence
   level at which FreshTake could send low-risk replies (e.g. simple "thank
   you" responses to short positive reviews) without per-item human approval —
   or does FR9's "always human-in-the-loop" rule remain absolute regardless of
   confidence? *(Surfaced in the mockup as a locked, explained toggle on
   Settings → Approval & Safety, screen 10.)*
2. **Brand-voice customization.** How much should each location/brand be able
   to customize reply tone, and how is that tone learned/encoded in the
   engineered prompt without each GM needing prompt-engineering skill?
   *(Surfaced as tone sliders + example-reply library on screen 10.)*
3. **Multi-language support.** The pilot data and worked examples are all in
   English — how should FreshTake categorise and draft replies for reviews
   submitted in other languages, and should reply tone/idiom rules (e.g. the
   "killer pasta" vs. "killed my appetite" contrast) be re-derived per
   language?
4. **Priority-escalation alert routing.** Beyond the in-app action queue, who
   should be notified — and through what channel (SMS, email, Teams) — when a
   High-priority item (especially a health/safety flag like Cust2024-003's
   "hair in my food") is logged but not actioned within the target window?
5. **Longitudinal accuracy decay & re-validation cadence.** How often should
   the categorisation/priority models be re-validated against fresh human
   judgement as menus, seasons, and customer language evolve — is the weekly
   20% audit (FR10) sufficient indefinitely, or should its sampling rate or
   scope change over time? *(The audit cadence is shown as a steady weekly
   rhythm on screen 09; the PRD leaves the long-term cadence open.)*

## Self-review checklist — result

- **Coverage** ✅ — all five PRD §3.3 flows have a complete, navigable screen
  sequence; all four personas (Maria, Jordan, Dana, Sankar) have screens that
  serve their stated jobs (traceability table above).
- **States** ✅ — empty/first-run, loading/processing, validation error,
  reliability-fallback notice, filtered-empty, ambiguous/N/A handling, and a
  deliberately-locked control are all present (see "States covered" above).
  *Found & fixed during review:* the new-batch screen initially showed only
  the happy-path paste flow — added the live ≥10 counter, the dismissible
  validation banner, and the "9 available / below minimum" Yelp notice so the
  FR2 rule is visible, not just implied.
- **Navigation** ✅ — every link/button resolves to a real file; `index.html`
  links to all 11 screens individually plus via the flow map; every screen's
  sidebar reaches every other screen and the hub. *Found & fixed:* an early
  draft of the batch-results table nested two filter-scope wrapper `<div>`s by
  mistake (a copy/paste artifact) — removed the duplicate and reworked
  `app.js`'s filter logic to combine multiple `data-filter-group`s on one
  scope with AND logic so Priority + Sentiment filters compose correctly.
- **Content realism** ✅ — zero lorem ipsum; every review, name, suggested
  action, and reply draft is domain-specific and either drawn from or
  consistent with the PRD's own worked examples (Cust2024-001…010, the
  "killer pasta"/"killed my appetite" contrast, the two ambiance reviews of
  differing severity, the gratitude/apology/acknowledgement reply templates).
- **Consistency** ✅ — sidebar, topbar, badges (sentiment/priority/status),
  chips, buttons, cards, modals, toasts, and the table/filter components share
  one definition in `assets/styles.css` + `assets/app.js` and identical markup
  patterns across all 10 screens.
- **Responsive & accessible** ✅ — mobile-first grid/flex layouts collapse
  cleanly from 375px (sidebar becomes a slide-over via the hamburger toggle,
  KPI grids stack, tables scroll horizontally); every input has a real
  `<label>`; landmark elements (`<header>`, `<nav>`, `<main>`, `<aside>`) are
  used throughout; focus-visible rings (`.ft-focus`) meet WCAG AA contrast
  against the light surfaces; the SVG rating-trend chart carries a descriptive
  `aria-label`/`role="img"` for screen readers in lieu of a data table.
- **Assumptions logged** ✅ — see the numbered log above; every invented name,
  number, and design decision not given verbatim by the PRD is recorded there.
