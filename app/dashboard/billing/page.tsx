import BillingHeader from "@/components/billing/BillingHeader";
import CurrentPlan from "@/components/billing/CurrentPlan";
import PricingPlans from "@/components/billing/PricingPlans";
import BillingHistory from "@/components/billing/BillingHistory";
import PaymentMethods from "@/components/billing/PaymentMethods";

export default function BillingPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <BillingHeader />
      <CurrentPlan />
      <PricingPlans />
      <div className="grid lg:grid-cols-2 gap-6">
        {/* <PaymentMethods /> */}
        <BillingHistory />
      </div>
    </div>
  );
}