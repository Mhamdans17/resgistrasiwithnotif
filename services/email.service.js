const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Welcome Email
async function sendWelcomeEmail(to, name) {
  const filePath = path.join(__dirname, '../templates/templateEmail.html');
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source);
  const htmlToSend = template({ name });

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject: 'Selamat Datang!',
    html: htmlToSend
  });
}

// Reset Password Success Email
async function sendResetSuccessEmail(to, name) {
  const filePath = path.join(__dirname, '../templates/resetSuccessEmail.html');
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source);
  const htmlToSend = template({ name });

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject: 'Password Berhasil Direset',
    html: htmlToSend
  });
}

module.exports = {
  sendWelcomeEmail,
  sendResetSuccessEmail
};
