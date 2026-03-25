import { useState, useEffect, useCallback } from "react"
import ShaderBackground from "@/components/ShaderBackground"
import Icon from "@/components/ui/icon"

// ─── Персонажи-помощники ───────────────────────────────────────────────────
interface CharacterProps {
  name: "ваня" | "василиса" | "умник"
  text: string
}

const CHARACTER_CONFIG = {
  ваня: { emoji: "🧒", color: "from-blue-400 to-blue-600", label: "Ваня" },
  василиса: { emoji: "👧", color: "from-pink-400 to-rose-500", label: "Василиса" },
  умник: { emoji: "🤖", color: "from-emerald-400 to-teal-600", label: "Умник" },
}

function Character({ name, text }: CharacterProps) {
  const cfg = CHARACTER_CONFIG[name]
  return (
    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 max-w-sm">
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}
      >
        {cfg.emoji}
      </div>
      <div>
        <div className="text-white/60 text-xs font-medium mb-1">{cfg.label}</div>
        <p className="text-white text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

// ─── Счётчик звёзд ────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 bg-yellow-400/20 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-400/30">
      <span className="text-yellow-300 text-lg">⭐</span>
      <span className="text-yellow-200 font-bold text-lg">{count}</span>
    </div>
  )
}

// ─── Кнопка ──────────────────────────────────────────────────────────────
function Btn({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "outline" | "success" | "danger"
  disabled?: boolean
}) {
  const variants = {
    primary: "bg-white text-green-900 hover:bg-white/90",
    outline: "bg-white/10 border border-white/30 text-white hover:bg-white/20",
    success: "bg-emerald-500 text-white hover:bg-emerald-400",
    danger: "bg-rose-500 text-white hover:bg-rose-400",
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-40 ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

// ─── Слайд-обёртка ───────────────────────────────────────────────────────
function Slide({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      className={`min-h-screen flex flex-col ${center ? "items-center justify-center" : "justify-between"} p-8 relative z-10`}
    >
      {children}
    </div>
  )
}

// ─── Прогресс-бар слайдов ─────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
      <span className="text-white/60 text-xs">
        {current + 1} / {total}
      </span>
    </div>
  )
}

