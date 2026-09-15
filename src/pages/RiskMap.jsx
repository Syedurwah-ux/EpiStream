import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { calculateRisk } from "../utils/riskEngine";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const color = { High: "#f87171", Medium: "#fbbf24", Low: "#34d399" };

function FlyTo({ point }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], 8, { duration: 1 });
  }, [point]);
  return null;
}

function RiskMap() {
  const { t } = useLanguage();
  const [points, setPoints] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reports"), async (snap) => {
      const reports = snap.docs.map((d) => d.data());
      const risks = await calculateRisk(reports);
      const withCoords = await Promise.all(
        risks.map(async (r) => {
          try {
            const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(r.village)},IN&limit=1&appid=99174f0fd29c9053d8b1e7caced0f49c`);
            const data = await res.json();
            if (!data[0]) return null;
            return { ...r, lat: data[0].lat, lng: data[0].lon };
          } catch {
            return null;
          }
        })
      );
      setPoints(withCoords.filter(Boolean));
    });
    return () => unsub();
  }, []);

  const counts = { High: points.filter((p) => p.risk === "High").length, Medium: points.filter((p) => p.risk === "Medium").length, Low: points.filter((p) => p.risk === "Low").length };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">{t("riskMap")}</h1>

        <div className="flex gap-3 mb-4">
          {Object.entries(counts).map(([level, n]) => (
            <div key={level} className="glass glow-border rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color[level] }}></span>
              <span className="text-sm text-slate-300">{level}: {n}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass glow-border rounded-2xl overflow-hidden p-2">
            <div style={{ filter: "invert(1) hue-rotate(180deg) brightness(0.9)" }}>
              <MapContainer center={[22.5, 80]} zoom={5} style={{ height: "65vh", borderRadius: "12px" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FlyTo point={selected} />
                {points.map((p) => (
                  <CircleMarker
                    key={p.village}
                    center={[p.lat, p.lng]}
                    radius={p.risk === "High" ? 12 : 9}
                    pathOptions={{ color: color[p.risk], fillColor: color[p.risk], fillOpacity: 0.7 }}
                    style={{ filter: "invert(1) hue-rotate(180deg)" }}
                    eventHandlers={{ click: () => setSelected(p) }}
                  >
                    <Popup>{p.village} — {p.risk} risk ({p.count} reports)</Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="glass glow-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Village Details</h2>
            {!selected && <p className="text-sm text-slate-500">Click a marker on the map to see details.</p>}
            {selected && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <p className="text-xl font-bold text-slate-100">{selected.village}</p>
                <p className="text-sm" style={{ color: color[selected.risk] }}>{selected.risk} Risk</p>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>Reports (7d): <span className="text-slate-200">{selected.count}</span></p>
                  <p>Rainfall: <span className="text-slate-200">{selected.rainfall ?? "N/A"} mm</span></p>
                  <p>Symptoms: <span className="text-slate-200">{selected.symptoms.join(", ")}</span></p>
                  <p>Coordinates: <span className="text-slate-200">{selected.lat.toFixed(2)}, {selected.lng.toFixed(2)}</span></p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskMap;