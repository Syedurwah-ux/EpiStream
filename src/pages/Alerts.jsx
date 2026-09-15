import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { calculateRisk } from "../utils/riskEngine";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const badge = {
  High: "bg-red-500/20 text-red-300 border border-red-500/30",
  Medium: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Low: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
};

function Alerts() {
  const { t } = useLanguage();
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), async (snap) => {
      const reports = snap.docs.map((d) => d.data());
      const result = await calculateRisk(reports);
      setRisks(result);
    });
    return () => unsub();
  }, []);

  const riskLabel = { High: t("high"), Medium: t("medium"), Low: t("low") };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">{t("alerts")}</h1>
        <div className="space-y-4 w-full">
          {risks.length === 0 && <p className="text-sm text-slate-500 text-center">{t("noReportsYet")}</p>}
          {risks.map((r, i) => (
            <motion.div
              key={r.village}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass glow-border rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-200">{r.village}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge[r.risk]}`}>{riskLabel[r.risk]}</span>
              </div>
              <p className="text-sm text-slate-400">{r.count} {t("reportsInLast7Days")} — {r.symptoms.join(", ")}</p>

              {r.risk === "High" && (
                <div className="mt-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 flex items-start gap-2">
                  <span>📱</span>
                  <div>
                    <p className="text-xs font-semibold text-cyan-300">SMS Alert Dispatched</p>
                    <p className="text-xs text-cyan-200/70 mt-0.5">
                      To: District Health Officer — "{r.village}: {r.count} cases detected. Suspected outbreak."
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Alerts;