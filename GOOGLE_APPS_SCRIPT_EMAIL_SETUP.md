# Free Google Apps Script acknowledgement email

This option keeps the existing Formspree submission and uses the Gmail account that deploys the script to send the respondent acknowledgement. OpenAI is optional: without an OpenAI key, the Vercel function sends the fixed personalized confirmation using the submitted name and includes the discovery-call action.

Google applies Apps Script and email-sending quotas. This path is appropriate for a low-volume portfolio intake form, not bulk email or newsletters.

## 1. Create the Google Apps Script

1. Open Google Apps Script while signed into the Gmail account that should send acknowledgements.
2. Create a new project named `Leo Portfolio Acknowledgement`.
3. Replace the default code with [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. In **Project Settings â†’ Script Properties**, add `WEBHOOK_TOKEN` with a private random value of at least 32 characters.
5. Choose **Deploy â†’ New deployment â†’ Web app**.
6. Set **Execute as** to yourself and allow access to anyone who can reach the web app.
7. Authorize the script, deploy it, and copy the Web app URL ending in `/exec`.

The web app is protected by `WEBHOOK_TOKEN`; never put that token in GitHub, HTML, client-side JavaScript, support messages, or chat.

## 2. Add the private Vercel settings

Add these to Production and Preview:

```text
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
GOOGLE_SCRIPT_TOKEN=the-same-private-webhook-token
```

Then redeploy the latest `main` commit so the variables take effect.

## 3. Optional personalization and booking

- Without `OPENAI_API_KEY`, the respondent still receives a personalized confirmation using their submitted name.
- With `OPENAI_API_KEY`, OpenAI drafts the message body before Gmail sends it.
- Without `BOOKING_URL`, the CTA opens a pre-addressed discovery-call request to `REPLY_TO`.
- Add `BOOKING_URL` later when a real Calendly or booking page is available.

## 4. Controlled test

Submit the live intake form using an email address you own. Confirm:

1. Formspree still sends the owner notification.
2. Vercel logs show `POST /api/ai-reply` with status `202`.
3. The respondent receives the confirmation and discovery-call CTA.
4. Replying to the email addresses `REPLY_TO`.

