"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");

    setSessionId(id);

    const verifyPayment = async () => {
      try {
        if (!id) return;

        await fetch("http://localhost:8000/api/billing/verify-session/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: id }),
        });

        setLoading(false);

        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (error) {
        console.error("Payment verification failed", error);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-green-500">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-400">
          Your subscription has been activated.
        </p>

        {loading ? (
          <p className="text-blue-400">Verifying payment...</p>
        ) : (
          <p className="text-green-400">Redirecting to dashboard...</p>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}