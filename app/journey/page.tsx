"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const LEVEL_COORDINATES = [
  {
    level: 1,
    xCenter: 393,
    yCenter: 905,
  },
  {
    level: 2,
    xCenter: 520,
    yCenter: 868,
  },
  {
    level: 3,
    xCenter: 538,
    yCenter: 813,
  },
  {
    level: 4,
    xCenter: 463,
    yCenter: 792,
  },
  {
    level: 5,
    xCenter: 400,
    yCenter: 790,
  },
  {
    level: 6,
    xCenter: 343,
    yCenter: 786,
  },
  {
    level: 7,
    xCenter: 297,
    yCenter: 745,
  },
  {
    level: 8,
    xCenter: 246,
    yCenter: 743,
  },
  {
    level: 9,
    xCenter: 312,
    yCenter: 701,
  },
  {
    level: 10,
    xCenter: 375,
    yCenter: 701,
  },
  {
    level: 11,
    xCenter: 453,
    yCenter: 693,
  },
  {
    level: 12,
    xCenter: 510,
    yCenter: 690,
  },
  {
    level: 13,
    xCenter: 499,
    yCenter: 651,
  },
  {
    level: 14,
    xCenter: 426,
    yCenter: 634,
  },
  {
    level: 15,
    xCenter: 368,
    yCenter: 638,
  },
  {
    level: 16,
    xCenter: 300,
    yCenter: 632,
  },
  {
    level: 17,
    xCenter: 243,
    yCenter: 597,
  },
  {
    level: 18,
    xCenter: 295,
    yCenter: 566,
  },
  {
    level: 19,
    xCenter: 353,
    yCenter: 542,
  },
  {
    level: 20,
    xCenter: 399,
    yCenter: 538,
  },
  {
    level: 21,
    xCenter: 450,
    yCenter: 534,
  },
  {
    level: 22,
    xCenter: 497,
    yCenter: 476,
  },
  {
    level: 23,
    xCenter: 443,
    yCenter: 445,
  },
  {
    level: 24,
    xCenter: 380,
    yCenter: 448,
  },
  {
    level: 25,
    xCenter: 310,
    yCenter: 441,
  },
  {
    level: 26,
    xCenter: 266,
    yCenter: 403,
  },
  {
    level: 27,
    xCenter: 314,
    yCenter: 365,
  },
  {
    level: 28,
    xCenter: 374,
    yCenter: 362,
  },
  {
    level: 29,
    xCenter: 437,
    yCenter: 348,
  },
  {
    level: 30,
    xCenter: 490,
    yCenter: 321,
  },
  {
    level: 31,
    xCenter: 531,
    yCenter: 277,
  },
  {
    level: 32,
    xCenter: 439,
    yCenter: 243,
  },
  {
    level: 33,
    xCenter: 386,
    yCenter: 233,
  },
  {
    level: 34,
    xCenter: 341,
    yCenter: 231,
  },
  {
    level: 35,
    xCenter: 291,
    yCenter: 224,
  },
  {
    level: 36,
    xCenter: 246,
    yCenter: 195,
  },
  {
    level: 37,
    xCenter: 297,
    yCenter: 138,
  },
  {
    level: 38,
    xCenter: 358,
    yCenter: 158,
  },
  {
    level: 39,
    xCenter: 421,
    yCenter: 125,
  },
  {
    level: 40,
    xCenter: 393,
    yCenter: 78,
  },
]

