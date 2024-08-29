import { BentoCard, BentoGrid } from '@/components/custom/bento-grid'
import { MinimalTiptapEditor } from '../minimal-tiptap'
import { cn } from '@/lib/utils'
import MinimalTiptapOne from './minimal-tiptap-one'
import MinimalTiptapThree from './minimal-tiptap-three'

const features = [
  {
    name: 'Minimal Tiptap 1',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <MinimalTiptapOne
        throttleDelay={2000}
        className={cn('h-full min-h-0 w-full rounded-xl')}
        editorContentClassName="some-class"
        output="html"
        placeholder="Comment here..."
        autofocus={true}
        immediatelyRender={true}
        editable={true}
        injectCSS={true}
        editorClassName="focus:outline-none p-5"
      />
    )
  },
  {
    name: 'Minimal Tiptap 2',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <MinimalTiptapEditor
        throttleDelay={2000}
        className={cn('h-full min-h-0 w-full rounded-xl')}
        editorContentClassName="some-class"
        output="html"
        placeholder="Type your description here..."
        autofocus={true}
        immediatelyRender={true}
        editable={true}
        injectCSS={true}
        editorClassName="focus:outline-none p-5"
      />
    )
  },
  {
    name: 'Minimal Tiptap 3',
    className: 'col-span-3',
    background: (
      <MinimalTiptapThree
        throttleDelay={2000}
        className={cn('h-full min-h-0 w-full rounded-xl')}
        editorContentClassName="some-class"
        output="html"
        placeholder="This is your placeholder..."
        autofocus={true}
        immediatelyRender={true}
        editable={true}
        injectCSS={true}
        editorClassName="focus:outline-none p-5"
      />
    )
  }
]

export function BentoMinimalTiptap() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  )
}
