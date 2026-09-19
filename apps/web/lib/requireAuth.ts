import { redirect } from "next/navigation";
import getSession from "./get-session";

export default async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
}
