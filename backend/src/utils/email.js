const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"PrepAI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

const emailTemplates = {
  verifyEmail: (name, verificationUrl) => `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e2e8f0; margin: 0; padding: 40px 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid #2d2d4e; }
      .header { background: linear-gradient(135deg, #6c63ff, #a855f7); padding: 40px; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px; }
      .body { padding: 40px; }
      .body p { line-height: 1.7; color: #94a3b8; margin-bottom: 20px; }
      .btn { display: inline-block; background: linear-gradient(135deg, #6c63ff, #a855f7); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
      .footer { padding: 20px 40px; border-top: 1px solid #2d2d4e; color: #64748b; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h1>🎯 PrepAI</h1></div>
        <div class="body">
          <h2 style="color: #e2e8f0;">Welcome, ${name}!</h2>
          <p>Thank you for joining PrepAI. Please verify your email address to get started.</p>
          <a href="${verificationUrl}" class="btn">Verify Email Address</a>
          <p style="font-size: 13px; color: #64748b;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer"><p>© ${new Date().getFullYear()} PrepAI. All rights reserved.</p></div>
      </div>
    </body></html>
  `,

  resetPassword: (name, resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e2e8f0; margin: 0; padding: 40px 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid #2d2d4e; }
      .header { background: linear-gradient(135deg, #ef4444, #f97316); padding: 40px; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 28px; }
      .body { padding: 40px; }
      .body p { line-height: 1.7; color: #94a3b8; margin-bottom: 20px; }
      .btn { display: inline-block; background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
      .footer { padding: 20px 40px; border-top: 1px solid #2d2d4e; color: #64748b; font-size: 12px; }
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h1>🔑 PrepAI</h1></div>
        <div class="body">
          <h2 style="color: #e2e8f0;">Password Reset, ${name}</h2>
          <p>We received a request to reset your password. Click the button below to reset it.</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p style="font-size: 13px; color: #64748b;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer"><p>© ${new Date().getFullYear()} PrepAI. All rights reserved.</p></div>
      </div>
    </body></html>
  `,
};

module.exports = { sendEmail, emailTemplates };
