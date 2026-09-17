import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo.png";

const langOptions = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "bn", label: "বাং" },
  { code: "ta", label: "தமி" },
  { code: "te", label: "తెలు" },
  { code: "mr", label: "मरा" },
];

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: t("dashboard") },
    { to: "/map", label: t("map") },
    { to: "/alerts", label: t("alerts") },
    { to: "/community", label: t("community") },
    { to: "/water-tests", label: t("waterTests") },
    { to: "/history", label: t("history") },
  ];

  const logout = async () => {
    await signOut(getAuth());
    navigate("/");
  };

  return (
    <nav className="glass px-6 py-3 sticky top-0 z-50 border-b border-white/10">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="EpiStream" className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">EpiStream</span>
        </Link>

        <div className="hidden md:flex gap-5">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`text-sm font-medium transition ${pathname === l.to ? "text-cyan-300" : "text-slate-400 hover:text-cyan-200"}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="hidden sm:block text-sm glass rounded-lg px-2 py-1 outline-none text-slate-200">
            {langOptions.map((o) => (
              <option key={o.code} value={o.code} className="bg-slate-900">{o.label}</option>
            ))}
          </select>
          <button onClick={logout} className="hidden md:block text-sm text-red-400 font-medium hover:text-red-300">{t("logout")}</button>
          <button onClick={() => setOpen(!open)} className="md:hidden text-slate-200 text-2xl leading-none">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-3 pb-2">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`text-sm font-medium ${pathname === l.to ? "text-cyan-300" : "text-slate-300"}`}>
              {l.label}
            </Link>
          ))}
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="text-sm glass rounded-lg px-2 py-1 outline-none text-slate-200 w-fit">
            {langOptions.map((o) => (
              <option key={o.code} value={o.code} className="bg-slate-900">{o.label}</option>
            ))}
          </select>
          <button onClick={logout} className="text-sm text-red-400 font-medium text-left">{t("logout")}</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;