"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@repo/auth/authClient";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FormError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage } from "@/lib/auth-error";
import { AuthAside } from "../../components/AuthAside";

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    setAuthError(null);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/library",
      });

      if (error) {
        setAuthError(
          getAuthErrorMessage(
            error,
            "We couldn’t sign you in. Please check your details and try again.",
          ),
        );
      }
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
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)]">
      <AuthAside />
      <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
        <div className="surface w-full max-w-md p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-[-0.03em]">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to StoryVoice.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                <Input
                  id="sign-in-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>

              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                <Input
                  id="sign-in-password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                <FieldError>
                  {form.formState.errors.password?.message}
                </FieldError>
              </Field>
            </FieldGroup>

            <FormError className="mt-6">{authError}</FormError>

            <Button
              type="submit"
              className="mt-6 w-full"
              isDisabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
