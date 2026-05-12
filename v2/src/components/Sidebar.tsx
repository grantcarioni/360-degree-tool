import { useState } from "react";
import { LayoutDashboard, MessageSquare, Users, BarChart3, Settings, ShieldCheck, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { clsx } from "clsx";
import { useCurrentUser } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { StaffMember } from "../types";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: MessageSquare, label: "Feedback Requests", href: "/request" },
  { icon: Users, label: "My Team", href: "/team" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const { data: staff } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      if (!res.ok) throw new Error("Failed to load staff");
      return res.json();
    },
  });

  const handleSwitch = (person: StaffMember) => {
    const initials = person.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    setCurrentUser({
      id: person.id,
      name: person.name,
      title: person.title,
      initials,
      department: person.department,
    });
    setSwitcherOpen(false);
  };

  return (
    <aside className="w-64 bg-[#253746] text-white flex flex-col h-full relative">
      {/* Logo */}
      <div className="p-6 border-b border-[#3a5165]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#A4343A] size-8" />
          <h1 className="text-xl font-bold font-display">NI 360°</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Feedback Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-ui",
                  isActive
                    ? "bg-[#3a5165] text-white shadow-sm"
                    : "text-gray-300 hover:bg-[#324557] hover:text-white"
                )}
              >
                <item.icon
                  className={clsx("size-5 transition-colors", isActive ? "text-[#A4343A]" : "text-gray-400")}
                />
                <span className="text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A4343A]" />}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Switcher (demo helper) */}
      <div className="p-4 border-t border-[#3a5165] relative">
        <button
          onClick={() => setSwitcherOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#324557] transition-colors group"
        >
          <div className="size-8 rounded-full bg-[#A4343A] flex items-center justify-center font-bold text-sm shrink-0">
            {currentUser.initials}
          </div>
          <div className="overflow-hidden flex-1 text-left">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser.department}</p>
          </div>
          <ChevronDown
            className={clsx(
              "size-4 text-gray-400 transition-transform shrink-0",
              switcherOpen && "rotate-180"
            )}
          />
        </button>

        {switcherOpen && staff && (
          <div className="absolute bottom-full left-4 right-4 mb-1 bg-[#1e2f3e] border border-[#3a5165] rounded-lg shadow-xl overflow-hidden z-10">
            <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Switch view as</p>
            {staff.map((person) => (
              <button
                key={person.id}
                onClick={() => handleSwitch(person)}
                className={clsx(
                  "w-full text-left px-3 py-2.5 hover:bg-[#324557] transition-colors text-sm flex items-center gap-2",
                  person.id === currentUser.id && "bg-[#2a4055]"
                )}
              >
                <div className="size-6 rounded-full bg-[#A4343A] flex items-center justify-center text-[10px] font-bold shrink-0">
                  {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{person.name}</p>
                  <p className="text-xs text-gray-400 truncate">{person.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
