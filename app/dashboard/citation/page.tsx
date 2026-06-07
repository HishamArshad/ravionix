import CitationHeader from "@/components/citation/CitationHeader";
import CitationForm from "@/components/citation/CitationForm";
import CitationHistory from "@/components/citation/CitationHistory";

export default function CitationPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <CitationHeader />
      <CitationForm />
      <CitationHistory />
    </div>
  );
}