import { redirect } from "next/navigation";
import getSession from "./get-session";

export default async function requireAuth() {
  try {
    const session = await getSession();
    if (!session) {
      redirect("/sign-in");
    }
  } catch (error) {
    redirect("/sign-in");
  }
}
