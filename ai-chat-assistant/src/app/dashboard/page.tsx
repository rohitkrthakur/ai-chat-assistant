"use client"
export const dynamic = "force-dynamic"

import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ChatInterface from "@/components/features/chat-interface"
import Image from "next/image"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // redirect to home if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>
  }

  const { name, image } = session?.user ?? {}

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-3">
            {image && (
              <Image
                src={image}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
                unoptimized
              />
            )}
            <h2 className="text-lg font-semibold">Hello, {name} 👋</h2>
          </div>

          {/* Logout button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </Button>
        </CardHeader>

        <ChatInterface />
      </Card>
    </main>
  )
}
