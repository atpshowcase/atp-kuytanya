"use client";

import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Lock, User, UserPlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, password);
      router.push("/login?registered=true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Buat Akun</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>Bergabung dengan KuyTanya</p>
        </div>

        {error && (
          <div style={{ padding: "12px", background: "var(--danger)", color: "white", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Nama Pengguna</label>
            <div style={{ position: "relative" }}>
              <User size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "15px" }}
                placeholder="Pilih nama pengguna"
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Kata Sandi</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "15px" }}
                placeholder="Buat kata sandi"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "8px", borderRadius: "12px", fontSize: "16px" }}
          >
            {loading ? "Membuat..." : <><UserPlus size={18} /> Daftar</>}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
          Sudah punya akun?{" "}
          <Link href="/login" style={{ color: "var(--green)", fontWeight: 600, textDecoration: "none" }}>
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
