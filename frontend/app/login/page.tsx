"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-split">
        {/* Left Side: Brand and Visuals */}
        <div className="login-visuals">
          <div className="visuals-overlay"></div>
          <Image
            src="/login_bg.png"
            alt="Abstract Background"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="visuals-content">
            <div className="logo-badge">
              <div className="logo-icon" style={{ overflow: "hidden", background: "transparent", border: "none", boxShadow: "none" }}>
                <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
              </div>
              KuyTanya
            </div>
            <h1 className="hero-title">Otomatiskan interaksi WhatsApp Anda<br/>dengan elegan.</h1>
            <p className="hero-subtitle">
              Platform utama untuk mengelola balasan otomatis dan melacak percakapan. Hubungkan pelanggan Anda secara instan dan mudah.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="login-form-wrapper">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Selamat Datang Kembali</h2>
              <p>Masuk untuk melanjutkan ke dasbor Anda</p>
            </div>

            {error && (
              <div className="error-alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label>Nama Pengguna</label>
                <div className="input-field">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan nama pengguna Anda"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Kata Sandi</label>
                <div className="input-field">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    Masuk
                    <ArrowRight size={18} className="btn-icon" />
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              Belum punya akun?{" "}
              <Link href="/register" className="register-link">
                Buat sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .login-container {
          min-height: 100vh;
          display: flex;
          background-color: var(--bg-primary);
        }
        
        .login-split {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        .login-visuals {
          flex: 1;
          position: relative;
          display: none;
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .login-visuals {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 60px;
          }
        }

        .visuals-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.9));
          z-index: 1;
        }

        .login-visuals img {
          z-index: 0;
        }

        .visuals-content {
          position: relative;
          z-index: 2;
          color: white;
          max-width: 520px;
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 8px 16px 8px 8px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--green);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px var(--green-glow);
        }

        .hero-title {
          font-size: 42px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
        }

        .login-form-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          background: var(--bg-primary);
        }

        .login-form-container {
          width: 100%;
          max-width: 420px;
          animation: fadeIn 0.6s ease;
        }

        .login-header {
          margin-bottom: 40px;
        }

        .login-header h2 {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
          margin-bottom: 8px;
        }

        .login-header p {
          font-size: 15px;
          color: var(--text-secondary);
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
          animation: slideUp 0.3s ease;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .input-field {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .input-field input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 15px;
          color: var(--text-primary);
          transition: all 0.2s ease;
          outline: none;
        }

        .input-field input:focus {
          background: #ffffff;
          border-color: var(--green);
          box-shadow: 0 0 0 4px var(--green-glow);
        }

        .input-field input:focus + .input-icon,
        .input-field input:not(:placeholder-shown) + .input-icon {
          color: var(--green);
        }

        .btn-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px var(--green-glow);
          margin-top: 8px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(37, 211, 102, 0.4);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-icon {
          transition: transform 0.2s ease;
        }

        .btn-submit:hover:not(:disabled) .btn-icon {
          transform: translateX(4px);
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 15px;
          color: var(--text-secondary);
        }

        .register-link {
          color: var(--green);
          font-weight: 600;
          text-decoration: none;
          position: relative;
        }

        .register-link::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: var(--green);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease-out;
        }

        .register-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
