"use client";

import { motion } from "framer-motion";
import { Calculator, Atom, FlaskConical } from "lucide-react";

export default function PhysicsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Physics Solver</h1>
          <p className="text-sm text-gray-400">
            Solve complex physics problems with step-by-step solutions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <Atom className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">
            Mechanics · Thermodynamics · Waves
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <FlaskConical className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">
            Unlimited solves
          </span>
        </div>
      </div>
    </motion.div>
  );
}