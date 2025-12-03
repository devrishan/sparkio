import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { OtpLoginForm } from "@/components/auth/OtpLoginForm";

export const metadata: Metadata = {
  title: "Create Account - Earniq",
  description: "Create your Earniq account to start earning rewards through referrals and tasks.",
};

export default function RegisterPage() {
  return (
    <AuthLayout showMarketing>
      <OtpLoginForm />
    </AuthLayout>
  );
}
