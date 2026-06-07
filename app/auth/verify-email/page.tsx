"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const codeString = code.join("");
  const isComplete = codeString.length === 6;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with real API call
      // const response = await fetch("http://localhost:8000/api/auth/verify-email/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ code: codeString }),
      // });

      await new Promise((r) => setTimeout(r, 2000));
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("Invalid verification code. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      // TODO: Call resend email API
      // await fetch("http://localhost:8000/api/auth/resend-code/", {
      //   method: "POST",
      // });
      await new Promise((r) => setTimeout(r, 1500));
      setResendTimer(60);
    } catch {
      setError("Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
          <p className="text-gray-400 mb-6">
            Your account is ready. Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto"
            >
              <Mail className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">Verify Your Email</h1>
            <p className="text-sm text-gray-400">
              We sent a 6-digit code to your email. Enter it below.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Code Input */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {code.map((digit, i) => (
                <motion.input
                  key={i}
                  id={`code-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && i > 0) {
                      const prevInput = document.getElementById(
                        `code-${i - 1}`
                      ) as HTMLInputElement;
                      prevInput?.focus();
                    }
                  }}
                  className="w-14 h-14 rounded-xl bg-white/10 border-2 border-white/20 text-center text-2xl font-bold focus:border-purple-500 focus:bg-white/20 outline-none transition"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!isComplete || isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm text-purple-400 hover:text-purple-300 font-medium"
              >
                Didn't receive code? Resend
              </button>
            )}
          </div>

          {/* Help */}
          <p className="text-xs text-gray-500 text-center">
            Check your spam folder if you don't see the email
          </p>
        </div>
      </motion.div>
    </div>
  );
}