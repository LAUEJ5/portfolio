'use client'

type WordFeedback = { word: string; correct: boolean }

export default function TranscriptView({ transcriptFeedback }: { transcriptFeedback: WordFeedback[] }) {
  return (
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
        <p className="text-gray-400">Test your memory here...</p>
      )}
    </div>
  )
}