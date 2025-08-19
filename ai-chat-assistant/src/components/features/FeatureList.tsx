import { FeatureItem } from "./FeatureItem"
import { Zap, MessageSquare, Shield } from "lucide-react"

export function FeatureList() {
  return (
    <section className="flex flex-col gap-8">

      <FeatureItem 
        icon={Shield}
        title="Secure Authentication"
        description="Sign in with Google or GitHub without worrying about security."
        isHighlighted
      />


      <FeatureItem 
        icon={Zap}
        title="Real-time Tools"
        description="Access live weather updates, F1 race details, and stock prices instantly."
      />


      <FeatureItem 
        icon={MessageSquare}
        title="Chat History"
        description="Pick up where you left off — your chats are stored safely."
      />
    </section>
  )
}
