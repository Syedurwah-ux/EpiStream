import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RiskMap from "./pages/RiskMap";
import Alerts from "./pages/Alerts";
import Community from "./pages/Community";
import WaterTests from "./pages/WaterTests";
import History from "./pages/History";

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function Wrapper({ children }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={fade} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Wrapper><Landing /></Wrapper>} />
        <Route path="/login" element={<Wrapper><Login /></Wrapper>} />
        <Route path="/dashboard" element={<Wrapper><Dashboard /></Wrapper>} />
        <Route path="/map" element={<Wrapper><RiskMap /></Wrapper>} />
        <Route path="/alerts" element={<Wrapper><Alerts /></Wrapper>} />
        <Route path="/community" element={<Wrapper><Community /></Wrapper>} />
        <Route path="/water-tests" element={<Wrapper><WaterTests /></Wrapper>} />
        <Route path="/history" element={<Wrapper><History /></Wrapper>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="mesh-bg"></div>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;