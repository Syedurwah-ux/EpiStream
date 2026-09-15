import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

function WaterTests() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ village: "", ph: "", turbidity: "", tds: "" });
  const [submitted, setSubmitted] = useState(false);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "waterTests"), orderBy("createdAt", "desc"), limit(6));
    const unsub = onSnapshot(q, (snap) => setTests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "waterTests"), { ...form, createdAt: serverTimestamp() });
      setSubmitted(true);
      setForm({ village: "", ph: "", turbidity: "", tds: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const inputClass = "w-full rounded-xl px-3 py-3 glass outline-none text-slate-100 placeholder-slate-500";

  const flagged = (test) => {
    const ph = parseFloat(test.ph);
    const turb = parseFloat(test.turbidity);
    return (ph && (ph < 6.5 || ph > 8.5)) || (turb && turb > 5);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">{t("waterTestEntry")}</h1>
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass glow-border rounded-2xl p-6 space-y-4 w-full">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{t("villageArea")}</label>
            <input type="text" required value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{t("phLevel")}</label>
            <input type="number" step="0.1" value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} className={inputClass} placeholder="Safe: 6.5 – 8.5" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{t("turbidity")}</label>
            <input type="number" value={form.turbidity} onChange={(e) => setForm({ ...form, turbidity: e.target.value })} className={inputClass} placeholder="Safe: below 5 NTU" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{t("tds")}</label>
            <input type="number" value={form.tds} onChange={(e) => setForm({ ...form, tds: e.target.value })} className={inputClass} />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-cyan-500/20">
            {t("submitTest")}
          </motion.button>
          {submitted && <p className="text-cyan-300 text-sm text-center">{t("testLogged")}</p>}
        </motion.form>

        <div className="w-full mt-10">
          <h2 className="text-lg font-semibold text-slate-200 mb-3">Recent Tests</h2>
          <div className="space-y-3">
            {tests.length === 0 && <p className="text-sm text-slate-500">No tests logged yet.</p>}
            {tests.map((test) => (
              <motion.div key={test.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`glass rounded-xl p-4 ${flagged(test) ? "border border-red-500/30" : ""}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-200">{test.village}</span>
                  {flagged(test) && <span className="text-xs text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full">⚠ Unsafe range</span>}
                </div>
                <p className="text-xs text-slate-400">pH: {test.ph || "—"} · Turbidity: {test.turbidity || "—"} NTU · TDS: {test.tds || "—"} ppm</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaterTests;