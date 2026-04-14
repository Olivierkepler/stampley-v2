import { createUser } from "@/actions/admin"
import { PasswordInput } from "./password-input"

type DashboardStats = {
  participants: number | string
  todayCheckins: number | string
  availableKeys: number | string
  safetyAlerts: number | string
}

type DashboardPageProps = {
  stats: DashboardStats
}

function StatCard({
  title,
  value,
  subtitle,
  backgroundImage,
  overlayClassName,
  titleClassName,
  valueClassName,
  subtitleClassName,
}: {
  title: string
  value: number | string
  subtitle: string
  backgroundImage: string
  overlayClassName: string
  titleClassName: string
  valueClassName: string
  subtitleClassName: string
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-white/30 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="relative z-10">
        <p className={`text-xs uppercase tracking-[0.18em] ${titleClassName}`}>
          {title}
        </p>
        <p className={`mt-2 text-4xl font-semibold leading-none ${valueClassName}`}>
          {value}
        </p>
        <p className={`mt-3 text-sm ${subtitleClassName}`}>{subtitle}</p>
      </div>
    </div>
  )
}

export function AddUserForm() {
  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm">
      <details
        className="group overflow-hidden rounded-[28px]"
        open
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 bg-gradient-to-b from-slate-50 to-white px-6 py-5"
          style={{
            backgroundImage: "url('/images/gradient5.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}>
          <div className="min-w-0"
          
        
          >
            <h2 className="text-xl font-semibold text-white">Add User</h2>
            <p className="mt-1 text-sm text-white/75">
              Create a new account and assign a role.
            </p>
          </div>

          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition duration-200 group-hover:text-slate-600 group-open:rotate-180">
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

        <div className="border-t border-slate-100 px-6 py-6">
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
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
                className="h-12 rounded-[18px] border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <PasswordInput />

            <div className="flex flex-col gap-2 lg:col-span-3">
              <label
                htmlFor="role"
                className="text-sm font-medium text-slate-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                className="h-12 rounded-[18px] border border-slate-200 bg-white/90 px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                <option value="PARTICIPANT">Participant</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex flex-col justify-end lg:col-span-2">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-[18px] bg-slate-950 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
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

function QuickSummaryCard() {
  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quick Summary</h2>
          <p className="mt-1 text-sm text-slate-500">
            A snapshot of activity and account health.
          </p>
        </div>

        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 4v12M4 10h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-[20px] border border-slate-100 bg-slate-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Account Status
          </p>
          <p className="mt-2 text-sm font-medium text-slate-900">
            All critical systems are normal.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            No urgent follow-up is needed right now.
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-100 bg-slate-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Recommendations
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>Review participant onboarding flow.</li>
            <li>Monitor key assignments before peak activity.</li>
            <li>Keep admin permissions limited to required staff.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function UsersTable() {
  const users = [
    {
      email: "james@example.com",
      role: "Participant",
      status: "Active",
    },
    {
      email: "olivia@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      email: "noah@example.com",
      role: "Participant",
      status: "Pending",
    },
  ]

  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage participants and administrators.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search users"
            className="h-11 rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.email}
                className="border-b border-slate-100/80 transition hover:bg-slate-50/70"
              >
                <td className="px-6 py-4 text-sm text-slate-800">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-violet-50 text-violet-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function DashboardPage({ stats }: DashboardPageProps) {
  const safetyAlertsNumber = Number(stats.safetyAlerts)

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div
        className="min-h-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(125,211,252,0.18), transparent 28%), radial-gradient(circle at top right, rgba(196,181,253,0.16), transparent 26%), radial-gradient(circle at bottom right, rgba(244,114,182,0.10), transparent 22%)",
        }}
      >
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="space-y-6">
            <section className="flex flex-col gap-2">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Dashboard
              </h1>
              <p className="text-lg text-slate-500">Monday, April 13, 2026</p>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Participants"
                value={stats.participants}
                subtitle="Total enrolled"
                backgroundImage="/images/gradient1.jpg"
                overlayClassName="bg-white/10"
                titleClassName="text-slate-600"
                valueClassName="text-slate-950"
                subtitleClassName="text-slate-600"
              />

              <StatCard
                title="Today"
                value={stats.todayCheckins}
                subtitle="Check-ins today"
                backgroundImage="/images/gradient4.jpg"
                overlayClassName="bg-black/10"
                titleClassName="text-white/80"
                valueClassName="text-white"
                subtitleClassName="text-white/75"
              />

              <StatCard
                title="Available Keys"
                value={stats.availableKeys}
                subtitle="Ready to assign"
                backgroundImage="/images/gradient5.jpg"
                overlayClassName="bg-black/10"
                titleClassName="text-white/75"
                valueClassName="text-emerald-300"
                subtitleClassName="text-white/70"
              />

              <StatCard
                title="Safety Alerts"
                value={stats.safetyAlerts}
                subtitle="Need attention"
                backgroundImage="/images/gradient3.jpg"
                overlayClassName="bg-white/10"
                titleClassName="text-slate-600"
                valueClassName={
                  safetyAlertsNumber > 0 ? "text-rose-600" : "text-slate-950"
                }
                subtitleClassName="text-slate-600"
              />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <AddUserForm />
              </div>
              <div className="xl:col-span-4">
                <QuickSummaryCard />
              </div>
            </section>

            <UsersTable />
          </div>
        </main>
      </div>
    </div>
  )
}