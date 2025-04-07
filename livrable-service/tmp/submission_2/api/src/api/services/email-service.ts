import nodemailer from "nodemailer";
import { prisma } from "../../utils/prisma";
import crypto from "crypto";
import mjml2html from "mjml";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const generateEmailTemplate = (
  title: string,
  content: string,
  ctaText: string,
  ctaLink: string
) => {
  return mjml2html(`
    <mjml>
      <mj-body background-color="#f4f4f4">
        <mj-section background-color="#ffffff" padding-bottom="20px" padding-top="20px">
          <mj-column width="100%">
            <mj-image src="${process.env.LOGO_URL}" alt="Logo" align="center" width="100px" />
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-bottom="0px" padding-top="0">
          <mj-column width="100%">
            <mj-text font-size="24px" color="#000000" align="center">${title}</mj-text>
            <mj-text font-size="16px" color="#000000">${content}</mj-text>
            <mj-button background-color="#000000" color="#ffffff" href="${ctaLink}">${ctaText}</mj-button>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `).html;
};

export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    });
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const createInvitation = async (
  organizationId: number,
  email: string
) => {
  const token = crypto.randomBytes(20).toString("hex");
  const invitation = await prisma.invitations.create({
    data: {
      email,
      organizationId,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const htmlContent = generateEmailTemplate(
    "You've been invited!",
    "You have been invited to join an organization on our platform. Click the button below to accept the invitation.",
    "Accept Invitation",
    `${process.env.FRONTEND_URL}/accept-invitation/${invitation.token}`
  );

  await sendEmail(email, "Invitation to join the organization", htmlContent);
  return invitation;
};

export const createResetPasswordToken = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const token = crypto.randomBytes(20).toString("hex");
  await prisma.resetPasswordTokens.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const htmlContent = generateEmailTemplate(
    "Reset Your Password",
    "We received a request to reset your password. Click the button below to create a new password. If you didn't make this request, you can safely ignore this email.",
    "Reset Password",
    `${process.env.FRONTEND_URL}/reset-password/?token=${token}`
  );

  await sendEmail(email, "Reset Your Password", htmlContent);
};
