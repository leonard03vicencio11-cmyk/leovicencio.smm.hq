/**
 * Free acknowledgement-email webhook for the Leonard Vicencio portfolio.
 *
 * Before deploying, add a Script Property named WEBHOOK_TOKEN with a long,
 * random value. Store the same value in Vercel as GOOGLE_SCRIPT_TOKEN.
 */

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function doPost(event) {
  try {
    var expectedToken = PropertiesService.getScriptProperties().getProperty('WEBHOOK_TOKEN');
    var payload = JSON.parse(event && event.postData ? event.postData.contents : '{}');
    var suppliedToken = cleanText(payload.token, 256);

    if (!expectedToken || suppliedToken !== expectedToken) {
      return jsonOutput({ ok: false, error: 'Unauthorized.' });
    }

    var recipient = cleanText(payload.to, 254).toLowerCase();
    var replyTo = cleanText(payload.replyTo, 254).toLowerCase();
    var subject = cleanText(payload.subject, 120);
    var plainText = cleanText(payload.text, 8000);
    var htmlBody = cleanText(payload.html, 30000);

    if (!isEmail(recipient) || !isEmail(replyTo) || !subject || !plainText || !htmlBody) {
      return jsonOutput({ ok: false, error: 'Invalid email payload.' });
    }

    MailApp.sendEmail({
      to: recipient,
      replyTo: replyTo,
      name: 'Leonard Vicencio',
      subject: subject,
      body: plainText,
      htmlBody: htmlBody,
    });

    return jsonOutput({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonOutput({ ok: false, error: 'Email delivery failed.' });
  }
}

