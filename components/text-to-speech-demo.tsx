"use client"

import { useState, useRef, useEffect } from "react"

export default function TextToSpeechDemo() {
  const [text, setText] = useState("Hello! This is a demo of the text-to-speech displayer.")
  const [voice, setVoice] = useState("default")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)
      }
    }

    loadVoices()
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      window.speechSynthesis.cancel()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Handle visualization
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple waveform visualization
    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      
      // Create a simple sine wave
      for (let x = 0; x < width; x++) {
        // Amplitude varies based on whether we're playing
        const amplitude = isPlaying ? 30 : 5
        
        // Frequency varies based on pitch
        const frequency = 0.02 * pitch
        
        // Speed varies based on rate
        const time = Date.now() * 0.001 * rate
        
        const y = centerY + Math.sin(x * frequency + time) * amplitude
        ctx.lineTo(x, y)
      }
      
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.stroke()
      
      animationRef.current = requestAnimationFrame(drawWaveform)
    }
    
    drawWaveform()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, pitch, rate])

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPaused(true)
      setIsPlaying(false)
      return
    }

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      
      // Set voice if available
      if (voices.length > 0 && voice !== "default") {
        const selectedVoice = voices.find(v => v.name === voice)
        if (selectedVoice) utterance.voice = selectedVoice
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech"
        className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Voice</label>
          <select 
            value={voice} 
            onChange={(e) => setVoice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="default">Default</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Rate: {rate.toFixed(1)}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Pitch: {pitch.toFixed(1)}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handlePlay}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          {isPaused ? "Resume" : isPlaying ? "Pause" : "Play"}
        </button>
        <button 
          onClick={handleStop} 
          disabled={!isPlaying && !isPaused}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Stop
        </button>
        <button 
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Save as MP3
        </button>
      </div>
      
      <div className="h-16 bg-gray-50 rounded-md border overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          width={500}
          height={64}
        />
      </div>
    </div>
  )
}
