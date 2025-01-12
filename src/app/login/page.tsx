import { getSession } from "~/lib/session";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getSession();

  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] text-secondaryCustom">
        <p>Already logged in.</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f3f4f6] to-slate-900 text-white">
      <form
        action="/api/login"
        method="post"
        className="flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-white text-black w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-center text-gray-800">Log In</h1>
        <label className="flex flex-col gap-2">
          <span>Username</span>
          <Input type="text" name="username" required />
        </label>
        <label className="flex flex-col gap-2">
          <span>Password</span>
          <Input type="password" name="password" required />
        </label>
        <Button type="submit" className="mt-4">
          Log In
        </Button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-buttonColor hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}