export default function JourneyPage() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState(1)

  useEffect(() => {
    const savedLevel = localStorage.getItem("journeyCurrentLevel")
    if (savedLevel) {
      setCurrentLevel(Number.parseInt(savedLevel))
    }
  }, [])

  const getLevelParameters = (level: number) => {
    let size: number
    let differences: number
    let errors: number
    let mode: "Zen" | "Normal" | "Time Challenge"
    let timeLimit: number

    if (level <= 10) {
      // Levels 1-10: Zen mode with increasing size and decreasing differences
      mode = "Zen"
      errors = 10 // Unlimited errors in Zen mode (high value)
      timeLimit = 300 // 5 minutes

      if (level <= 2) {
        size = 3
        differences = 7
      } else if (level <= 4) {
        size = 4
        differences = 6
      } else if (level <= 6) {
        size = 5
        differences = 5
      } else if (level <= 8) {
        size = 6
        differences = 4
      } else {
        size = 7
        differences = 3
      }
    } else if (level <= 25) {
      // Levels 11-25: Normal mode with increasing size and decreasing errors
      mode = "Normal"
      timeLimit = 300 // Not used in Normal mode
      differences = 5

      if (level <= 12) {
        size = 4
        errors = 5
      } else if (level <= 14) {
        size = 5
        errors = 4
      } else if (level <= 16) {
        size = 6
        errors = 3
      } else if (level <= 18) {
        size = 7
        errors = 2
      } else {
        size = 8
        errors = 1
      }
    } else {
      // Levels 26-40: Time Challenge mode with escalating difficulty
      mode = "Time Challenge"
      differences = 3 // Minimum differences
      errors = Math.max(1, 5 - Math.floor((level - 25) / 3))

      if (level <= 27) {
        size = 4
        timeLimit = 120
      } else if (level <= 29) {
        size = 5
        timeLimit = 100
      } else if (level <= 31) {
        size = 6
        timeLimit = 80
      } else if (level <= 33) {
        size = 7
        timeLimit = 60
      } else if (level <= 35) {
        size = 8
        timeLimit = 40
      } else if (level <= 37) {
        size = 8
        timeLimit = 25
      } else {
        size = 8
        timeLimit = Math.max(5, 20 - (level - 37) * 5) // Minimum 5 seconds
      }
    }

    return {
      size,
      differences,
      errors,
      mode,
      timeLimit,
    }
  }

  const handleLevelClick = (level: number) => {
    if (level <= currentLevel) {
      const { size, differences, errors, mode, timeLimit } = getLevelParameters(level)

      router.push(
        `/game?size=${size}&differences=${differences}&letters=true&numbers=true&emojis=true&sounds=true&errors=${errors}&mode=${mode}&timeLimit=${timeLimit}&level=${level}`,
      )
    }
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="flex flex-col" style={{ width: "730px", maxWidth: "calc(100vw - 32px)", height: "100vh" }}>
        <div className="sticky top-0 z-10 flex justify-end p-2 bg-gradient-to-b from-primary/10 to-transparent">
          <Button onClick={handleHome} variant="outline" size="sm">
            🏠 Home
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div
            className="journey-container relative bg-cover bg-center mx-0"
            style={{
              backgroundImage: `url('/images/game-levels-2.png')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top center",
              width: "100%",
              aspectRatio: "730 / 1010",
            }}
          >
            {/* Level Buttons */}
            {LEVEL_COORDINATES.map(({ level, xCenter, yCenter }) => {
              const isCompleted = level < currentLevel
              const isAvailable = level <= currentLevel
              const buttonSize = 32

              return (
                <button
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  disabled={!isAvailable}
                  className={`absolute rounded-full font-bold transition-all transform -translate-x-1/2 -translate-y-1/2 border-2 flex items-center justify-center text-xs ${
                    isCompleted
                      ? "bg-green-500 border-green-600 text-white shadow-lg scale-110 hover:scale-125"
                      : isAvailable
                        ? "bg-blue-500 border-blue-600 text-white shadow-lg hover:scale-110 cursor-pointer"
                        : "bg-white border-gray-400 text-gray-700 cursor-not-allowed opacity-60" // changed disabled button background from gray-400 to white
                  }`}
                  style={{
                    left: `${(xCenter / 730) * 100}%`,
                    top: `${(yCenter / 1010) * 100}%`,
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    fontSize: "12px",
                  }}
                  title={`Level ${level}${isCompleted ? " (Completed)" : isAvailable ? " (Available)" : " (Locked)"}`}
                >
                  {level}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
