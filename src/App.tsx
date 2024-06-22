import { useState } from "react";
import { MinimalTiptapEditor } from "./components/minimal-tiptap";

export default function App() {
  const [value, setValue] = useState<string>("");

  return (
    <main className="flex min-h-screen place-items-center justify-center bg-white p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            Minimal Tiptap Editor
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <a
                href="https://github.com/Aslam97/shadcn-tiptap"
                className="font-semibold text-primary"
              >
                View on Github <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="mt-10 flex text-left">
            <MinimalTiptapEditor value={value} onValueChange={setValue} />
          </div>
        </div>
      </div>
    </main>
  );
}
