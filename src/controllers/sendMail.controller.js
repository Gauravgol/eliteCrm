const nodemailer = require("nodemailer");

exports.sendMail = async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      email,
      state,
      serviceNeeded,
      additionalDetails,
      callDetails
    } =  req.body;
    console.log("🚀 ~ req.body:", req.body)
  

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color:#333;">
      ${callDetails
        ? `<h2 style="color:#2563eb;">Call Request</h2>`
        : `<h2 style="color:#2563eb;">New Service Inquiry</h2>`
      }
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td><strong>Full Name:</strong></td>
            <td>${fullName}</td>
          </tr>
          <tr>
            <td><strong>Company Name:</strong></td>
            <td>${companyName || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Email:</strong></td>
            <td>${email}</td>
          </tr>
          <tr>
            <td><strong>State:</strong></td>
            <td>${state || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Service Needed:</strong></td>
            <td>${serviceNeeded}</td>
          </tr>
          ${
            additionalDetails
              ? `
          <tr>
            <td><strong>Additional Details:</strong></td>
            <td>${additionalDetails}</td>
          </tr>`
              : ""
          }
          ${
            callDetails
              ? `
          <tr>
            <td><strong>Call Details:</strong></td>
            <td>${callDetails}</td>
          </tr>`
              : ""
          }
        </table>

        <p style="margin-top:20px;">
          This inquiry was submitted from your website.
        </p>
      </div>
    `;
    await transporter.sendMail({
      from: `"Website Inquiry" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Inquiry from ${fullName}`,
      html,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });

  } catch (error) {
    console.error("Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};