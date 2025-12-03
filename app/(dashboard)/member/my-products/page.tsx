import type { Metadata } from "next";
import { MemberProductsClient } from "@/components/member/member-products-client";

export const metadata: Metadata = {
  title: "My Products | Earniq",
  description: "Manage your products and orders",
};

export default function MemberProductsPage() {
  return <MemberProductsClient />;
}
