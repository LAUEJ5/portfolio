'use client'

import { useRef, useState } from 'react'
import TranscriptView from './components/TranscriptView'
import ScorePanel from './components/ScorePanel'

export default function RecallrPage() {
  const [script, setScript] = useState('Twinkle Twinkle, Little Star. How I wonder what you are. Up above the world so high. Like a diamond in the sky. Twinkle Twinkle Little Star. How I wonder what you are!')
  const [submitted, setSubmitted] = useState(false)
  const [socketReady, setSocketReady] = useState(false)
  const [showError, setShowError] = useState(false)

  type WordFeedback = { word: string; correct: boolean }
  const [transcriptFeedback, setTranscriptFeedback] = useState<WordFeedback[]>([])

  const wsRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleStart = async () => {
    if (!script.trim()) {
      setShowError(true)
      return
    }

    setShowError(false)
    setSubmitted(true)

    const ws = new WebSocket('ws://localhost:8000/ws')
    wsRef.current = ws

    ws.onopen = () => {
      setSocketReady(true)
      ws.send(JSON.stringify({ type: 'script', payload: script }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'transcript') {
        setTranscriptFeedback(data.payload)
      }
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(event.data)
      }
    })

    mediaRecorder.start(200)
  }

  const handleStop = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      mediaRecorderRef.current?.stop()
      wsRef.current.send(JSON.stringify({ type: 'end' }))
      wsRef.current.close()
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-background">
      <div className="w-full max-w-6xl flex flex-row gap-6 ">
        {/* Left Panel - Transcript */}
        <div className="w-3/5 bg-white p-4 rounded-lg h-full flex flex-col">
          <h2 className="text-4xl font-semibold mb-4 text-center">Recallr</h2>
          <div className="bg-gray-200 p-4 rounded-lg flex-1 overflow-y-auto">
            <TranscriptView transcriptFeedback={transcriptFeedback} />
          </div>
        </div>

        {/* Right Panel - Input + Buttons + Score */}
        <div className="w-2/5 flex flex-col min-h-[calc(100vh-5rem)]">
        {/* Wrap input + scoring in one growable column */}
  <div className="flex flex-col h-full flex-1 justify-between gap-6">
    
    {/* Script Input with Buttons inside */}
    <div className="bg-white p-4 rounded-lg flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Input Text</h2>

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Paste your reference script here..."
        className={`w-full h-[200px] p-4 bg-gray-200 border rounded-md resize-none ${
          script ? 'text-black' : 'text-gray-400'
        }`}
      />

      {showError && (
        <span className="text-red-600 text-sm mt-1">Please input your memorized text</span>
      )}

      <div className="flex justify-between mt-4 gap-3">
        <button
          onClick={handleStart}
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={submitted}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          className="w-full py-3 bg-gray-600 text-white rounded hover:bg-gray-800"
          disabled={!socketReady}
        >
          Stop
        </button>
        <button
          onClick={() => alert('Hint clicked!')}
          className="w-full py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Hint
        </button>
      </div>
    </div>

    {/* Score Panel aligned to bottom */}
    <div className="bg-white p-4 rounded-lg flex flex-col flex-1 justify-between">
      <h2 className="text-2xl font-semibold mb-2">Scoring</h2>
      <div className="bg-gray-200 p-4 rounded-lg flex-1">
        <ScorePanel />
      </div>
    </div>
  </div>
</div>
</div>

    </div>
  )
}