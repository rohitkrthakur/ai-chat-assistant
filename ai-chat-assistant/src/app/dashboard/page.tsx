// app/dashboard/page.tsx
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ChatInterface from "@/components/features/chat-interface"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  const { name, image } = session.user ?? {}

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-3">
            {image && (
              <img
                src={image}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}
            <h2 className="text-lg font-semibold">Hello, {name} 👋</h2>
          </div>

          {/* Logout button */}
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <Button variant="destructive" size="sm" type="submit">
              Logout
            </Button>
          </form>
        </CardHeader>

        {/* Chat Interface Component */}
        <ChatInterface />
      </Card>
    </main>
  )
}