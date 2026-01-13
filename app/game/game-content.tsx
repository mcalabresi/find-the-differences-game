"use client"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Symbol = string
type GameState = {
  matrix1: Symbol[][]
  matrix2: Symbol[][]
  differences: Set<string>
  found: Set<string>
}

const buildSymbolsArray = (useLetters: boolean, useNumbers: boolean, useEmojis: boolean): string[] => {
  const symbols: string[] = []

  if (useLetters) {
    symbols.push(...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)))
  }

  if (useNumbers) {
    symbols.push(...Array.from({ length: 10 }, (_, i) => i.toString()))
  }

  if (useEmojis) {
    symbols.push(
      "😀",
      "😂",
      "🎉",
      "🚀",
      "💡",
      "🎨",
      "⭐",
      "🌟",
      "💎",
      "🎭",
      "🎪",
      "🎸",
      "🎮",
      "🍕",
      "🍔",
      "🐶",
      "🐱",
      "🦁",
      "🐘",
      "🦋",
      "🌈",
      "🔥",
      "❄️",
      "⚡",
      "🌸",
      "🌺",
      "🍎",
      "🍊",
      "🍋",
      "🍌",
    )
  }

  return symbols
}

export default function GameContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const size = Number.parseInt(searchParams.get("size") || "4")
  const numDifferences = Number.parseInt(searchParams.get("differences") || "3")
  const numErrors = Number.parseInt(searchParams.get("errors") || "3")
  const useLetters = searchParams.get("letters") !== "false"
  const useNumbers = searchParams.get("numbers") !== "false"
  const useEmojis = searchParams.get("emojis") !== "false"
  const useSounds = searchParams.get("sounds") !== "false"
  const gameMode = (searchParams.get("mode") || "Normal") as "Zen" | "Normal" | "TimeChallenge"
  const timeLimit = Number.parseInt(searchParams.get("timeLimit") || "60")

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [foundCount, setFoundCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const [gridWidth, setGridWidth] = useState<number>(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [victoryAudio, setVictoryAudio] = useState<HTMLAudioElement | null>(null)
  const [errorAudio, setErrorAudio] = useState<HTMLAudioElement | null>(null)
  const [errorCell, setErrorCell] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)

  useEffect(() => {
    const audioElement = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/correct-IPaMrjsFEJ9kqYNPOGBow7AmUb81N4.mp3")
    setAudio(audioElement)

    const victoryAudioElement = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/victory-L467P0DmZCnSmbVcrRqoOEsndA6Ree.mp3")
    setVictoryAudio(victoryAudioElement)

    const errorAudioElement = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wrong_answer-ja2dIoM4JBHwzEFDw83ZXj4r3eNp0l.mp3")
    setErrorAudio(errorAudioElement)
  }, [])

  useEffect(() => {
    if (gameMode !== "TimeChallenge" || gameWon || gameLost) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameLost(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameMode, gameWon, gameLost])

  const SYMBOLS = useMemo(
    () => buildSymbolsArray(useLetters, useNumbers, useEmojis),
    [useLetters, useNumbers, useEmojis],
  )

  // Initialize game
  useEffect(() => {
    const matrix1: Symbol[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]),
    )

    // Deep copy for matrix2
    const matrix2 = matrix1.map((row) => [...row])

    // Create differences
    const differences = new Set<string>()
    const diffSet = new Set<number>()
    while (diffSet.size < numDifferences) {
      const randomIdx = Math.floor(Math.random() * (size * size))
      if (!diffSet.has(randomIdx)) {
        diffSet.add(randomIdx)
        const row = Math.floor(randomIdx / size)
        const col = randomIdx % size
        let randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        while (randomSymbol === matrix2[row][col]) {
          randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        }
        matrix2[row][col] = randomSymbol
        differences.add(`${row}-${col}`)
      }
    }

    setGameState({
      matrix1,
      matrix2,
      differences,
      found: new Set(),
    })
  }, [size, numDifferences, SYMBOLS])

  useEffect(() => {
    const calculateGridWidth = () => {
      const clientWidth = document.documentElement.clientWidth
      const clientHeight = document.documentElement.clientHeight

      let calculatedWidth: number
      if (clientWidth > clientHeight) {
        // Landscape: clientWidth / (2 * size + 4)
        calculatedWidth = clientWidth / (2 * size + 4)
      } else {
        // Portrait: clientWidth / (size + 2)
        calculatedWidth = clientWidth / (size + 2)
      }

      setGridWidth(calculatedWidth)
    }

    calculateGridWidth()
    window.addEventListener("resize", calculateGridWidth)
    return () => window.removeEventListener("resize", calculateGridWidth)
  }, [size])

  const handleCellClick = (row: number, col: number) => {
    if (!gameState) return
    const key = `${row}-${col}`

    if (gameState.matrix1[row][col] === gameState.matrix2[row][col]) {
      if (useSounds && errorAudio) {
        errorAudio.currentTime = 0
        const playPromise = errorAudio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("[v0] Error audio play failed:", error)
          })
        }
      }
      // Trigger error animation
      setErrorCell(key)
      setTimeout(() => setErrorCell(null), 500)

      if (gameMode !== "Zen") {
        const newErrorCount = errorCount + 1
        setErrorCount(newErrorCount)

        if (numErrors > 0 && newErrorCount >= numErrors) {
          setGameLost(true)
        }
      }
      return
    }

    // Already found or not a difference
    if (gameState.found.has(key) || !gameState.differences.has(key)) return

    const newFound = new Set(gameState.found)
    newFound.add(key)

    const isLastDifference = newFound.size === gameState.differences.size

    if (gameMode === "TimeChallenge") {
      setTimeRemaining((prev) => prev + 3)
    }

    if (!isLastDifference && useSounds && audio) {
      audio.currentTime = 0
      audio.play().catch(() => {
        // Silently ignore errors if audio can't play
      })
    }

    setGameState({ ...gameState, found: newFound })
    setFoundCount(newFound.size)

    if (isLastDifference) {
      if (useSounds && victoryAudio) {
        victoryAudio.currentTime = 0
        victoryAudio.play().catch(() => {
          // Silently ignore errors if audio can't play
        })
      }
      setGameWon(true)
    }
  }

  const handlePlayAgain = () => {
    setGameWon(false)
    setGameLost(false)
    setFoundCount(0)
    setErrorCount(0)
    setTimeRemaining(timeLimit)
    const matrix1: Symbol[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]),
    )

    // Deep copy for matrix2
    const matrix2 = matrix1.map((row) => [...row])

    // Create differences
    const differences = new Set<string>()
    const diffSet = new Set<number>()
    while (diffSet.size < numDifferences) {
      const randomIdx = Math.floor(Math.random() * (size * size))
      if (!diffSet.has(randomIdx)) {
        diffSet.add(randomIdx)
        const row = Math.floor(randomIdx / size)
        const col = randomIdx % size
        let randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        while (randomSymbol === matrix2[row][col]) {
          randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        }
        matrix2[row][col] = randomSymbol
        differences.add(`${row}-${col}`)
      }
    }

    setGameState({
      matrix1,
      matrix2,
      differences,
      found: new Set(),
    })
  }

  if (!gameState) return <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10" />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-2 md:p-4">
      <div className="space-y-6 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2 lg:px-4">
          <Button onClick={() => router.push("/")} variant="outline">
            🏠
          </Button>
          {gameMode === "TimeChallenge" && (
            <div className="text-xl font-bold text-foreground">
              ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>

        {/* Differences Display */}
        <div className="flex justify-center px-2 lg:px-4">
          <div className="flex flex-wrap gap-2 items-center justify-center max-w-lg">
            {Array.from({ length: gameState.differences.size }).map((_, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full transition-colors border-2 border-solid border-green-500 ${idx < foundCount ? "bg-accent" : "bg-white"}`}
              />
            ))}
          </div>
        </div>

        {/* Errors Display - Show in Normal and Time Challenge modes */}
        {(gameMode === "Normal" || gameMode === "TimeChallenge") && numErrors > 0 && (
          <div className="flex justify-center px-2 lg:px-4">
            <div className="flex flex-wrap gap-2 items-center justify-center max-w-lg">
              {Array.from({ length: numErrors }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 flex items-center justify-center font-bold text-sm transition-colors ${idx < errorCount ? "text-red-600 bg-red-100 border-2 border-red-600" : "text-gray-400 bg-gray-100 border-2 border-gray-400"} rounded`}
                >
                  X
                </div>
              ))}
            </div>
          </div>
        )}

        <Dialog open={gameWon} onOpenChange={setGameWon}>
          <DialogContent
            className="bg-gradient-to-r from-green-300 to-green-400 border-2 text-center border-green-400"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl text-foreground justify-center text-center">🎉 You Won! 🎉</DialogTitle>
              <DialogDescription className="text-foreground text-center">
                You found all the differences!
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={handlePlayAgain} className="hover:bg-primary/90 bg-secondary">
                Play Again
              </Button>
              <Button onClick={() => router.push("/")} className="hover:bg-secondary/90 bg-chart-4">
                Home
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Game Over Dialog - Shows for Zen, Normal mode errors, or Time Challenge timeout */}
        <Dialog open={gameLost} onOpenChange={setGameLost}>
          <DialogContent
            className="bg-gradient-to-r from-red-400 to-red-500 border-2 text-center border-red-500"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl text-foreground justify-center text-center">
                💔 Game Over! 💔
              </DialogTitle>
              <DialogDescription className="text-foreground text-center">
                {gameMode === "TimeChallenge" && timeRemaining <= 0
                  ? "Time's up!"
                  : "You reached the maximum number of errors!"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={handlePlayAgain} className="hover:bg-primary/90 bg-secondary">
                Play Again
              </Button>
              <Button onClick={() => router.push("/")} className="hover:bg-secondary/90 bg-chart-4">
                Home
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Matrices Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 lg:px-4 overflow-hidden">
          {/* Matrix 1 - Read Only */}
          <Card className="p-6 flex flex-col items-center overflow-x-auto px-6 border">
            <div className="flex justify-center min-w-0">
              <div
                className="gap-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                  width: `${gridWidth * size + (size - 1) * 4}px`,
                }}
              >
                {gameState.matrix1.map((row, rowIdx) =>
                  row.map((symbol, colIdx) => (
                    <div
                      key={`m1-${rowIdx}-${colIdx}`}
                      className="flex items-center justify-center bg-card border-border rounded-lg font-bold text-foreground border-0 aspect-square"
                      style={{
                        width: `${gridWidth}px`,
                        height: `${gridWidth}px`,
                        fontSize: `${Math.max(12, gridWidth * 0.5)}px`,
                      }}
                    >
                      {symbol}
                    </div>
                  )),
                )}
              </div>
            </div>
          </Card>

          {/* Matrix 2 - Interactive */}
          <Card className="p-6 flex flex-col items-center overflow-x-auto">
            <div className="flex justify-center min-w-0">
              <div
                className="gap-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                  width: `${gridWidth * size + (size - 1) * 4}px`,
                }}
              >
                {gameState.matrix2.map((row, rowIdx) =>
                  row.map((symbol, colIdx) => {
                    const key = `${rowIdx}-${colIdx}`
                    const isFound = gameState.found.has(key)
                    const isDifference = gameState.differences.has(key)
                    const isError = errorCell === key

                    return (
                      <button
                        key={`m2-${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        disabled={isFound}
                        className={`flex items-center justify-center rounded-lg font-bold transition-all border-0 leading-none ${
                          isError
                            ? "bg-red-500 text-red-foreground animate-error-flash"
                            : isFound
                              ? "bg-accent text-accent-foreground border-2 border-accent shadow-lg scale-105"
                              : "bg-card border-2 border-border text-foreground hover:border-primary hover:shadow-md cursor-pointer"
                        }`}
                        style={{
                          width: `${gridWidth}px`,
                          height: `${gridWidth}px`,
                          fontSize: `${Math.max(12, gridWidth * 0.5)}px`,
                        }}
                      >
                        {symbol}
                      </button>
                    )
                  }),
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
