/**
 * DebateHub — Professional email templates
 * Mobile-first, table-based layout for maximum email-client compatibility.
 * Clean Klera/Beefree-inspired design with Inter font.
 */

function formatTimeIST(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period} IST`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const FONT = "'Inter','Helvetica Neue','Helvetica',Arial,sans-serif";
const YEAR = new Date().getFullYear();

/* ── shared outer shell ─────────────────────────────────────── */
const shell = (body) => `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<![endif]-->
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<!--<![endif]-->
<style>
*{box-sizing:border-box}
body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table{border-spacing:0;border-collapse:collapse}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}
#MessageViewBody a{color:inherit;text-decoration:none}
p{margin:0;padding:0}

/* ── Desktop defaults (applied inline too, these are fallbacks) ── */
.wrapper{width:100%;table-layout:fixed;background-color:#ffffff}
.main{max-width:600px;margin:0 auto;background-color:#ffffff}

/* ── Mobile overrides ── */
@media only screen and (max-width:640px){
  .main{width:100%!important;min-width:100%!important}
  .card{padding:24px 20px 20px!important}
  .card-inner{padding:0!important}
  .top-bar-td{padding:12px 16px!important}
  .logo-td{padding:20px 16px 16px!important}
  .callout-td{padding:14px 20px!important;border-radius:16px!important}
  .footer-td{padding:28px 20px!important}
  .footer-spacer{height:32px!important;line-height:32px!important}
  .h1{font-size:26px!important;line-height:1.2!important}
  .h2{font-size:18px!important}
  .body-text{font-size:15px!important;line-height:1.5!important}
  .detail-label{font-size:12px!important;padding-bottom:2px!important}
  .detail-value{font-size:15px!important}
  .detail-row td{padding:10px 16px!important}
  .topic-card{padding:20px 16px!important;border-radius:12px!important}
  .topic-title{font-size:18px!important}
  .topic-desc{font-size:14px!important}
  .divider-td{padding:16px 0!important}
  .tip-row td{padding:6px 0 6px 8px!important}
  .tip-text{font-size:14px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">
<center class="wrapper" style="width:100%;table-layout:fixed;background-color:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
<tr><td align="center" style="padding:0;">
  <table role="presentation" class="main" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <tr><td>
${body}
    </td></tr>
  </table>
</td></tr>
</table>
</center>
</body>
</html>`;

/* ── Reusable pieces ────────────────────────────────────────── */

const topBar = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="top-bar-td" style="padding:14px 24px;background-color:#f9f9fb;border-radius:8px 8px 0 0;">
  <p style="margin:0;font-family:${FONT};font-size:13px;font-weight:400;color:#6b7280;text-align:center;line-height:1.4;">DebateHub Notification</p>
</td></tr>
</table>`;

const logoRow = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="logo-td" style="padding:28px 24px 20px;text-align:center;">
  <span style="font-family:${FONT};font-size:26px;font-weight:700;letter-spacing:-0.5px;color:#1e40ff;">Debate</span><span style="font-family:${FONT};font-size:26px;font-weight:700;letter-spacing:-0.5px;color:#040b22;">Hub</span>
</td></tr>
</table>`;

const dividerBlock = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="divider-td" style="padding:20px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="border-top:1px solid #e5e7eb;font-size:1px;line-height:1px;">&#8202;</td></tr>
  </table>
</td></tr>
</table>`;

const footerBlock = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="footer-spacer" style="height:48px;line-height:48px;font-size:1px;">&#8202;</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;border-radius:20px 20px 0 0;">
<tr><td class="footer-td" style="padding:36px 32px;text-align:center;">
  <p style="margin:0 0 6px;font-family:${FONT};font-size:13px;font-weight:400;color:#6b7280;line-height:1.5;">You received this because you joined a debate on DebateHub.</p>
  <p style="margin:0 0 10px;font-family:${FONT};font-size:13px;font-weight:400;color:#6b7280;line-height:1.5;">&#169; ${YEAR} DebateHub. All rights reserved.</p>
  <p style="margin:0;font-family:${FONT};font-size:11px;font-weight:400;color:#9ca3af;line-height:1.4;">Platform developed by Priyanshu Chaniyara</p>
</td></tr>
</table>`;

/** Detail row — label on top, value below (stacks cleanly on mobile) */
function detailRow(label, value) {
  return `
<tr><td class="detail-row" style="padding:0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="padding:12px 20px;border-bottom:1px solid #ebedf0;">
    <p class="detail-label" style="margin:0 0 4px;font-family:${FONT};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#8b8fa3;line-height:1.3;">${label}</p>
    <p class="detail-value" style="margin:0;font-family:${FONT};font-size:16px;font-weight:500;color:#040b22;line-height:1.4;">${value}</p>
  </td></tr>
  </table>
</td></tr>`;
}

/** Tip row with bullet  */
function tipRow(text) {
  return `
<tr><td class="tip-row" style="padding:0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="width:24px;padding:8px 0 8px 4px;vertical-align:top;font-family:${FONT};font-size:15px;color:#1e40ff;">&#8226;</td>
    <td class="tip-text" style="padding:8px 0;font-family:${FONT};font-size:15px;font-weight:300;color:#4a4f5f;line-height:1.5;">${text}</td>
  </tr>
  </table>
</td></tr>`;
}

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 1 — Debate Joined
   ══════════════════════════════════════════════════════════════ */

const debateJoinedTemplate = ({ userName, date, time, location }) => {
  const body = `
${topBar}
${logoRow}

<!-- Card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;border-radius:20px;">
  <tr><td class="card" style="padding:36px 32px 28px;">

    <!-- Heading -->
    <h1 class="h1" style="margin:0 0 12px;font-family:${FONT};font-size:30px;font-weight:600;color:#040b22;letter-spacing:-0.5px;line-height:1.15;">You're in! &#127881;</h1>

    <!-- Intro -->
    <p class="body-text" style="margin:0;font-family:${FONT};font-size:16px;font-weight:300;color:#4a4f5f;line-height:1.6;">Hi <strong style="font-weight:500;color:#040b22;">${userName}</strong>, you've successfully joined a debate. Here are the details:</p>

    ${dividerBlock}

    <!-- Section: Details -->
    <h2 class="h2" style="margin:0 0 12px;font-family:${FONT};font-size:22px;font-weight:600;color:#040b22;letter-spacing:-0.5px;line-height:1.2;">Debate details</h2>

    <!-- Detail card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
      ${detailRow("Date", formatDate(date))}
      ${detailRow("Time", formatTimeIST(time))}
      <tr><td style="padding:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:12px 20px;">
          <p class="detail-label" style="margin:0 0 4px;font-family:${FONT};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#8b8fa3;line-height:1.3;">Location</p>
          <p class="detail-value" style="margin:0;font-family:${FONT};font-size:16px;font-weight:500;color:#040b22;line-height:1.4;">${location}</p>
        </td></tr>
        </table>
      </td></tr>
    </table>

    ${dividerBlock}

    <!-- Section: What next -->
    <h2 class="h2" style="margin:0 0 10px;font-family:${FONT};font-size:22px;font-weight:600;color:#040b22;letter-spacing:-0.5px;line-height:1.2;">What happens next</h2>

    <p class="body-text" style="margin:0;font-family:${FONT};font-size:16px;font-weight:300;color:#4a4f5f;line-height:1.6;">The debate topic is still hidden and will be revealed automatically 30 minutes before the scheduled time. You'll receive another email when it's live &#8212; keep an eye on your inbox!</p>

  </td></tr>
  </table>
</td></tr>
</table>

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="height:16px;line-height:16px;font-size:1px;">&#8202;</td></tr>
</table>

<!-- Callout -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ece9ff;border-radius:20px;">
  <tr><td class="callout-td" style="padding:16px 32px;text-align:center;">
    <p style="margin:0;font-family:${FONT};font-size:15px;font-weight:400;color:#040b22;line-height:1.5;">Have questions? Just reply to this email &#8212; we're here to help.</p>
  </td></tr>
  </table>
</td></tr>
</table>

${footerBlock}`;

  return shell(body);
};

/* ══════════════════════════════════════════════════════════════
   TEMPLATE 2 — Topic Revealed
   ══════════════════════════════════════════════════════════════ */

const topicRevealedTemplate = ({
  userName,
  topicTitle,
  topicDescription,
  date,
  time,
  location,
}) => {
  const body = `
${topBar}
${logoRow}

<!-- Card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;border-radius:20px;">
  <tr><td class="card" style="padding:36px 32px 28px;">

    <!-- Heading -->
    <h1 class="h1" style="margin:0 0 12px;font-family:${FONT};font-size:30px;font-weight:600;color:#040b22;letter-spacing:-0.5px;line-height:1.15;">Topic revealed! &#128161;</h1>

    <!-- Intro -->
    <p class="body-text" style="margin:0;font-family:${FONT};font-size:16px;font-weight:300;color:#4a4f5f;line-height:1.6;">Hi <strong style="font-weight:500;color:#040b22;">${userName}</strong>, the debate topic has been revealed. Time to start preparing!</p>

    ${dividerBlock}

    <!-- Section: Topic -->
    <h2 class="h2" style="margin:0 0 12px;font-family:${FONT};font-size:22px;font-weight:600;color:#040b22;letter-spacing:-0.5px;line-height:1.2;">Your topic</h2>

    <!-- Topic accent card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td class="topic-card" style="background-color:#ece9ff;border-radius:16px;padding:24px 24px;text-align:center;">
      <p class="topic-title" style="margin:0 0 8px;font-family:${FONT};font-size:20px;font-weight:600;color:#1e40ff;line-height:1.3;letter-spacing:-0.3px;">${topicTitle}</p>
      <p class="topic-desc" style="margin:0;font-family:${FONT};font-size:15px;font-weight:300;color:#4a4f5f;line-height:1.5;">${topicDescription}</p>
    </td></tr>
    </table>

    ${dividerBlock}

    <!-- Section: Details -->
    <h2 class="h2" style="margin:0 0 12px;font-family:${FONT};font-size:22px;font-weight:600;color:#040b22;letter-spacing:-0.5px;line-height:1.2;">Debate details</h2>

    <!-- Detail card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
      ${detailRow("Date", formatDate(date))}
      ${detailRow("Time", formatTimeIST(time))}
      <tr><td style="padding:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:12px 20px;">
          <p class="detail-label" style="margin:0 0 4px;font-family:${FONT};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#8b8fa3;line-height:1.3;">Location</p>
          <p class="detail-value" style="margin:0;font-family:${FONT};font-size:16px;font-weight:500;color:#040b22;line-height:1.4;">${location}</p>
        </td></tr>
        </table>
      </td></tr>
    </table>

    ${dividerBlock}

    <!-- Section: Tips -->
    <h2 class="h2" style="margin:0 0 8px;font-family:${FONT};font-size:22px;font-weight:600;color:#040b22;letter-spacing:-0.5px;line-height:1.2;">How to prepare</h2>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${tipRow("Research both sides of the topic")}
      ${tipRow("Outline your key arguments")}
      ${tipRow("Anticipate counterpoints")}
      ${tipRow("Come ready to make your case!")}
    </table>

  </td></tr>
  </table>
</td></tr>
</table>

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="height:16px;line-height:16px;font-size:1px;">&#8202;</td></tr>
</table>

<!-- Callout -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ece9ff;border-radius:20px;">
  <tr><td class="callout-td" style="padding:16px 32px;text-align:center;">
    <p style="margin:0;font-family:${FONT};font-size:15px;font-weight:400;color:#040b22;line-height:1.5;">Good luck &#8212; you've got this! &#128170;</p>
  </td></tr>
  </table>
</td></tr>
</table>

${footerBlock}`;

  return shell(body);
};

module.exports = {
  debateJoinedTemplate,
  topicRevealedTemplate,
};
