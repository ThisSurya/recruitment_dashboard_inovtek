import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const fromRaw = params.from;
  const from = typeof fromRaw === "string" ? fromRaw : "/dashboard";

  return <LoginForm from={from} />;
}
