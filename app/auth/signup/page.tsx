"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/components/api/authService";
import { authState } from "@/components/store/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // university: "",
    // agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  if (type === "checkbox") {
    const target = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: target.checked,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordStrength = formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      if (!passwordsMatch) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // if (!formData.agreeToTerms) {
      //   setError("You must agree to the terms and conditions");
      //   setIsLoading(false);
      //   return;
      // }
      const signUp = await authService.signUp(formData.email, formData.password, formData.first_name,formData.last_name)
      authState.token.set(signUp.token)
      authState.isAuthenticated.set(true);
      // important: ensure token is available for getMe request
      const user = await authService.getMe();

      authState.user.set(user);

      console.log(user);

      router.push("/dashboard");
      // TODO: Replace with real Django API call
      // const response = await fetch("http://localhost:8000/api/auth/signup/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     first_name: formData.first_name,
      //     last_name: formData.last_name,
      //     email: formData.email,
      //     password: formData.password,
      //     university: formData.university,
      //   }),
      // });
      // const data = await response.json();
      // localStorage.setItem("token", data.access);
      // router.push("/auth/verify-email");

      // Simulated API call
      // await new Promise((r) => setTimeout(r, 2000));

      // // Success - redirect to verify email
      // router.push("/auth/verify-email");
} catch (err: any) {
    const message =
      err?.response?.data?.email ||
      err?.response?.data?.detail ||
      err?.response?.data?.password ||
      "Sign up failed. Please try again.";

    setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  const googleLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const redirectUri = "http://127.0.0.1:8000/api/accounts/google/callback/"

  const scope = "openid email profile"

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}`

  window.location.href = url
}
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
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto"
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">Join StudyAI</h1>
            <p className="text-sm text-gray-400">
              Create your account and start learning smarter
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Ahmed"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Khan"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@gcu.edu.pk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* University Field */}
            {/* <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                University
              </label>
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
                disabled={isLoading}
              >
                <option value="">Select your university</option>
                <option value="gcu">GCU Lahore</option>
                <option value="lums">LUMS</option>
                <option value="fast">FAST NUCES</option>
                <option value="pu">Punjab University</option>
                <option value="uet">UET Lahore</option>
                <option value="other">Other</option>
              </select>
            </div> */}

            {/* Password Field */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/10 transition"
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
              {formData.password && (
                <div className="mt-1 text-xs">
                  {passwordStrength ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Strong password
                    </span>
                  ) : (
                    <span className="text-yellow-400">
                      Need: 8+ chars, 1 uppercase, 1 number
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border text-sm text-gray-200 placeholder-gray-600 outline-none transition
                    ${
                      formData.confirmPassword
                        ? passwordsMatch
                          ? "border-green-500/50 focus:border-green-500/70"
                          : "border-red-500/50 focus:border-red-500/70"
                        : "border-white/10 focus:border-purple-500/50"
                    }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-1 text-xs">
                  {passwordsMatch ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords don't match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            {/* <label className="flex items-start gap-3 cursor-pointer mt-5">
              <div
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                  formData.agreeToTerms
                    ? "bg-purple-500 border-purple-500"
                    : "border-white/20 hover:border-white/30"
                }`}
              >
                {formData.agreeToTerms && (
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
              <span className="text-xs text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label> */}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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

          {/* Social Signup */}
          <button onClick={googleLogin} className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition font-medium text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium transition">
              Sign In
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