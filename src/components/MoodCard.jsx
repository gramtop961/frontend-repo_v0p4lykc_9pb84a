import React from 'react'
import { motion } from 'framer-motion'
import { Smile, Moon, Cloud, Sun, Heart } from 'lucide-react'

const presets = {
  calm: { label: 'Calm', icon: Cloud, gradient: 'from-indigo-500/20 to-purple-500/20' },
  peaceful: { label: 'Peaceful', icon: Moon, gradient: 'from-purple-500/20 to-pink-500/20' },
  dreamy: { label: 'Dreamy', icon: Heart, gradient: 'from-pink-500/20 to-violet-500/20' },
  focused: { label: 'Focused', icon: Sun, gradient: 'from-blue-500/20 to-cyan-500/20' },
  uplifted: { label: 'Uplifted', icon: Smile, gradient: 'from-rose-500/20 to-orange-500/20' },
}

export default function MoodCard({ mood, selected, onSelect }) {
  const p = presets[mood]
  const Icon = p.icon
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(mood)}
      className={`relative w-full overflow-hidden rounded-2xl p-4 bg-zinc-900/60 ring-1 ring-white/10 text-left ${selected ? 'outline outline-2 outline-pink-400/50' : ''}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-70 pointer-events-none`} />
      <div className="relative flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5 ring-1 ring-white/10">
          <Icon className="w-5 h-5 text-white/90" />
        </div>
        <div>
          <div className="text-white font-medium">{p.label}</div>
          <div className="text-white/60 text-xs capitalize">{mood}</div>
        </div>
      </div>
    </motion.button>
  )
}
