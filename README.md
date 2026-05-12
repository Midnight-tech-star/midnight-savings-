package.json

{
  "name": "midnight-savings",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8"
  }
}

index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/10473/10473838.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Midnight Savings - Secure Group Savings Platform" />
    <title>Midnight Savings 💯</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

vercel.json

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

src/App.jsx

import { useState, useEffect } from "react";

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_MEMBERS = [
  { id: 1, name: "Amina Wanjiru", phone: "0712345678", shares: 2, status: "paid", joinDate: "2025-01-05", role: "admin" },
  { id: 2, name: "Brian Otieno", phone: "0723456789", shares: 1, status: "paid", joinDate: "2025-01-07", role: "treasurer" },
  { id: 3, name: "Cynthia Mwangi", phone: "0734567890", shares: 1, status: "pending", joinDate: "2025-01-10", role: "member" },
  { id: 4, name: "David Kamau", phone: "0745678901", shares: 2, status: "paid", joinDate: "2025-01-12", role: "member" },
  { id: 5, name: "Esther Njoroge", phone: "0756789012", shares: 1, status: "pending", joinDate: "2025-01-15", role: "member" },
];

const MOCK_REQUESTS = [
  { id: 101, name: "Felix Ochieng", phone: "0767890123", requestDate: "2025-05-10", shares: 1 },
  { id: 102, name: "Grace Karanja", phone: "0778901234", requestDate: "2025-05-09", shares: 2 },
  { id: 103, name: "Hassan Mwenda", phone: "0789012345", requestDate: "2025-05-08", shares: 1 },
];

const MOCK_TRANSACTIONS = [
  { id: "T001", member: "Amina Wanjiru", type: "contribution", amount: 1480, date: "2025-05-10 09:14", note: "Week 19 - 2 shares" },
  { id: "T002", member: "Brian Otieno", type: "contribution", amount: 740, date: "2025-05-10 10:02", note: "Week 19" },
  { id: "T003", member: "David Kamau", type: "contribution", amount: 1480, date: "2025-05-10 11:45", note: "Week 19 - 2 shares" },
  { id: "T004", member: "System", type: "payout", amount: 5920, date: "2025-05-04 08:00", note: "Sunday payout – Amina Wanjiru" },
  { id: "T005", member: "System", type: "payout", amount: 2960, date: "2025-04-27 08:00", note: "Sunday payout – Brian Otieno" },
];

const PAYOUT_SCHEDULE = [
  { week: 19, member: "Amina Wanjiru", shares: 2, amount: 5920, status: "upcoming" },
  { week: 20, member: "Brian Otieno", shares: 1, amount: 2960, status: "scheduled" },
  { week: 21, member: "Cynthia Mwangi", shares: 1, amount: 2960, status: "scheduled" },
  { week: 22, member: "David Kamau", shares: 2, amount: 5920, status: "scheduled" },
  { week: 23, member: "Esther Njoroge", shares: 1, amount: 2960, status: "scheduled" },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function getNextSaturday9PM() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSat = (6 - day + 7) % 7 || 7;
  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntilSat);
  sat.setHours(21, 0, 0, 0);
  return sat;
}

function pad(n) { return String(n).padStart(2, "0"); }

