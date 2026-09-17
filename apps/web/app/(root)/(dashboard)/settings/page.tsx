import { Bell, Moon, UserRound } from "lucide-react";
import NavHeader from "./navheader";

const settings = [{ icon: UserRound, title: "Profile", description: "Riyad · Personal library" }, { icon: Bell, title: "Notifications", description: "Updates about your audiobook projects" }, { icon: Moon, title: "Appearance", description: "Light theme · Warm and focused" }];

export default function SettingsPage() {
  return <div><NavHeader /><div className="mx-auto max-w-3xl px-6 py-10 md:px-9"><div className="surface divide-y overflow-hidden">{settings.map(({ icon: Icon, title, description }) => <button key={title} className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-muted/50"><span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon size={18} /></span><span><span className="block font-semibold">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{description}</span></span><span className="ml-auto text-muted-foreground">›</span></button>)}</div></div></div>;
}