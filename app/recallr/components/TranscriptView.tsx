type WordFeedback = { word: string; correct: boolean; hint?: boolean }

export default function TranscriptView({
  transcriptFeedback,
  sessionStopped,
}: {
  transcriptFeedback: WordFeedback[]
  sessionStopped: boolean
}) {
  return (
    <div className="text-xl leading-relaxed whitespace-pre-wrap space-y-2 h-[calc(100vh-180px)] overflow-y-auto pr-2">
      {transcriptFeedback.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {transcriptFeedback.map((word, idx) => {
            const isMissed = sessionStopped && !word.correct
            const baseClasses = 'transition duration-200'
            const finalClass = word.correct
              ? 'text-green-600'
              : isMissed
              ? 'text-red-500'
              : 'text-black blur-sm'

            return (
            <span
            key={idx}
            className={`${
                word.correct
                ? 'text-green-600'
                : word.hint
                ? 'text-red-500'
                : 'text-black blur-sm'
            }`}
            >
            {word.word}
            </span>

            )
          })}
        </div>
      ) : (
        <p className="text-gray-400">Paste your reference script here...</p>
      )}
    </div>
  )
}