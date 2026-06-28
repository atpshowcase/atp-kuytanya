export default function SetupPage() {
  const steps = [
    {
      title: "Create a Meta Developer App",
      body: (
        <>
          Go to{" "}
          <a
            href="https://developers.facebook.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--green)" }}
          >
            developers.facebook.com
          </a>
          , click <strong>My Apps → Create App</strong>, choose{" "}
          <strong>Business</strong>, then add the <strong>WhatsApp</strong>{" "}
          product to your app.
        </>
      ),
    },
    {
      title: "Get your credentials",
      body: (
        <>
          In your app, go to <strong>WhatsApp → API Setup</strong>. Copy your{" "}
          <strong>Phone Number ID</strong> and generate a temporary (or
          permanent) <strong>Access Token</strong>. Put them in your{" "}
          <code
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            backend/.env
          </code>{" "}
          file.
        </>
      ),
    },
    {
      title: "Set up PostgreSQL",
      body: (
        <>
          Create a local database, then update{" "}
          <code
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "1px 6px",
              borderRadius: "4px",
            }}
          >
            DATABASE_URL
          </code>{" "}
          in your .env file. The backend will auto-create the tables on first
          run.
          <div className="code-block">
            createdb atp_chatbot
          </div>
        </>
      ),
    },
    {
      title: "Start the backend",
      body: (
        <>
          Install Go dependencies and start the server on port 8080.
          <div className="code-block">
            cd backend<br />
            cp .env.example .env<br />
            go run main.go
          </div>
        </>
      ),
    },
    {
      title: "Expose your backend with ngrok",
      body: (
        <>
          Meta requires a public HTTPS URL for the webhook. Use ngrok to expose
          your local server.
          <div className="code-block">
            ngrok http 8080
          </div>
          Copy the <strong>https://</strong> URL it gives you — this is your
          webhook URL.
        </>
      ),
    },
    {
      title: "Register the webhook with Meta",
      body: (
        <>
          In your Meta app, go to <strong>WhatsApp → Configuration</strong>,
          click <strong>Edit</strong> on the webhook. Enter:
          <ul style={{ marginTop: "8px", paddingLeft: "20px", lineHeight: 2, color: "var(--text-secondary)", fontSize: "14px" }}>
            <li>
              <strong>Callback URL:</strong>{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                https://YOUR_NGROK_URL/webhook
              </code>
            </li>
            <li>
              <strong>Verify Token:</strong> the value of{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                WHATSAPP_VERIFY_TOKEN
              </code>{" "}
              in your .env
            </li>
          </ul>
          Subscribe to the <strong>messages</strong> field, then click{" "}
          <strong>Verify and Save</strong>.
        </>
      ),
    },
    {
      title: "Start the frontend",
      body: (
        <>
          Run the Next.js dashboard in a separate terminal.
          <div className="code-block">
            cd frontend<br />
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
          to see the dashboard.
        </>
      ),
    },
    {
      title: "Add auto-reply rules & test!",
      body: (
        <>
          Go to the <strong>Auto-Reply Rules</strong> page and add your first
          rule (e.g., keyword: <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: "4px" }}>hello</code>, reply:{" "}
          <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: "4px" }}>Hi! How can I help?</code>). Send a WhatsApp message
          containing that word from any number linked to your sandbox — the bot
          will reply automatically! 🚀
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">🛠️ Setup Guide</h1>
        <p className="page-subtitle">
          Complete step-by-step instructions to get your bot live
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
          📋 Required environment variables (backend/.env)
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
            ["DATABASE_URL", "PostgreSQL connection string"],
            ["WHATSAPP_TOKEN", "Access token from Meta API Setup page"],
            ["WHATSAPP_PHONE_ID", "Phone Number ID from Meta API Setup page"],
            ["WHATSAPP_VERIFY_TOKEN", "Custom string you choose (e.g. my_verify_token)"],
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
            <p>{step.body}</p>
          </div>
        </div>
      ))}
    </>
  );
}
