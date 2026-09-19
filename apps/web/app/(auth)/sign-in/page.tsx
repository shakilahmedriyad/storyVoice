import requireUnAuth from "@/lib/requireUnAuth";
import { SignInForm } from "./components/SignInForm";

export default async function SignInPage() {
  await requireUnAuth();
  return <SignInForm />;
}
