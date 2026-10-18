
import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {
  try {
    // 1. Read the email template
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "template.hbs"),
      "utf8"
    );

    // 2. Compile the Handlebars template
    const template = handlebars.compile(emailTemplateSource);

    // 3. Insert the token into the template
    const htmlToSend = template({
      token: encodeURIComponent(token),
    });

    // 4. Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 5. Configure the email
    const mailConfiguration = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Email Verification",
      html: htmlToSend,
    };

    // 6. Send the email
    const info = await transporter.sendMail(mailConfiguration);

    console.log("Email sent successfully:", info);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
