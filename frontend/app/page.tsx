import { getMessages, getReplies, getStatus } from "@/lib/api";
import { MessageCircle, CheckCircle2, Zap, TrendingUp, LayoutDashboard, ArrowUpRight } from "lucide-react";
import RecentMessages from "@/components/RecentMessages";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let messages: Awaited<ReturnType<typeof getMessages>> = [];
  let rules: Awaited<ReturnType<typeof getReplies>> = [];
  let status: Awaited<ReturnType<typeof getStatus>> | null = null;

  try {
    [messages, rules, status] = await Promise.all([getMessages(), getReplies(), getStatus()]);
  } catch {
    // Backend might not be running during development
  }

  const repliedCount = messages.filter((m) => m.replied).length;
  const activeRules = rules.filter((r) => r.is_active).length;
  const replyRate = messages.length > 0 ? Math.round((repliedCount / messages.length) * 100) : 0;

  return (
    <>
      <div className="page-header animate-in">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={28} className="text-green-500" strokeWidth={2.5} />
          Dashboard
        </h1>
        <p className="page-subtitle" style={{ marginBottom: "16px" }}>
          Monitor your WhatsApp chatbot in real-time
        </p>
        
        {status?.phone && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(37, 211, 102, 0.1)", border: "1px solid rgba(37, 211, 102, 0.2)", padding: "6px 12px", borderRadius: "999px" }}>
            <div className="animate-pulse-dot" style={{ width: "8px", height: "8px" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              Connected as {status.phone.replace(/@s\.whatsapp\.net$/, "")}
            </span>
          </div>
        )}
      </div>

      {/* Bento Grid Stats */}
      <div className="bento-grid">
        <div className="bento-card bento-large animate-in stagger-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-icon" style={{ background: 'rgba(37, 211, 102, 0.1)' }}>
              <MessageCircle size={24} strokeWidth={2} color="var(--green)" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              +12% <ArrowUpRight size={14} />
            </span>
          </div>
          <div>
            <div className="stat-value">{messages.length}</div>
            <div className="stat-label">Total Messages Processed</div>
          </div>
        </div>

        <div className="bento-card bento-small animate-in stagger-2">
          <div className="stat-icon">
            <CheckCircle2 size={22} strokeWidth={2} color="var(--text-secondary)" />
          </div>
          <div>
            <div className="stat-value">{repliedCount}</div>
            <div className="stat-label">Auto-Replied</div>
          </div>
        </div>

        <div className="bento-card bento-small animate-in stagger-3">
          <div className="stat-icon">
            <Zap size={22} strokeWidth={2} color="var(--text-secondary)" />
          </div>
          <div>
            <div className="stat-value">{activeRules}</div>
            <div className="stat-label">Active Rules</div>
          </div>
        </div>

        <div className="bento-card bento-wide animate-in stagger-4">
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', height: '100%' }}>
            <div className="stat-icon" style={{ flexShrink: 0, width: '64px', height: '64px' }}>
              <TrendingUp size={28} strokeWidth={2} color="var(--text-secondary)" />
            </div>
            <div>
              <div className="stat-value">{replyRate}%</div>
              <div className="stat-label">Overall Reply Resolution Rate</div>
              <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${replyRate}%`, height: '100%', background: 'var(--green)', borderRadius: '2px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecentMessages messages={messages} />
    </>
  );
}
