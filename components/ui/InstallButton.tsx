// components/InstallButton.tsx
"use client";

import usePWAInstall from "../lib/usePWAInstall";

 

export default function InstallButton() {
  const { installApp, isInstallable } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={installApp}
      className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-black text-white rounded-xl shadow-lg"
    >
      📲 Install App
    </button>
  );
}