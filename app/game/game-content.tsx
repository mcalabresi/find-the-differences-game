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
  const useLetters = searchParams.get("letters") !== "false"
  const useNumbers = searchParams.get("numbers") !== "false"
  const useEmojis = searchParams.get("emojis") !== "false"

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [foundCount, setFoundCount] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gridWidth, setGridWidth] = useState<number>(0)

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

  const handlePlayAgain = () => {
    setGameWon(false)
    setFoundCount(0)
    // Trigger re-initialization by updating game state
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
          <h1 className="text-2xl font-bold text-primary">Find the Differences</h1>
          <p className="text-lg text-foreground mx-4">
            Found: <span className="font-bold text-accent">{foundCount}</span> / {gameState.differences.size}
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            ⚙️
          </Button>
        </div>

        <Dialog open={gameWon} onOpenChange={setGameWon}>
          <DialogContent
            className="bg-gradient-to-r from-green-300 to-green-400 border-2 text-center border-green-400"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl text-foreground justify-center text-center">🎉 You Won! 🎉</DialogTitle>
              <DialogDescription className="text-foreground text-center">You found all the differences!</DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={handlePlayAgain} className="hover:bg-primary/90 bg-secondary">
                Play Again
              </Button>
              <Button onClick={() => router.push("/")} className="hover:bg-secondary/90 bg-chart-4">
                Close
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

                    return (
                      <button
                        key={`m2-${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        disabled={isFound}
                        className={`flex items-center justify-center rounded-lg font-bold transition-all border-0 leading-none ${
                          isFound
                            ? "bg-accent text-accent-foreground ring-2 ring-accent shadow-lg scale-105"
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
