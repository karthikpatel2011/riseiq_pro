# RiseIQ — Codebase Documentation

> For any developer, AI, or collaborator who needs to understand this project quickly.

---

## What is RiseIQ?

**RiseIQ** is an AI-powered career guidance platform. It helps students, job seekers, government exam aspirants, and startup founders get a personalized roadmap to reach their career goals — using AI-generated plans, mock interviews, skill-gap analysis, mentor sessions, and opportunity matching. All in one platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (via Vite) |
| Bundler | Vite |
| Styling | Plain CSS (`index.css`) — no Tailwind, no CSS modules |
| Font | Google Fonts — `Geom` |
| Language | JavaScript (JSX) |
| Package Manager | npm |

---

## Project Structure

```
RiseIq/
├── index.html                  # HTML entry point (has viewport meta tag)
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # React root render
    ├── App.jsx                 # Root component — assembles all pages in order
    ├── App.css                 # App-level styles
    ├── index.css               # ALL global styles (one big file, ~1985 lines)
    ├── assets/                 # Images (logo, hero illustration, phase images, mouse icon)
    └── Components/
        ├── Navbar.jsx
        ├── Home.jsx
        ├── Secondpage.jsx
        ├── Thirdpage.jsx
        ├── Fourthpage.jsx
        ├── Fifthpage.jsx
        ├── Sixthpage.jsx
        ├── Seventh.jsx
        ├── Eightcard.jsx
        ├── StatCard.jsx        # Reusable card (used by Thirdpage)
        ├── StatCard2.jsx       # Reusable card with bullets (used by Fourthpage)
        └── StatCard3.jsx       # Reusable card variant (used by Fifthpage)
```

---

## Page-by-Page Breakdown

All pages are assembled top-to-bottom in `App.jsx` in this order:

---

### 1. `Navbar.jsx`
**CSS classes:** `.Navbar`, `.nav-toggle`, `.nav-menu`, `.nav-menu--open`, `.lii`, `.butt`, `.but1`, `.but2`, `.logo`

- Fixed top navigation bar (stays on screen while scrolling)
- **Left:** Logo image
- **Right:** Nav links (Feature, How It Works, Pricing, Testimonials, FAQ) + Login & Signup buttons
- **Mobile:** Hamburger menu toggle (3-line icon → X animation). Menu slides down as a full-width overlay
- Uses `useState` to track open/closed state

---

### 2. `Home.jsx` — Hero Section
**CSS classes:** `.cents`, `.mainimg`, `.mainimg-inner`, `.main1`, `.start`, `.but11`, `.but22`, `.mouse`

- Full-viewport hero section with blue-to-purple gradient background
- **Left (desktop):** Large illustration image (`Seminar-amico.png`)
- **Right (desktop):** Headline text + "Get Started" & "How It Works" buttons + mouse scroll icon
- On mobile: stacks vertically (text on top, image below)

---

### 3. `Secondpage.jsx` — Marquee Banner
**CSS classes:** `.secmain`, `.secc`, `.marquee-track`

- Thin horizontal scrolling ticker/marquee band
- White background, continuously scrolls left with: `Training • Mock Interview • Communication Skills • Confidence • Problem Solving • Jobs`
- Two copies of the text are rendered side by side to create a seamless infinite scroll effect (`animation: secMarquee`)

---

### 4. `Thirdpage.jsx` — The Problem Statement
**CSS classes:** `.thirdmain`, `.thirpge`, `.hh`, `.card` (via `StatCard.jsx`)

