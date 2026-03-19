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
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[3%] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <IconSparkles className="h-5 w-5 text-orange-500" />
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-sm font-bold tracking-tight text-transparent">
            Askly
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Create your account
        </h2>
        <p className="mt-1.5 text-sm text-white/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-400 transition-colors hover:text-orange-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="text-white/70">
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
            <Label htmlFor="lastname" className="text-white/70">
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
          <Label htmlFor="email" className="text-white/70">
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
          <Label htmlFor="password" className="text-white/70">
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
          className="group/btn relative mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-orange-500 font-semibold text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-200 hover:bg-orange-400 hover:shadow-[0_0_28px_rgba(249,115,22,0.5)] disabled:opacity-50"
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
            "Create account →"
          )}
          <BottomGradient />
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-black px-3 text-white/40">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            className="group/btn relative flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
            type="button"
            disabled={isLoading}
          >
            <IconBrandGoogle className="h-4 w-4" />
            Google
            <BottomGradient />
          </button>
          <button
            className="group/btn relative flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
            type="button"
            disabled={isLoading}
          >
            <IconBrandGithub className="h-4 w-4" />
            GitHub
            <BottomGradient />
          </button>
        </div>

        <p className="pt-2 text-center text-xs text-white/30">
          By creating an account you agree to our{" "}
          <span className="text-white/50">Terms of Service</span> and{" "}
          <span className="text-white/50">Privacy Policy</span>.
        </p>
      </form>
    </div>
  );
}
