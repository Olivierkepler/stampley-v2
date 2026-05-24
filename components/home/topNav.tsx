// components/Navbar.tsx
import { HeartHandshake, MapPin, Phone } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-blue-900 text-white">
      <nav className="flex h-10 items-center justify-between px-8 md:px-24">
        
        {/* Left Side */}
        <div className="flex items-center gap-10">
          <a
            href="#"
            className="flex items-center gap-3 font-semibold hover:opacity-90 transition "
          >
            <HeartHandshake size={24} strokeWidth={2.5} />
            <span className="hidden sm:block">Volunteer Application</span>
          </a>

          <a
            href="#"
            className="hidden items-center gap-3 font-semibold md:flex hover:opacity-90 transition"
          >
            <MapPin size={24} strokeWidth={2.5} />
            <span>Visit Us Today</span>
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 font-semibold">
          <Phone size={22} />
          <span>Call Us: 617-287-4067</span>
        </div>
      </nav>
    </header>
  );
}