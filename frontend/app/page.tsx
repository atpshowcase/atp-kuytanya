import { getMessages, getReplies } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let messages: Awaited<ReturnType<typeof getMessages>> = [];
  let rules: Awaited<ReturnType<typeof getReplies>> = [];

  try {
    [messages, rules] = await Promise.all([getMessages(), getReplies()]);
  } catch {
    // Backend might not be running during development
  }

  const repliedCount = messages.filter((m) => m.replied).length;
  const activeRules = rules.filter((r) => r.is_active).length;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <p className="page-subtitle">
          Monitor your WhatsApp chatbot in real-time
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-value">{messages.length}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{repliedCount}</div>
          <div className="stat-label">Auto-Replied</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{activeRules}</div>
          <div className="stat-label">Active Rules</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">
            {messages.length > 0
              ? Math.round((repliedCount / messages.length) * 100)
              : 0}
            %
          </div>
          <div className="stat-label">Reply Rate</div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "var(--text-primary)",
            }}
          >
            Recent Messages
          </h2>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              background: "rgba(255,255,255,0.05)",
              padding: "4px 10px",
              borderRadius: "999px",
            }}
          >
            Last 100
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No messages yet</div>
            <div className="empty-state-sub">
              Messages will appear here once your bot receives them
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Reply Sent</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: "var(--text-primary)",
                        }}
                      >
                        +{msg.from}
                      </span>
                    </td>
                    <td
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {msg.body}
                    </td>
                    <td>
                      {msg.replied ? (
                        <span className="badge badge-green">✓ Replied</span>
                      ) : (
                        <span className="badge badge-gray">— No match</span>
                      )}
                    </td>
                    <td
                      style={{
                        maxWidth: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                      }}
                    >
                      {msg.reply_text || "—"}
                    </td>
                    <td style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                      {new Date(msg.received_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
