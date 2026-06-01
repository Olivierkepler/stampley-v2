"use client"

const navItems = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stampley", href: "#stampley" },
  { label: "contact", href: "/contact" },
] as const

export default function MenuBar() {
  return (
    <nav
      className="relative z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-center px-4 sm:px-6 lg:px-8">
        <ul className="flex h-full items-center justify-center gap-1  text-[15px] font-medium tracking-[-0.01em] text-slate-700 xl:gap-2">
          {navItems.map((item) => (
            <li key={item.href} className="h-full shrink-0">
              <a
                href={item.href}
                className="group relative flex h-full items-center px-3 text-[16px] font-['Poppins', sans-serif] tracking-[-0.01em] transition-colors duration-200 hover:text-blue-600 focus-visible:text-blue-600 focus-visible:outline-none sm:px-4 xl:px-5"
              >
                <span className="relative whitespace-nowrap">
                  {item.label}
                  <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] origin-center scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}