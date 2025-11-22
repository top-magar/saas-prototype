import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📧 Verification link for ${email}:\n${verificationUrl}\n`);
  }
  
  if (resend) {
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Verify your email',
      html: `<p>Hi ${name},</p><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    });
  }
}
