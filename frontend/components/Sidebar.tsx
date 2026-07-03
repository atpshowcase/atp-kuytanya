"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Smartphone, Zap, Settings, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/connect", label: "Connect WhatsApp", icon: Smartphone },
  { href: "/rules", label: "Auto-Reply Rules", icon: Zap },
  { href: "/setup", label: "Setup Guide", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    try {
      const { authLogout } = await import("@/lib/api");
      await authLogout();
      window.location.href = "/login";
    } catch {}
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <MessageSquare size={20} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="sidebar-logo-text">ATP Chatbot</span>
      </div>

      <nav>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-link-icon">
                <item.icon size={18} strokeWidth={2} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        <button 
          onClick={handleLogout}
          style={{ background: "transparent", border: "1px solid var(--border)", padding: "10px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontWeight: 600, transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.borderColor = "var(--danger)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          Logout User
        </button>
        <div style={{ padding: "0 12px", fontSize: "12px", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <div className="animate-pulse-dot" />
            <span>Bot Active</span>
          </div>
          <span>WhatsApp Business API</span>
        </div>
      </div>
    </aside>
  );
}
