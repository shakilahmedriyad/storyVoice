import { redirect } from "next/navigation";
import getSession from "./get-session";

export default async function requireUnAuth() {
  const session = await getSession();
  if (session) {
    redirect("/library");
  }
}
