require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const CONFIG = {
  senderEmail: process.env.SENDER_EMAIL,
  senderPassword: process.env.SENDER_PASSWORD,
  senderName: process.env.SENDER_NAME,
  resumeLink: process.env.RESUME_LINK,
  linkedInLink: process.env.LINKEDIN_LINK,
  githubLink: process.env.GITHUB_LINK,
  phone: process.env.PHONE,
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 60000,
  auth: {
    user: CONFIG.senderEmail,
    pass: CONFIG.senderPassword,
  },
});

function getEmailHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="font-family: Arial, Helvetica, sans-serif; color: #333333; line-height: 1.6; max-width: 650px; margin: 0 auto; padding: 20px;">

  <p>Hi,</p>

  <p>
    I’m <strong>Yashveer Singh</strong>, a Software Engineer with 
    <strong>two years+ of experience at RapiPay Fintech</strong>, building
    backend systems for payments and financial services.
  </p>

  <p>
    I have worked on multi-bank reconciliation, QR payments, Redis-based
    idempotency, and event-driven services using RabbitMQ and Kafka. My skills
    include <strong>Java, Spring Boot, Node.js, PostgreSQL, MongoDB,
    microservices, and distributed systems</strong>.
  </p>

  <p>
    I’m exploring Backend Engineer / Software Engineer opportunities in fintech
    and would appreciate consideration for any relevant role.
  </p>

  <p>
    <strong>Resume:</strong>
    <a href="${CONFIG.resumeLink}" style="color: #0056b3; text-decoration: none; font-weight: bold;">
      View Resume
    </a><br />

    <strong>LinkedIn:</strong>
    <a href="${CONFIG.linkedInLink}" style="color: #0056b3; text-decoration: none;">
      linkedin.com/in/yashveer-singh-086119281
    </a><br />

    <strong>GitHub:</strong>
    <a href="${CONFIG.githubLink}" style="color: #0056b3; text-decoration: none;">
      github.com/YashveerS12
    </a>
  </p>

  <p>Thank you for your time and consideration.</p>

  <p>
    Best regards,<br />
    <strong>Yashveer Singh</strong><br />
    Software Engineer | Fintech Backend<br />
    ${CONFIG.phone}<br />
    ${CONFIG.senderEmail}
  </p>

</body>
</html>
  `;
}

app.post("/send-mail", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !Array.isArray(email) || email.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide email array: { email: ['hr@company.com'] }",
      });
    }

    const results = [];

    for (const recipient of email) {
      try {
        await transporter.sendMail({
          from: `"${CONFIG.senderName}" <${CONFIG.senderEmail}>`,
          to: recipient,
          subject:
            "Fintech Backend Engineer | Java, Spring Boot, Payments & Distributed Systems",
          html: getEmailHTML(),
        });

        results.push({ email: recipient, status: "sent" });
        console.log(`Sent to: ${recipient}`);
      } catch (err) {
        results.push({
          email: recipient,
          status: "failed",
          error: err.message,
        });
        console.error(`Failed for ${recipient}: ${err.message}`);
      }
    }

    return res.json({ success: true, results });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});