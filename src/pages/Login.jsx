import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.png";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState("phone");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
  };

  const sendOtp = async () => {
    setError("");
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Check the number and try again.");
    }
  };

  const verifyOtp = async () => {
    setError("");
    try {
      await confirmationResult.confirm(otp);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm glass glow-border rounded-2xl p-8"
      >
        <img src={logo} alt="EpiStream" className="h-16 w-16 mx-auto mb-3" />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center mb-1 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent tracking-wide"
        >
          EpiStream
        </motion.h1>
        <p className="text-center text-slate-400 mb-8 text-sm tracking-wide">Community Health Early Warning</p>

        {step === "phone" && (
          <>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Phone Number</label>
            <div className="flex items-center rounded-xl mb-5 overflow-hidden glass">
              <span className="px-3 text-slate-400 py-3 border-r border-white/10">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="flex-1 px-3 py-3 bg-transparent outline-none text-slate-100 placeholder-slate-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendOtp}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-cyan-500/20"
            >
              Send OTP
            </motion.button>
          </>
        )}

        {step === "otp" && (
          <>
            <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full rounded-xl px-3 py-3 mb-5 glass outline-none text-slate-100 placeholder-slate-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={verifyOtp}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-cyan-500/20"
            >
              Verify & Login
            </motion.button>
          </>
        )}

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}

export default Login;