# TODO / Roadmap

- Resource eligibility & data
  - Expand criteria (radius, transportation, age, veteran status), tighten server-side validation, and improve filters/sorting/pagination.
  - Add admin CSV import/export with an audit trail.

- Auth & roles
  - Add password reset and email verification flows.
  - Enforce role-based UI guards (admin/partner) and provide a "view as user" mode for admins.

- Admin panel
  - Full CRUD for resources/users/partners/notifications with confirmation states.
  - Role management and analytics.

- Partner portal
  - Onboarding form, status tracking, and document upload.
  - Organization profile management and messaging with admins.

- Notifications
  - Real-time updates plus in-app toasts and user preferences.
  - Scheduled/broadcast jobs and badge sync across views.

- Bookmarks & personalization
  - Tags/notes, sorting/sharing, and "similar resources" suggestions.
  - Offline caching of the last view.

- Profile & eligibility form
  - Client/server validation and a multi-step wizard with progress.
  - Add fields (languages, age, veteranship, employment) and data freshness reminders.

- Accessibility & UX
  - Run Axe/Lighthouse and fix findings; manage focus on route changes.
  - Improve list/card semantics, add a high-contrast toggle, honor reduced-motion, and provide keyboard shortcuts.

- Testing
  - Add backend Supertest coverage.
  - Broaden frontend cases (notifications, admin/partner routes, theme toggle, error boundaries).
  - Add contract tests to keep API mocks aligned with real responses.

- Performance & resilience
  - Consistent skeletons/spinners, retry/backoff handling, and visible API error banners.
  - Cache with SWR/React Query, harden token-refresh handling, and tune Firestore indexes/limits.

- Security & compliance
  - Input sanitization, rate limiting, and helmet/CORS hardening.
  - Revisit Firestore bookmark ownership checks, validate dotenv config, add audit logging, and define PII minimization/retention policy.

- Deployment & DevEx
  - CI for lint/test/build and lint/format configs.
  - Scripted deployment (Firebase hosting/functions or alternative) with staging/prod envs.
  - Remove Vite scaffold leftovers and unify JS/TS entrypoints.
  - Containerize using Docker/Kubernetes [✅]