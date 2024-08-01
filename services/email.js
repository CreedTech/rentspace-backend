const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
    from: 'no-reply@rentspacetech.com'
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "RentSpace <no-reply@rentspacetech.com>", // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
});

module.exports = sendEmail;




// const nodemailer = require("nodemailer");
// const asyncHandler = require("express-async-handler");

// const sendEmail = asyncHandler(async (data, req, res) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: "smtp.resend.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: 'resend',
//         pass: process.env.RESEND_API_KEY,
//       },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: "RentSpace <onboarding@resend.dev>",
//       to: data.to,
//       subject: data.subject,
//       text: data.text,
//       html: data.html,
//     });

//     console.log("Message sent using Resend: %s", info.messageId);
//   } catch (resendError) {
//     console.error("Error sending email using Resend:", resendError.message);

//     // Fallback to Gmail if Resend fails
//     let gmailTransporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_ID,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     let gmailInfo = await gmailTransporter.sendMail({
//       from: "RentSpace <rentspacedev@gmail.com>",
//       to: data.to,
//       subject: data.subject,
//       text: data.text,
//       html: data.html,
//     });

//     console.log("Message sent using Gmail: %s", gmailInfo.messageId);
//   }
// });


// module.exports = sendEmail;
