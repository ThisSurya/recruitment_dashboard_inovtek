import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, DUMMY_CREDENTIALS } from "@/lib/auth";

type LoginPayload = {
  email?: string;
  password?: string;
  remember?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginPayload | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const remember = Boolean(body?.remember);

  const isValid =
    email.toLowerCase() === DUMMY_CREDENTIALS.email &&
    password === DUMMY_CREDENTIALS.password;

  if (!isValid) {
    return NextResponse.json(
      { ok: false, error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  return NextResponse.json({ ok: true });
}
