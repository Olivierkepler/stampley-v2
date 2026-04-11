"use server"

import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function registerWithKey(formData: FormData) {
  const studyId = formData.get("studyId") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!studyId || !email || !password) {
    return { error: "All fields are required" }
  }

  try {
    // Check if study key exists and is unused
    const keyResult = await query(
      "SELECT * FROM study_keys WHERE key = $1 AND is_used = FALSE",
      [studyId.toUpperCase()]
    )

    if (keyResult.rows.length === 0) {
      return { error: "Invalid or already used Study ID" }
    }

    // Check if email already exists
    const existingUser = await query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    )

    if (existingUser.rows.length > 0) {
      return { error: "Email already registered" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and mark key as used in a transaction
    await query("BEGIN", [])
    
    await query(
      `INSERT INTO users (id, email, password, role, study_id, created_at)
       VALUES (gen_random_uuid()::text, $1, $2, 'PARTICIPANT', $3, NOW())`,
      [email.toLowerCase(), hashedPassword, studyId.toUpperCase()]
    )

    await query(
      "UPDATE study_keys SET is_used = TRUE WHERE key = $1",
      [studyId.toUpperCase()]
    )

    await query("COMMIT", [])

    return { success: true }

  } catch (error) {
    await query("ROLLBACK", [])
    console.error("[register] error:", error)
    return { error: "Something went wrong. Please try again." }
  }
}