import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OAuthButtons } from "./OAuthButtons"

export function LoginCard() {
  return (
    <Card className="w-full max-w-md mx-auto lg:mx-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-base">
          Sign in to access your AI assistant and chat history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OAuthButtons />
      </CardContent>
    </Card>
  )
}