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
  };
  if (type === "TASK_ASSIGNED") {
    console.log("INside mail send")

    subject = "You’ve been assigned a new task";
  
    html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6">
        <h2 style="color: #1f2937;">New Task Assigned</h2>
  
        <p>Hello,</p>
  
        <p>
          <strong>${data.assignedBy || "Someone"}</strong> has assigned you a new task.
        </p>
  
        <div style="
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 16px;
          margin: 16px 0;
        ">
          <p style="margin: 0 0 8px 0;">
            <strong>Task:</strong> ${data.taskName}
          </p>
  
          ${
            data.description
              ? `<p style="margin: 0;">
                  <strong>Description:</strong><br />
                  ${data.description}
                </p>`
              : ""
          }
        </div>
  
        <p>
          Please review the task and take the necessary action.
        </p>
  
        <p style="margin-top: 24px;">
          — <br />
          <strong>CRM Team</strong>
        </p>
      </div>
    `;
  }

  let sendEmail = await transporter.sendMail({
    from: `"CRM" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  console.log("🚀 ~ sendEmail:", sendEmail)
};
