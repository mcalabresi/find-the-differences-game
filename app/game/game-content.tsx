"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Symbol = string
type GameState = {
  matrix1: Symbol[][]
  matrix2: Symbol[][]
  differences: Set<string>
  found: Set<string>
}

const SYMBOLS = [
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // A-Z
  ...Array.from({ length: 10 }, (_, i) => i.toString()), // 0-9
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
]

export default function GameContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const size = Number.parseInt(searchParams.get("size") || "4")
  const numDifferences = Number.parseInt(searchParams.get("differences") || "3")

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [foundCount, setFoundCount] = useState(0)
  const [gameWon, setGameWon] = useState(false)

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
  }, [size, numDifferences])

  const handleCellClick = (row: number, col: number) => {
    if (!gameState) return
    const key = `${row}-${col}`

    // Already found or not a difference
    if (gameState.found.has(key) || !gameState.differences.has(key)) return

    const newFound = new Set(gameState.found)
    newFound.add(key)
    setGameState({ ...gameState, found: newFound })
    setFoundCount(newFound.size)

    if (newFound.size === gameState.differences.size) {
      setGameWon(true)
    }
  }

  const handleReset = () => {
    router.push("/")
  }

  if (!gameState) return <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10" />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Find the Differences</h1>
          <p className="text-lg text-foreground">
            Found: <span className="font-bold text-accent">{foundCount}</span> / {gameState.differences.size}
          </p>
        </div>

        {/* Game Won Message */}
        {gameWon && (
          <Card className="bg-gradient-to-r from-accent to-secondary p-6 text-center border-2 border-accent">
            <h2 className="text-2xl font-bold text-foreground mb-4">🎉 You Won! 🎉</h2>
            <p className="text-foreground mb-4">You found all the differences!</p>
            <Button onClick={handleReset} className="bg-primary hover:bg-primary/90">
              Play Again
            </Button>
          </Card>
        )}

        {/* Matrices Container */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matrix 1 - Read Only */}
          <Card className="p-6">
            <h3 className="text-center font-bold text-foreground mb-4">Original</h3>
            <div className="flex justify-center">
              <div
                className="gap-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                }}
              >
                {gameState.matrix1.map((row, rowIdx) =>
                  row.map((symbol, colIdx) => (
                    <div
                      key={`m1-${rowIdx}-${colIdx}`}
                      className="flex items-center justify-center w-12 h-12 bg-card border-2 border-border rounded-lg text-lg font-bold text-foreground"
                    >
                      {symbol}
                    </div>
                  )),
                )}
              </div>
            </div>
          </Card>

          {/* Matrix 2 - Interactive */}
          <Card className="p-6">
            <h3 className="text-center font-bold text-foreground mb-4">Find Differences</h3>
            <div className="flex justify-center">
              <div
                className="gap-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                }}
              >
                {gameState.matrix2.map((row, rowIdx) =>
                  row.map((symbol, colIdx) => {
                    const key = `${rowIdx}-${colIdx}`
                    const isFound = gameState.found.has(key)
                    const isDifference = gameState.differences.has(key)

                    return (
                      <button
                        key={`m2-${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        disabled={isFound}
                        className={`flex items-center justify-center w-12 h-12 rounded-lg text-lg font-bold transition-all ${
                          isFound
                            ? "bg-accent text-accent-foreground ring-2 ring-accent shadow-lg scale-105"
                            : "bg-card border-2 border-border text-foreground hover:border-primary hover:shadow-md cursor-pointer"
                        }`}
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

        {/* Reset Button */}
        <div className="text-center">
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
          >
            Back to Setup
          </Button>
        </div>
      </div>
    </div>
  )
}
