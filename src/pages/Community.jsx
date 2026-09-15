import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

function Community() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ village: "", symptom: "Diarrhea", severity: "Mild" });
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(6));
    const unsub = onSnapshot(q, (snap) => setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reports"), { ...form, createdAt: serverTimestamp() });
      setSubmitted(true);
      setForm({ village: "", symptom: "Diarrhea", severity: "Mild" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    await addDoc(collection(db, "reviews"), {
      name: reviewName.trim() || "Anonymous",
      text: reviewText.trim(),
      createdAt: serverTimestamp(),
    });
    setReviewText("");
    setReviewName("");
  };

  const inputClass = "w-full rounded-xl px-3 py-3 glass outline-none text-slate-100 placeholder-slate-500";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">{t("reportSymptoms")}</h1>
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass glow-border rounded-2xl p-6 space-y-4 w-full max-w-md">
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{t("villageArea")}</label>
            <input type="text" required value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} className={inputClass} placeholder="e.g. Rampur, Bihar" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{t("symptom")}</label>
            <select value={form.symptom} onChange={(e) => setForm({ ...form, symptom: e.target.value })} className={inputClass}>
              <option value="Diarrhea" className="bg-slate-900">{t("diarrhea")}</option>
              <option value="Vomiting" className="bg-slate-900">{t("vomiting")}</option>
              <option value="Fever" className="bg-slate-900">{t("fever")}</option>
              <option value="Jaundice" className="bg-slate-900">{t("jaundice")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">{t("severity")}</label>
            <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className={inputClass}>
              <option value="Mild" className="bg-slate-900">{t("mild")}</option>
              <option value="Moderate" className="bg-slate-900">{t("moderate")}</option>
              <option value="Severe" className="bg-slate-900">{t("severe")}</option>
            </select>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-cyan-500/20">
            {t("submitReport")}
          </motion.button>
          {submitted && <p className="text-cyan-300 text-sm text-center">{t("reportSubmitted")}</p>}
        </motion.form>

        <div className="w-full max-w-md mt-10">
          <h2 className="text-lg font-semibold text-slate-200 mb-3">Community Feedback</h2>
          <form onSubmit={submitReview} className="glass glow-border rounded-2xl p-4 space-y-3 mb-4">
            <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name (optional)" className={inputClass} />
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience with EpiStream..." rows={2} className={inputClass} />
            <button className="w-full bg-white/5 border border-white/10 text-slate-200 py-2 rounded-xl text-sm hover:bg-white/10 transition">Post Feedback</button>
          </form>

          <div className="space-y-3">
            {reviews.length === 0 && <p className="text-sm text-slate-500">No feedback yet — be the first!</p>}
            {reviews.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4">
                <p className="text-sm text-slate-200 mb-1">"{r.text}"</p>
                <p className="text-xs text-cyan-300">— {r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;