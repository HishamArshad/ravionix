import SummarizerHeader from "@/components/summarizer/SummarizerHeader";
import SummarizerInput from "@/components/summarizer/SummarizerInput";
import SummarizerHistory from "@/components/summarizer/SummarizerHistory";

export default function SummarizerPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <SummarizerHeader />
      <SummarizerInput />
      <SummarizerHistory />
    </div>
  );
}