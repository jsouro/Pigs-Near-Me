import { useEffect, useRef, useState } from 'react'

const WIDTH = 880
const HEIGHT = 320
const GROUND_Y = 270
const PIG_X = 90
const PIG_SIZE = 56
const GRAVITY = 2200
const JUMP_VELOCITY = -860
const BASE_SPEED = 320
const MAX_SPEED = 620
const RESTART_DELAY_MS = 450
const BEST_SCORE_KEY = 'pigs-near-me:truffle-trot-best'

const EMOJI_FONT = '"Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif'

type Phase = 'ready' | 'running' | 'over'

type Obstacle = { x: number; size: number; emoji: string }
type Apple = { x: number; y: number; taken: boolean }
type Cloud = { x: number; y: number; size: number }

type GameState = {
  pigY: number
  pigVy: number
  speed: number
  score: number
  distance: number
  nextObstacleIn: number
  nextAppleIn: number
  obstacles: Obstacle[]
  apples: Apple[]
  clouds: Cloud[]
  overAt: number
}

function freshState(): GameState {
  return {
    pigY: GROUND_Y,
    pigVy: 0,
    speed: BASE_SPEED,
    score: 0,
    distance: 0,
    nextObstacleIn: 520,
    nextAppleIn: 900,
    obstacles: [],
    apples: [],
    clouds: [
      { x: 140, y: 70, size: 38 },
      { x: 430, y: 46, size: 30 },
      { x: 720, y: 88, size: 44 },
    ],
    overAt: 0,
  }
}

function readBestScore(): number {
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_KEY)
    const parsed = raw === null ? 0 : Number.parseInt(raw, 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  } catch {
    return 0
  }
}

function saveBestScore(score: number) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score))
  } catch {
    // Private browsing or blocked storage: best score just won't persist.
  }
}

// Hitboxes are shrunk relative to the drawn glyph so near misses feel fair.
function entityBox(x: number, bottomY: number, size: number) {
  return {
    left: x + size * 0.14,
    right: x + size * 0.86,
    top: bottomY - size * 0.8,
    bottom: bottomY - size * 0.05,
  }
}

type Box = ReturnType<typeof entityBox>