// ─── Игра: классификация ──────────────────────────────────────────────────
function ClassifyGame({
  onSuccess,
  items,
  categories,
  title,
}: {
  onSuccess: () => void
  items: { label: string; emoji: string; category: string }[]
  categories: string[]
  title: string
}) {
  const [placed, setPlaced] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [allCorrect, setAllCorrect] = useState(false)

  const handlePlace = (item: string, cat: string) => {
    if (checked) return
    setPlaced((p) => ({ ...p, [item]: cat }))
  }

  const checkAnswers = () => {
    const correct = items.every((i) => placed[i.label] === i.category)
    setAllCorrect(correct)
    setChecked(true)
    if (correct) setTimeout(onSuccess, 1500)
  }

  return (
    <div className="space-y-4">
      <p className="text-white/80 text-sm font-medium">{title}</p>
      <div className="flex gap-3 flex-wrap">
        {items.map((it) => {
          const isPlaced = !!placed[it.label]
          return (
            <div key={it.label} className="flex flex-col items-center gap-1">
              <div
                className={`text-3xl p-3 rounded-xl cursor-pointer transition-all ${isPlaced ? "opacity-40 scale-90" : "bg-white/10 hover:bg-white/20 hover:scale-110"} border border-white/20`}
              >
                {it.emoji}
              </div>
              <span className="text-white/70 text-xs">{it.label}</span>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const inCat = items.filter((i) => placed[i.label] === cat)
          return (
            <div
              key={cat}
              onDragOver={(e) => e.preventDefault()}
              className="min-h-20 border-2 border-dashed border-white/30 rounded-2xl p-3 bg-white/5"
            >
              <p className="text-white/60 text-xs font-medium mb-2">{cat}</p>
              <div className="flex gap-2 flex-wrap">
                {items
                  .filter((i) => !placed[i.label])
                  .slice(0, 3)
                  .map((item) => (
                    <button
                      key={item.label + cat}
                      onClick={() => handlePlace(item.label, cat)}
                      className="text-xl hover:scale-110 transition-transform"
                    >
                      {item.emoji}
                    </button>
                  ))}
                {inCat.map((i) => (
                  <span key={i.label} className="text-xl">
                    {i.emoji}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {!checked && Object.keys(placed).length === items.length && (
        <Btn onClick={checkAnswers}>Проверить ✓</Btn>
      )}
      {checked && (
        <div
          className={`text-sm font-bold ${allCorrect ? "text-emerald-300" : "text-rose-300"} bg-white/10 rounded-xl p-3`}
        >
          {allCorrect ? "🎉 Молодец! Всё правильно!" : "🤔 Попробуй ещё раз!"}
        </div>
      )}
    </div>
  )
}

// ─── Игра: угадай по следу ────────────────────────────────────────────────
function TrackGame({ onSuccess }: { onSuccess: () => void }) {
  const tracks = [
    { emoji: "🐾", animal: "Лось", options: ["Лось", "Заяц", "Медведь", "Лиса"] },
    { emoji: "🐾", animal: "Медведь", options: ["Волк", "Медведь", "Олень", "Кабан"] },
    { emoji: "🐾", animal: "Лиса", options: ["Кот", "Лиса", "Выдра", "Норка"] },
  ]
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)

  const choose = (opt: string) => {
    if (chosen) return
    setChosen(opt)
    if (opt === tracks[idx].animal) {
      setCorrect((c) => c + 1)
      setTimeout(() => {
        if (idx + 1 < tracks.length) {
          setIdx((i) => i + 1)
          setChosen(null)
        } else {
          onSuccess()
        }
      }, 1000)
    } else {
      setTimeout(() => setChosen(null), 800)
    }
  }

  const track = tracks[idx]
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-6xl mb-2">
          {idx === 0 ? "🦶🦶" : idx === 1 ? "🐾🐾🐾" : "·  ·  ·  ·"}
        </div>
        <p className="text-white/60 text-xs">Следы {idx + 1} из {tracks.length}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {track.options.map((opt) => {
          let cls = "bg-white/10 border border-white/20 text-white hover:bg-white/20"
          if (chosen === opt) {
            cls = opt === track.animal ? "bg-emerald-500 border-emerald-400 text-white" : "bg-rose-500 border-rose-400 text-white"
          }
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {correct > 0 && (
        <p className="text-emerald-300 text-sm">✓ Угадано: {correct}</p>
      )}
    </div>
  )
}

// ─── Игра: Красная книга ─────────────────────────────────────────────────
function RedBookGame({ onSuccess }: { onSuccess: () => void }) {
  const animals = [
    { name: "Орлан-белохвост", emoji: "🦅", endangered: true },
    { name: "Воробей", emoji: "🐦", endangered: false },
    { name: "Рысь", emoji: "🐱", endangered: true },
    { name: "Бурый медведь", emoji: "🐻", endangered: false },
    { name: "Стерлядь", emoji: "🐟", endangered: true },
    { name: "Домашняя корова", emoji: "🐄", endangered: false },
  ]
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({})
  const [checked, setChecked] = useState(false)

  const toggle = (name: string, val: boolean) => {
    if (checked) return
    setAnswers((a) => ({ ...a, [name]: val }))
  }

  const check = () => {
    setChecked(true)
    const correct = animals.every((a) => answers[a.name] === a.endangered)
    if (correct) setTimeout(onSuccess, 1500)
  }

  return (
    <div className="space-y-3">
      {animals.map((a) => {
        const ans = answers[a.name]
        return (
          <div key={a.name} className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/20">
            <span className="text-2xl">{a.emoji}</span>
            <span className="text-white text-sm flex-1">{a.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => toggle(a.name, true)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${ans === true ? (checked && a.endangered ? "bg-emerald-500 text-white" : checked ? "bg-rose-500 text-white" : "bg-red-500 text-white") : "bg-white/10 text-white/60 hover:bg-red-500/40"}`}
              >
                📕 Да
              </button>
              <button
                onClick={() => toggle(a.name, false)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${ans === false ? (checked && !a.endangered ? "bg-emerald-500 text-white" : checked ? "bg-rose-500 text-white" : "bg-gray-500 text-white") : "bg-white/10 text-white/60 hover:bg-gray-500/40"}`}
              >
                ✗ Нет
              </button>
            </div>
          </div>
        )
      })}
      {Object.keys(answers).length === animals.length && !checked && (
        <Btn onClick={check}>Проверить ✓</Btn>
      )}
      {checked && (
        <p className={`text-sm font-bold ${animals.every((a) => answers[a.name] === a.endangered) ? "text-emerald-300" : "text-rose-300"}`}>
          {animals.every((a) => answers[a.name] === a.endangered) ? "🎉 Отлично! Всё верно!" : "Посмотри внимательнее — нажми ещё раз!"}
        </p>
      )}
    </div>
  )
}

// ─── Игра: найди животное ─────────────────────────────────────────────────
function FindAnimalGame({ onSuccess }: { onSuccess: () => void }) {
  const [found, setFound] = useState<number[]>([])
  const hidden = [
    { id: 0, x: "15%", y: "30%", emoji: "🦊" },
    { id: 1, x: "60%", y: "50%", emoji: "🐺" },
    { id: 2, x: "80%", y: "20%", emoji: "🦌" },
    { id: 3, x: "35%", y: "70%", emoji: "🐇" },
    { id: 4, x: "50%", y: "10%", emoji: "🦉" },
  ]
  const click = (id: number) => {
    if (found.includes(id)) return
    const next = [...found, id]
    setFound(next)
    if (next.length === hidden.length) setTimeout(onSuccess, 1000)
  }
  return (
    <div className="space-y-3">
      <div className="relative w-full h-52 bg-gradient-to-b from-emerald-900/40 to-green-800/40 rounded-2xl border border-white/20 overflow-hidden">
        <div className="absolute inset-0 text-4xl opacity-30 flex flex-wrap gap-1 p-2 pointer-events-none">
          {Array(30).fill("🌲").map((t, i) => <span key={i}>{t}</span>)}
        </div>
        {hidden.map((h) => (
          <button
            key={h.id}
            onClick={() => click(h.id)}
            style={{ left: h.x, top: h.y, position: "absolute" }}
            className={`text-2xl transition-all duration-300 cursor-pointer ${found.includes(h.id) ? "scale-125 brightness-150" : "opacity-20 hover:opacity-60"}`}
          >
            {h.emoji}
          </button>
        ))}
      </div>
      <p className="text-white/70 text-sm">Найдено: {found.length} из {hidden.length}</p>
    </div>
  )
}

// ─── Игра: запомни растения ───────────────────────────────────────────────
function MemoryGame({ onSuccess }: { onSuccess: () => void }) {
  const plants = [
    { name: "Береза", emoji: "🌳" },
    { name: "Сосна", emoji: "🌲" },
    { name: "Иван-чай", emoji: "🌸" },
    { name: "Ромашка", emoji: "🌼" },
    { name: "Черника", emoji: "🫐" },
  ]
  const allOptions = [...plants.map((p) => p.name), "Пальма", "Кактус", "Бамбук"].sort(() => Math.random() - 0.5)
  const [phase, setPhase] = useState<"show" | "hide" | "test">("show")
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (phase === "show") {
      const t = setTimeout(() => setPhase("hide"), 4000)
      return () => clearTimeout(t)
    }
    if (phase === "hide") {
      const t = setTimeout(() => setPhase("test"), 1000)
      return () => clearTimeout(t)
    }
  }, [phase])

  const toggle = (name: string) => {
    if (checked) return
    setSelected((s) => s.includes(name) ? s.filter((x) => x !== name) : [...s, name])
  }

  const check = () => {
    setChecked(true)
    const ok = plants.every((p) => selected.includes(p.name)) && selected.length === plants.length
    if (ok) setTimeout(onSuccess, 1200)
  }

  if (phase === "show") {
    return (
      <div className="space-y-3 text-center">
        <p className="text-yellow-300 font-medium text-sm">⏱ Запоминай! 4 секунды...</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {plants.map((p) => (
            <div key={p.name} className="bg-white/10 rounded-2xl p-4 border border-white/20 text-center">
              <div className="text-4xl mb-1">{p.emoji}</div>
              <div className="text-white text-sm font-medium">{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (phase === "hide") {
    return <p className="text-white text-center text-lg font-bold">🙈 Теперь вспоминай!</p>
  }
  return (
    <div className="space-y-3">
      <p className="text-white/80 text-sm">Какие растения ты видел?</p>
      <div className="flex flex-wrap gap-2">
        {allOptions.map((name) => (
          <button
            key={name}
            onClick={() => toggle(name)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${selected.includes(name) ? "bg-emerald-500 text-white border-emerald-400 border" : "bg-white/10 text-white border border-white/20 hover:bg-white/20"}`}
          >
            {name}
          </button>
        ))}
      </div>
      {selected.length >= 5 && !checked && <Btn onClick={check}>Проверить ✓</Btn>}
      {checked && (
        <p className={`text-sm font-bold ${plants.every((p) => selected.includes(p.name)) ? "text-emerald-300" : "text-rose-300"}`}>
          {plants.every((p) => selected.includes(p.name)) ? "🎉 Отличная память!" : "Попробуй ещё раз — ты можешь!"}
        </p>
      )}
    </div>
  )
}

// ─── Нейроупражнение ──────────────────────────────────────────────────────
function NeuroExercise({ title, description, onDone }: { title: string; description: string; onDone: () => void }) {
  const [done, setDone] = useState(false)
  const [count, setCount] = useState(0)
  return (
    <div className="space-y-4 text-center">
      <div className="text-5xl">🧠</div>
      <h3 className="text-white text-xl font-bold">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
      {!done ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => {
                  const next = count + 1
                  setCount(next)
                  if (next >= 3) { setDone(true); setTimeout(onDone, 800) }
                }}
                className={`w-14 h-14 rounded-full border-2 text-2xl cursor-pointer transition-all ${count >= n ? "bg-emerald-500 border-emerald-400" : "bg-white/10 border-white/30 hover:bg-white/20"}`}
              >
                {count >= n ? "✓" : n}
              </button>
            ))}
          </div>
          <p className="text-white/50 text-xs">Нажми кружок когда выполнишь</p>
        </div>
      ) : (
        <p className="text-emerald-300 font-bold text-lg">🌟 Молодец, мозг готов к работе!</p>
      )}
    </div>
  )
}

// ─── Викторина ────────────────────────────────────────────────────────────
function QuizQuestion({
  question,
  options,
  correct,
  onAnswer,
}: {
  question: string
  options: string[]
  correct: number
  onAnswer: (ok: boolean) => void
}) {
  const [chosen, setChosen] = useState<number | null>(null)

  const choose = (i: number) => {
    if (chosen !== null) return
    setChosen(i)
    setTimeout(() => onAnswer(i === correct), 1000)
  }

  return (
    <div className="space-y-4">
      <p className="text-white font-semibold text-base leading-relaxed">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let cls = "bg-white/10 border-white/20 text-white hover:bg-white/20"
          if (chosen !== null) {
            if (i === correct) cls = "bg-emerald-500 border-emerald-400 text-white"
            else if (i === chosen) cls = "bg-rose-500 border-rose-400 text-white"
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`w-full text-left py-3 px-4 rounded-xl border text-sm font-medium cursor-pointer transition-all ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Рисовалка символа ────────────────────────────────────────────────────
function DrawingSlide({ onDone }: { onDone: () => void }) {
  const [color, setColor] = useState("#22c55e")
  const [drawing, setDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = "rgba(255,255,255,0.05)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const canvas = e.currentTarget
    const ctx = canvas.getContext("2d")!
    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 6, 0, Math.PI * 2)
    ctx.fill()
    setHasDrawn(true)
  }

  const colors = ["#22c55e", "#fb923c", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#ffffff"]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ background: c }}
            className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${color === c ? "scale-125 ring-2 ring-white" : ""}`}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        className="rounded-2xl border-2 border-dashed border-white/30 bg-white/5 w-full cursor-crosshair"
        onMouseDown={() => setDrawing(true)}
        onMouseUp={() => setDrawing(false)}
        onMouseMove={draw}
        onMouseLeave={() => setDrawing(false)}
      />
      {hasDrawn && (
        <Btn onClick={onDone} variant="success">Готово! Я нарисовал ✓</Btn>
      )}
    </div>
  )
}

// ─── ДАННЫЕ СЛАЙДОВ ───────────────────────────────────────────────────────
type SlideData = {
  id: number
  type: "intro" | "info" | "quiz" | "classify" | "track" | "redbook" | "find" | "memory" | "neuro" | "draw" | "slideshow" | "final"
  bg?: string
}

const SLIDES_COUNT = 20

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────────────────
export default function Index() {
  const [slide, setSlide] = useState(0)
  const [stars, setStars] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState<boolean | null>(null)
  const [slideshowIdx, setSlideshowIdx] = useState(0)

  const addStar = () => setStars((s) => s + 1)
  const next = () => setSlide((s) => Math.min(s + 1, SLIDES_COUNT - 1))
  const prev = () => setSlide((s) => Math.max(s - 1, 0))

  const slideshowImages = [
    { emoji: "🌲", label: "Тайга Южного Урала" },
    { emoji: "🏔️", label: "Горы Уральского хребта" },
    { emoji: "🦌", label: "Благородный олень" },
    { emoji: "🌸", label: "Цветущие луга" },
    { emoji: "🦅", label: "Орлан-белохвост" },
  ]

  useEffect(() => {
    if (slide !== 2) return
    const t = setInterval(() => setSlideshowIdx((i) => (i + 1) % slideshowImages.length), 2500)
    return () => clearInterval(t)
  }, [slide])

  const renderSlide = () => {
    switch (slide) {
      // ── Слайд 0: Заставка ─────────────────────────────────────────────
      case 0:
        return (
          <Slide center>
            <div className="text-center space-y-6 max-w-lg">
              <div className="text-7xl animate-bounce">🌿</div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-white/80 text-xs">Квест № 3 · 1 класс</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                В поисках{" "}
                <span className="italic text-emerald-300">живых символов</span>
              </h1>
              <p className="text-white/60 text-sm">Природа Южного Урала · Интерактивное путешествие</p>
              <div className="flex flex-col gap-3 items-center">
                <Character name="ваня" text="Привет! Я Ваня. Мы отправляемся в удивительное путешествие по Южному Уралу. Готов?" />
              </div>
              <Btn onClick={next}>Начать путешествие 🚀</Btn>
            </div>
          </Slide>
        )

      // ── Слайд 1: Знакомство с помощниками ─────────────────────────────
      case 1:
        return (
          <Slide center>
            <div className="space-y-6 max-w-lg w-full text-center">
              <h2 className="text-3xl font-bold text-white">Наши помощники</h2>
              <div className="space-y-3">
                <Character name="ваня" text="Ваня — знает всё о животных Урала. Буду рассказывать интересные факты!" />
                <Character name="василиса" text="Василиса — люблю растения и цветы. Расскажу о деревьях и травах!" />
                <Character name="умник" text="Робот Умник — проверяю ваши ответы и считаю звёзды. Удачи, юный натуралист!" />
              </div>
              <Btn onClick={next}>Отлично, поехали! →</Btn>
            </div>
          </Slide>
        )

      // ── Слайд 2: Слайд-шоу природы ────────────────────────────────────
      case 2:
        return (
          <Slide center>
            <div className="space-y-6 max-w-lg w-full text-center">
              <h2 className="text-3xl font-bold text-white">Природа Южного Урала</h2>
              <div className="relative h-48 bg-white/5 rounded-3xl border border-white/20 overflow-hidden flex items-center justify-center">
                <div className="text-center transition-all duration-700">
                  <div className="text-8xl mb-3">{slideshowImages[slideshowIdx].emoji}</div>
                  <p className="text-white/80 font-medium">{slideshowImages[slideshowIdx].label}</p>
                </div>
                <div className="absolute bottom-3 flex gap-2 justify-center left-0 right-0">
                  {slideshowImages.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === slideshowIdx ? "bg-emerald-300 w-4" : "bg-white/30"}`} />
                  ))}
                </div>
              </div>
              <Character name="василиса" text="Южный Урал — это горы, реки, леса и удивительные животные. Здесь живут лось, медведь, рысь и сотни видов птиц!" />
              <Btn onClick={next}>Узнать больше →</Btn>
            </div>
          </Slide>
        )

      // ── Слайд 3: Символы края ─────────────────────────────────────────
      case 3:
        return (
          <Slide center>
            <div className="space-y-5 max-w-lg w-full text-center">
              <h2 className="text-3xl font-bold text-white">Символы Южного Урала</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { emoji: "🦌", name: "Лось", desc: "Царь леса" },
                  { emoji: "🌲", name: "Сосна", desc: "Вечнозелёная" },
                  { emoji: "🌳", name: "Берёза", desc: "Символ России" },
                ].map((s) => (
                  <div key={s.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-5xl mb-2">{s.emoji}</div>
                    <div className="text-white font-bold text-sm">{s.name}</div>
                    <div className="text-white/50 text-xs">{s.desc}</div>
                  </div>
                ))}
              </div>
              <Character name="ваня" text="Лось — самое крупное животное наших лесов! Его рога могут весить 30 кг. Сосна и берёза — главные деревья Уральских лесов." />
              <Btn onClick={next}>Дальше →</Btn>
            </div>
          </Slide>
        )

      // ── Слайд 4: Нейроупражнение 1 ────────────────────────────────────
      case 4:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <Character name="умник" text="Перед заданием — разомнём мозг! Нейроупражнение поможет лучше запоминать." />
              <NeuroExercise
                title="Левая-Правая"
                description="Потяни правую руку вперёд, потом левую. Чередуй 3 раза — это активирует оба полушария мозга!"
                onDone={() => { addStar(); next() }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 5: Классификация дикие/домашние ────────────────────────
      case 5:
        return (
          <Slide center>
            <div className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Дикие и домашние</h2>
              <Character name="ваня" text="Нажимай на животное и помести его в нужный домик — дикое или домашнее!" />
              <ClassifyGame
                title="Распредели животных по группам:"
                items={[
                  { label: "Лось", emoji: "🦌", category: "Дикие" },
                  { label: "Корова", emoji: "🐄", category: "Домашние" },
                  { label: "Волк", emoji: "🐺", category: "Дикие" },
                  { label: "Кошка", emoji: "🐱", category: "Домашние" },
                  { label: "Медведь", emoji: "🐻", category: "Дикие" },
                  { label: "Овца", emoji: "🐑", category: "Домашние" },
                ]}
                categories={["Дикие", "Домашние"]}
                onSuccess={() => { addStar(); next() }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 6: Игра "Угадай по следу" ──────────────────────────────
      case 6:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Угадай по следу! 🐾</h2>
              <Character name="ваня" text="У каждого зверя свои следы. Смотри внимательно и угадай, кто прошёл по лесу!" />
              <TrackGame onSuccess={() => { addStar(); next() }} />
            </div>
          </Slide>
        )

      // ── Слайд 7: Классификация хвойные/лиственные ─────────────────────
      case 7:
        return (
          <Slide center>
            <div className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Деревья Урала</h2>
              <Character name="василиса" text="Хвойные деревья зелёные весь год! А лиственные сбрасывают листья осенью. Распредели их!" />
              <ClassifyGame
                title="Хвойные или лиственные?"
                items={[
                  { label: "Сосна", emoji: "🌲", category: "Хвойные" },
                  { label: "Берёза", emoji: "🌳", category: "Лиственные" },
                  { label: "Ель", emoji: "🎄", category: "Хвойные" },
                  { label: "Осина", emoji: "🍂", category: "Лиственные" },
                  { label: "Кедр", emoji: "🌲", category: "Хвойные" },
                  { label: "Дуб", emoji: "🌳", category: "Лиственные" },
                ]}
                categories={["Хвойные", "Лиственные"]}
                onSuccess={() => { addStar(); next() }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 8: Найди животное в лесу ────────────────────────────────
      case 8:
        return (
          <Slide center>
            <div className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Найди животное в лесу! 🔍</h2>
              <Character name="василиса" text="Животные умеют прятаться! Нажимай на лесных жителей — найди всех 5!" />
              <FindAnimalGame onSuccess={() => { addStar(); next() }} />
            </div>
          </Slide>
        )

      // ── Слайд 9: Нейроупражнение 2 ────────────────────────────────────
      case 9:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <Character name="умник" text="Отличная работа! Ещё одно нейроупражнение — для глаз и внимания." />
              <NeuroExercise
                title="Восьмёрка глазами"
                description="Не двигая головой, нарисуй глазами большую восьмёрку 3 раза. Это улучшает концентрацию!"
                onDone={() => { addStar(); next() }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 10: Память — запомни растения ───────────────────────────
      case 10:
        return (
          <Slide center>
            <div className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Запомни 5 растений! 🧠</h2>
              <Character name="василиса" text="Внимательно посмотри на растения Урала. Через 4 секунды они исчезнут — вспомнишь?" />
              <MemoryGame onSuccess={() => { addStar(); next() }} />
            </div>
          </Slide>
        )

      // ── Слайд 11: Красная книга ────────────────────────────────────────
      case 11:
        return (
          <Slide center>
            <div className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Красная книга 📕</h2>
              <Character name="умник" text="Красная книга защищает редких животных. Отметь — кто в ней есть, а кто нет?" />
              <RedBookGame onSuccess={() => { addStar(); next() }} />
            </div>
          </Slide>
        )

      // ── Слайд 12: Викторина — Лось ────────────────────────────────────
      case 12:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Викторина 🦌</h2>
              <Character name="ваня" text="Ты уже столько узнал о природе Урала! Проверим знания о лосе." />
              <QuizQuestion
                question="Что лось использует как оружие и украшение?"
                options={["Длинный хвост", "Рога", "Острые зубы", "Пятна на шкуре"]}
                correct={1}
                onAnswer={(ok) => { if (ok) addStar(); setTimeout(next, 500) }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 13: Нейроупражнение 3 ───────────────────────────────────
      case 13:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <Character name="умник" text="Почти дошли! Нейроупражнение перед финальным заданием — зарядим мозг!" />
              <NeuroExercise
                title="Перекрёстный шаг"
                description="Подними правое колено и коснись его левым локтем. Потом наоборот. Повтори 3 раза — синхронизирует полушария!"
                onDone={() => { addStar(); next() }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 14: Рисуем символ края ──────────────────────────────────
      case 14:
        return (
          <Slide center>
            <div className="max-w-md w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Нарисуй символ! ✏️</h2>
              <Character name="василиса" text="Выбери цвет и нарисуй лося, сосну или берёзу — символ Южного Урала. Выражай себя!" />
              <DrawingSlide onDone={() => { addStar(); next() }} />
            </div>
          </Slide>
        )

      // ── Слайд 15: Викторина — Берёза ──────────────────────────────────
      case 15:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Знаешь деревья? 🌳</h2>
              <Character name="василиса" text="Берёза — одно из самых любимых деревьев на Урале. Проверим, что ты знаешь!" />
              <QuizQuestion
                question="Какого цвета кора у берёзы?"
                options={["Коричневая", "Серая", "Белая с чёрными полосками", "Зелёная"]}
                correct={2}
                onAnswer={(ok) => { if (ok) addStar(); setTimeout(next, 500) }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 16: Красная книга Челябинской области ────────────────────
      case 16:
        return (
          <Slide center>
            <div className="space-y-5 max-w-lg w-full text-center">
              <h2 className="text-2xl font-bold text-white">Красная книга Челябинской области</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "🦅", name: "Орлан-белохвост", status: "исчезающий" },
                  { emoji: "🐱", name: "Рысь", status: "редкий" },
                  { emoji: "🐟", name: "Стерлядь", status: "под угрозой" },
                  { emoji: "🌺", name: "Венерин башмачок", status: "редкий" },
                  { emoji: "🦇", name: "Ночница Брандта", status: "редкий" },
                  { emoji: "🐍", name: "Медянка", status: "редкий" },
                ].map((a) => (
                  <div key={a.name} className="bg-red-900/30 border border-red-400/30 rounded-2xl p-3 text-left flex items-center gap-3">
                    <span className="text-3xl">{a.emoji}</span>
                    <div>
                      <div className="text-white text-xs font-medium">{a.name}</div>
                      <div className="text-red-300 text-xs">{a.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Character name="умник" text="Эти животные и растения нуждаются в нашей защите! Мы должны беречь природу Урала." />
              <Btn onClick={next}>Понял, буду беречь! →</Btn>
            </div>
          </Slide>
        )

      // ── Слайд 17: Нейроупражнение 4 (мозжечковая гимнастика) ──────────
      case 17:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <Character name="умник" text="Мозжечковая стимуляция помогает лучше читать и писать. Попробуем вместе!" />
              <NeuroExercise
                title="Мозжечковая гимнастика"
                description="Встань прямо. Вытяни руки в стороны. Закрой глаза и постой на одной ноге 5 секунд. Потом на другой. Повтори 3 раза!"
                onDone={() => { addStar(); next() }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 18: Финальная викторина ────────────────────────────────
      case 18:
        return (
          <Slide center>
            <div className="max-w-sm w-full space-y-4">
              <h2 className="text-2xl font-bold text-white text-center">Финальный вопрос! 🏆</h2>
              <Character name="ваня" text="Последний вопрос — и ты настоящий знаток природы Южного Урала!" />
              <QuizQuestion
                question="Как называется книга, в которую внесены редкие животные и растения?"
                options={["Синяя книга", "Зелёная книга", "Красная книга", "Золотая книга"]}
                correct={2}
                onAnswer={(ok) => { if (ok) addStar(); setTimeout(next, 500) }}
              />
            </div>
          </Slide>
        )

      // ── Слайд 19: Финал ────────────────────────────────────────────────
      case 19:
        return (
          <Slide center>
            <div className="text-center space-y-6 max-w-lg">
              <div className="text-7xl">🏆</div>
              <h1 className="text-4xl font-bold text-white">
                Квест пройден!
              </h1>
              <div className="flex items-center justify-center gap-2 text-2xl">
                <span className="text-yellow-300 font-bold">Твои звёзды:</span>
                <Stars count={stars} />
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                <p className="text-emerald-300 font-bold text-lg mb-1">
                  {stars >= 8 ? "🌟 Юный натуралист!" : stars >= 5 ? "🌿 Знаток природы!" : "🐾 Начинающий следопыт!"}
                </p>
                <p className="text-white/70 text-sm">
                  {stars >= 8
                    ? "Блестящий результат! Ты отлично знаешь природу Южного Урала!"
                    : stars >= 5
                    ? "Хорошая работа! Природа Урала открывает тебе свои тайны."
                    : "Молодец, что прошёл квест! Продолжай изучать природу!"}
                </p>
              </div>
              <div className="space-y-3">
                <Character name="ваня" text="Ты настоящий защитник природы! Береги животных и растения Урала!" />
                <Character name="василиса" text="Спасибо за путешествие! Сажай деревья и никогда не мусори в лесу!" />
                <Character name="умник" text="Отличная работа! Твои знания помогут сохранить природу Южного Урала для будущих поколений!" />
              </div>
              <Btn onClick={() => { setSlide(0); setStars(0) }} variant="outline">
                Пройти ещё раз 🔄
              </Btn>
            </div>
          </Slide>
        )

      default:
        return null
    }
  }

  return (
    <ShaderBackground>
      {/* Навигационная шапка */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        <div className="text-white/80 text-sm font-medium">
          🌿 Природа Южного Урала
        </div>
        <Stars count={stars} />
      </div>

      {/* Прогресс */}
      <div className="absolute top-16 left-4 right-4 z-20">
        <ProgressBar current={slide} total={SLIDES_COUNT} />
      </div>

      {/* Контент слайда */}
      <div className="pt-24">{renderSlide()}</div>

      {/* Навигация */}
      {slide > 0 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
      )}
      {slide < SLIDES_COUNT - 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      )}
    </ShaderBackground>
  )
}
