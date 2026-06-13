# NextBelt LLC — Website

Static marketing site (plain HTML/CSS/JS, no build step) deployed on **Netlify**.
Production: https://next-belt.com

## Structure

| Path | Purpose |
|------|---------|
| `*.html` | One file per page (`index`, `services`, `consulting`, `platform`, `belt-catalog`, `rmi-audit`, `about`, `privacy-policy`, `terms-of-service`, `404`) |
| `styles-new.css` | Single global stylesheet |
| `script.js` | Global JS: mobile nav, contact/demo form (EmailJS), scroll/counter animations, Tawk widget tidy-up |
| `img/team/`, `img/catalog/` | Canonical image locations (WebP/optimized JPEG) |
| `og-image.png` | 1200×630 social share image |
| `netlify.toml` | **Authoritative** Netlify config: redirects, security headers (CSP), cache headers |
| `emailjs-*.html` | EmailJS dashboard email templates (not pages) |
| `.netlify/` | Local Netlify CLI cache — **git-ignored**, do not commit |

## Local development

It's static — open `index.html` directly, or for redirects/headers parity run `netlify dev`.

## Deploy

Push to the connected GitHub repo; Netlify builds from the repo root (`publish = "."`).
Only the root `netlify.toml` is used in production.

## Conventions

- **Cache-busting:** CSS/JS are cached `immutable` for 1 year, busted via a `?v=YYYYMMDD` query string
  (e.g. `styles-new.css?v=20260213`, `script.js?v=20260213`). **Bump the `?v=` token on every CSS/JS change**
  so returning visitors get the new file.
- **Images:** optimize *before* committing. Keep source art elsewhere; commit only web-sized assets
  (favicon ≤180px, logo ~512px, team photos ~400px WebP/JPEG). The repo should not contain multi-MB images.
- **Fonts:** loaded via `<link rel="preconnect">` + Google Fonts stylesheet in each page `<head>`
  (not a CSS `@import`).
- **Canonicals / sitemap:** use the extensionless URL form (`/services`, not `/services.html`) to match
  Netlify `pretty_urls`.

## Third-party integrations

GTM (`GTM-TDB2L8Z5`) + GA4 (`G-Q7BFPQ0K71`), Cookiebot consent, Tawk.to chat, and EmailJS (contact /
demo / quote forms). All required origins are whitelisted in the CSP in `netlify.toml` — update the CSP if
you add or change a third-party script.

## ⚠️ Security TODO — EmailJS form hardening (dashboard, not code)

The form keys (`service_9pdxtom`, `template_mulotoe`, public key) are necessarily public in client JS.
Client-side guards (honeypot + 3s time-trap + submit-lock) are in place, but a bot can still call
`emailjs.send()` directly. The **definitive** fixes live in the EmailJS dashboard and must be enabled:

1. **Allowed Origins** → restrict to `https://next-belt.com` (and `https://www.next-belt.com`) so the keys
   only work from this site.
2. **Enable captcha** (reCAPTCHA/hCaptcha) on the template, and add the captcha widget to the forms.

Until both are on, `info@next-belt.com` and the Zenduty emergency alias
(`nextbelt-emergency@next-belt.zendutyalerts.com`) are exposed to automated spam.

Optional: self-host a version-pinned EmailJS SDK instead of `https://esm.sh/@emailjs/browser` and drop
`esm.sh` from the CSP, to remove the third-party supply-chain dependency on form pages.
