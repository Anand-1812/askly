"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconSparkles,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-1.5", className)}>
    {children}
  </div>
);

export default function Register() {
  const { login, createAccount } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!firstname || !lastname || !email || !password) {
      setError("Please fill out all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await createAccount(
      `${firstname} ${lastname}`,
      email.toString(),
      password.toString(),
    );

    if (response.error) {
      setError(response.error.message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());
      if (loginResponse.error) {
        setError(loginResponse.error.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card/85 p-8 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <IconSparkles className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-sm font-bold tracking-tight text-transparent">
            Askly
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary transition-colors hover:brightness-110"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground/85">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="text-foreground/80">
              First name
            </Label>
            <Input
              id="firstname"
              name="firstname"
              placeholder="John"
              type="text"
              autoComplete="given-name"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname" className="text-foreground/80">
              Last name
            </Label>
            <Input
              id="lastname"
              name="lastname"
              placeholder="Doe"
              type="text"
              autoComplete="family-name"
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer>
          <Label htmlFor="email" className="text-foreground/80">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password" className="text-foreground/80">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
          />
        </LabelInputContainer>

        <button
          className="group/btn relative mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:brightness-95 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating account...
            </span>
          ) : (
            "Create account ->"
          )}
          <BottomGradient />
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            className="group/btn relative flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-primary disabled:opacity-50"
            type="button"
            disabled={isLoading}
          >
            <IconBrandGoogle className="h-4 w-4" />
            Google
            <BottomGradient />
          </button>
          <button
            className="group/btn relative flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-primary disabled:opacity-50"
            type="button"
            disabled={isLoading}
          >
            <IconBrandGithub className="h-4 w-4" />
            GitHub
            <BottomGradient />
          </button>
        </div>

        <p className="pt-2 text-center text-xs text-muted-foreground">
          By creating an account you agree to our{" "}
          <span className="text-foreground/75">Terms of Service</span> and{" "}
          <span className="text-foreground/75">Privacy Policy</span>.
        </p>
      </form>
    </div>
  );
}
