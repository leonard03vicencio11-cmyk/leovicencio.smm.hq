const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitBuckets = globalThis.__leoAiReplyRateLimit || new Map();
globalThis.__leoAiReplyRateLimit = rateLimitBuckets;

function jsonResponse(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeSubmission(body) {
  return {
    name: String(body.name || '').trim().slice(0, 120),
    email: String(body.email || '').trim().toLowerCase().slice(0, 254),
    project_type: String(body.project_type || '').trim().slice(0, 120),
    budget_range: String(body.budget_range || body.budget || '').trim().slice(0, 120),
    brief: String(body.brief || '').trim().slice(0, 4000),
    website: String(body.website || '').trim().slice(0, 200),
  };
}

function fallbackReply(submission) {
  const firstName = submission.name.split(/\s+/)[0] || 'there';
  return {
    subject: 'We received your project brief',
    body: `Hi ${firstName},\n\nThanks for sending your project brief. I've received your details and will review your goals, timeline, and requirements. I'll get back to you shortly with the next steps.\n\nBest,\nLeonard Vicencio`,
  };
}

function getAllowedOrigin() {
  try {
    return new URL(process.env.SITE_ORIGIN || '').origin;
  } catch {
    return '';
  }
}

function getClientIp(request) {
  return String(request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown')
    .split(',')[0]
    .trim()
    .slice(0, 100);
}

function checkRateLimit(key) {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || now >= current.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function extractOutputText(payload) {
  if (typeof payload.output_text === 'string') return payload.output_text;
  if (!Array.isArray(payload.output)) return '';

  for (const item of payload.output) {
    if (!Array.isArray(item.content)) continue;
    const outputText = item.content.find((part) => part.type === 'output_text' && typeof part.text === 'string');
    if (outputText) return outputText.text;
  }

  return '';
}

async function createPersonalizedReply(submission) {
  const fallback = fallbackReply(submission);
  if (!process.env.OPENAI_API_KEY) return { reply: fallback, usedFallback: true };

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        store: false,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: [
                  'Write a concise, warm, professional first-response email for Leonard Vicencio, a social media manager and digital marketer.',
                  'Use only the supplied submission facts. Do not invent prices, availability, results, guarantees, meeting times, or services.',
                  'Do not provide legal, medical, financial, or other regulated advice. Do not mention that AI was used.',
                  'Keep the subject under 80 characters and the body between 70 and 180 words.',
                ].join(' '),
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  name: submission.name,
                  project_type: submission.project_type,
                  budget_range: submission.budget_range,
                  brief: submission.brief,
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'lead_reply',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                subject: { type: 'string' },
                body: { type: 'string' },
              },
              required: ['subject', 'body'],
              additionalProperties: false,
            },
          },
        },
        max_output_tokens: 700,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!aiResponse.ok) {
      console.error('OpenAI request failed:', aiResponse.status);
      return { reply: fallback, usedFallback: true };
    }

    const aiPayload = await aiResponse.json();
    const parsed = JSON.parse(extractOutputText(aiPayload) || '{}');
    if (!parsed.subject || !parsed.body) return { reply: fallback, usedFallback: true };

    return {
      reply: {
        subject: String(parsed.subject).replace(/[\r\n]+/g, ' ').trim().slice(0, 120),
        body: String(parsed.body).trim().slice(0, 5000),
      },
      usedFallback: false,
    };
  } catch (error) {
    console.error('OpenAI reply generation failed:', error instanceof Error ? error.message : 'Unknown error');
    return { reply: fallback, usedFallback: true };
  }
}

async function sendReplyEmail(submission, reply) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { ok: false, status: 503, error: 'Email delivery is not configured.' };
  }

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [submission.email],
        reply_to: process.env.REPLY_TO || 'leovicenciosmm.hq@gmail.com',
        subject: reply.subject,
        text: reply.body,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-line">${escapeHtml(reply.body)}</div>`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!emailResponse.ok) {
      console.error('Resend request failed:', emailResponse.status);
      return { ok: false, status: 502, error: 'Email delivery failed.' };
    }

    return { ok: true };
  } catch (error) {
    console.error('Resend request failed:', error instanceof Error ? error.message : 'Unknown error');
    return { ok: false, status: 502, error: 'Email delivery failed.' };
  }
}

async function handlePost(request) {
  const allowedOrigin = getAllowedOrigin();
  if (!allowedOrigin) return jsonResponse(503, { error: 'Personalized replies are not configured.' });
  if (request.headers.get('origin') !== allowedOrigin) return jsonResponse(403, { error: 'Origin not allowed.' });

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse(415, { error: 'JSON content is required.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON.' });
  }

  const submission = normalizeSubmission(body || {});
  if (submission.website) return jsonResponse(202, { ok: true });
  if (!submission.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    return jsonResponse(400, { error: 'A valid respondent email is required.' });
  }

  const rateLimit = checkRateLimit(`${getClientIp(request)}:${submission.email}`);
  if (!rateLimit.allowed) {
    return jsonResponse(429, { error: 'Too many requests. Please try again later.' }, { 'Retry-After': String(rateLimit.retryAfter) });
  }

  const { reply, usedFallback } = await createPersonalizedReply(submission);
  const delivery = await sendReplyEmail(submission, reply);
  if (!delivery.ok) return jsonResponse(delivery.status, { error: delivery.error });

  return jsonResponse(202, { ok: true, fallback: usedFallback });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return jsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'POST' });
    }

    return handlePost(request);
  },
};
