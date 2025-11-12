import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Loader2, Music, Volume2 } from 'lucide-react'
import MoodCard from './components/MoodCard'
import AudioEngine from './components/AudioEngine'

const moods = ['calm', 'peaceful', 'dreamy', 'focused', 'uplifted']

export default function App() {
  const [selected, setSelected] = useState('calm')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchData = async (m) => {
    setLoading(true)
    setPlaying(false)
    try {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: m }),
      })
      const json = await res.json()
      setData(json)
      setPlaying(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelect = (m) => {
    setSelected(m)
    fetchData(m)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero with Spline cover */}
      <section className="relative h-[60vh] min-h-[520px] w-full overflow-hidden">
        <Spline scene="https://prod.spline.design/kqB-rdL4TCJ7pyGb/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/10 to-zinc-950" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-semibold tracking-tight"
            >
              Mood-based relaxing music with soothing visuals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-white/70"
            >
              Pick a mood and drift into a calming, generative audio-visual journey. Minimal. Modern. Soft gradients. Always-on dark mode.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="relative -mt-14 z-10 px-4">
        <div className="mx-auto max-w-3xl rounded-3xl bg-zinc-900/70 backdrop-blur ring-1 ring-white/10 p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moods.map((m) => (
              <MoodCard key={m} mood={m} selected={selected === m} onSelect={handleSelect} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/5 ring-1 ring-white/10"><Music className="w-4 h-4" /></div>
              <div className="text-sm text-white/70 capitalize">{selected} • {data ? `${data.bpm} bpm` : '...'}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white/70" />
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24" />
              </div>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-2 rounded-xl bg-pink-500/90 hover:bg-pink-500 text-white px-4 py-2 text-sm font-medium transition"
                disabled={!data}
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {playing ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Visualizer placeholder */}
      <section className="px-4 mt-10 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="relative h-56 sm:h-72 rounded-3xl bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-pink-500/20 ring-1 ring-white/10 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-[2px]" />
            <div className="absolute inset-0 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 content-end">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0.2, opacity: 0.6 }}
                  animate={{ scaleY: [0.2, 0.9, 0.3, 0.7, 0.25], opacity: [0.6, 1, 0.8, 1, 0.7] }}
                  transition={{ duration: 3 + (i % 5) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="origin-bottom rounded-lg bg-white/40"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hidden audio engine */}
      <AudioEngine data={data} playing={playing} volume={volume} />

      <footer className="px-4 pb-10">
        <div className="mx-auto max-w-3xl text-center text-xs text-white/50">
          Built for calm focus. Headphones recommended.
        </div>
      </footer>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-900/80 ring-1 ring-white/10 px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
