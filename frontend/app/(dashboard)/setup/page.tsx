import { Settings, ClipboardList, Rocket } from "lucide-react";

export default function SetupPage() {
  const steps = [
    {
      title: "Siapkan PostgreSQL",
      body: (
        <>
          Buat database lokal, lalu perbarui{" "}
          <code
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            DATABASE_URL
          </code>{" "}
          dan{" "}
          <code
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            WA_DB_URL
          </code>{" "}
          di file .env Anda. Backend akan membuat tabel secara otomatis saat pertama kali
          dijalankan.
          <div className="code-block">
            createdb atp_chatbot
          </div>
        </>
      ),
    },
    {
      title: "Jalankan Backend",
      body: (
        <>
          Instal dependensi Go dan jalankan server.
          <div className="code-block">
            cd backend<br />
            cp .env.example .env<br />
            go run main.go
          </div>
        </>
      ),
    },
    {
      title: "Jalankan Frontend",
      body: (
        <>
          Jalankan dasbor Next.js di terminal terpisah.
          <div className="code-block">
            cd frontend<br />
            npm run dev
          </div>
          Buka{" "}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--green)" }}
          >
            http://localhost:3000
          </a>{" "}
          untuk melihat dasbor.
        </>
      ),
    },
    {
      title: "Hubungkan WhatsApp",
      body: (
        <>
          Buka menu <strong>Hubungkan WhatsApp</strong> di dasbor. Pindai kode QR menggunakan 
          fitur Perangkat Tertaut (Linked Devices) di aplikasi WhatsApp ponsel Anda 
          untuk menghubungkan bot secara instan.
        </>
      ),
    },
    {
      title: "Tambah Aturan Balasan Otomatis & Uji Coba!",
      body: (
        <>
          Buka halaman <strong>Aturan Balasan Otomatis</strong> dan tambahkan aturan pertama
          Anda (contoh, kata kunci: <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: "4px" }}>hallo</code>, balasan:{" "}
          <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: "4px" }}>Halo juga! Ada yang bisa kami bantu?</code>). 
          Kirim pesan WhatsApp yang mengandung kata kunci tersebut dari nomor lain ke nomor bot Anda — bot 
          akan membalas secara otomatis! <Rocket size={16} style={{ display: 'inline', marginLeft: '4px' }} />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={28} className="text-green-500" strokeWidth={2.5} /> Panduan Pengaturan
        </h1>
        <p className="page-subtitle">
          Instruksi langkah demi langkah untuk mengaktifkan bot Anda
        </p>
      </div>

      {/* API Keys summary */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "14px",
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ClipboardList size={20} /> Variabel lingkungan yang diperlukan (backend/.env)</span>
        </h3>
        <div
          style={{
            display: "grid",
            gap: "10px",
            fontFamily: "monospace",
            fontSize: "13px",
          }}
        >
          {[
            ["DATABASE_URL", "String koneksi PostgreSQL untuk data aplikasi"],
            ["WA_DB_URL", "URL PostgreSQL untuk penyimpanan sesi WhatsApp (whatsmeow)"],
            ["PORT", "Port untuk menjalankan server backend (opsional, default: 8080)"],
          ].map(([key, desc]) => (
            <div
              key={key}
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ color: "var(--green)", whiteSpace: "nowrap" }}>{key}</span>
              <span style={{ color: "var(--text-muted)", fontFamily: "inherit" }}>— {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, i) => (
        <div className="step-card" key={i}>
          <div className="step-number">{i + 1}</div>
          <div className="step-content">
            <h3>{step.title}</h3>
            <div style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{step.body}</div>
          </div>
        </div>
      ))}
    </>
  );
}
