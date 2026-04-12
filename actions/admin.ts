"use server"

import { query } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

function generateKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let key = "AIDES-"
  for (let i = 0; i < 6; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

export async function generateStudyKey() {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }
  try {
    const key = generateKey()
    await query(
      `INSERT INTO study_keys (id, key, is_used, created_by, created_at)
       VALUES (gen_random_uuid()::text, $1, FALSE, $2, NOW())`,
      [key, session.user.email]
    )
    revalidatePath("/admin/keys")
    return { success: true, key }
  } catch (error) {
    console.error("[generateStudyKey]", error)
    return { error: "Failed to generate key" }
  }
}

export async function deleteStudyKey(id: string) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }
  try {
    await query(
      "DELETE FROM study_keys WHERE id = $1 AND is_used = FALSE",
      [id]
    )
    revalidatePath("/admin/keys")
    return { success: true }
  } catch (error) {
    console.error("[deleteStudyKey]", error)
    return { error: "Failed to delete key" }
  }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }
  try {
    await query("DELETE FROM users WHERE id = $1", [id])
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("[deleteUser]", error)
    return { error: "Failed to delete user" }
  }
}

export async function createUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await query(
      `INSERT INTO users (id, email, password, role, created_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, NOW())`,
      [email.toLowerCase(), hashedPassword, role]
    )
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("[createUser]", error)
    return { error: "Failed to create user" }
  }
}

export async function toggleUserRole(id: string, currentRole: string) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "Unauthorized" }
  }
  const newRole = currentRole === "ADMIN" ? "PARTICIPANT" : "ADMIN"
  try {
    await query(
      "UPDATE users SET role = $1 WHERE id = $2",
      [newRole, id]
    )
    revalidatePath("/admin/users")
    return { success: true, newRole }
  } catch (error) {
    console.error("[toggleUserRole]", error)
    return { error: "Failed to update role" }
  }
}