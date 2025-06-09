const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  console.log('send email', to, subject, html);
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.MAILER_FROM,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const link = `${origin}/user/verify-email?verificationToken=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the link:<a href="${link}">Verify here</a></p>`;

  sendEmail({
    to: email,
    subject: 'Confirm Email',
    html: `<h4>Hello ${name}</h4>${message}`,
  });
};

module.exports = { sendVerificationEmail };
