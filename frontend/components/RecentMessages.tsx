"use client";

import { useState } from "react";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";

type Message = {
  id: number;
  from: string;
  body: string;
  replied: boolean;
  reply_text: string | null;
  received_at: string;
};

export default function RecentMessages({ messages }: { messages: Message[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMessages = messages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="card animate-in stagger-4" style={{ marginTop: "40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          Recent Activity
        </h2>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-muted)",
            background: "rgba(0,0,0,0.04)",
            padding: "6px 12px",
            borderRadius: "999px",
          }}
        >
          Total: {messages.length} Messages
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ display: "flex", justifyContent: "center" }}>
            <Inbox size={48} strokeWidth={1.5} color="var(--border)" />
          </div>
          <div className="empty-state-text">No messages yet</div>
          <div className="empty-state-sub">
            Messages will appear here once your bot receives them
          </div>
        </div>
      ) : (
        <>
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
                {currentMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        +{msg.from}
                      </span>
                    </td>
                    <td
                      style={{
                        maxWidth: "240px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "var(--text-primary)",
                        fontWeight: 500,
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
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "13px",
                      }}
                    >
                      {msg.reply_text || "—"}
                    </td>
                    <td style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                      {new Date(msg.received_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, messages.length)} of {messages.length}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: page === currentPage ? "1px solid var(--green)" : "1px solid transparent",
                        background: page === currentPage ? "rgba(37, 211, 102, 0.1)" : "transparent",
                        color: page === currentPage ? "var(--green)" : "var(--text-secondary)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
