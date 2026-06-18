 // const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';

 const email = "nosheindia.2026@gmail.com";
 const pass = "pyso ehtv xpls ckmo";
const port = 587;
const host = "smtp.gmail.com"
 import { Resend } from 'resend';
const resend = new Resend("rnd_RTCdohBJJTFX7SWUJuidOiH3xZ56");

async function sendQrEmail(recipientEmail, username, qrCodeBase64) {
  try {
    const base64Data = qrCodeBase64 != null 
      ? qrCodeBase64.split("base64,")[1] 
      : null;

    await resend.emails.send({
      from: 'Your App Team <neelammahato3@gmail.com>', // or your verified domain
      to: recipientEmail,
      subject: base64Data ? `Your Registration Security QR Code` : `Request declined`,
      html: `
        <h3>Hello ${username},</h3>
        ${base64Data ? `
          <p>Thank you for registering. Below is your secure entry QR code:</p>
          <img src="cid:user_qr_code" alt="Registration QR" style="width:200px;height:200px;" />
          <p>Keep this code confidential.</p>` : `
          <p>Your registration request has been declined. Please contact admin.</p>`}
      `,
      attachments: base64Data ? [{
        filename: 'qrcode.png',
        content: base64Data,  // base64 string directly
      }] : [],
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

//  async function sendQrEmail(recipientEmail, username, qrCodeBase64) {
//     try {

//       const base64Data = qrCodeBase64 != null? qrCodeBase64.split("base64,")[1] : null;

//       const mailOptions = {
//         from: `"Your App Team" <${email}>`,
//         to: recipientEmail,
//         subject: base64Data ? `Your Registration Security QR Code` : `Request declined`,
//         html: `
//           <h3>Hello ${username},</h3>
//           ${base64Data ? `
//             <p>Thank you for registering. Below is your secure entry QR code:</p>
//             <p><img src="cid:user_qr_code" alt="Registration QR" style="width:200px; height:200px;" /></p>
//             <p>Keep this code confidential.</p>` : `
//             <p>Your registration request has been declined.Please contact admin</p>`}
//           `,
//           attachments: [
//             ...(base64Data ? [{
//             filename: 'qrcode.png',
//             content: base64Data,
//             encoding: 'base64',     
//             cid: 'user_qr_code'     
//           }] : [])
//         ]
//       };
// console.log(mailOptions)
//       await transporter.sendMail(mailOptions);

//       console.log(`QR Code successfully emailed to ${recipientEmail}`);
//     } catch (error) {
//       console.error('Email pipeline failed:', error);
//     }
//   }

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
  export {sendQrEmail,sendOtp }
