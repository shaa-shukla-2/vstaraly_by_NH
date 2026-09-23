import { AuthForm } from "@/components/account/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Forgot password" };
export default function ForgotPage() {
  return <AuthForm mode="forgot" />;
}
