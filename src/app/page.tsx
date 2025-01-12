import Link from "next/link";
import { LoginOrLogout } from "~/components/LoginOrLogout";
import { getSession } from "~/lib/session";
import { UserRole } from "~/lib/enums/roles";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import illustration from "~/../public/ilustrasyon.jpg";

import { IoIosArrowForward } from "react-icons/io";

export default async function HomePage() {
  const session = await getSession();
  const user = session?.user;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex items-center gap-40 p-6">
        {/* Left Section */}
        <div className="flex flex-col items-start space-y-4 max-w-md">
          {user ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome {user.name}!
              </h1>
              {user.role === UserRole.CUSTOMER && (
                <>
                  <p className="text-gray-700">Feeling hungry?</p>
                  <Link href="/dashboard/customer">
                    <Button className="w-full" variant="default">
                      View restaurants and order food
                      <IoIosArrowForward />
                    </Button>
                  </Link>
                </>
              )}
              {user.role === UserRole.OWNER && (
                <>
                  <p className="text-gray-700">Are you a restaurant owner?</p>
                  <Link href="/dashboard/owner">
                    <Button className="w-full" variant="default">
                      Manage your restaurants and view incoming orders
                      <IoIosArrowForward />
                    </Button>
                  </Link>
                </>
              )}
              <LoginOrLogout />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to Byte&Bite!
              </h1>
              <p className="text-gray-700">
                If you have an account, you can log in.
              </p>
              <div className="flex gap-4">
                <Link href="/login">
                  <Button variant="default">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="relative">
          <Image
            src={illustration}
            alt="An illustration of a person ordering food and a courier"
            width={500}
            height={500}
            className=""
          />
        </div>
      </div>
    </main>
  );
}
