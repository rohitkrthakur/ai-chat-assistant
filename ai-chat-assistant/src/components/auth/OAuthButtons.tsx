import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export function OAuthButtons() {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 text-gray-900"
      >
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </Button>

      <Button
        className="w-full h-12 flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white"
      >
        <FaGithub className="w-5 h-5" />
        Continue with GitHub
      </Button>
    </div>
  )
}
