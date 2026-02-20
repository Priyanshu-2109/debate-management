/**
 * DebateHub email templates
 * Clean, minimal design inspired by Klera/Beefree style.
 * Table-based layout for maximum email-client compatibility.
 * Uses Inter font with clean #f5f5f7 content cards on white background.
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

/* ── shared skeleton ────────────────────────────────────────── */
const shell = (inner) => `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]>
  <xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
  <o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
  <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" type="text/css">
  <!--<![endif]-->
  <style>
    *{box-sizing:border-box}
    body{margin:0;padding:0}
    a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}
    #MessageViewBody a{color:inherit;text-decoration:none}
    p{line-height:inherit}
    @media(max-width:720px){
      .row-content{width:100%!important}
      .stack .column{width:100%;display:block}
      .card-td{padding:24px 16px!important}
      .body-td{padding:10px!important}
      .heading-main{font-size:28px!important}
      .heading-sub{font-size:20px!important}
      .text-body{font-size:16px!important}
      .footer-td{padding:24px!important}
      .callout-td{padding:12px 16px!important}
      .btn-link span{font-size:16px!important;line-height:32px!important}
    }
  </style>
</head>
<body style="background-color:#ffffff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffffff;">
    <tbody><tr><td>
${inner}
    </td></tr></tbody>
  </table>
</body>
</html>`;

/* ── reusable rows ──────────────────────────────────────────── */

/** Top bar — "View this email in your browser" */
const topBar = `
<!-- Top bar -->
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;width:700px;margin:0 auto;border:8px solid #ffffff;" width="700">
      <tbody><tr>
        <td style="font-weight:400;text-align:left;background-color:#f9f9fb;vertical-align:top;border-radius:8px;">
          <table width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation">
            <tr><td class="body-td">
              <div style="color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:14px;font-weight:400;letter-spacing:0;line-height:1.2;text-align:center;">
                <p style="margin:0;">DebateHub Notification</p>
              </div>
            </td></tr>
          </table>
        </td>
      </tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

/** Logo row */
const logoRow = `
<!-- Logo -->
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;width:700px;margin:0 auto;" width="700">
      <tbody><tr>
        <td style="font-weight:400;text-align:left;padding-bottom:32px;padding-top:24px;vertical-align:top;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr><td style="width:100%;padding:0;">
              <div style="text-align:center;">
                <span style="font-family:'Inter','Helvetica',sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#1e40ff;">Debate</span><span style="font-family:'Inter','Helvetica',sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#040b22;">Hub</span>
              </div>
            </td></tr>
          </table>
        </td>
      </tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

/** Spacer */
const spacer = (h = 24) => `
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#000;width:700px;margin:0 auto;" width="700">
      <tbody><tr><td style="font-weight:400;text-align:left;vertical-align:top;">
        <div style="height:${h}px;line-height:${h}px;font-size:1px;">&#8202;</div>
      </td></tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

/** Divider inside a card */
const divider = `
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tr><td style="padding:24px 0;">
    <div style="text-align:center;">
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr><td style="font-size:1px;line-height:1px;border-top:1px solid #d9d9d9;"><span>&#8202;</span></td></tr>
      </table>
    </div>
  </td></tr>
</table>`;

/** Footer */
const footer = `
${spacer(80)}
<!-- Footer -->
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f5f5f7;border-radius:24px 24px 0 0;color:#000;width:700px;margin:0 auto;" width="700">
      <tbody><tr>
        <td style="font-weight:400;text-align:left;vertical-align:top;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr><td class="footer-td" style="padding:44px 10px;">
              <div style="color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:14px;font-weight:400;letter-spacing:0;line-height:1.6;text-align:center;">
                <p style="margin:0;margin-bottom:0;">You received this email because you joined a debate on DebateHub.</p>
                <p style="margin:0;margin-bottom:0;">&#169; ${new Date().getFullYear()} DebateHub. All rights reserved.</p>
                <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">Platform developed by Priyanshu Chaniyara</p>
              </div>
            </td></tr>
          </table>
        </td>
      </tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

/* ── TEMPLATE 1 — Debate Joined ─────────────────────────────── */

