import Link from "next/link"
import { Github, Linkedin } from 'lucide-react' // Optional: use a LinkedIn icon, otherwise leave as is

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-xl font-semibold">jeremylaue.com</h2>
        <div className="flex items-center gap-4">
        <Link
          href="https://www.linkedin.com/in/jeremy-laue/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 mt-[-5px] text-gray-700"
          >
            <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 24V7h5v17H0zm7.5-17H12v2.56h.08c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.46 3.04 5.46 6.98V24h-5v-8.37c0-2-.04-4.56-2.78-4.56-2.78 0-3.2 2.17-3.2 4.41V24h-5V7z" />
          </svg>
          <span className="sr-only">LinkedIn</span>
        </Link>


          <Link href="https://github.com/LAUEJ5" target="_blank" rel="noopener noreferrer">
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://jeremysfilms.com" target="_blank" rel="noopener noreferrer" className="text-sm">
            Film Reviews
          </Link>
          <div className="relative group">
            <button className="text-sm flex items-center">
              About me
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 ml-1"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10">
              <Link href="/about" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                About Me
              </Link>
              <Link href="/resume" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                Resume
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <h1 className="text-4xl font-bold mb-16">Hey, I'm Jeremy.</h1>

        {/* Text-to-Speech Project */}
        <div className="my-12 p-8 border border-gray-200 rounded-lg">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4">Text-to-Speech Displayer</h2>
              <p className="text-gray-600 mb-6">A tool that converts text to speech with real-time visualization. Built with React for the frontend and a Node.js backend hosted on Render.</p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-gray-600">Multiple voice options</li>
                <li className="text-gray-600">Adjustable speech rate and pitch</li>
                <li className="text-gray-600">Visual waveform display</li>
                <li className="text-gray-600">Save audio as MP3</li>
              </ul>
            </div>
            
            <div className="md:w-1/2 bg-gray-50 rounded-lg p-4">
              <div id="text-to-speech-demo" className="space-y-4">
                <textarea
                  placeholder="Enter text to convert to speech"
                  className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                  defaultValue="Hello! This is a demo of the text-to-speech displayer."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="default">Default</option>
                      <option value="voice1">Voice 1</option>
                      <option value="voice2">Voice 2</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rate: 1.0</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pitch: 1.0</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                    Play
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50">
                    Stop
                  </button>
                  <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                    Save as MP3
                  </button>
                </div>
                
                <div className="h-16 bg-gray-50 rounded-md border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Waveform visualization
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for future projects */}
        <div className="my-12 p-8 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Future Project #1</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        <div className="my-12 p-8 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Future Project #2</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        {/* Interactive Element */}
        <div className="my-12 p-8 border border-gray-200 rounded-lg text-center">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
            Want to learn more about my projects?
          </button>
          <p className="mt-4 text-gray-500">Click the button to explore more details</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
      </footer>
    </div>
  )
}
