import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE_NAME)?.value === "1";
  redirect(isAuthed ? "/dashboard" : "/login");
}
