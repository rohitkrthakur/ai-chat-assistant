"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name}</h1>
      <p className="mt-2 text-gray-700">You’re signed in with {session?.user?.email}</p>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-6 px-4 py-2 bg-gray-500 hover:bg-red-600 text-white rounded-lg"
      >
        Log out
      </button>
    </div>
  )
}
