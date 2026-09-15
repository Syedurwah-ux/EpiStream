import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { calculateRisk } from "../utils/riskEngine";
import logo from "../assets/logo.png";

const features = [
  { icon: "📍", title: "Community Reporting", desc: "Villagers and ASHA workers log symptoms in real time, geo-tagged instantly." },
  { icon: "🌧️", title: "Rainfall Correlation", desc: "Cross-references flooding data with outbreak patterns for early detection." },
  { icon: "🗺️", title: "Live Risk Map", desc: "Pan-India outbreak risk visualization, updated as new reports arrive." },
  { icon: "🚨", title: "Instant Alerts", desc: "Automated dispatch to health officers the moment risk crosses threshold." },
  { icon: "💧", title: "Water Quality Tracking", desc: "Log pH, turbidity, and TDS test results with automatic unsafe-range flags." },
  { icon: "🌐", title: "6 Languages", desc: "Built for accessibility across India's linguistic diversity." },
];

const steps = [
  { num: "01", title: "Report", desc: "A villager or ASHA worker logs symptoms with location, in seconds." },
  { num: "02", title: "Detect", desc: "The engine clusters reports by geography, time, and rainfall patterns." },
  { num: "03", title: "Alert", desc: "Health officers get notified the moment risk crosses threshold — before it spreads." },
];

function Counter({ value }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2 });
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => { controls.stop(); unsub(); };
  }, [value]);
  return <span>{display}</span>;
}

function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ reports: 0, villages: 0, active: 0 });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), async (snap) => {
      const reports = snap.docs.map((d) => d.data());
      const risks = await calculateRisk(reports);
      setStats({
        reports: reports.length,
        villages: risks.length,
        active: risks.filter((r) => r.risk !== "Low").length,
      });
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      {/* Hero */}
      <div className="max-w-4xl w-full pt-20 text-center">
        <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} src={logo} alt="EpiStream" className="h-20 w-20 mx-auto mb-4" />
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
          EpiStream
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="h-0.5 w-32 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-lg text-slate-400 mb-2">
          Community Health Early Warning System
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="text-sm text-slate-500 max-w-xl mx-auto mb-8">
          Detecting water-borne disease outbreaks before they spread — by turning scattered symptom reports and rainfall data into village-level risk intelligence.
        </motion.p>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,211,238,0.4)" }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/login")} className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-cyan-500/20">
          Get Started →
        </motion.button>
      </div>

      {/* Live stats */}
      <div className="max-w-3xl w-full mt-16 grid grid-cols-3 gap-4">
        {[
          { label: "Total Reports", value: stats.reports },
          { label: "Villages Monitored", value: stats.villages },
          { label: "Active Alerts", value: stats.active },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass glow-border rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-cyan-300"><Counter value={s.value} /></p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="max-w-5xl w-full mt-24">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-bold text-center text-slate-200 mb-10">How It Works</motion.h2>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass glow-border rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-cyan-400/40 mb-2">{s.num}</p>
              <h3 className="text-slate-200 font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="max-w-5xl w-full mt-24 grid md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 * i }} whileHover={{ y: -6, boxShadow: "0 0 24px rgba(34,211,238,0.15)" }} className="glass glow-border rounded-2xl p-5">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }} className="text-3xl mb-2">{f.icon}</motion.div>
            <h3 className="text-slate-200 font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Why EpiStream */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl w-full mt-24 glass glow-border rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-3">Predictive, Not Just Reactive</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          India's existing disease surveillance (IDSP) tracks outbreaks at the district level, often after cases are already confirmed. EpiStream works at the village level — correlating symptom clusters with rainfall and flooding in real time, so health officers can act days earlier, before an outbreak fully takes hold.
        </p>
      </motion.div>

      {/* Footer */}
      <div className="max-w-5xl w-full mt-20 pb-10 border-t border-white/10 pt-8 flex flex-col items-center gap-3">
        <div className="flex gap-3 flex-wrap justify-center">
          {["React", "Firebase", "Tailwind", "OpenWeather API", "Leaflet"].map((tech) => (
            <span key={tech} className="text-xs glass rounded-full px-3 py-1 text-slate-400">{tech}</span>
          ))}
        </div>
        <p className="text-xs text-slate-600">Built by Syed Urwah</p>
      </div>
    </div>
  );
}

export default Landing;