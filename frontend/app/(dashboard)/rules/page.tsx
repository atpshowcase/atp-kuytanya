"use client";

import { useEffect, useState } from "react";
import {
  getReplies,
  createReply,
  updateReply,
  deleteReply,
  AutoReply,
} from "@/lib/api";
import { Zap, Hourglass, Plus, Edit2, Trash2, HelpCircle } from "lucide-react";

export default function RulesPage() {
  const [rules, setRules] = useState<AutoReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReply | null>(null);
  const [keyword, setKeyword] = useState("");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    try {
      const data = await getReplies();
      setRules(data);
    } catch {
      /* backend offline */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openCreate = () => {
    setEditingRule(null);
    setKeyword("");
    setReply("");
    setShowModal(true);
  };

  const openEdit = (rule: AutoReply) => {
    setEditingRule(rule);
    setKeyword(rule.keyword);
    setReply(rule.reply);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!keyword.trim() || !reply.trim()) return;
    setSaving(true);
    try {
      if (editingRule) {
        await updateReply(editingRule.id, { keyword, reply });
      } else {
        await createReply(keyword, reply);
      }
      await fetchRules();
      setShowModal(false);
    } catch (e) {
      alert("Failed to save. Make sure the backend is running.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (rule: AutoReply) => {
    await updateReply(rule.id, { is_active: !rule.is_active });
    await fetchRules();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this auto-reply rule?")) return;
    await deleteReply(id);
    await fetchRules();
  };

  return (
    <>
      <div
        className="page-header"
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={28} className="text-green-500" strokeWidth={2.5} /> Auto-Reply Rules
          </h1>
          <p className="page-subtitle">
            Configure keyword-based auto-reply triggers for your WhatsApp bot
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="add-rule-btn">
          <Plus size={16} /> Add Rule
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center' }}><Hourglass size={48} strokeWidth={1.5} color="var(--border)" /></div>
            <div className="empty-state-text">Loading rules…</div>
          </div>
        ) : rules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center' }}><Zap size={48} strokeWidth={1.5} color="var(--border)" /></div>
            <div className="empty-state-text">No auto-reply rules yet</div>
            <div className="empty-state-sub">
              Click &ldquo;Add Rule&rdquo; to create your first auto-reply
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Reply Message</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <span
                        style={{
                          background: "rgba(99,102,241,0.15)",
                          color: "#818cf8",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          fontSize: "13px",
                          fontFamily: "monospace",
                        }}
                      >
                        {rule.keyword}
                      </span>
                    </td>
                    <td
                      style={{
                        maxWidth: "260px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {rule.reply}
                    </td>
                    <td>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={rule.is_active}
                          onChange={() => handleToggle(rule)}
                        />
                        <span className="toggle-track" />
                        <span className="toggle-thumb" />
                      </label>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {new Date(rule.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(rule)}
                          id={`edit-rule-${rule.id}`}
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(rule.id)}
                          id={`delete-rule-${rule.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HelpCircle size={18} /> How keyword matching works</span>
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          When a WhatsApp message is received, the bot checks if the message{" "}
          <strong style={{ color: "var(--text-primary)" }}>contains</strong>{" "}
          any active keyword (case-insensitive). The{" "}
          <strong style={{ color: "var(--green)" }}>first matching rule</strong>{" "}
          fires and its reply is sent back. Rules are checked in order of
          creation date.
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {editingRule ? <><Edit2 size={24} /> Edit Rule</> : <><Zap size={24} /> New Auto-Reply Rule</>}
              </span>
            </h2>

            <div className="form-group">
              <label htmlFor="keyword-input">Keyword (trigger)</label>
              <input
                id="keyword-input"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. hello, price, help"
              />
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                The bot replies if the message contains this word
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="reply-input">Reply message</label>
              <textarea
                id="reply-input"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Hi! Thanks for contacting us. How can we help?"
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving || !keyword.trim() || !reply.trim()}
                id="save-rule-btn"
              >
                {saving ? "Saving…" : "Save Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
