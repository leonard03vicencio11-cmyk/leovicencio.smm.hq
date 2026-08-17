# AI-Personalized Form Reply Setup

This integration keeps the existing Formspree submission and owner notification unchanged. After Formspree succeeds, the browser sends a non-blocking copy of the submitted fields to `/api/ai-reply`. The Vercel Function drafts a concise response with OpenAI and delivers it through Resend. If OpenAI is unavailable, the function uses a fixed fallback confirmation. If the AI or email request fails, the visitor still sees the successful Formspree confirmation.

## Files

- `api/ai-reply.js`: server-side OpenAI Responses API and Resend integration.
- `portfolio-expansion.js`: preserves Formspree and adds the non-blocking same-origin request.
- `index.html`: includes an invisible honeypot field named `website`.
- `AI_REPLY_SETUP.md`: configuration, testing, fallback, and hardening guidance.

No API key or email credential belongs in the repository or browser code. Do not commit a `.env` file.

## Required Vercel environment variables

Add these in the existing Vercel project under **Settings → Environment Variables**. Configure Production first; add separate Preview and Development values only when needed.

```text
OPENAI_API_KEY=your-private-openai-api-key
OPENAI_MODEL=gpt-5-mini
RESEND_API_KEY=your-private-resend-api-key
EMAIL_FROM=Leonard Vicencio <verified-sender@example.com>
REPLY_TO=leovicenciosmm.hq@gmail.com
SITE_ORIGIN=https://leovicencio-smm-hq.vercel.app
```

Requirements:

- `EMAIL_FROM` must use an address or domain verified in Resend.
- `SITE_ORIGIN` must be the exact site origin, without a path or trailing route.
- Never paste private keys into GitHub, HTML, client-side JavaScript, support messages, or chat.

## Activate the integration

1. Add all six environment variables to the existing Vercel project.
2. Redeploy the current production deployment so the Function receives the variables.
3. Submit one intake using an email address you own.
4. Confirm the original Formspree owner notification arrives.
5. Confirm the personalized reply arrives from the verified Resend sender.
6. Review the message content and Vercel Function logs before wider promotion.

Until the required variables are configured, Formspree continues to work but `/api/ai-reply` returns `503` and sends no respondent email.

## Data and fallback behavior

- OpenAI receives only `name`, `project_type`, `budget_range`, and `brief`.
- Resend receives the respondent email and generated or fallback message.
- The OpenAI request sets `store: false`.
- The prompt forbids invented pricing, availability, guarantees, services, meeting times, and regulated advice.
- OpenAI failure uses a fixed confirmation; Resend failure does not change the Formspree success state.

## Security and production hardening

The Function validates the exact `SITE_ORIGIN`, accepts JSON POST requests only, caps submitted field lengths, escapes email HTML, uses a honeypot, applies a lightweight per-instance rate limit, and adds request timeouts. The in-memory limiter is not a distributed control. Before significant traffic or paid promotion, enable Vercel Firewall/WAF rate limiting or connect a durable rate-limit store. Review applicable privacy and consent requirements before using AI-assisted drafting with production leads.