const debateJoinedTemplate = ({ userName, date, time, location }) => {
  const cardContent = `
<!-- Main card -->
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-left:16px solid transparent;border-right:16px solid transparent;color:#000;padding-left:60px;padding-right:60px;width:700px;margin:0 auto;" width="700">
      <tbody><tr><td>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tbody><tr>
            <td class="column card-td" style="font-weight:400;text-align:left;background-color:#f5f5f7;padding:40px 32px 32px;vertical-align:top;border-radius:24px;">

              <!-- Heading -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-bottom:8px;text-align:center;width:100%;">
                  <h1 class="heading-main" style="margin:0;color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:32px;font-weight:600;letter-spacing:-1px;line-height:1.2;text-align:left;">You're in! &#127881;</h1>
                </td></tr>
              </table>

              <!-- Intro -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-top:8px;">
                  <div class="text-body" style="color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.5;text-align:left;">
                    <p style="margin:0;">Hi <strong style="font-weight:500;color:#040b22;">${userName}</strong>, you've successfully joined a debate. Here are the details:</p>
                  </div>
                </td></tr>
              </table>

              ${divider}

              <!-- Details heading -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-bottom:12px;text-align:center;width:100%;">
                  <h2 class="heading-sub" style="margin:0;color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:24px;font-weight:600;letter-spacing:-1px;line-height:1.2;text-align:left;">Debate details</h2>
                </td></tr>
              </table>

              <!-- Detail list -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.5;text-align:left;">
                <tr><td style="padding:0;">
                  <div style="margin-left:-20px">
                    <ul style="margin:0;list-style-type:disc;">
                      <li style="margin:0 0 6px 0;"><strong style="font-weight:500;color:#040b22;">Date:</strong> ${formatDate(date)}</li>
                      <li style="margin:0 0 6px 0;"><strong style="font-weight:500;color:#040b22;">Time:</strong> ${formatTimeIST(time)}</li>
                      <li style="margin:0 0 0 0;"><strong style="font-weight:500;color:#040b22;">Location:</strong> ${location}</li>
                    </ul>
                  </div>
                </td></tr>
              </table>

              ${divider}

              <!-- What's next -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-bottom:12px;text-align:center;width:100%;">
                  <h2 class="heading-sub" style="margin:0;color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:24px;font-weight:600;letter-spacing:-1px;line-height:1.2;text-align:left;">What happens next</h2>
                </td></tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-top:8px;">
                  <div class="text-body" style="color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.5;text-align:left;">
                    <p style="margin:0;">The debate topic is still hidden and will be revealed automatically 30 minutes before the scheduled time. You'll receive another email when it's live &#8212; so keep an eye on your inbox!</p>
                  </div>
                </td></tr>
              </table>

            </td>
          </tr></tbody>
        </table>
      </td></tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

  const callout = `
${spacer(24)}
<!-- Callout -->
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-left:16px solid transparent;border-right:16px solid transparent;color:#000;padding-left:60px;padding-right:60px;width:700px;margin:0 auto;" width="700">
      <tbody><tr><td>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tbody><tr>
            <td class="callout-td" style="font-weight:400;text-align:left;background-color:#ece9ff;padding:14px 32px;vertical-align:top;border-radius:24px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td>
                  <div style="color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.4;text-align:center;">
                    <p style="margin:0;">Have questions? Just reply to this email &#8212; we're here to help.</p>
                  </div>
                </td></tr>
              </table>
            </td>
          </tr></tbody>
        </table>
      </td></tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

  return shell(`${topBar}${logoRow}${cardContent}${callout}${footer}`);
};

/* ── TEMPLATE 2 — Topic Revealed ─────────────────────────────── */

