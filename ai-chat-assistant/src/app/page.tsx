
import Header from "@/components/layout/Header";
import { FeatureList } from "@/components/features/FeatureList"
import { LoginCard } from "@/components/auth/LoginCard";


export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
  <div className="max-w-4xl w-full">
   <Header/>
   <div className="grid lg:grid-cols-2 gap-8 items-center">
  
    <FeatureList />
    <LoginCard/>
   </div>
  </div>
    </div>
  )
}