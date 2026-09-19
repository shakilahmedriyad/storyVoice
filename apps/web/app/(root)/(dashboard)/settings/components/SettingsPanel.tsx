"use client";

import { Bell, Moon, Trash2, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { ProfileModal } from "./ProfileModal";

type SettingsPanelProps = {
  initialUser: {
    name: string;
    email: string;
  };
};

export default function SettingsPanel({ initialUser }: SettingsPanelProps) {
  const [user, setUser] = useState(initialUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            General
          </h2>
          <div className="surface divide-y overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-muted/50"
              onClick={() => setProfileOpen(true)}
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <UserRound size={18} />
              </span>
              <span>
                <span className="block font-semibold">Profile</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {user.name} · {user.email}
                </span>
              </span>
              <span className="ml-auto text-muted-foreground">›</span>
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Preferences
          </h2>
          <div className="surface divide-y overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-muted/50"
              disabled
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Bell size={18} />
              </span>
              <span>
                <span className="block font-semibold">Notifications</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Updates about your audiobook projects
                </span>
              </span>
              <span className="ml-auto text-muted-foreground">›</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-muted/50"
              disabled
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Moon size={18} />
              </span>
              <span>
                <span className="block font-semibold">Appearance</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Light theme · Warm and focused
                </span>
              </span>
              <span className="ml-auto text-muted-foreground">›</span>
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-destructive">
            Danger
          </h2>
          <div className="surface flex items-center gap-4 border border-destructive/25 bg-destructive/5 p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
              <Trash2 size={18} />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-destructive">Delete account</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This is permanent. All your data will be lost.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="ml-auto"
              onPress={() => setDeleteOpen(true)}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </section>
      </div>

      <ProfileModal
        user={user}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onUpdated={(name) => setUser((current) => ({ ...current, name }))}
      />
      <DeleteAccountModal
        userName={user.name}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
