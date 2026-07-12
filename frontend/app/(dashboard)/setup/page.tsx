import { ClipboardList, Rocket, Settings } from "lucide-react";

const codeStyle = {
  background: "rgba(255,255,255,0.08)",
  padding: "1px 6px",
  borderRadius: "4px",
};

export default function SetupPage() {
  const steps = [
    {
      title: "Prepare PostgreSQL",
      body: (
        <>
          Create a database, then update <code style={codeStyle}>DATABASE_URL</code> and{" "}
          <code style={codeStyle}>WA_DB_URL</code> in your environment file. The backend
          runs migrations automatically on startup.
          <div className="code-block">createdb kuytanya_db</div>
        </>
      ),
    },
    {
      title: "Run the Backend",
      body: (
        <>
          Install Go dependencies and start the API server.
          <div className="code-block">
            cd backend
            <br />
            cp .env.example .env
            <br />
            go run main.go
          </div>
        </>
      ),
    },
    {
      title: "Run the Frontend",
      body: (
        <>
          Start the Next.js dashboard in a separate terminal.
          <div className="code-block">
            cd frontend
            <br />
            npm install
            <br />
            npm run dev
          </div>
          Open{" "}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--green)" }}
          >
            http://localhost:3000
          </a>{" "}
          to view the dashboard.
        </>
      ),
    },
    {
      title: "Connect WhatsApp",
      body: (
        <>
          Open <strong>Connect WhatsApp</strong> in the dashboard. Scan the QR code from
          WhatsApp Linked Devices to connect the bot.
        </>
      ),
    },
    {
      title: "Create a Rule and Test",
      body: (
        <>
          Open <strong>Auto-Reply Rules</strong> and add your first rule, for example{" "}
          <code style={codeStyle}>hello</code> as the keyword and{" "}
          <code style={codeStyle}>Hi! How can we help?</code> as the reply. Send a matching
          WhatsApp message from another number and the bot will respond automatically.{" "}
          <Rocket size={16} style={{ display: "inline", marginLeft: "4px" }} />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Settings size={28} className="text-green-500" strokeWidth={2.5} /> Setup Guide
        </h1>
        <p className="page-subtitle">Step-by-step instructions to run your bot</p>
      </div>

      <div className="card" style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "14px",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ClipboardList size={20} /> Required environment variables
          </span>
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
            ["DATABASE_URL", "PostgreSQL connection string for application data"],
            ["WA_DB_URL", "PostgreSQL connection string for WhatsApp session storage"],
            ["JWT_SECRET", "Random secret used to sign authentication tokens"],
            ["CORS_ALLOWED_ORIGINS", "Comma-separated list of allowed frontend origins"],
            ["PORT", "Backend server port"],
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
              <span style={{ color: "var(--text-muted)", fontFamily: "inherit" }}>- {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {steps.map((step, i) => (
        <div className="step-card" key={step.title}>
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
