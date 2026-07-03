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

      <div style={{ marginTop: "auto", padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <div className="animate-pulse-dot" />
          <span>Bot Active</span>
        </div>
        <span>WhatsApp Business API</span>
      </div>
    </aside>
  );
}
