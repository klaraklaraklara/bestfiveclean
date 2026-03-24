# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bestfive Clean is a **single-page static website** for a Czech professional cleaning service (car upholstery, sofas, carpets, mattresses, ozone disinfection). The entire site lives in one self-contained HTML file: `bestfive-clean-4.html`.

## Architecture

The file is a monolithic HTML document (~2200 lines) containing all CSS, HTML, and JavaScript inline:

- **CSS** (lines 1–530): Custom properties in `:root` for the pink/dark theme. Responsive via `@media (max-width: 768px)`. Splash screen, modal, animations, and segment/pricing styles are all embedded.
- **HTML** (lines ~530–1650): Sections in order: splash screen → nav → hero → services grid → video section → segment switcher (households/businesses) → interactive pricing configurator → booking form with EmailJS integration → footer → order modal.
- **JavaScript** (lines ~1650–2241): All logic is vanilla JS with no build step:
  - `PRICES` object: nested pricing data keyed by service type → variant → city → billing period.
  - Pricing configurator: `selectCity()`, `selectType()`, `selectVariant()`, `setMix()`, `renderBilling()`, `renderResult()` — drives an interactive price calculator with promo/mix discounts.
  - `emailjs.send()` for form submission (service ID `service_yvz1dyp`, template `template_q4dz6yr`).
  - City tab switcher, splash screen auto-dismiss, scroll animations via `IntersectionObserver`.

## Development

No build tools, package manager, or dependencies — just open the HTML file in a browser. External resources loaded via CDN:
- Google Fonts (Playfair Display, DM Sans)
- EmailJS SDK (`emailjs-com@3`)

## Key Patterns

- **Language**: All UI text is in Czech.
- **Pricing logic**: Discounts stack multiplicatively — promo (25%) × mix discount (15%/30%/45%) = `totalDisc` factor applied to base prices.
- **Three cities** served: Praha, Brno, Jihlava — each with independent pricing.
- **Segment switcher**: toggles between "Pro domácnosti" and "Pro firmy" panels.
- **Placeholder video links**: YouTube links use `DOPLNIT_LINK` (meaning "fill in link") — these are intentional TODOs.
