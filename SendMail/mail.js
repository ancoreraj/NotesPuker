const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const user = process.env.USER;
const pass = process.env.USER_PASSWORD;

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  }
})

const sendEmail = (name, email, message) => {
  transport.sendMail({
    from: user,
    to: user,
    subject: "Contact from AncoreNotes",
    html: `<div>
        <p>Name : ${name}</p>
        <p>Email Id : ${email}</p>
        <p>Message : ${message}<p>
        </div>`,
  }).catch(err => console.log(err));
};

module.exports = sendEmail;


