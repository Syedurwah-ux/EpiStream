import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { db } from "../firebase";
import { calculateRisk } from "../utils/riskEngine";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

function Counter({ value }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1 });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value]);
  return <span>{display}</span>;
}

function Dashboard() {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(5));
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsub2 = onSnapshot(collection(db, "reports"), async (snap) => {
      const all = snap.docs.map((d) => d.data());
      setAllReports(all);
      setRisks(await calculateRisk(all));
    });
    return () => { unsub(); unsub2(); };
  }, []);

  const symptomCounts = ["Diarrhea", "Vomiting", "Fever", "Jaundice"].map((s) => ({
    name: s,
    count: allReports.filter((r) => r.symptom === s).length,
  }));

  const stats = [
    { label: t("activeAlerts"), value: risks.filter((r) => r.risk !== "Low").length, text: "text-red-300" },
    { label: t("villagesMonitored"), value: risks.length, text: "text-blue-300" },
    { label: t("reportsLive"), value: allReports.length, text: "text-amber-300" },
    { label: t("waterTestsLogged"), value: 19, text: "text-emerald-300" },
  ];

  const riskColor = { High: "#f87171", Medium: "#fbbf24", Low: "#34d399" };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">{t("appName")}</h1>
          <span className="relative flex h-2.5 w-2.5 ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span className="text-xs text-emerald-300">Live</span>
        </div>
        <p className="text-slate-400 mb-6">{t("tagline")}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass glow-border rounded-xl p-4">
              <p className={`text-3xl font-bold ${stat.text}`}><Counter value={stat.value} /></p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass glow-border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Symptom Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={symptomCounts}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass glow-border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Village Risk Overview</h2>
            <div className="space-y-3">
              {risks.length === 0 && <p className="text-sm text-slate-500">{t("noReportsYet")}</p>}
              {risks.slice(0, 5).map((r) => (
                <div key={r.village}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{r.village}</span>
                    <span style={{ color: riskColor[r.risk] }}>{r.risk}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(r.count * 10, 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-1.5 rounded-full"
                      style={{ background: riskColor[r.risk] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="glass glow-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">{t("recentReports")}</h2>
          <div className="space-y-3">
            {reports.length === 0 && <p className="text-sm text-slate-500">{t("noReportsYet")}</p>}
            {reports.map((r) => (
              <div key={r.id} className="flex justify-between items-center border-b border-white/10 last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="font-medium text-slate-200">{r.village}</p>
                  <p className="text-sm text-slate-400">{r.symptom} · {r.severity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;