import { useState } from 'react'
import { MinimalTiptapEditor } from './components/minimal-tiptap'

export default function App() {
  const [value, setValue] = useState<string>('')

  return (
    <main className="flex justify-center min-h-screen place-items-center bg-white p-4">
      <div className="w-full text-center max-w-4xl">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Minimal Tiptap Editor
        </h1>
        <div className="mt-10 flex text-left">
          <MinimalTiptapEditor value={value} onValueChange={setValue} />
        </div>
      </div>
    </main>
  )
}
