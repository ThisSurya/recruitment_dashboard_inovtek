"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DUMMY_CREDENTIALS } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Email must be a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ from }: { from: string }) {
  const router = useRouter();

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: DUMMY_CREDENTIALS.email,
      password: DUMMY_CREDENTIALS.password,
      remember: true,
    },
  });

  const remember = Boolean(useWatch({ control, name: "remember" }));

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setServerError(data?.error || "Login failed");
        return;
      }

      router.push(from);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <BrandMark />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900">
              Recruitment ATS
            </div>
            <div className="text-sm text-zinc-500">Recruiter Dashboard</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <p className="mt-1 text-sm text-zinc-500">
              Use your company credentials to continue.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm font-medium text-zinc-900 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <Checkbox
                    checked={remember}
                    onChange={(e) =>
                      setValue("remember", e.currentTarget.checked, {
                        shouldDirty: true,
                      })
                    }
                  />
                  Remember me
                </label>
              </div>

              {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Login"}
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
              <div className="font-medium text-zinc-900">Demo credentials</div>
              <div>Email: {DUMMY_CREDENTIALS.email}</div>
              <div>Password: {DUMMY_CREDENTIALS.password}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
