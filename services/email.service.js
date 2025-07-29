const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

async function sendEmail(to, name) {
  const filePath = path.join(__dirname, '../templates/templateEmail.html');
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source);
  const htmlToSend = template({ name });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject: 'Selamat Datang!',
    html: htmlToSend
  });
}

module.exports = { sendEmail };
