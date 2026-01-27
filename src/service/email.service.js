const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = async ({ type, to, data }) => {
  let subject = "";
  let html = "";

  if (type === "PROJECT_ASSIGNED") {
    subject = "New Project Assigned";
    html = `
      <p>You are assigned to <b>${data.projectName}</b></p>
      <p>Assigned by ${data.assignedBy}</p>
    `;
  }

  await transporter.sendMail({
    from: `"CRM" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
