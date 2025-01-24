require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { subject, email, message } = req.body;

  if (!subject || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      text: `Message from ${email}:\n\n${message}`,
      replyTo: email, 
    };
    

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error.message, error.stack);
    res.status(500).json({ error: "Failed to send email. Try again later." });
  }
});

module.exports = router;
