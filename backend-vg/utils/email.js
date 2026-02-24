const nodemailer = require('nodemailer');

const parseBoolean = (value, fallback = false) => {
  if (typeof value !== 'string') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: parseBoolean(process.env.SMTP_SECURE),
    auth: { user, pass }
  });
};

const sendMail = async ({ to, subject, html, text, replyTo }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[mail:disabled] to=${to} subject="${subject}"`);
    return { delivered: false };
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from: fromAddress,
    to,
    replyTo,
    subject,
    html,
    text
  });

  return { delivered: true };
};

module.exports = {
  sendMail,
  parseBoolean
};
