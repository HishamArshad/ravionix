import HumanizerHeader from "@/components/humanizer/HumanizerHeader";
import HumanizerEditor from "@/components/humanizer/HumanizerEditor";
import HumanizerHistory from "@/components/humanizer/HumanizerHistory";

export default function HumanizerPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <HumanizerHeader />
      <HumanizerEditor />
      <HumanizerHistory />
    </div>
  );
}