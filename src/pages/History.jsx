import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const incidents = [
  { village: "Rampur, Bihar", type: "Diarrheal Outbreak", status: "Resolved", date: "2 Sep 2026" },
  { village: "Sonapur, Assam", type: "Vomiting Cluster", status: "Active", date: "10 Sep 2026" },
  { village: "Keshavpur, UP", type: "Fever Cases", status: "Monitoring", date: "12 Sep 2026" },
];

const badge = {
  Resolved: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  Active: "bg-red-500/20 text-red-300 border border-red-500/30",
  Monitoring: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

function History() {
  const { t } = useLanguage();
  const statusLabel = { Resolved: t("resolved"), Active: t("active"), Monitoring: t("monitoring") };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">{t("incidentHistory")}</h1>
        <div className="glass glow-border rounded-2xl divide-y divide-white/10">
          {incidents.map((inc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex justify-between items-center p-4"
            >
              <div>
                <p className="font-medium text-slate-200">{inc.village}</p>
                <p className="text-sm text-slate-400">{inc.type} · {inc.date}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge[inc.status]}`}>{statusLabel[inc.status]}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;