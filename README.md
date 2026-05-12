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