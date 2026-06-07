"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle, 
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { authService } from "@/components/api/authService";
import { authState } from "@/components/store/auth";
import { useObservable } from "@legendapp/state/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const userData = useObservable(null)
  const googleLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const redirectUri =
  "https://7cfb-202-66-180-220.ngrok-free.app/api/accounts/google/callback/";

const scope = "openid email profile";

const url =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${clientId}` +
  `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(scope)}` +
  `&access_type=offline` +
  `&prompt=consent`;

window.location.href = url;
}
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
     const data = await authService.login(email, password);

      authState.token.set(data.token);
      authState.isAuthenticated.set(true);

      // important: ensure token is available for getMe request
      const user = await authService.getMe();

      authState.user.set(user);

      console.log(user);

      router.push("/dashboard");
      // TODO: Replace with real Django API call
      // const response = await fetch("http://localhost:8000/api/auth/login/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      // localStorage.setItem("token", data.access);
      // router.push("/dashboard");

      // Simulated API call
      // await new Promise((r) => setTimeout(r, 2000));

      // // Success
      // router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto"
            >
              <span className="text-2xl font-bold">✨</span>
            </motion.div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-gray-400">
              Sign in to your StudyAI account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 transition"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition ${
                  rememberMe
                    ? "bg-purple-500 border-purple-500"
                    : "border-white/20 hover:border-white/30"
                }`}
              >
                {rememberMe && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </div>
              <span className="text-sm text-gray-400">Remember me</span>
            </label>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-7"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Login */}
          <button onClick={googleLogin} className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition font-medium text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium transition">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300 transition">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-gray-300 transition">
            Terms
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
        </div>
      </motion.div>
    </div>
  );
}