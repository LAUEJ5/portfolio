'use client'

import { useEffect, useRef, useState } from 'react'

export default function RecallrPage() {
  const [script, setScript] = useState('')
  const [submitted, setSubmitted] = useState(false)
  type WordFeedback = { word: string; correct: boolean }
  const [transcriptFeedback, setTranscriptFeedback] = useState<WordFeedback[]>([])
  
  const wsRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleStart = async () => {
    if (!script.trim()) return alert('Please paste a reference script.')

    setSubmitted(true)

    // Connect to backend WebSocket
    const ws = new WebSocket('wss://recallr.onrender.com/ws')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')

      // Send reference script
      ws.send(JSON.stringify({ type: 'script', payload: script }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'transcript') {
        setTranscriptFeedback(data.payload)
      }
    }

    // Get mic access
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
    mediaRecorderRef.current?.stop()
    wsRef.current?.send(JSON.stringify({ type: 'end' }))
    wsRef.current?.close()
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-background">
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl shadow-md overflow-hidden border bg-white">
        {/* Left pane */}
        <div className="w-full md:w-3/5 p-6 overflow-y-auto border-r">
          <h2 className="text-2xl font-semibold mb-4">Reference Text</h2>
          <div className="text-xl leading-relaxed whitespace-pre-wrap space-y-2 h-[calc(100vh-180px)] overflow-y-auto pr-2">
            {transcriptFeedback.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {transcriptFeedback.map((word, idx) => (
                  <span
                    key={idx}
                    className={`${
                      word.correct ? 'text-green-600' : 'text-red-500 underline'
                    }`}
                  >
                    {word.word}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Your reference text will appear here as you speak.</p>
            )}
          </div>
        </div>
  
        {/* Right pane */}
        <div className="w-full md:w-2/5 p-6 bg-muted space-y-4 h-full">
          <h2 className="text-xl font-semibold">Paste Your Script</h2>
          {!submitted && (
            <>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste your reference script here..."
                className="w-full h-48 p-4 border rounded-md"
              />
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Start Session
              </button>
            </>
          )}
          {submitted && (
            <button
              onClick={handleStop}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Stop Session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}  