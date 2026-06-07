import MCQHeader from "@/components/mcq/MCQHeader";
import MCQGenerator from "@/components/mcq/MCQGenerator";
import MCQHistory from "@/components/mcq/MCQHistory";

export default function MCQPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <MCQHeader />
      <MCQGenerator />
      <MCQHistory />
    </div>
  );
}