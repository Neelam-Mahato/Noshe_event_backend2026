 const nodemailer = require('nodemailer');

 const transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,      
   port: parseInt(process.env.EMAIL_PORT || '587'), 
   secure: false,                    
   auth: {
     user: process.env.EMAIL_USER,    
     pass: process.env.EMAIL_PASS     
   }
 });

 async function sendQrEmail(recipientEmail, username, qrCodeBase64) {
    try {
      const base64Data = qrCodeBase64 != null? qrCodeBase64.split("base64,")[1] : null;

      const mailOptions = {
        from: `"Your App Team" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: base64Data != null ? `Your Registration Security QR Code` : `Request declined`,
        html: `
          <h3>Hello ${username},</h3>
          ${base64Data != null? `
            <p>Thank you for registering. Below is your secure entry QR code:</p>
            <p><img src="cid:user_qr_code" alt="Registration QR" style="width:200px; height:200px;" /></p>
            <p>Keep this code confidential.</p>` : `
            <p>Your registration request has been declined.Please contact admin</p>`}
          `,
          attachments: [
            ...(base64Data != null ? [{
            filename: 'qrcode.png',
            content: base64Data,
            encoding: 'base64',     
            cid: 'user_qr_code'     
          }] : [])
        ]
      };
console.log(mailOptions)
      await transporter.sendMail(mailOptions);

      console.log(`QR Code successfully emailed to ${recipientEmail}`);
    } catch (error) {
      console.error('Email pipeline failed:', error);
    }
  }

   async function sendOtp(otp,recipientEmail) {
    try {
      const mailOptions = {
        from: `"Your App Team" <${email}>`,
        to: recipientEmail,
        subject: 'Your Registration Security QR Code',
        html: `
          <h3>Hello ,</h3>
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
    sendQrEmail,sendOtp
  }
