"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/components/api/authService";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1: Request Reset Code
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const forgotPassowrd = await authService.forgotPassword(email)
      console.log(forgotPassowrd)
      // TODO: API call
      // await fetch("http://localhost:8000/api/auth/forgot-password/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      await new Promise((r) => setTimeout(r, 1500));
      setStep("code");
    } catch {
      setError("Email not found");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      
      setStep("reset");
    } catch {
      setError("Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
const handlePasswordReset = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords don't match");
    setIsLoading(false);
    return;
  }

  try {
    // ONE API CALL (code + password together)
    await authService.resetPassword(code, password);

    setSuccess(true);

    // optional: redirect to login
    // router.push("/auth/login");

  } catch (err: any) {
    setError("Invalid code or reset failed");
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
          <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
          <p className="text-gray-400 mb-6">
            Your password has been successfully reset.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium"
          >
            Back to Login
          </Link>
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
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto"
            >
              <Mail className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-sm text-gray-400">
              {step === "email" && "Enter your email to get a reset code"}
              {step === "code" && "Enter the code we sent to your email"}
              {step === "reset" && "Create a new password"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gcu.edu.pk"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  disabled={isLoading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Code */}
          {step === "code" && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 6))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-2xl font-bold tracking-widest outline-none focus:border-purple-500/50 transition"
                  disabled={isLoading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full py-2 text-sm text-gray-400 hover:text-white"
              >
                Back
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === "reset" && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 outline-none focus:border-purple-500/50 transition"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 outline-none focus:border-purple-500/50 transition"
                  disabled={isLoading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !password || password !== confirmPassword}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-xs text-gray-500 text-center">
            <Link href="/auth/login" className="text-purple-400 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}