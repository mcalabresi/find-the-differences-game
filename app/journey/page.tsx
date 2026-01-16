"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Level coordinates for each section
const SECTION_COORDINATES = {
  1: [
    // Levels 1-10: Beach section - centered horizontally, spread vertically
    { level: 1, xCenter: 365, yCenter: 950 },
    { level: 2, xCenter: 365, yCenter: 850 },
    { level: 3, xCenter: 365, yCenter: 750 },
    { level: 4, xCenter: 365, yCenter: 650 },
    { level: 5, xCenter: 365, yCenter: 550 },
    { level: 6, xCenter: 365, yCenter: 450 },
    { level: 7, xCenter: 365, yCenter: 350 },
    { level: 8, xCenter: 365, yCenter: 250 },
    { level: 9, xCenter: 365, yCenter: 150 },
    { level: 10, xCenter: 365, yCenter: 50 },
  ],
  2: [
    // Levels 11-20: Forest section - centered horizontally, spread vertically
    { level: 11, xCenter: 365, yCenter: 950 },
    { level: 12, xCenter: 365, yCenter: 850 },
    { level: 13, xCenter: 365, yCenter: 750 },
    { level: 14, xCenter: 365, yCenter: 650 },
    { level: 15, xCenter: 365, yCenter: 550 },
    { level: 16, xCenter: 365, yCenter: 450 },
    { level: 17, xCenter: 365, yCenter: 350 },
    { level: 18, xCenter: 365, yCenter: 250 },
    { level: 19, xCenter: 365, yCenter: 150 },
    { level: 20, xCenter: 365, yCenter: 50 },
  ],
  3: [
    // Levels 21-30: Deep forest section - centered horizontally, spread vertically
    { level: 21, xCenter: 365, yCenter: 950 },
    { level: 22, xCenter: 365, yCenter: 850 },
    { level: 23, xCenter: 365, yCenter: 750 },
    { level: 24, xCenter: 365, yCenter: 650 },
    { level: 25, xCenter: 365, yCenter: 550 },
    { level: 26, xCenter: 365, yCenter: 450 },
    { level: 27, xCenter: 365, yCenter: 350 },
    { level: 28, xCenter: 365, yCenter: 250 },
    { level: 29, xCenter: 365, yCenter: 150 },
    { level: 30, xCenter: 365, yCenter: 50 },
  ],
  4: [
    // Levels 31-40: Mountain peak section - centered horizontally, spread vertically
    { level: 31, xCenter: 365, yCenter: 950 },
    { level: 32, xCenter: 365, yCenter: 850 },
    { level: 33, xCenter: 365, yCenter: 750 },
    { level: 34, xCenter: 365, yCenter: 650 },
    { level: 35, xCenter: 365, yCenter: 550 },
    { level: 36, xCenter: 365, yCenter: 450 },
    { level: 37, xCenter: 365, yCenter: 350 },
    { level: 38, xCenter: 365, yCenter: 250 },
    { level: 39, xCenter: 365, yCenter: 150 },
    { level: 40, xCenter: 365, yCenter: 50 },
  ],
}

const SECTION_IMAGES = {
  1: "/images/levels1_10.png",
  2: "/images/levels11_20.png",
  3: "/images/levels21_30.png",
  4: "/images/levels31_40.png",
}

const SECTION_TITLES = {
  1: "Beach Journey",
  2: "Forest Adventure",
  3: "Mountain Trail",
  4: "Peak Challenge",
}

export default function JourneyPage() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentSection, setCurrentSection] = useState(1)

  useEffect(() => {
    const savedLevel = localStorage.getItem("journeyCurrentLevel")
    if (savedLevel) {
      const level = Number.parseInt(savedLevel)
      setCurrentLevel(level)
      // Determine initial section based on current level
      setCurrentSection(Math.ceil(level / 10))
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

  // Navigation functions for section switching
  const goToPreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
    }
  }

  const goToNextSection = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1)
    }
  }

  const sectionLevels = SECTION_COORDINATES[currentSection as keyof typeof SECTION_COORDINATES] || []
  const sectionImage = SECTION_IMAGES[currentSection as keyof typeof SECTION_IMAGES]
  const sectionTitle = SECTION_TITLES[currentSection as keyof typeof SECTION_TITLES]

  // Determine if buttons should be enabled
  const canGoPrevious = currentSection > 1
  const canGoNext = currentSection < 4

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex flex-col items-center justify-center">
      <div className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="flex items-center justify-center gap-4 p-3 max-w-2xl mx-auto">
          <Button
            onClick={goToPreviousSection}
            disabled={!canGoPrevious}
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-transparent"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button onClick={handleHome} variant="outline" size="icon" className="h-10 w-10 bg-transparent">
            🏠
          </Button>

          <Button
            onClick={goToNextSection}
            disabled={!canGoNext}
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-transparent"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Map container with scrollable content */}
      <div className="flex-1 overflow-y-auto w-full max-w-2xl flex flex-col items-center p-4">
        <div
          className="relative w-full bg-cover bg-center rounded-lg border-2 border-primary/20"
          style={{
            backgroundImage: `url('${sectionImage}')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            aspectRatio: "730 / 1010",
            minHeight: "600px",
          }}
        >
          {/* Render level buttons for current section */}
          {sectionLevels.map(({ level, xCenter, yCenter }) => {
            const isCompleted = level < currentLevel
            const isAvailable = level <= currentLevel
            const buttonSize = 50

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
                      : "bg-white border-gray-400 text-gray-700 cursor-not-allowed opacity-60"
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
  )
}
