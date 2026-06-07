"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { authState } from "@/components/store/auth";
import { CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { authService } from "@/components/api/authService";

type CallbackStatus = "loading" | "success" | "error";

export default function CallbackPage() {
  // const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   const authenticateUser = async () => {
  //     try {
  //       const token = params.get("token");

  //       if (!token) {
  //         setStatus("error");
  //         setErrorMessage("No authentication token received");
  //         setTimeout(() => router.push("/auth/login"), 3000);
  //         return;
  //       }

  //       // Store token
  //       authState.token.set(token);
  //       authState.isAuthenticated.set(true); 
  //       const user = await authService.getMe()
  //       authState.user.set(user)
  //       // Success animation delay
  //       setStatus("success");
        
  //       // Redirect after animation
  //       setTimeout(() => {
  //         router.push("/dashboard");
  //       }, 2000);
  //     } catch (error) {
  //       console.error("Authentication error:", error);
  //       setStatus("error");
  //       setErrorMessage("Authentication failed. Please try again.");
  //       setTimeout(() => router.push("/auth/login"), 3000);
  //     }
  //   };

  //   authenticateUser();
  // }, [params, router]);
useEffect(() => {
  const authenticateUser = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setErrorMessage("No authentication token received");
        setTimeout(() => router.push("/auth/login"), 3000);
        return;
      }

      authState.token.set(token);
      authState.isAuthenticated.set(true);

      const user = await authService.getMe();
      authState.user.set(user);

      setStatus("success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Authentication failed. Please try again.");
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  };

  authenticateUser();
}, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center space-y-8">
          {/* Icon Container */}
          <motion.div
            className="flex justify-center"
            animate={status === "loading" ? { rotate: 360 } : {}}
            transition={
              status === "loading"
                ? { duration: 2, repeat: Infinity, ease: "linear" }
                : {}
            }
          >
            <motion.div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                status === "loading"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : status === "success"
                  ? "bg-gradient-to-br from-green-500 to-emerald-500"
                  : "bg-gradient-to-br from-red-500 to-orange-500"
              } shadow-2xl`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              {status === "loading" && (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              )}
              {status === "success" && (
                <CheckCircle className="w-10 h-10 text-white" />
              )}
              {status === "error" && (
                <AlertCircle className="w-10 h-10 text-white" />
              )}
            </motion.div>
          </motion.div>

          {/* Sparkles Animation */}
          {status === "success" && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.cos((i / 6) * Math.PI * 2) * 100,
                    y: Math.sin((i / 6) * Math.PI * 2) * 100,
                    opacity: 0,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              ))}
            </>
          )}

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {status === "loading"
                ? "Welcome Back!"
                : status === "success"
                ? "You're All Set!"
                : "Oops! Something Went Wrong"}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p
              className={`text-lg ${
                status === "loading"
                  ? "text-gray-400"
                  : status === "success"
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {status === "loading"
                ? "Authenticating your account..."
                : status === "success"
                ? "Authentication successful! Redirecting to dashboard..."
                : errorMessage || "Failed to authenticate. Please try again."}
            </p>
          </motion.div>

          {/* Status Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span
                  className={`text-sm font-medium capitalize ${
                    status === "loading"
                      ? "text-yellow-400"
                      : status === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {status === "loading"
                    ? "Authenticating"
                    : status === "success"
                    ? "Success"
                    : "Error"}
                </span>
              </div>

              {/* Progress Indicator */}
              {status === "loading" && (
                <motion.div
                  className="w-full h-1 bg-white/10 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ x: "-100%" }}
                    animate={{ x: ["−100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}

              {/* Success Checkmarks */}
              {status === "success" && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {["Token verified", "Profile loaded", "Redirecting"].map(
                    (item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-2 text-xs text-green-400"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.1 * i + 0.3,
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="w-3 h-3 rounded-full bg-green-400"
                        />
                        {item}
                      </motion.div>
                    )
                  )}
                </motion.div>
              )}

              {/* Error Details */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-300"
                >
                  Redirecting to login in 3 seconds...
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-gray-500">StudyAI</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      {status === "success" && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 text-4xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4 text-4xl"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -360],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          >
            🎉
          </motion.div>
        </>
      )}

      {/* Error Message Details */}
      {status === "error" && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-gray-500">
            If the problem persists, contact{" "}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              support
            </a>
          </p>
        </motion.div>
      )}
    </div>
  );
}