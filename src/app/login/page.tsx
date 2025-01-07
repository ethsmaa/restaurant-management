import { getSession } from "~/lib/session";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default async function LoginPage() {
  const session = await getSession();

  if (session.user) {
    return <div>Already logged in</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-700 to-slate-900 text-white">
      <form
        action="/api/login"
        method="post"
        className="flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-white text-black"
      >
        <label className="flex flex-col gap-2">
          <span>Username</span>
          <Input type="text" name="username" required />
        </label>
        <label className="flex flex-col gap-2">
          <span>Password</span>
          <Input type="password" name="password" required />
        </label>
        <Button type="submit" className="mt-4">
          Login
        </Button>
      </form>
    </main>
  );
}
