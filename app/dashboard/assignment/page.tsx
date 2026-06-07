import AssignmentHeader from "@/components/assignment/AssignmentHeader";
import AssignmentTemplates from "@/components/assignment/AssignmentTemplates";
import AssignmentForm from "@/components/assignment/AssignmentForm";
import AssignmentHistory from "@/components/assignment/AssignmentHistory";

export default function AssignmentPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <AssignmentHeader />
      <AssignmentTemplates />
      <AssignmentForm />
      <AssignmentHistory />
    </div>
  );
}