/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter object using SMTP protocol
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  // Define email options
  const mailOptions = {
    from: 'Ecommerce Website <mohamedlasheen222003@gmail.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  }

  // Send email using transporter object
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail