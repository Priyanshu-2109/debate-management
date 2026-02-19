/**
 * Reusable HTML email templates
 */

const baseStyle = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #1a1a2e;
  color: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
`;

const headerStyle = `
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  padding: 32px 24px;
  text-align: center;
  color: #ffffff;
`;

const bodyStyle = `
  padding: 32px 24px;
`;

const footerStyle = `
  padding: 20px 24px;
  text-align: center;
  font-size: 12px;
  color: #888;
  border-top: 1px solid #333;
`;

const debateJoinedTemplate = ({ userName, date, time, location }) => `
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="margin: 0; font-size: 24px;">Debate Joined!</h1>
  </div>
  <div style="${bodyStyle}">
    <p>Hi <strong>${userName}</strong>,</p>
    <p>You have successfully joined the debate. Here are the details:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #333; color: #a78bfa; font-weight: bold;">Date</td>
        <td style="padding: 10px; border-bottom: 1px solid #333;">${new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #333; color: #a78bfa; font-weight: bold;">Time</td>
        <td style="padding: 10px; border-bottom: 1px solid #333;">${time}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #333; color: #a78bfa; font-weight: bold;">Location</td>
        <td style="padding: 10px; border-bottom: 1px solid #333;">${location}</td>
      </tr>
    </table>
    <p>The debate topic will be revealed closer to the event. Stay tuned!</p>
  </div>
  <div style="${footerStyle}">
    <p>Debate Management System &copy; ${new Date().getFullYear()}</p>
  </div>
</div>
`;

const topicRevealedTemplate = ({
  userName,
  topicTitle,
  topicDescription,
  date,
  time,
  location,
}) => `
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="margin: 0; font-size: 24px;">Topic Revealed!</h1>
  </div>
  <div style="${bodyStyle}">
    <p>Hi <strong>${userName}</strong>,</p>
    <p>The topic for your upcoming debate has been revealed!</p>
    <div style="background: #16213e; border-left: 4px solid #8b5cf6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <h2 style="margin: 0 0 8px 0; color: #a78bfa;">${topicTitle}</h2>
      <p style="margin: 0; color: #ccc;">${topicDescription}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #333; color: #a78bfa; font-weight: bold;">Date</td>
        <td style="padding: 10px; border-bottom: 1px solid #333;">${new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #333; color: #a78bfa; font-weight: bold;">Time</td>
        <td style="padding: 10px; border-bottom: 1px solid #333;">${time}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #333; color: #a78bfa; font-weight: bold;">Location</td>
        <td style="padding: 10px; border-bottom: 1px solid #333;">${location}</td>
      </tr>
    </table>
    <p>Prepare well and good luck!</p>
  </div>
  <div style="${footerStyle}">
    <p>Debate Management System &copy; ${new Date().getFullYear()}</p>
  </div>
</div>
`;

module.exports = {
  debateJoinedTemplate,
  topicRevealedTemplate,
};
