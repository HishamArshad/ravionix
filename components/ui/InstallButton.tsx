"use client";

import usePWAInstall from "../lib/usePWAInstall";

export default function InstallButton() {
  const { installApp, isInstallable } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={installApp}
        className="group flex items-center gap-2 px-4 py-2.5
                   rounded-full bg-white/80 backdrop-blur-xl
                   border border-black/10 shadow-lg
                   hover:shadow-xl hover:scale-[1.03]
                   active:scale-95 transition-all duration-200"
      >
        {/* icon bubble */}
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">
          ⬇
        </span>

        {/* text */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-black">
            Install App
          </span>
          <span className="text-[11px] text-gray-500">
            Faster & offline access
          </span>
        </div>

        {/* hover arrow */}
        <span className="ml-1 text-gray-400 group-hover:translate-x-1 transition">
          →
        </span>
      </button>
    </div>
  );
}