import PhysicsHeader from "@/components/physics/PhysicsHeader";
import PhysicsSolver from "@/components/physics/PhysicsSolver";
import PhysicsHistory from "@/components/physics/PhysicsHistory";

export default function PhysicsPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PhysicsHeader />
      <PhysicsSolver />
      <PhysicsHistory />
    </div>
  );
}