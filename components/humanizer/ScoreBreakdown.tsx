"use client";

import { motion } from "framer-motion";

type Props = {
  naturalness: number;
  clarity: number;
  style_match: number;
};

function getBarColor(value: number) {
  if (value >= 25) return "from-green-400 to-emerald-500";
  if (value >= 18) return "from-yellow-400 to-orange-500";
  return "from-red-400 to-pink-500";
}

function getLabel(value: number) {
  if (value >= 25) return "Strong";
  if (value >= 18) return "Good";
  if (value >= 12) return "Average";
  return "Weak";
}

export default function ScoreBreakdown({
  naturalness,
  clarity,
  style_match,
}: Props)

{
  const items = [
    { label: "Naturalness", value: naturalness },
    { label: "Clarity", value: clarity },
    { label: "Style Match", value: style_match },
  ];
  console.log({
    naturalness,
    clarity,
    style_match,
  });

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 uppercase tracking-wider">
        Writing Quality Breakdown
      </p>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="space-y-1"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {item.label}
              </span>

              <span className="text-xs text-gray-500">
                {item.value}/35 · {getLabel(item.value)}
              </span>
            </div>

            {/* Bar background */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / 35) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${getBarColor(
                  item.value
                )}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}