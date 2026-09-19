"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FormError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { getAuthErrorMessage } from "@/lib/auth-error";
import { authClient } from "@repo/auth/authClient";

const profileSchema = z.object({
  name: z.string().trim().min(3, "Use at least 3 characters."),
});

type ProfileValues = z.infer<typeof profileSchema>;

type ProfileUser = {
  name: string;
  email: string;
};

type ProfileModalProps = {
  user: ProfileUser;
  open: boolean;
  onClose: () => void;
  onUpdated: (name: string) => void;
};

export function ProfileModal({
  user,
  open,
  onClose,
  onUpdated,
}: ProfileModalProps) {
  const [authError, setAuthError] = useState<string | null>(null);
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: user.name });
      setAuthError(null);
    }
  }, [form, open, user.name]);

  async function onSubmit(values: ProfileValues) {
    setAuthError(null);

    try {
      const { error } = await authClient.updateUser({ name: values.name });

      if (error) {
        setAuthError(
          getAuthErrorMessage(error, "We couldn’t update your profile."),
        );
        return;
      }

      onUpdated(values.name);
      onClose();
    } catch (error) {
      setAuthError(
        getAuthErrorMessage(
          error,
          "We couldn’t connect to the server. Please try again.",
        ),
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Your profile"
      description="Update the name shown across StoryVoice."
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="profile-name">Name</FieldLabel>
            <Input
              id="profile-name"
              autoComplete="name"
              aria-invalid={!!form.formState.errors.name}
              {...form.register("name")}
            />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input id="profile-email" value={user.email} disabled />
            <p className="text-xs text-muted-foreground">
              Email changes are not available here yet.
            </p>
          </Field>
        </FieldGroup>

        <FormError className="mt-4">{authError}</FormError>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onPress={onClose}>
            Cancel
          </Button>
          <Button type="submit" isDisabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
