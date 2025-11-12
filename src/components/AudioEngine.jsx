import React, { useEffect, useMemo, useRef } from 'react'

function createReverb(context, decay = 2.5) {
  const convolver = context.createConvolver()
  const rate = context.sampleRate
  const length = rate * decay
  const impulse = context.createBuffer(2, length, rate)
  for (let c = 0; c < 2; c++) {
    const ch = impulse.getChannelData(c)
    for (let i = 0; i < length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
    }
  }
  convolver.buffer = impulse
  return convolver
}

function oscNode(ctx, type, freq) {
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.value = freq
  return o
}

export default function AudioEngine({ data, playing, volume = 0.8 }) {
  const ctxRef = useRef(null)
  const masterRef = useRef(null)

  useEffect(() => {
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const master = ctx.createGain()
      master.gain.value = volume
      master.connect(ctx.destination)
      ctxRef.current = ctx
      masterRef.current = master
    }
  }, [volume])

  useEffect(() => {
    if (!data || !playing || !ctxRef.current) return
    const ctx = ctxRef.current
    const now = ctx.currentTime + 0.05

    const scheduleChordLayer = (layer) => {
      const reverb = createReverb(ctx, 3)
      reverb.connect(masterRef.current)
      layer.events.forEach((ev) => {
        const chordGain = ctx.createGain()
        chordGain.gain.value = 0.12
        chordGain.connect(reverb)

        ev.frequencies.forEach((f) => {
          const o = oscNode(ctx, layer.type, f)
          const g = ctx.createGain()
          g.gain.setValueAtTime(0, now + ev.start)
          g.gain.linearRampToValueAtTime(0.18, now + ev.start + layer.attack)
          g.gain.linearRampToValueAtTime(0.0, now + ev.start + ev.duration + layer.release)
          o.connect(g)
          g.connect(chordGain)
          o.start(now + ev.start)
          o.stop(now + ev.start + ev.duration + layer.release + 0.1)
        })
      })
    }

    const schedulePlucks = (layer) => {
      const reverb = createReverb(ctx, 1.8)
      reverb.connect(masterRef.current)
      layer.events.forEach((ev) => {
        const o = oscNode(ctx, layer.type, ev.frequency)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0, now + ev.start)
        g.gain.linearRampToValueAtTime(ev.gain ?? 0.12, now + ev.start + layer.attack)
        g.gain.linearRampToValueAtTime(0, now + ev.start + ev.duration + layer.release)
        o.connect(g)
        g.connect(reverb)
        o.start(now + ev.start)
        o.stop(now + ev.start + ev.duration + layer.release + 0.05)
      })
    }

    const scheduleBass = (layer) => {
      const reverb = createReverb(ctx, 1.2)
      reverb.connect(masterRef.current)
      layer.events.forEach((ev) => {
        const o = oscNode(ctx, layer.type, ev.frequency)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0, now + ev.start)
        g.gain.linearRampToValueAtTime(ev.gain ?? 0.12, now + ev.start + layer.attack)
        g.gain.linearRampToValueAtTime(0, now + ev.start + ev.duration + layer.release)
        o.connect(g)
        g.connect(reverb)
        o.start(now + ev.start)
        o.stop(now + ev.start + ev.duration + layer.release + 0.1)
      })
    }

    scheduleChordLayer(data.layers.chords)
    schedulePlucks(data.layers.plucks)
    scheduleBass(data.layers.bass)

    return () => {}
  }, [data, playing])

  return null
}
