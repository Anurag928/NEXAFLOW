import DashboardLayoutComponent from "@/components/DashboardLayout";
import { ReactNode } from "react";

export default function PricingLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
  );
}
