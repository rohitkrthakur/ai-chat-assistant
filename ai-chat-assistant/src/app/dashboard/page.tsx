// app/dashboard/page.tsx
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

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

        {/* Chat history */}
        <CardContent className="p-4">
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="flex flex-col gap-3">
              {/* Example chat messages */}
              <div className="self-start bg-gray-200 text-black px-4 py-2 rounded-lg max-w-[70%]">
                Hey! How can I help you today?
              </div>
              <div className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg max-w-[70%]">
                I want to know about my account.
              </div>
            </div>
          </ScrollArea>
        </CardContent>

        {/* Chat input */}
        <div className="flex items-center gap-2 border-t p-3">
          <Input placeholder="Type your message..." className="flex-1" />
          <Button>Send</Button>
        </div>
      </Card>
    </main>
  )
}
