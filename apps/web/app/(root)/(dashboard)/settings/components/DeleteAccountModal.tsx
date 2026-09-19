"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FormError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { getAuthErrorMessage } from "@/lib/auth-error";
import { authClient } from "@repo/auth/authClient";
import { redirect } from "next/navigation";

type DeleteAccountModalProps = {
  userName: string;
  open: boolean;
  onClose: () => void;
};

export function DeleteAccountModal({
  userName,
  open,
  onClose,
}: DeleteAccountModalProps) {
  const [confirmation, setConfirmation] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function closeModal() {
    if (isDeleting) return;
    setConfirmation("");
    setAuthError(null);
    onClose();
  }

  async function handleDelete() {
    if (confirmation !== userName) return;

    setIsDeleting(true);
    setAuthError(null);

    try {
      const { error } = await authClient.deleteUser({
        callbackURL: "/sign-in",
      });
      if (error) {
        setAuthError(
          getAuthErrorMessage(error, "We couldn’t delete your account."),
        );
        setIsDeleting(false);
        return;
      }
    } catch (error) {
      setAuthError(
        getAuthErrorMessage(
          error,
          "We couldn’t connect to the server. Please try again.",
        ),
      );
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Delete your account?"
      description="This permanently deletes your profile and audiobook library. This action cannot be undone."
    >
      <div className="space-y-4">
        <p className="text-sm">
          Type <strong>{userName}</strong> to confirm.
        </p>
        <Field
          data-invalid={confirmation.length > 0 && confirmation !== userName}
        >
          <FieldLabel htmlFor="delete-account-confirmation">
            Profile name
          </FieldLabel>
          <Input
            id="delete-account-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="off"
            placeholder={userName}
            aria-invalid={confirmation.length > 0 && confirmation !== userName}
          />
          <FieldError>
            {confirmation.length > 0 && confirmation !== userName
              ? "The profile name does not match."
              : null}
          </FieldError>
        </Field>

        <FormError>{authError}</FormError>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onPress={closeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            isDisabled={confirmation !== userName || isDeleting}
            onPress={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
