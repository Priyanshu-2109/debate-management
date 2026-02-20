/**
 * Reusable HTML email templates — modern, clean design
 */

/** Format "HH:MM" (24h) → "h:mm AM/PM IST" */
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

const wrapper = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const headerJoined = `
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
  padding: 40px 32px;
  text-align: center;
`;

const headerRevealed = `
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%);
  padding: 40px 32px;
  text-align: center;
`;

const body = `padding: 32px;`;

const footer = `
  padding: 24px 32px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

const infoRow = `
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const infoLabel = `
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  min-width: 80px;
`;

const infoValue = `
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
`;

const debateJoinedTemplate = ({ userName, date, time, location }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
<div style="${wrapper}">
  <div style="${headerJoined}">
    <div style="font-size: 48px; margin-bottom: 8px;">🎯</div>
    <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">You're In!</h1>
    <p style="margin: 8px 0 0; font-size: 15px; color: rgba(255,255,255,0.85);">Successfully joined the debate</p>
  </div>
  <div style="${body}">
    <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">Hey <strong>${userName}</strong> 👋</p>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">Great news! You've been registered for the upcoming debate. Here are your details:</p>
    
    <div style="margin: 24px 0;">
      <div style="${infoRow}">
        <span style="${infoLabel}">📅 Date</span>
        <span style="${infoValue}">${formatDate(date)}</span>
      </div>
      <div style="${infoRow}">
        <span style="${infoLabel}">🕐 Time</span>
        <span style="${infoValue}">${formatTimeIST(time)}</span>
      </div>
      <div style="${infoRow}">
        <span style="${infoLabel}">📍 Venue</span>
        <span style="${infoValue}">${location}</span>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #eff6ff, #f0f9ff); border-left: 4px solid #6366f1; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #4338ca; font-weight: 500;">🔒 The debate topic will be automatically revealed at the scheduled time. Stay tuned!</p>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">See you there! 🚀</p>
  </div>
  <div style="${footer}">
    <p style="margin: 0;">DebateHub &copy; ${new Date().getFullYear()} &middot; Built for great debates</p>
  </div>
</div>
</body>
</html>
`;

const topicRevealedTemplate = ({
  userName,
  topicTitle,
  topicDescription,
  date,
  time,
  location,
}) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
<div style="${wrapper}">
  <div style="${headerRevealed}">
    <div style="font-size: 48px; margin-bottom: 8px;">🎤</div>
    <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">Topic Revealed!</h1>
    <p style="margin: 8px 0 0; font-size: 15px; color: rgba(255,255,255,0.85);">It's time to prepare</p>
  </div>
  <div style="${body}">
    <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">Hey <strong>${userName}</strong> 👋</p>
    <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">The moment you've been waiting for — your debate topic has been revealed!</p>
    
    <div style="background: linear-gradient(135deg, #fdf4ff, #faf5ff); border: 2px solid #d8b4fe; padding: 24px; margin: 24px 0; border-radius: 12px; text-align: center;">
      <div style="font-size: 28px; margin-bottom: 8px;">💡</div>
      <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #7c3aed; font-weight: 700;">${topicTitle}</h2>
      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">${topicDescription}</p>
    </div>

    <div style="margin: 24px 0;">
      <div style="${infoRow}">
        <span style="${infoLabel}">📅 Date</span>
        <span style="${infoValue}">${formatDate(date)}</span>
      </div>
      <div style="${infoRow}">
        <span style="${infoLabel}">🕐 Time</span>
        <span style="${infoValue}">${formatTimeIST(time)}</span>
      </div>
      <div style="${infoRow}">
        <span style="${infoLabel}">📍 Venue</span>
        <span style="${infoValue}">${location}</span>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #fefce8, #fffbeb); border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 0 10px 10px 0; margin: 24px 0;">
      <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 500;">⚡ Start preparing now — research, outline your arguments, and come ready to impress!</p>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">Good luck! You've got this! 💪</p>
  </div>
  <div style="${footer}">
    <p style="margin: 0;">DebateHub &copy; ${new Date().getFullYear()} &middot; Built for great debates</p>
  </div>
</div>
</body>
</html>
`;

module.exports = {
  debateJoinedTemplate,
  topicRevealedTemplate,
};
