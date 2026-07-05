"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Smartphone, Zap, Settings, MessageSquare } from "lucide-react";

const navItems = [
  { href: "/", label: "Dasbor", icon: LayoutDashboard },
  { href: "/connect", label: "Hubungkan WhatsApp", icon: Smartphone },
  { href: "/rules", label: "Aturan Balasan Otomatis", icon: Zap },
  { href: "/setup", label: "Panduan Pengaturan", icon: Settings },
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
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/login";
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>
          <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
          <span>KuyTanya</span>
        </div>
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
            <span>Bot Aktif</span>
          </div>
          <span>WhatsApp Business API</span>
        </div>
      </div>
    </aside>
  );
}
