const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT || 587) === 465,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 50000,
  greetingTimeout: 50000,
  socketTimeout: 50000,
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendMail({ to, subject, html, attachments = [] }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials are missing. Check EMAIL_USER and EMAIL_PASS in the environment.');
  }

  const mailOptions = {
    from: `"Your App Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  };

  try {
    await transporter.verify();
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    const message =
      error?.code === 'ETIMEDOUT'
        ? 'SMTP timeout. Check EMAIL_HOST/EMAIL_PORT, firewall/network access, and Gmail app password.'
        : error?.message || 'Failed to send email';

    throw new Error(message);
  }
}

async function sendQrEmail(recipientEmail, username, qrCodeBase64) {
  const base64Data =
    typeof qrCodeBase64 === 'string' && qrCodeBase64.includes('base64,')
      ? qrCodeBase64.split('base64,')[1]
      : null;

  if (!recipientEmail) {
    throw new Error('Recipient email is required.');
  }

  const attachments = base64Data
    ? [
        {
          filename: 'qrcode.png',
          content: base64Data,
          encoding: 'base64',
          cid: 'user_qr_code',
        },
      ]
    : [];

  const html = `
    <h3>Hello ${username || 'there'},</h3>
    <p>Thank you for registering. Below is your secure entry QR code:</p>
    <p><img src="cid:user_qr_code" alt="Registration QR" style="width:200px; height:200px;" /></p>
    <p>Keep this code confidential.</p>
  `;

  await sendMail({
    to: recipientEmail,
    subject: 'Your Registration Security QR Code',
    html,
    attachments,
  });
}

async function sendEmail(recipientEmail, username) {
  if (!recipientEmail) {
    throw new Error('Recipient email is required.');
  }

  await sendMail({
    to: recipientEmail,
    subject: 'Request declined',
    html: `
      <h3>Hello ${username || 'there'},</h3>
      <p>Your registration request has been declined. Please contact admin.</p>
    `,
  });
}

async function sendOtp(otp,recipientEmail, name) {
    try {
      const mailOptions = {
        from: `"Your App Team" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: 'Your login OTP Code',
        html: `
          <h3>Hello ${name},</h3>
          <p>Your otp is ${otp}</p>
          <p>Keep this code confidential.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      console.log(`QR Code successfully emailed to ${recipientEmail}`);
    } catch (error) {
      console.error('Email pipeline failed:', error);
    }
  }

module.exports = {
  sendQrEmail,
  sendEmail,
  sendOtp,
};
