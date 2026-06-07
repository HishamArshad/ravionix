import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryStats from "@/components/history/HistoryStats";
import HistoryTable from "@/components/history/HistoryTable";

export default function HistoryPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <HistoryHeader />
      <HistoryStats />
      <HistoryTable />
    </div>
  );
}