import PlagiarismHeader from "@/components/plagiarism/PlagiarismHeader";
import PlagiarismChecker from "@/components/plagiarism/PlagiarismChecker";
import PlagiarismHistory from "@/components/plagiarism/PlagiarismHistory";

export default function PlagiarismPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PlagiarismHeader />
      <PlagiarismChecker />
      <PlagiarismHistory />
    </div>
  );
}