// api/contact.js - Enhanced debugging version
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Set CORS headers for all requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "X-Requested-With, Content-Type, Accept, Authorization, Cache-Control",
    "Access-Control-Allow-Credentials": "false",
    "Access-Control-Max-Age": "86400",
  };

  // Apply CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  console.log("=== REQUEST DEBUG INFO ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request headers:", JSON.stringify(req.headers, null, 2));

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return res
      .status(405)
      .json({ error: `Method ${req.method} not allowed. Use POST.` });
  }

  try {
    console.log("=== PROCESSING POST REQUEST ===");
    console.log("Raw body:", req.body);
    console.log("Body type:", typeof req.body);

    // Enhanced environment variables check
    const envVars = {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? "***HIDDEN***" : undefined,
      NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    console.log("=== ENVIRONMENT VARIABLES ===");
    console.log("Environment check:", JSON.stringify(envVars, null, 2));

    // Check if required environment variables exist
    if (!process.env.EMAIL_USER) {
      console.error("❌ EMAIL_USER is missing");
      return res.status(500).json({
        error: "EMAIL_USER environment variable is not set",
        debug: { hasEmailUser: false },
      });
    }

    if (!process.env.EMAIL_PASS) {
      console.error("❌ EMAIL_PASS is missing");
      return res.status(500).json({
        error: "EMAIL_PASS environment variable is not set",
        debug: { hasEmailPass: false },
      });
    }

    console.log("✅ Environment variables are present");

    // Extract and validate request body
    const { name, email, subject, message } = req.body || {};

    console.log("=== REQUEST BODY VALIDATION ===");
    console.log("Extracted fields:", {
      name: name ? `"${name}"` : "MISSING",
      email: email ? `"${email}"` : "MISSING",
      subject: subject ? `"${subject}"` : "MISSING",
      message: message ? `"${message.substring(0, 50)}..."` : "MISSING",
    });

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!subject) missingFields.push("subject");
    if (!message) missingFields.push("message");

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields);
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
        received: {
          name: !!name,
          email: !!email,
          subject: !!subject,
          message: !!message,
        },
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format:", email);
      return res.status(400).json({ error: "Invalid email format" });
    }

    console.log("✅ All fields validated successfully");

    console.log("=== CREATING EMAIL TRANSPORTER ===");

    // Configure nodemailer transporter with enhanced options
    const transporterConfig = {
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      // Add connection timeout
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    };

    console.log("Transporter config (without credentials):", {
      service: transporterConfig.service,
      host: transporterConfig.host,
      port: transporterConfig.port,
      secure: transporterConfig.secure,
      hasAuth: !!transporterConfig.auth.user && !!transporterConfig.auth.pass,
    });

    const transporter = nodemailer.createTransport(transporterConfig);

    // Test the connection with timeout
    console.log("=== TESTING SMTP CONNECTION ===");
    try {
      const verifyResult = await Promise.race([
        transporter.verify(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("SMTP verification timeout")),
            30000
          )
        ),
      ]);
      console.log("✅ SMTP connection verified successfully:", verifyResult);
    } catch (verifyError) {
      console.error("❌ SMTP verification failed:", {
        message: verifyError.message,
        code: verifyError.code,
        errno: verifyError.errno,
        syscall: verifyError.syscall,
        hostname: verifyError.hostname,
      });
      return res.status(500).json({
        error: "Email service configuration error",
        details: verifyError.message,
        code: verifyError.code,
      });
    }

    const notificationEmail =
      process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;
    console.log("📧 Notification email recipient:", notificationEmail);

    // Email options
    const notificationEmailOptions = {
      from: process.env.EMAIL_USER,
      to: notificationEmail,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 10px; text-align: center; color: #64748b; font-size: 12px;">
            Sent from your Portfolio Contact Form | ${new Date().toLocaleString()}
          </div>
        </div>
      `,
    };

    const autoReplyEmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting me, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            Thank You for Reaching Out!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="font-style: italic; color: #64748b;">"${message.substring(
              0,
              150
            )}${message.length > 150 ? "..." : ""}"</p>
          </div>
          
          <p>I typically respond within 24-48 hours.</p>
          
          <p>Best regards,<br>
          <strong>Manav Prakash</strong><br>
          Computer Science & Engineering Student<br>
          VIT Vellore</p>
        </div>
      `,
    };

    console.log("=== SENDING EMAILS ===");
    console.log("Notification email to:", notificationEmailOptions.to);
    console.log("Auto-reply email to:", autoReplyEmailOptions.to);

    // Send emails with timeout
    const emailPromises = [
      transporter.sendMail(notificationEmailOptions),
      transporter.sendMail(autoReplyEmailOptions),
    ].map((promise) =>
      Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Email send timeout")), 30000)
        ),
      ])
    );

    const emailResults = await Promise.allSettled(emailPromises);

    console.log("=== EMAIL RESULTS ===");
    emailResults.forEach((result, index) => {
      const emailType = index === 0 ? "notification" : "auto-reply";
      if (result.status === "fulfilled") {
        console.log(`✅ ${emailType} email sent successfully:`, {
          messageId: result.value.messageId,
          response: result.value.response,
        });
      } else {
        console.error(`❌ ${emailType} email failed:`, {
          error: result.reason.message,
          code: result.reason.code,
        });
      }
    });

    // Check if at least the notification email was sent
    if (emailResults[0].status === "rejected") {
      console.error("❌ Critical: Failed to send notification email");
      return res.status(500).json({
        error: "Failed to send notification email",
        details: emailResults[0].reason?.message,
        code: emailResults[0].reason?.code,
      });
    }

    console.log("✅ SUCCESS: Email process completed");
    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      debug: {
        notificationSent: emailResults[0].status === "fulfilled",
        autoReplySent: emailResults[1].status === "fulfilled",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("=== CRITICAL ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Error code:", error.code);
    console.error("Error errno:", error.errno);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
      code: error.code,
      type: error.name,
      timestamp: new Date().toISOString(),
    });
  }
}
