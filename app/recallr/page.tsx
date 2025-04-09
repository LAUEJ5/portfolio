'use client'

import { useRef, useState } from 'react'
import TranscriptView from './components/TranscriptView'
import ScorePanel from './components/ScorePanel'

export default function RecallrPage() {
  const [script, setScript] = useState(
    'Twinkle Twinkle, Little Star. How I wonder what you are. Up above the world so high. Like a diamond in the sky. Twinkle Twinkle Little Star. How I wonder what you are!'
  )
  const [submitted, setSubmitted] = useState(false)
  const [socketReady, setSocketReady] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const sessionActive = submitted && !paused
  const [sessionStopped, setSessionStopped] = useState(false)

  type WordFeedback = { word: string; correct: boolean; hint?: boolean }
  const [transcriptFeedback, setTranscriptFeedback] = useState<WordFeedback[]>([])
  const correctCount = transcriptFeedback.filter((w) => w.correct).length
  const totalCount = transcriptFeedback.filter((w) => !w.hint).length
  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0


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
    
        const allCorrect = data.payload.every((w: WordFeedback) => w.correct)
        const allCount = data.payload.length
    
        if (allCount > 0 && allCorrect) {
          // All words matched — stop session
          handleStop()
        }
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
    setScript('')
    setIsRunning(true)
  }

  const handleStop = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      mediaRecorderRef.current?.stop()
      wsRef.current.send(JSON.stringify({ type: 'end' }))
      wsRef.current.close()
    }
    setIsRunning(false)
    setPaused(false)
    setSubmitted(false)
    setScript('')
    setSessionStopped(true)
  }
  const handleHint = () => {
    const nextIndex = transcriptFeedback.findIndex(w => !w.correct && !w.hint)
    if (nextIndex === -1) return
  
    const updated = [...transcriptFeedback]
    updated[nextIndex] = {
      ...updated[nextIndex],
      hint: true,  // Unblur and mark red
      correct: false  // Does not count as correct
    }
    setTranscriptFeedback(updated)
  }
  
  
  

  return (
<div className="min-h-screen flex items-start justify-center p-6 bg-background font-sans">
  <div className="w-full max-w-6xl flex flex-row gap-6">
    
    {/* Left Panel - Transcript */}
    <div className="w-3/5 bg-background p-4 rounded-2xl min-h-[calc(100vh-6rem)] flex flex-col">
      <div className="bg-white p-6 shadow-md rounded-2xl flex-1 overflow-y-auto">
      <TranscriptView transcriptFeedback={transcriptFeedback} sessionStopped={sessionStopped}/>
      </div>
    </div>

    {/* Right Panel - Input + Buttons + Score */}
    <div className="w-2/5 flex flex-col min-h-[calc(100vh-6rem)] justify-between">
      
      {/* Input Section */}
      <div className="bg-background p-4 rounded-2xl ">
        <h2 className="text-2xl font-semibold mb-2">Input Text</h2>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your reference script here..."
          className={`w-full h-[200px] p-4 bg-white border shadow-md rounded-2xl resize-none text-base ${
            script ? 'text-black font-semibold' : 'text-gray-400'
          }`}
        />
        {showError && (
          <span className="text-red-600 text-sm mt-1">Please input your memorized text</span>
        )}
        <div className="flex justify-between mt-4 gap-3">
          {/* Start / Pause / Resume Button */}
          <button
            onClick={() => {
              if (!submitted) {
                handleStart()
                setScript('')
              } else {
                setPaused((prev) => !prev)
              }
            }}
            className={`w-full py-3 text-white rounded ${
              !submitted
                ? 'bg-green-500 hover:bg-green-600'
                : paused
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            disabled={!script && !submitted}
          >
            {!submitted ? 'Start' : paused ? 'Resume' : 'Pause'}
          </button>

          {/* Stop Button */}
          <button
            onClick={handleStop}
            className={`w-full py-3 text-white rounded ${
              sessionActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!sessionActive}
          >
            Stop
          </button>

          {/* Hint Button */}
          <button
            onClick={handleHint}
            disabled={!sessionActive || paused}
            className={`w-full py-3 rounded ${
              sessionActive && !paused
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
            >
            Hint
          </button>


        </div>
      </div>

      {/* Score Panel */}
      <div className="bg-background p-4 rounded-2xl  h-full flex flex-col justify-between">
        <h2 className="text-2xl font-semibold mb-2">Scoring</h2>
        <div className="bg-white p-4 shadow-md rounded-2xl flex-1 flex items-center justify-center">
          <p className="text-6xl font-bold text-gray-800">{score}%</p>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}
