import getSession from "@/lib/get-session";
import NavHeader from "./navheader";
import SettingsPanel from "./components/SettingsPanel";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) return null;

  return (
    <div>
      <NavHeader />
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-9">
        <SettingsPanel
          initialUser={{
            name: session.user.name,
            email: session.user.email,
          }}
        />
      </div>
    </div>
  );
}
