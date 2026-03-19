import { LayoutDashboard, MessageSquare, Users, BarChart3, Settings, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { clsx } from "clsx";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: MessageSquare, label: "Feedback Requests", href: "/request" },
  { icon: Users, label: "My Team", href: "/team" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-[#253746] text-white flex flex-col h-full">
      <div className="p-6 border-b border-[#3a5165]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#A4343A] size-8" />
          <h1 className="text-xl font-bold font-display">NI 360°</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Feedback Platform</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-ui",
                isActive ? "bg-[#3a5165] text-white" : "text-gray-300 hover:bg-[#324557] hover:text-white"
              )}>
                <item.icon className={clsx("size-5", isActive ? "text-[#A4343A]" : "text-gray-400")} />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[#3a5165]">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="size-8 rounded-full bg-[#A4343A] flex items-center justify-center font-bold">GC</div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Grant Carioni</p>
            <p className="text-xs text-gray-400 truncate">Sr. Director, P&C</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
