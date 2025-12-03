import { AuthLayout } from "@/components/auth/AuthLayout";
import { OtpLoginForm } from "@/components/auth/OtpLoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <OtpLoginForm />
    </AuthLayout>
  );
}