const topicRevealedTemplate = ({
  userName,
  topicTitle,
  topicDescription,
  date,
  time,
  location,
}) => {
  const cardContent = `
<!-- Main card -->
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-left:16px solid transparent;border-right:16px solid transparent;color:#000;padding-left:60px;padding-right:60px;width:700px;margin:0 auto;" width="700">
      <tbody><tr><td>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tbody><tr>
            <td class="column card-td" style="font-weight:400;text-align:left;background-color:#f5f5f7;padding:40px 32px 32px;vertical-align:top;border-radius:24px;">

              <!-- Heading -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-bottom:8px;text-align:center;width:100%;">
                  <h1 class="heading-main" style="margin:0;color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:32px;font-weight:600;letter-spacing:-1px;line-height:1.2;text-align:left;">Topic revealed! &#128161;</h1>
                </td></tr>
              </table>

              <!-- Intro -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-top:8px;">
                  <div class="text-body" style="color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.5;text-align:left;">
                    <p style="margin:0;">Hi <strong style="font-weight:500;color:#040b22;">${userName}</strong>, the debate topic has been revealed. It's time to start preparing!</p>
                  </div>
                </td></tr>
              </table>

              ${divider}

              <!-- Topic heading -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-bottom:12px;text-align:center;width:100%;">
                  <h2 class="heading-sub" style="margin:0;color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:24px;font-weight:600;letter-spacing:-1px;line-height:1.2;text-align:left;">Your topic</h2>
                </td></tr>
              </table>

              <!-- Topic card (accent) -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="background-color:#ece9ff;border-radius:16px;padding:28px 24px;text-align:center;">
                  <h3 style="margin:0 0 8px;color:#1e40ff;font-family:'Inter','Helvetica',sans-serif;font-size:22px;font-weight:600;line-height:1.3;letter-spacing:-0.5px;">${topicTitle}</h3>
                  <p style="margin:0;color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:15px;font-weight:300;line-height:1.5;">${topicDescription}</p>
                </td></tr>
              </table>

              ${divider}

              <!-- Debate details heading -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-bottom:12px;text-align:center;width:100%;">
                  <h2 class="heading-sub" style="margin:0;color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:24px;font-weight:600;letter-spacing:-1px;line-height:1.2;text-align:left;">Debate details</h2>
                </td></tr>
              </table>

              <!-- Detail list -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.5;text-align:left;">
                <tr><td style="padding:0;">
                  <div style="margin-left:-20px">
                    <ul style="margin:0;list-style-type:disc;">
                      <li style="margin:0 0 6px 0;"><strong style="font-weight:500;color:#040b22;">Date:</strong> ${formatDate(date)}</li>
                      <li style="margin:0 0 6px 0;"><strong style="font-weight:500;color:#040b22;">Time:</strong> ${formatTimeIST(time)}</li>
                      <li style="margin:0 0 0 0;"><strong style="font-weight:500;color:#040b22;">Location:</strong> ${location}</li>
                    </ul>
                  </div>
                </td></tr>
              </table>

              ${divider}

              <!-- Tips -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding-bottom:12px;text-align:center;width:100%;">
                  <h2 class="heading-sub" style="margin:0;color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:24px;font-weight:600;letter-spacing:-1px;line-height:1.2;text-align:left;">How to prepare</h2>
                </td></tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:#4a4f5f;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.5;text-align:left;">
                <tr><td style="padding:0;">
                  <div style="margin-left:-20px">
                    <ul style="margin:0;list-style-type:disc;">
                      <li style="margin:0 0 6px 0;">Research both sides of the topic</li>
                      <li style="margin:0 0 6px 0;">Outline your key arguments</li>
                      <li style="margin:0 0 6px 0;">Anticipate counterpoints</li>
                      <li style="margin:0 0 0 0;">Come ready to make your case!</li>
                    </ul>
                  </div>
                </td></tr>
              </table>

            </td>
          </tr></tbody>
        </table>
      </td></tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

  const callout = `
${spacer(24)}
<!-- Callout -->
<table class="row" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
  <tbody><tr><td>
    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-left:16px solid transparent;border-right:16px solid transparent;color:#000;padding-left:60px;padding-right:60px;width:700px;margin:0 auto;" width="700">
      <tbody><tr><td>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tbody><tr>
            <td class="callout-td" style="font-weight:400;text-align:left;background-color:#ece9ff;padding:14px 32px;vertical-align:top;border-radius:24px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td>
                  <div style="color:#040b22;font-family:'Inter','Helvetica',sans-serif;font-size:16px;font-weight:300;letter-spacing:0;line-height:1.4;text-align:center;">
                    <p style="margin:0;">Good luck &#8212; you've got this! &#128170;</p>
                  </div>
                </td></tr>
              </table>
            </td>
          </tr></tbody>
        </table>
      </td></tr></tbody>
    </table>
  </td></tr></tbody>
</table>`;

  return shell(`${topBar}${logoRow}${cardContent}${callout}${footer}`);
};

module.exports = {
  debateJoinedTemplate,
  topicRevealedTemplate,
};
