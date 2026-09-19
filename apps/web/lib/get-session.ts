import { auth } from "@repo/auth/auth";
import { headers } from "next/headers";
export default async function getSession() {
  try {
    const session = auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    return null;
  }
}
