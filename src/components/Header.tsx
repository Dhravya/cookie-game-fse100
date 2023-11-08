import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';

function Header() {
    const { data: session } = useSession();

  return (
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
          {session.user.cookies}
        </div>
        <button className="ml-4" onClick={() => signOut()}>Logout</button>
      </div>
    ) : (
      <button onClick={() => signIn("google")}>Click here to log in</button>
    )}
  </div>
  )
}

export default Header