function boxesOverlap(a: Box, b: Box) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function PigGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const stateRef = useRef<GameState>(freshState())
  const phaseRef = useRef<Phase>('ready')
  const bestRef = useRef(0)

  const [phase, setPhase] = useState<Phase>('ready')
  const [finalScore, setFinalScore] = useState(0)
  const [best, setBest] = useState(0)

  useEffect(() => {
    bestRef.current = readBestScore()
    setBest(bestRef.current)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const frame = frameRef.current
    if (!canvas || !frame) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    context.scale(dpr, dpr)

    const setGamePhase = (next: Phase) => {
      phaseRef.current = next
      setPhase(next)
    }

    const start = () => {
      stateRef.current = freshState()
      setGamePhase('running')
    }

    const jump = () => {
      const game = stateRef.current
      if (game.pigY >= GROUND_Y - 1) {
        game.pigVy = JUMP_VELOCITY
      }
    }

    const handleAction = () => {
      if (phaseRef.current === 'ready') {
        start()
      } else if (phaseRef.current === 'running') {
        jump()
      } else if (performance.now() - stateRef.current.overAt > RESTART_DELAY_MS) {
        start()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault()
      frame.focus()
      handleAction()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return
      }
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'Enter') {
        event.preventDefault()
        handleAction()
      }
    }

    frame.addEventListener('pointerdown', onPointerDown)
    frame.addEventListener('keydown', onKeyDown)

    const endRun = () => {
      const game = stateRef.current
      game.overAt = performance.now()
      const score = Math.floor(game.score)
      if (score > bestRef.current) {
        bestRef.current = score
        setBest(score)
        saveBestScore(score)
      }
      setFinalScore(score)
      setGamePhase('over')
    }

    const update = (dt: number) => {
      const game = stateRef.current

      game.speed = Math.min(MAX_SPEED, game.speed + dt * 9)
      game.distance += game.speed * dt
      game.score += dt * 10

      game.pigVy += GRAVITY * dt
      game.pigY = Math.min(GROUND_Y, game.pigY + game.pigVy * dt)
      if (game.pigY === GROUND_Y) {
        game.pigVy = 0
      }

      game.nextObstacleIn -= game.speed * dt
      if (game.nextObstacleIn <= 0) {
        const useTractor = game.score > 30 && Math.random() < 0.3
        game.obstacles.push({
          x: WIDTH + 40,
          size: useTractor ? 64 : 46,
          emoji: useTractor ? '🚜' : '🪵',
        })
        game.nextObstacleIn = 340 + Math.random() * 280 + game.speed * 0.32
      }

      game.nextAppleIn -= game.speed * dt
      if (game.nextAppleIn <= 0) {
        game.apples.push({
          x: WIDTH + 40,
          y: GROUND_Y - 92 - Math.random() * 56,
          taken: false,
        })
        game.nextAppleIn = 700 + Math.random() * 900
      }

      for (const obstacle of game.obstacles) {
        obstacle.x -= game.speed * dt
      }
      for (const apple of game.apples) {
        apple.x -= game.speed * dt
      }
      game.obstacles = game.obstacles.filter((obstacle) => obstacle.x > -100)
      game.apples = game.apples.filter((apple) => apple.x > -60 && !apple.taken)

      for (const cloud of game.clouds) {
        cloud.x -= game.speed * 0.25 * dt
        if (cloud.x < -80) {
          cloud.x = WIDTH + 60
          cloud.y = 40 + Math.random() * 60
        }
      }

      const pigBox = entityBox(PIG_X, game.pigY, PIG_SIZE)
      for (const obstacle of game.obstacles) {
        if (boxesOverlap(pigBox, entityBox(obstacle.x, GROUND_Y, obstacle.size))) {
          endRun()
          return
        }
      }
      for (const apple of game.apples) {
        if (!apple.taken && boxesOverlap(pigBox, entityBox(apple.x, apple.y, 34))) {
          apple.taken = true
          game.score += 30
        }
      }
    }

    const drawEmoji = (emoji: string, x: number, bottomY: number, size: number, mirror = false) => {
      context.save()
      context.font = `${size}px ${EMOJI_FONT}`
      context.textAlign = 'center'
      context.textBaseline = 'bottom'
      context.translate(x + size / 2, bottomY)
      if (mirror) {
        context.scale(-1, 1)
      }
      context.fillText(emoji, 0, 4)
      context.restore()
    }

    const draw = () => {
      const game = stateRef.current

      const sky = context.createLinearGradient(0, 0, 0, HEIGHT)
      sky.addColorStop(0, '#fff7fa')
      sky.addColorStop(1, '#ffe7f1')
      context.fillStyle = sky
      context.fillRect(0, 0, WIDTH, HEIGHT)

      for (const cloud of game.clouds) {
        drawEmoji('☁️', cloud.x, cloud.y, cloud.size)
      }

      context.fillStyle = '#fadcea'
      context.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y)
      context.strokeStyle = '#e9b3cd'
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(0, GROUND_Y)
      context.lineTo(WIDTH, GROUND_Y)
      context.stroke()

      context.fillStyle = '#e9b3cd'
      const dashOffset = game.distance % 64
      for (let x = -dashOffset; x < WIDTH; x += 64) {
        context.fillRect(x, GROUND_Y + 18, 26, 3)
      }

      for (const obstacle of game.obstacles) {
        drawEmoji(obstacle.emoji, obstacle.x, GROUND_Y, obstacle.size)
      }
      for (const apple of game.apples) {
        drawEmoji('🍎', apple.x, apple.y, 34)
      }

      const bob =
        game.pigY >= GROUND_Y - 1 && phaseRef.current === 'running'
          ? Math.sin(game.distance / 26) * 2.5
          : 0
      drawEmoji('🐖', PIG_X, game.pigY + bob, PIG_SIZE, true)

      context.fillStyle = '#7c1e49'
      context.font = '600 19px Outfit, sans-serif'
      context.textAlign = 'right'
      context.textBaseline = 'top'
      context.fillText(`Score ${Math.floor(game.score)}`, WIDTH - 20, 16)
      if (bestRef.current > 0) {
        context.fillStyle = '#b07b94'
        context.font = '500 15px Outfit, sans-serif'
        context.fillText(`Best ${bestRef.current}`, WIDTH - 20, 42)
      }
    }

    let rafId = 0
    let lastTime = performance.now()

    const tick = (time: number) => {
      // Clamp dt so backgrounded tabs don't teleport the pig into a log.
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      if (phaseRef.current === 'running') {
        update(dt)
      }
      draw()
      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(rafId)
      frame.removeEventListener('pointerdown', onPointerDown)
      frame.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div
      ref={frameRef}
      className="game-frame"
      tabIndex={0}
      role="application"
      aria-label="Truffle Trot, a side-scrolling pig jumping game. Tap, click, or press space to make the pig jump over obstacles and collect apples."
    >
      <canvas ref={canvasRef} className="game-canvas" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }} />

      {phase === 'ready' ? (
        <div className="game-overlay">
          <p className="game-overlay-title">🐖 Truffle Trot</p>
          <p>Hop over logs and tractors, snag apples for bonus points.</p>
          <p className="game-overlay-hint">Tap, click, or press space to start</p>
        </div>
      ) : null}

      {phase === 'over' ? (
        <div className="game-overlay">
          <p className="game-overlay-title">Oops, mud bath! 🛁</p>
          <p>
            You scored <strong>{finalScore}</strong>
            {finalScore >= best && best > 0 ? ' — new best!' : best > 0 ? ` · best ${best}` : ''}
          </p>
          <p className="game-overlay-hint">Tap or press space to trot again</p>
        </div>
      ) : null}
    </div>
  )
}

export default PigGame
