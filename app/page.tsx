"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Home() {
  const router = useRouter()
  const [matrixSize, setMatrixSize] = useState(4)
  const [numDifferences, setNumDifferences] = useState(3)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    const savedSize = localStorage.getItem("gameMatrixSize")
    const savedDifferences = localStorage.getItem("gameNumDifferences")

    if (savedSize) setMatrixSize(Number.parseInt(savedSize))
    if (savedDifferences) setNumDifferences(Number.parseInt(savedDifferences))
  }, [])

  useEffect(() => {
    localStorage.setItem("gameMatrixSize", matrixSize.toString())
  }, [matrixSize])

  useEffect(() => {
    localStorage.setItem("gameNumDifferences", numDifferences.toString())
  }, [numDifferences])

  const maxDifferences = Math.floor(matrixSize ** 2 / 2)

  const handlePlay = () => {
    router.push(`/game?size=${matrixSize}&differences=${numDifferences}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Find the Differences</h1>
          <img
            src="/images/gemini-generated-image-5bdcfn5bdcfn5bdc.png"
            alt="Detective character with magnifying glass"
            className="w-48 h-48 mx-auto mb-6 rounded-lg"
          />
          <p className="text-muted-foreground mb-8">Spot all the differences between the two matrices!</p>

          <div className="space-y-4">
            {/* Play Button */}
            <Button
              onClick={handlePlay}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow"
            >
              Play
            </Button>

            <Button onClick={() => setIsSettingsOpen(true)} variant="outline" className="w-full py-6 text-lg font-bold">
              Settings
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Game Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Matrix Size Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Matrix Size</label>
              <div className="flex gap-2">
                {[3, 4, 5, 6, 8].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setMatrixSize(size)
                      setNumDifferences(3)
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      matrixSize === size
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Differences Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Number of Differences</label>
              <input
                type="range"
                min="1"
                max={maxDifferences}
                value={numDifferences}
                onChange={(e) => setNumDifferences(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-center text-sm text-muted-foreground">
                {numDifferences} / {maxDifferences} differences
              </div>
            </div>

            <Button onClick={() => setIsSettingsOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
