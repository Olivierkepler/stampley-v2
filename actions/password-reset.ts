"use server"

import { query } from "@/lib/db"
import crypto from "crypto"

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) return { error: "Email is required" }

  try {
    // Check if user exists
    const userResult = await query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    )

    // Always return success even if user not found (security best practice)
    if (userResult.rows.length === 0) {
      return { success: true }
    }

    const userId = userResult.rows[0].id

    // Delete any existing tokens for this user
    await query(
      "DELETE FROM password_reset_tokens WHERE user_id = $1",
      [userId]
    )

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Store token (expires in 1 hour)
    await query(
      `INSERT INTO password_reset_tokens 
       (id, user_id, token_hash, expires_at, created_at)
       VALUES (gen_random_uuid()::text, $1, $2, NOW() + INTERVAL '1 hour', NOW())`,
      [userId, tokenHash]
    )

    // Send email
    try {
      const { sendPasswordResetEmail } = await import("@/lib/email")
      await sendPasswordResetEmail(email.toLowerCase(), token)
      console.log(`[password-reset] email sent to ${email}`)
    } catch (emailError) {
      // Log but don't fail — token is saved, email can be resent
      console.error("[password-reset] email failed:", emailError)
      // Fallback: log token for manual testing
      console.log(`[password-reset] fallback link: /reset-password?token=${token}`)
    }

    return { success: true }

  } catch (error) {
    console.error("[requestPasswordReset]", error)
    return { error: "Something went wrong. Please try again." }
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!token || !password || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  try {
    // Hash the token to compare with stored hash
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Find valid token
    const tokenResult = await query(
      `SELECT * FROM password_reset_tokens 
       WHERE token_hash = $1 
       AND expires_at > NOW()`,
      [tokenHash]
    )

    if (tokenResult.rows.length === 0) {
      return { error: "Reset link is invalid or has expired. Please request a new one." }
    }

    const { user_id } = tokenResult.rows[0]

    // Hash new password
    const bcrypt = await import("bcryptjs")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password
    await query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, user_id]
    )

    // Delete used token
    await query(
      "DELETE FROM password_reset_tokens WHERE token_hash = $1",
      [tokenHash]
    )

    return { success: true }

  } catch (error) {
    console.error("[resetPassword]", error)
    return { error: "Something went wrong. Please try again." }
  }
}