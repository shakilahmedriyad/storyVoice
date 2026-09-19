"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthAside } from "../../components/AuthAside";
import { authClient } from "@repo/auth/authClient";
import { redirect } from "next/navigation";

const signUpSchema = z
  .object({
    name: z.string().min(3, "Enter your name."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SignUpValues) {
    try {
      authClient.signUp.email({
        email: values.email,
        name: values.name,
        password: values.password,
        callbackURL: "/library",
      });
    } catch (error) {}
  }

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)]">
      <AuthAside />
      <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
        <div className="surface w-full max-w-md p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-[-0.03em]">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start turning your books into audiobooks.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.name}>
                <FieldLabel htmlFor="sign-up-name">Name</FieldLabel>
                <Input
                  id="sign-up-name"
                  type="text"
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  aria-invalid={!!form.formState.errors.name}
                  {...form.register("name")}
                />
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>

              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
                <Input
                  id="sign-up-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>

              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
                <Input
                  id="sign-up-password"
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                <FieldError>
                  {form.formState.errors.password?.message}
                </FieldError>
              </Field>

              <Field data-invalid={!!form.formState.errors.confirmPassword}>
                <FieldLabel htmlFor="sign-up-confirm-password">
                  Confirm password
                </FieldLabel>
                <Input
                  id="sign-up-confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.confirmPassword}
                  {...form.register("confirmPassword")}
                />
                <FieldError>
                  {form.formState.errors.confirmPassword?.message}
                </FieldError>
              </Field>
            </FieldGroup>

            <Button type="submit" className="mt-6 w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
