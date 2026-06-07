// lib/usePWAInstall.ts
"use client";

import { useEffect, useState } from "react";

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

 useEffect(() => {
  console.log("PWA hook mounted");

  const handler = (e: any) => {
    console.log("beforeinstallprompt fired");

    e.preventDefault();
    setDeferredPrompt(e);
    setIsInstallable(true);
  };

  window.addEventListener("beforeinstallprompt", handler);

  return () => window.removeEventListener("beforeinstallprompt", handler);
}, []);
  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("User accepted install");
    } else {
      console.log("User dismissed install");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { installApp, isInstallable };
}