import requireUnAuth from "@/lib/requireUnAuth";
import { SignUpForm } from "./components/SignUpForm";

export default async function SignUpPage() {
  await requireUnAuth();
  return <SignUpForm />;
}
