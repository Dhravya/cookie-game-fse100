import Link from "next/link";
import Image from "next/image";
import RootLayout from "./layout";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <RootLayout>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="absolute w-full top-0 flex h-16 items-center justify-between px-8">
          <div className="h-1"></div>
          {session ? (
            <div className="flex">
              <div className="flex items-center gap-4">
                <Image
                  className="rounded-full"
                  src={session.user.image ? session.user.image : ""}
                  alt="User avatar"
                  unoptimized
                  width={32}
                  height={32}
                />
                <div>{session.user.name}</div>
              </div>
              <button className="ml-4" onClick={() => signOut()}>Logout</button>
            </div>
          ) : (
            <button onClick={() => signIn("google")}>Click here to log in</button>
          )}
        </div>
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 ">
          <Image
            className="rounded-full"
            src="https://i.pinimg.com/564x/3c/32/fc/3c32fc5df675e77467b0343ea7b46dbb.jpg"
            alt="Cookie"
            unoptimized
            width={200}
            height={200}
          />
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Cookie game
          </h1>

          {session ? (
            <>
              {" "}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                <Link
                  className="flex max-w-xs flex-col gap-4 rounded-xl border-2 border-black p-4 hover:bg-black/20"
                  href="/game-1"
                  target="_blank"
                >
                  <h3 className="text-2xl font-bold">Game 1: Get the cookie</h3>
                  <div className="text-lg">
                    Get the cookie by clicking on it. The more you click, the
                    more cookies you get.
                  </div>
                </Link>
                <Link
                  aria-disabled={true}
                  className="flex max-w-xs cursor-not-allowed flex-col gap-4 rounded-xl bg-black/10 p-4 hover:bg-black/20"
                  href="/"
                  target="_blank"
                >
                  <h3 className="text-2xl font-bold">Game 2</h3>
                  <div className="text-lg">Game 2 is currently disabled.</div>
                </Link>
              </div>
            </>
          ) : (
            <button onClick={() => signIn("google")}>Login with google</button>
          )}
        </div>
      </main>
    </RootLayout>
  );
}
