"use client";

import { useEffect, useState } from "react";
import {
  getReplies,
  createReply,
  updateReply,
  deleteReply,
  AutoReply,
} from "@/lib/api";
import { Zap, Hourglass, Plus, Edit2, Trash2, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function RulesPage() {
  const [rules, setRules] = useState<AutoReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReply | null>(null);
  const [keyword, setKeyword] = useState("");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastRule = currentPage * itemsPerPage;
  const indexOfFirstRule = indexOfLastRule - itemsPerPage;
  const currentRules = rules.slice(indexOfFirstRule, indexOfLastRule);
  const totalPages = Math.ceil(rules.length / itemsPerPage);

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
      alert("Gagal menyimpan. Pastikan backend sedang berjalan.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (rule: AutoReply) => {
    await updateReply(rule.id, { is_active: !rule.is_active });
    await fetchRules();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus aturan balasan otomatis ini?")) return;
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
            <Zap size={28} className="text-green-500" strokeWidth={2.5} /> Aturan Balasan Otomatis
          </h1>
          <p className="page-subtitle">
            Konfigurasi pemicu balasan otomatis berdasarkan kata kunci untuk bot WhatsApp Anda
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="add-rule-btn">
          <Plus size={16} /> Tambah Aturan
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center' }}><Hourglass size={48} strokeWidth={1.5} color="var(--border)" /></div>
            <div className="empty-state-text">Memuat aturan…</div>
          </div>
        ) : rules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center' }}><Zap size={48} strokeWidth={1.5} color="var(--border)" /></div>
            <div className="empty-state-text">Belum ada aturan balasan otomatis</div>
            <div className="empty-state-sub">
              Klik &ldquo;Tambah Aturan&rdquo; untuk membuat balasan otomatis pertama Anda
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Kata Kunci</th>
                  <th>Pesan Balasan</th>
                  <th>Status</th>
                  <th>Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentRules.map((rule) => (
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
            
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Menampilkan {indexOfFirstRule + 1} hingga {Math.min(indexOfLastRule, rules.length)} dari {rules.length} entri
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} /> Sebelumnya
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Berikutnya <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HelpCircle size={18} /> Bagaimana pencocokan kata kunci bekerja</span>
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Ketika pesan WhatsApp diterima, bot memeriksa apakah pesan tersebut{" "}
          <strong style={{ color: "var(--text-primary)" }}>mengandung</strong>{" "}
          kata kunci aktif (tidak peka huruf besar/kecil).{" "}
          <strong style={{ color: "var(--green)" }}>Aturan pertama yang cocok</strong>{" "}
          akan dieksekusi dan balasannya akan dikirim. Aturan diperiksa berdasarkan
          urutan tanggal pembuatan.
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {editingRule ? <><Edit2 size={24} /> Edit Aturan</> : <><Zap size={24} /> Aturan Balasan Otomatis Baru</>}
              </span>
            </h2>

            <div className="form-group">
              <label htmlFor="keyword-input">Kata Kunci (pemicu)</label>
              <input
                id="keyword-input"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="contoh: halo, harga, bantuan"
              />
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                Bot akan membalas jika pesan mengandung kata ini
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="reply-input">Pesan balasan</label>
              <textarea
                id="reply-input"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Hai! Terima kasih telah menghubungi kami. Ada yang bisa kami bantu?"
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving || !keyword.trim() || !reply.trim()}
                id="save-rule-btn"
              >
                {saving ? "Menyimpan…" : "Simpan Aturan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
