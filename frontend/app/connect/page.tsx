"use client";

import { useEffect, useState, useCallback } from "react";
import { getQR, logout, QRResponse } from "@/lib/api";

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
      <div className="page-header">
        <h1 className="page-title">📱 Connect WhatsApp</h1>
        <p className="page-subtitle">
          Scan QR code dengan WhatsApp di HP untuk mengaktifkan bot
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* QR Card */}
        <div className="card" style={{ textAlign: "center" }}>
          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <div className="empty-state-text">Menghubungkan ke server…</div>
            </div>
          ) : data?.connected ? (
            <div style={{ padding: "40px 20px" }}>
              <div style={{ fontSize: "72px", marginBottom: "16px" }}>✅</div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "var(--green)",
                  marginBottom: "8px",
                }}
              >
                WhatsApp Terhubung!
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "28px",
                }}
              >
                Bot aktif dan siap membalas pesan otomatis
              </p>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                id="logout-btn"
              >
                🔌 Logout
              </button>
            </div>
          ) : data?.qr ? (
            <>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                QR refresh dalam{" "}
                <span
                  style={{
                    color: countdown <= 10 ? "var(--danger)" : "var(--green)",
                    fontWeight: "700",
                  }}
                >
                  {countdown}s
                </span>
              </p>

              {/* QR Image */}
              <div
                style={{
                  display: "inline-block",
                  padding: "12px",
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 0 40px rgba(37,211,102,0.2)",
                  marginBottom: "16px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${data.qr}`}
                  alt="WhatsApp QR Code"
                  width={220}
                  height={220}
                  style={{ display: "block", borderRadius: "8px" }}
                />
              </div>

              <button
                className="btn btn-ghost"
                onClick={fetchQR}
                id="refresh-qr-btn"
                style={{ marginTop: "8px" }}
              >
                🔄 Refresh QR
              </button>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔌</div>
              <div className="empty-state-text">Backend tidak terhubung</div>
              <div className="empty-state-sub">
                Jalankan <code style={{ color: "var(--green)" }}>go run main.go</code> di folder backend
              </div>
            </div>
          )}
        </div>

        {/* Instructions Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              📋 Cara Menghubungkan
            </h3>
            {[
              {
                icon: "1️⃣",
                title: "Buka WhatsApp di HP",
                desc: 'Tap ikon tiga titik (⋮) di pojok kanan atas',
              },
              {
                icon: "2️⃣",
                title: 'Pilih "Linked Devices"',
                desc: 'Atau "Perangkat Tertaut" jika pakai bahasa Indonesia',
              },
              {
                icon: "3️⃣",
                title: 'Tap "Link a Device"',
                desc: "Kamera HP akan terbuka secara otomatis",
              },
              {
                icon: "4️⃣",
                title: "Scan QR code di sebelah kiri",
                desc: "Arahkan kamera HP ke QR code di layar ini",
              },
              {
                icon: "5️⃣",
                title: "Bot langsung aktif! 🎉",
                desc: "Session tersimpan otomatis, tidak perlu scan ulang",
              },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "14px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "20px", flexShrink: 0 }}>
                  {step.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,211,102,0.08), rgba(37,211,102,0.03))",
              border: "1px solid rgba(37,211,102,0.2)",
            }}
          >
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "var(--green)",
                  marginBottom: "8px",
                }}
              >
                ✅ Keunggulan metode ini
              </div>
              <ul style={{ paddingLeft: "18px" }}>
                <li>Tidak perlu akun Meta Developer</li>
                <li>Nomor WhatsApp biasa (bukan Business API)</li>
                <li>Session tersimpan — restart server tidak perlu scan ulang</li>
                <li>Gratis tanpa batas</li>
                <li>Setup &lt; 1 menit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
