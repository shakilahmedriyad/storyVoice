import { redirect } from "next/navigation";
import getSession from "./get-session";

export default async function requireUnAuth() {
  try {
    const session = await getSession();
    if (session) {
      redirect("/library");
    }
  } catch (error) {
    redirect("/sign-in");
  }
}
