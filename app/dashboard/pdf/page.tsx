import PDFHeader from "@/components/pdf/PDFHeader";
import PDFUploader from "@/components/pdf/PDFUploader";
import PDFHistory from "@/components/pdf/PDFHistory";

export default function PDFPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PDFHeader />
      <PDFUploader />
      <PDFHistory />
    </div>
  );
}