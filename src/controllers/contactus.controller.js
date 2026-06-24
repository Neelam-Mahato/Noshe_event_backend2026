const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  debug:true,
  secureConnection:false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_KEY,
  },
  tls:{
    rejectUnauthorized:true
  },
  pool: true,            
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 20000,     
});

const contact = async(req,res) =>{
      console.log(process.env.EMAIL_HOST,process.env.EMAIL_PASS,process.env.EMAIL_USER)

    try{
        const data = req.body;
        res.status(200).json({ success: true, message: "Submitted successfully" });
    sendContactMail(data).catch(err => {
        console.error('Mail failed:', err.message);
        // optionally: save to DB as "pending" for retry, alert yourself, etc.
    });
    }
    catch (error){
        res.status(500).json({ success: false, message: 'Some error occured' });
    }
}


async function sendContactMail(data, retries = 3) {
  const mailOptions = {
    from: `"Your App Team" <${process.env.EMAIL_USER}>`,
    to: "nosheundia.2026@gmail.com",        // see point 2 below
    replyTo: "nosheundia.2026@gmail.com",
    subject: 'New Contact Form Submission',
    html: `
      <h3>New Contact Submission</h3>
      <p>Name: ${data.name}</p>
      <p>Email: ${data.email}</p>
      <p>Mobile: ${data.phone}</p>
      <p>Message: ${data.message}</p>
    `,
  };

  for (let i = 0; i < retries; i++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log('Mail sent');
      return;
    } catch (err) {
      console.error(`Attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
module.exports = {
    contact
}