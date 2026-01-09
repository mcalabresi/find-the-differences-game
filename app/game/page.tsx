import { Suspense } from "react"
import GameContent from "./game-content"

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10" />}>
      <GameContent />
    </Suspense>
  )
}
