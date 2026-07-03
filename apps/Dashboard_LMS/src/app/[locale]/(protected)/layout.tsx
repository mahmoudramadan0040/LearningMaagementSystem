import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
  // return <>{children}</>;
}
