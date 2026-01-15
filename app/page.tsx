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
  const [useLetters, setUseLetters] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useEmojis, setUseEmojis] = useState(true)
  const [useSounds, setUseSounds] = useState(true)
  const [numErrors, setNumErrors] = useState(3)
  const [gameMode, setGameMode] = useState<"Zen" | "Normal" | "TimeChallenge" | "Journey">("Normal")
  const [timeLimit, setTimeLimit] = useState(60)

  useEffect(() => {
    const savedSize = localStorage.getItem("gameMatrixSize")
    const savedDifferences = localStorage.getItem("gameNumDifferences")
    const savedLetters = localStorage.getItem("gameUseLetters")
    const savedNumbers = localStorage.getItem("gameUseNumbers")
    const savedEmojis = localStorage.getItem("gameUseEmojis")
    const savedSounds = localStorage.getItem("gameUseSounds")
    const savedErrors = localStorage.getItem("gameNumErrors")
    const savedGameMode = localStorage.getItem("gameMode")
    const savedTimeLimit = localStorage.getItem("gameTimeLimit")

    if (savedSize) setMatrixSize(Number.parseInt(savedSize))
    if (savedDifferences) setNumDifferences(Number.parseInt(savedDifferences))
    if (savedLetters !== null) setUseLetters(JSON.parse(savedLetters))
    if (savedNumbers !== null) setUseNumbers(JSON.parse(savedNumbers))
    if (savedEmojis !== null) setUseEmojis(JSON.parse(savedEmojis))
    if (savedSounds !== null) setUseSounds(JSON.parse(savedSounds))
    if (savedErrors) setNumErrors(Number.parseInt(savedErrors))
    if (savedGameMode) setGameMode(savedGameMode as "Zen" | "Normal" | "TimeChallenge" | "Journey")
    if (savedTimeLimit) setTimeLimit(Number.parseInt(savedTimeLimit))
  }, [])

  useEffect(() => {
    localStorage.setItem("gameMatrixSize", matrixSize.toString())
  }, [matrixSize])

  useEffect(() => {
    localStorage.setItem("gameNumDifferences", numDifferences.toString())
  }, [numDifferences])

  useEffect(() => {
    localStorage.setItem("gameUseLetters", JSON.stringify(useLetters))
  }, [useLetters])

  useEffect(() => {
    localStorage.setItem("gameUseNumbers", JSON.stringify(useNumbers))
  }, [useNumbers])

  useEffect(() => {
    localStorage.setItem("gameUseEmojis", JSON.stringify(useEmojis))
  }, [useEmojis])

  useEffect(() => {
    localStorage.setItem("gameUseSounds", JSON.stringify(useSounds))
  }, [useSounds])

  useEffect(() => {
    localStorage.setItem("gameNumErrors", numErrors.toString())
  }, [numErrors])

  useEffect(() => {
    localStorage.setItem("gameMode", gameMode)
  }, [gameMode])

  useEffect(() => {
    localStorage.setItem("gameTimeLimit", timeLimit.toString())
  }, [timeLimit])

  const maxDifferences = Math.floor(matrixSize ** 2 / 2)

  const enabledSymbolCount = [useLetters, useNumbers, useEmojis].filter(Boolean).length

  const handlePlay = () => {
    if (gameMode === "Journey") {
      router.push("/journey")
      return
    }
    router.push(
      `/game?size=${matrixSize}&differences=${numDifferences}&letters=${useLetters}&numbers=${useNumbers}&emojis=${useEmojis}&sounds=${useSounds}&errors=${numErrors}&mode=${gameMode}&timeLimit=${timeLimit}`,
    )
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Game Mode</label>
              <div className="flex gap-2 flex-wrap justify-center">
                {["Zen", "Normal", "TimeChallenge", "Journey"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGameMode(mode as "Zen" | "Normal" | "TimeChallenge" | "Journey")}
                    className={`py-2 px-3 rounded-lg font-medium transition-all ${
                      gameMode === mode
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-white text-foreground border-2 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {mode === "TimeChallenge"
                      ? "⏲️ TC"
                      : mode === "Zen"
                        ? "😎 Zen"
                        : mode === "Journey"
                          ? "🏔️ Journey"
                          : mode}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handlePlay}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow"
            >
              Play
            </Button>

            <Button onClick={() => setIsSettingsOpen(true)} variant="outline" className="w-full py-6 text-lg font-bold">
              Settings
            </Button>

            <p className="text-xs text-muted-foreground mt-4">© 2026 Marcello Calabresi</p>
          </div>
        </div>
      </Card>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Game Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
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

            <div className="space-y-1">
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

            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">Number of Errors</label>
              <input
                type="range"
                min="1"
                max="10"
                value={numErrors}
                onChange={(e) => setNumErrors(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="text-center text-sm text-muted-foreground">{numErrors} / 10 errors allowed</div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">Time Limit (seconds)</label>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-center text-sm text-muted-foreground">{timeLimit} seconds</div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSounds}
                  onChange={(e) => setUseSounds(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-foreground">Sounds</span>
              </label>
            </div>

            <div className="space-y-3 border-t pt-4">
              <label className="block text-sm font-medium text-foreground">Symbols</label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useLetters}
                    onChange={(e) => setUseLetters(e.target.checked)}
                    disabled={useLetters && enabledSymbolCount === 1}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-foreground">Letters (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                    disabled={useNumbers && enabledSymbolCount === 1}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-foreground">Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useEmojis}
                    onChange={(e) => setUseEmojis(e.target.checked)}
                    disabled={useEmojis && enabledSymbolCount === 1}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-foreground">Emojis</span>
                </label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
