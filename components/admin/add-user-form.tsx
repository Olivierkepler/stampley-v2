import { createUser } from "@/actions/admin"
import { PasswordInput } from "./password-input"

export function AddUserForm() {
  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
       {/* Add User Form */}
       <details
        className="group overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm"
        open
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 bg-gradient-to-b from-gray-50 to-white px-6 py-5 transition hover:bg-gray-50">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900">Add User</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new account and assign a role.
            </p>
          </div>

          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm transition duration-200 group-hover:text-gray-600 group-open:rotate-180">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </summary>

        <div className="border-t border-gray-100 px-6 py-6">
          <form
            className="grid grid-cols-1 gap-4 lg:grid-cols-12"
            action={async (formData) => {
              "use server"
              await createUser(formData)
            }}
          >
            <div className="flex flex-col gap-2 lg:col-span-4">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
                className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
              />
            </div>

            {/* <div className="flex flex-col gap-2 lg:col-span-3">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
              />
            </div> */}
            <PasswordInput />

            <div className="flex flex-col gap-2 lg:col-span-3">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
              >
                <option value="PARTICIPANT">Participant</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex flex-col justify-end lg:col-span-2">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-gray-900 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </details>
    </section>
  )
}