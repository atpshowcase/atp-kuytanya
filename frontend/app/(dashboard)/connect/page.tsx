"use client";

import { useEffect, useState, useCallback } from "react";
import { getQR, logout, QRResponse } from "@/lib/api";
import { Smartphone, Loader2, CheckCircle2, LogOut, RefreshCw, Unplug, ClipboardList } from "lucide-react";

export default function ConnectPage() {
  const [data, setData] = useState<QRResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);

  const fetchQR = useCallback(async () => {
    try {
      const res = await getQR();
      setData(res);
      setCountdown(30);
    } catch {
      // backend offline
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQR();
  }, [fetchQR]);

  // Auto-refresh QR every 30s (QR codes expire)
  useEffect(() => {
    if (data?.connected) return; // stop polling when connected

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          fetchQR();
          return 30;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.connected, fetchQR]);

  const handleLogout = async () => {
    if (!confirm("Logout dari WhatsApp? Bot akan berhenti sampai scan QR lagi.")) return;
    await logout();
    setData(null);
    setLoading(true);
    setTimeout(fetchQR, 1500);
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '32px' }}>
          <div style={{ padding: '12px', background: 'var(--green-glow)', borderRadius: '14px', color: 'var(--green)' }}>
            <Smartphone size={28} strokeWidth={2.5} />
          </div>
          Hubungkan WhatsApp
        </h1>
        <p className="page-subtitle" style={{ fontSize: '16px', marginTop: '12px' }}>
          Pindai kode QR dengan WhatsApp di ponsel Anda untuk menghubungkan bot secara instan.
        </p>
      </div>

      <div
        className="connect-grid"
      >
        {/* Left Side: QR Card */}
        <div className="premium-card qr-card animate-in stagger-1">
          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Loader2 className="animate-spin" size={56} strokeWidth={1.5} color="var(--green)" />
              </div>
              <div className="empty-state-text">Menghubungkan ke Server...</div>
              <div className="empty-state-sub">Membangunkan kontainer WhatsApp khusus Anda</div>
            </div>
          ) : data?.connected ? (
            <div className="connected-state animate-in">
              <div className="success-icon-wrapper">
                <div className="pulse-ring"></div>
                <CheckCircle2 size={80} color="var(--green)" strokeWidth={2} className="relative z-10" />
              </div>
              <h2 className="connected-title">WhatsApp Terhubung!</h2>
              <p className="connected-desc">
                Bot Anda sepenuhnya aktif dan siap menangani pesan masuk secara otomatis.
              </p>
              
              {data?.phone && (
                <div className="phone-badge">
                  Terhubung sebagai <span className="phone-number">{data.phone.split('.')[0]}</span>
                </div>
              )}
              
              <button
                className="btn-danger-premium"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Keluar & Ganti Perangkat
              </button>
            </div>
          ) : data?.qr ? (
            <div className="qr-state animate-in">
              <div className="qr-countdown">
                Menyegarkan dalam <span className={countdown <= 10 ? 'text-danger' : 'text-green'}>{countdown}d</span>
              </div>

              <div className="qr-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${data.qr}`}
                  alt="WhatsApp QR Code"
                  className="qr-image"
                />
              </div>

              <button
                className="btn-ghost-premium"
                onClick={fetchQR}
              >
                <RefreshCw size={16} /> Segarkan Paksa QR
              </button>
            </div>
          ) : (
            <div className="empty-state animate-in">
              <div className="empty-state-icon">
                <Unplug size={56} strokeWidth={1.5} color="var(--danger)" />
              </div>
              <div className="empty-state-text">Backend Terputus</div>
              <div className="empty-state-sub">
                Jalankan <code className="code-inline">go run main.go</code> di folder backend
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Instructions */}
        <div className="instructions-wrapper animate-in stagger-2">
          <div className="premium-card instructions-card">
            <h3 className="instructions-title">
              <ClipboardList size={22} color="var(--green)" /> Cara Menghubungkan
            </h3>
            <div className="steps-container">
              {[
                {
                  title: "Buka WhatsApp",
                  desc: 'Ketuk ikon tiga titik (⋮) di kanan atas layar Anda.',
                },
                {
                  title: 'Pilih "Perangkat Tertaut"',
                  desc: 'Atau "Linked Devices" jika menggunakan bahasa Inggris.',
                },
                {
                  title: 'Ketuk "Tautkan Perangkat"',
                  desc: "Kamera ponsel Anda akan terbuka secara otomatis.",
                },
                {
                  title: "Pindai Kode QR",
                  desc: "Arahkan kamera ponsel Anda ke kode QR yang ditampilkan di sini.",
                },
                {
                  title: "Bot Aktif! 🎉",
                  desc: "Sesi disimpan dengan aman. Tidak perlu memindai ulang nanti.",
                },
              ].map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-number-premium">{i + 1}</div>
                  <div className="step-content-text">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card benefits-card">
            <h3 className="benefits-title">
              <CheckCircle2 size={18} /> Mengapa metode ini?
            </h3>
            <ul className="benefits-list">
              <li><strong>Aman (E2EE):</strong> Terenkripsi penuh (End-to-End) persis seperti WhatsApp Web.</li>
              <li><strong>Penyimpanan Aman:</strong> Sesi/autentikasi disimpan dengan aman di Database server.</li>
              <li><strong>Tanpa Biaya:</strong> Gratis tanpa perlu daftar akun Meta Developer.</li>
              <li><strong>Bebas Nomor:</strong> Bekerja dengan nomor WhatsApp standar apa pun.</li>
            </ul>
            <div className="warning-highlight">
              <strong>⚠️ Catatan Keamanan:</strong> Harap gunakan bot ini sebijak mungkin. Pengiriman pesan spam/massal yang dilaporkan oleh pengguna lain dapat mengakibatkan pemblokiran (banned) nomor oleh pihak WhatsApp.
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .connect-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (min-width: 1000px) {
          .connect-grid {
            grid-template-columns: 1.1fr 1fr;
          }
        }

        .premium-card {
          background: var(--bg-card);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;
        }

        .premium-card:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
          border-color: rgba(37, 211, 102, 0.15);
        }

        .qr-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 500px;
          position: relative;
          overflow: hidden;
        }

        /* Abstract Glows inside QR Card */
        .qr-card::before, .qr-card::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.5;
        }
        .qr-card::before {
          background: rgba(37, 211, 102, 0.1);
          top: -100px;
          left: -100px;
        }
        .qr-card::after {
          background: rgba(99, 102, 241, 0.05);
          bottom: -100px;
          right: -100px;
        }

        .qr-card > * {
          position: relative;
          z-index: 10;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .connected-state, .qr-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
        }

        .success-icon-wrapper {
          position: relative;
          margin-bottom: 24px;
        }

        .pulse-ring {
          position: absolute;
          inset: -20px;
          background: var(--green);
          opacity: 0.15;
          border-radius: 50%;
          filter: blur(16px);
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .connected-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .connected-desc {
          font-size: 15px;
          color: var(--text-secondary);
          max-width: 300px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .phone-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 999px;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 40px;
        }

        .phone-number {
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.5px;
        }

        .btn-danger-premium {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-danger-premium:hover {
          background: linear-gradient(135deg, #fee2e2, #fca5a5);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.15);
        }

        .qr-countdown {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 24px;
          background: rgba(0,0,0,0.03);
          padding: 8px 16px;
          border-radius: 20px;
        }

        .text-danger { color: var(--danger); font-weight: 700; }
        .text-green { color: var(--green); font-weight: 700; }

        .qr-image-wrapper {
          padding: 16px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.04);
          margin-bottom: 32px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .qr-image-wrapper:hover {
          transform: scale(1.02) translateY(-4px);
        }

        .qr-image {
          display: block;
          width: 260px;
          height: 260px;
          border-radius: 12px;
        }

        .btn-ghost-premium {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-ghost-premium:hover {
          background: rgba(0,0,0,0.02);
          color: var(--text-primary);
          border-color: rgba(0,0,0,0.1);
        }

        .instructions-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .instructions-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 12px;
          border-radius: 16px;
          transition: background 0.2s ease;
        }
        .step-item:hover {
          background: rgba(0,0,0,0.02);
        }

        .step-number-premium {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background: var(--green-glow);
          color: var(--green-dark);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
        }

        .step-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .step-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .benefits-card {
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.08), rgba(37, 211, 102, 0.02));
          border: 1px solid rgba(37, 211, 102, 0.15);
          padding: 24px 32px;
        }

        .benefits-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          color: var(--green-dark);
          margin-bottom: 12px;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .benefits-list li {
          position: relative;
          padding-left: 20px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .benefits-list li::before {
          content: '•';
          position: absolute;
          left: 4px;
          color: var(--green);
          font-weight: bold;
        }

        .code-inline {
          background: rgba(37, 211, 102, 0.1);
          color: var(--green-dark);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
        }

        .warning-highlight {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.08);
          border-left: 4px solid var(--danger, #ef4444);
          border-radius: 4px 8px 8px 4px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        .warning-highlight strong {
          color: var(--danger, #ef4444);
        }
      `}} />
    </>
  );
}
