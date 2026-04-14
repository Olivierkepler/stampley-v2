import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(
  email: string,
  token: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "AIDES-T2D <onboarding@resend.dev>",
    to: email,
    subject: "Reset your AIDES-T2D password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0;">AIDES-T2D</h1>
              <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">
                AI-Driven Emotional Support for Type 2 Diabetes
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 32px;">

            <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">
              Reset your password
            </h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
              We received a request to reset the password for your AIDES-T2D account.
            </p>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">
              Click the button below to set a new password. 
              This link will expire in <strong>1 hour</strong>.
            </p>

            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${resetUrl}"
                style="display: inline-block; background-color: #111827; color: white; font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
                Reset Password
              </a>
            </div>

            <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.6;">
                🔒 If you did not request a password reset, you can safely ignore this email. Your password will not change.
              </p>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
              If the button doesn't work, copy and paste this link:
            </p>
            <p style="color: #6b7280; font-size: 12px; word-break: break-all; margin: 0 0 32px 0;">
              ${resetUrl}
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 24px;">

            <div style="text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                AIDES-T2D Study  |  University of Massachusetts Boston
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0;">
                pcrg@umb.edu  |  617-287-4067
              </p>
            </div>

          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error("[sendPasswordResetEmail] error:", error)
    throw new Error("Failed to send email")
  }

  return { success: true }
}