function formatCountdown(ms) {
  if (ms <= 0) return "00d 00h 00m 00s";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(sc)}s`;
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">{children}</div>
    </div>
  );
}

// ── COUNTDOWN BANNER ─────────────────────────────────────────────────────────
function CountdownBanner() {
  const [ms, setMs] = useState(getNextSaturday9PM() - Date.now());

  useEffect(() => {
    const t = setInterval(() => setMs(getNextSaturday9PM() - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="countdown-banner">
      <div>
        <div className="countdown-label">⏳ Next Contribution Deadline</div>
        <span className="countdown-timer">{formatCountdown(ms)}</span>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--silver)", marginBottom: 4 }}>DEADLINE</div>
        <div style={{ fontWeight: 700, color: "var(--mist)" }}>Saturday 9:00 PM</div>
      </div>
    </div>
  );
}

// Full App Component (simplified but functional)
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* Sidebar and Main Content - Full version will be in next update */}
      <h1 style={{color: "white", padding: "20px"}}>Midnight Savings App Loaded Successfully! 💯</h1>
      <p style={{color: "#94a3b8", padding: "20px"}}>Now creating the remaining files...</p>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState("");
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Midnight Savings 💯</h1>
        <input 
          type="tel" 
          className="form-input" 
          placeholder="Enter phone number" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => onLogin({id:1, name:"Test User", role:"admin"})}>
          Login
        </button>
      </div>
    </div>
  );
}

src/index.css

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --midnight: #020817;
  --deep: #050f2e;
  --navy: #0a1940;
  --cobalt: #0d2a6b;
  --royal: #1a3fa0;
  --electric: #2563eb;
  --sky: #38bdf8;
  --silver: #94a3b8;
  --mist: #cbd5e1;
  --white: #f0f4ff;
  --gold: #f59e0b;
  --emerald: #10b981;
  --rose: #f43f5e;
  --amber: #f97316;
  --glass: rgba(255,255,255,0.04);
  --glass2: rgba(255,255,255,0.08);
  --border: rgba(56,189,248,0.15);
  --glow: rgba(37,99,235,0.4);
}

html { font-size: 16px; }
body { background: var(--midnight); color: var(--white); font-family: 'Rajdhani', sans-serif; min-height: 100vh; overflow-x: hidden; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--deep); }
::-webkit-scrollbar-thumb { background: var(--cobalt); border-radius: 2px; }

/* LAYOUT */
.app { display: flex; min-height: 100vh; }
.sidebar {
  width: 260px; min-height: 100vh; background: var(--deep);
  border-right: 1px solid var(--border); display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; z-index: 100;
}
.main { margin-left: 260px; flex: 1; min-height: 100vh; }

.topbar {
  background: rgba(5,15,46,0.95); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border); padding: 14px 32px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 50;
}

/* CARDS */
.card {
  background: linear-gradient(135deg, var(--deep) 0%, var(--navy) 100%);
  border: 1px solid var(--border); border-radius: 12px; padding: 24px;
}

.countdown-banner {
  background: linear-gradient(135deg, var(--navy), var(--cobalt));
  border: 1px solid rgba(56,189,248,0.25); border-radius: 12px;
  padding: 20px 28px; display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
}

.countdown-timer {
  font-family: 'JetBrains Mono', monospace; font-size: 2rem; font-weight: 700;
  background: linear-gradient(90deg, var(--sky), var(--white));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px; border: none; cursor: pointer;
  font-weight: 700; letter-spacing: 0.05em;
}

.btn-primary { background: linear-gradient(135deg, var(--electric), var(--royal)); color: white; }
.btn-success { background: linear-gradient(135deg, var(--emerald), #059669); color: white; }
.btn-danger { background: linear-gradient(135deg, var(--rose), #be123c); color: white; }
.btn-gold { background: linear-gradient(135deg, var(--gold), var(--amber)); color: var(--midnight); }

/* TABLES, BADGES, MODALS, LOGIN etc. */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px 16px; text-align: left; }

.badge { padding: 3px 10px; border-radius: 20px; font-size: 0.65rem; font-weight: 700; }

.login-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--midnight);
}

.login-card {
  background: linear-gradient(160deg, var(--deep) 0%, var(--navy) 100%);
  border: 1px solid var(--border); border-radius: 20px; padding: 44px 40px;
  max-width: 420px;
}

.form-input {
  width: 100%; background: var(--midnight); border: 1px solid var(--border);
  border-radius: 8px; padding: 12px; color: var(--white);
}

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main { margin-left: 0; }
}