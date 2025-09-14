import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SendGrid, etc.
  auth: {
    user: "u2414906@gmail.com",
    pass: "ssrt rcrg rsve qumg"
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Trip Planner" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;