- Blue gradient section
- Headline: **"The Problem is Massive. We're Here to Solve It."**
- 4 stat cards rendered via `StatCard.jsx`:
  - 300M+ Students Graduate Yearly
  - 70% Feel Unprepared For Real Jobs
  - 85% Never Get Career Mentorship
  - 1 Platform. Every Skill. (RiseIQ's answer)
- Cards use `.card` class — light purple/lavender gradient, hover shine effect

---

### 5. `Fourthpage.jsx` — Who Gets Benefited
**CSS classes:** `.thirdmain2`, `.thirpge`, `.hh`, `.card1` (via `StatCard2.jsx`)

- Grey-to-skyblue gradient section
- Headline: **"Who Will Get Benefited."**
- 4 dark cards rendered via `StatCard2.jsx`, each for a user type:
  - **Students** — AI roadmap for internships & placements
  - **Job Seekers** — Role-specific prep, ATS resume, interview drills
  - **Govt Exam Aspirants** — Personalized syllabus, mock tests, analytics
  - **Startup Entrepreneurs** — Business model validation, go-to-market plan
- Cards use `.card1` class — dark/black gradient, bullet list layout, CTA button

---

### 6. `Fifthpage.jsx` — How It Works (3 Steps)
**CSS classes:** `.fifthmain`, `.thirpge`, `.hh`, `.card3` (via `StatCard3.jsx`)

- Dark blue-to-black gradient section
- Headline: **"Career Clarity in 3-Steps."**
- 3 cards rendered via `StatCard3.jsx`:
  - **Step 1:** Create Your Profile
  - **Step 2:** Get Your AI Roadmap
  - **Step 3:** Execute & Rise
- Cards use `.card3` class — light blue gradient, same shine hover effect as `.card`

---

### 7. `Sixthpage.jsx` — One Platform, Your Entire Career
**CSS classes:** `.sixth`, `.six-align`, `.Cardsix`, `.Cardsix--column`, `.learn`, `.gap`

- White-to-purple gradient section
- Headline: **"One Platform. Your Entire Career."**
- 3 phase rows, each with a large illustration image + heading/description:
  - **Phase-01:** Land Your First Opportunity (image left, text right)
  - **Phase-02:** Raise to High Paying Roles (text left, image right on desktop; image top, text bottom on mobile — uses `.Cardsix--column`)
  - **Phase-03:** Become a Mentor, Give Back (image left, text right)
- Images are `learning.png`, `phase2.png`, `phase3.png` from `/assets`

---

### 8. `Eightcard.jsx` — Pricing Plans
**CSS classes:** `.eight`, `.hg`, `.pricing`, `.cord`, `.featured`, `.badge`, `.price`, `.description`

- White-to-indigo-to-white gradient section
- Headline: **"Invest in Your Future. Cancel Anytime."**
- 3 pricing cards:
  - **Starter** — $0/forever free
  - **Pro** — $9/mo (featured/highlighted card, "Most Popular" badge)
  - **Elite** — $19/mo ("Best Value" badge)
- `.featured` card is highlighted in blue (`#3955e4`)
- Cards use `.cord` class

---

### 9. `Seventh.jsx` — Enterprise / Institutional Plans
**CSS classes:** `.mainpage0`, `.copo`, `.enterprise-card`, `.left`, `.right`, `.tag`, `.feature-card`

- White-to-blue-purple gradient section
- Headline: **"Institutions & Corporate — RiseIQ Is here."**
- Two-column layout:
  - **Left (`.left`):** Tag, heading "Corporate & Institutional", description, "Custom" pricing, "Contact Sales" button
  - **Right (`.right`):** 2×3 grid of 6 feature cards (Bulk Accounts, Admin Dashboard, Branded Platform, Custom Goal Tracks, Dedicated Manager, API & Integrations)
- On mobile: stacks to single column

---

## Reusable Card Components

| Component | Used By | CSS Class | Style |
|---|---|---|---|
| `StatCard.jsx` | Thirdpage, Fifthpage | `.card` / `.card3` | Light gradient, shine hover, stat + description |
| `StatCard2.jsx` | Fourthpage | `.card1` | Dark/black, bullet list, CTA button |
| `StatCard3.jsx` | Fifthpage | `.card3` | Light blue gradient, stat + description |

---

## CSS Architecture

All styles live in a **single file**: `src/index.css`.

Key sections in order:
1. **Reset & base** — box-sizing, html/body/root, img
2. **Navbar** — fixed, hamburger toggle, mobile menu overlay
3. **Buttons** — `.but1`, `.but2`, `.but11`, `.but22`, `.but12`, `.card1-btn` (all use animated gradients)
4. **Home/Hero** — `.cents`, `.mainimg`, `.main1`
5. **Responsive breakpoints for Hero** — 901px+, 1024px, 900px, 768px, 480px
6. **Secondpage marquee** — `.secmain`, `.secc`, `.marquee-track`
7. **Thirdpage cards** — `.thirdmain`, `.thirpge`, `.hh`, `.card`
8. **Fourthpage cards** — `.thirdmain2`, `.card1` and all `.card1-*` variants
9. **Fifthpage cards** — `.fifthmain`, `.card3` and all `.card3-*` variants
10. **Sixthpage** — `.sixth`, `.six-align`, `.Cardsix`, `.Cardsix--column`, `.learn`, `.gap`
11. **Seventh / Enterprise** — `.mainpage0`, `.enterprise-card`, `.left`, `.right`, `.feature-card`
12. **Eightcard / Pricing** — `.eight`, `.hg`, `.pricing`, `.cord`, `.featured`, `.badge`
13. **Mobile media queries** — appended at bottom for Sixthpage, Seventh, Eightcard

---

## Mobile Responsiveness

- Navbar collapses to hamburger at `≤768px`
- Hero stacks vertically at `≤900px`
- All card grids use `auto-fit minmax()` or `flex-wrap`
- Fixed heights (`height: 130vh`, `height: 295vh`) have been replaced with fluid layouts
- Fixed font sizes replaced with `clamp()` for fluid typography
- Phase-02 in Sixthpage uses `.Cardsix--column`: side-by-side on desktop, image-top/text-bottom on mobile

---

## Assets (`src/assets/`)

| File | Used In |
|---|---|
| `logo.png` | Navbar |
| `Seminar-amico.png` | Home hero illustration |
| `mouse.png` | Home scroll indicator |
| `learning.png` | Sixthpage Phase-01 |
| `phase2.png` | Sixthpage Phase-02 |
| `phase3.png` | Sixthpage Phase-03 |
