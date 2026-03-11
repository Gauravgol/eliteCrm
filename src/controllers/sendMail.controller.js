const nodemailer = require("nodemailer");
const { info_logger, error_logger } = require("../logger/winston");

exports.sendMail = async (req, res) => {
  let urn = req.body.urn;

  try {
    const {
      fullName,
      companyName,
      email,
      state,
      serviceNeeded,
      additionalDetails,
      callDetails
    } = req.body;

    info_logger(`urn:${urn} >>>>> SEND MAIL REQ BODY: ${JSON.stringify(req.body)}`);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const isCallRequest = callDetails && callDetails.date && callDetails.time;

    const subject = isCallRequest
      ? `Call Scheduled by ${fullName}`
      : `New Service Inquiry from ${fullName}`;

    const heading = isCallRequest
      ? "Call Request Scheduled"
      : "New Service Inquiry";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color:#333;">
        <h2 style="color:#2563eb;">${heading}</h2>

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
            isCallRequest
              ? `
          <tr>
            <td><strong>Call Date:</strong></td>
            <td>${callDetails.date}</td>
          </tr>
          <tr>
            <td><strong>Call Time:</strong></td>
            <td>${callDetails.time}</td>
          </tr>`
              : ""
          }
        </table>

        <p style="margin-top:20px;">
          This request was submitted from your website.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Website Inquiry" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject,
      html,
    });

    return res.status(200).json({
      success: true,
      message: isCallRequest
        ? "Your call has been scheduled successfully."
        : "Inquiry sent successfully.",
    });

  } catch (error) {
    error_logger(`urn:${urn} >>>>> SEND MAIL ERROR: ${error}`);

    console.error("Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};