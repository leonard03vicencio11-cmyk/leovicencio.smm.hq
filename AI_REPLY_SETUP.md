# AI-Personalized Form Reply Setup

This integration keeps the existing Formspree submission and owner notification unchanged. After Formspree succeeds, the browser sends a non-blocking copy of the submitted fields to `/api/ai-reply`. The Vercel Function can deliver through Resend or the free Google Apps Script Gmail webhook. OpenAI is optional: without it, the function uses a fixed confirmation personalized with the respondent's submitted name. If the acknowledgement request fails, the visitor still sees the successful Formspree confirmation.

For the no-cost Gmail setup, follow [`GOOGLE_APPS_SCRIPT_EMAIL_SETUP.md`](GOOGLE_APPS_SCRIPT_EMAIL_SETUP.md). It does not require Resend or an OpenAI API key.

## Files

- `api/ai-reply.js`: server-side acknowledgement generation plus Resend or Google Apps Script delivery.
- `google-apps-script/Code.gs`: protected Gmail sender used by the no-cost option.
- `portfolio-expansion.js`: preserves Formspree and adds the non-blocking same-origin request.
- `index.html`: includes an invisible honeypot field named `website`.
- `AI_REPLY_SETUP.md`: configuration, testing, fallback, and hardening guidance.

No API key or email credential belongs in the repository or browser code. Do not commit a `.env` file.

## Vercel environment variables

Add these in the existing Vercel project under **Settings â†’ Environment Variables**. Configure Production first; add separate Preview and Development values only when needed.

Always required:

```text
REPLY_TO=leovicenciosmm.hq@gmail.com
SITE_ORIGIN=https://leovicencio-smm-hq.vercel.app
```

Free Google Apps Script delivery:

```text
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
GOOGLE_SCRIPT_TOKEN=your-private-random-webhook-token
```

Resend delivery instead:

```text
RESEND_API_KEY=your-private-resend-api-key
EMAIL_FROM=Leonard Vicencio <verified-sender@example.com>
```

Optional enhancements:

```text
OPENAI_API_KEY=your-private-openai-api-key
OPENAI_MODEL=gpt-5-mini
BOOKING_URL=https://your-booking-page.example
```

Requirements:

- Configure one email provider: Google Apps Script or Resend. When both are configured, Resend is used first.
- `EMAIL_FROM` must use an address or domain verified in Resend.
- `SITE_ORIGIN` must be the exact site origin, without a path or trailing route.
- `BOOKING_URL` is optional. When omitted, the acknowledgement button opens a pre-addressed discovery-call request email to `REPLY_TO`.
- Never paste private keys into GitHub, HTML, client-side JavaScript, support messages, or chat.

## Activate the integration

1. Add the always-required variables and one configured email provider to the existing Vercel project.
2. Redeploy the current production deployment so the Function receives the variables.
3. Submit one intake using an email address you own.
4. Confirm the original Formspree owner notification arrives.
5. Confirm the personalized reply arrives from the configured sender.
6. Review the message content and Vercel Function logs before wider promotion.

Until an email provider is configured, Formspree continues to work but `/api/ai-reply` returns `503` and sends no respondent email.

## Data and fallback behavior

- OpenAI receives only `name`, `project_type`, `budget_range`, and `brief`.
- The selected email provider receives the respondent email and generated or fallback message.
- The OpenAI request sets `store: false`.
- The prompt forbids invented pricing, availability, guarantees, services, meeting times, and regulated advice.
- OpenAI failure uses a fixed confirmation; email-provider failure does not change the Formspree success state.

## Security and production hardening

The Function validates the exact `SITE_ORIGIN`, accepts JSON POST requests only, caps submitted field lengths, escapes email HTML, uses a honeypot, applies a lightweight per-instance rate limit, and adds request timeouts. The in-memory limiter is not a distributed control. Before significant traffic or paid promotion, enable Vercel Firewall/WAF rate limiting or connect a durable rate-limit store. Review applicable privacy and consent requirements before using AI-assisted drafting with production leads.
