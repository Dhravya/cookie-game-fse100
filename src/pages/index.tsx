import Link from "next/link";
import Image from "next/image";
import RootLayout from "./layout";
import { useSession, signIn } from "next-auth/react";
import Header from "~/components/Header";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <RootLayout>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Header />

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
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
                  aria-disabled={session.user.cookies < 1000 ? "true" : "false"}
                  className={`flex max-w-xs flex-col gap-4 rounded-xl border-2 border-black p-4  ${
                    session.user.cookies > 1000
                      ? " hover:bg-black/20"
                      : "cursor-not-allowed bg-black/30"
                  }`}
                  href={session.user.cookies > 1000 ? "/game-2" : "/"}
                >
                  <h3 className="text-2xl font-bold">Game 2: Cookie racer</h3>
                  <div className="text-lg">
                    {session.user.cookies > 1000
                      ? "Cookie racer"
                      : "Get 1000 cookies to unlock this game"}
                  </div>
                </Link>

                <Link
                  aria-disabled={session.user.cookies < 5000 ? "true" : "false"}
                  className={`flex max-w-xs flex-col gap-4 rounded-xl border-2 border-black p-4  ${
                    session.user.cookies > 5000
                      ? " hover:bg-black/20"
                      : "cursor-not-allowed bg-black/30"
                  }`}
                  href={session.user.cookies > 5000 ? "/game-3" : "/"}
                >
                  <h3 className="text-2xl font-bold">Game 3: Dalgona Cookie</h3>
                  <div className="text-lg">
                    {session.user.cookies > 5000
                      ? "Trace the cookie"
                      : "Get 5000 cookies to unlock this game"}
                  </div>
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
