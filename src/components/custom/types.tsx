import { BentoCard, BentoGrid } from '@/components/custom/bento-grid'
import { MinimalTiptapEditor } from '../minimal-tiptap'
import { cn } from '@/lib/utils'
import { MinimalTiptapOne } from './minimal-tiptap-one'
import { MinimalTiptapThree } from './minimal-tiptap-three'
import Content from '../../data/content.json'

const features = [
  {
    name: 'Minimal Tiptap 1',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <MinimalTiptapOne
        throttleDelay={1000}
        className={cn('h-full min-h-56 w-full rounded-xl')}
        editorContentClassName="overflow-auto h-full"
        output="html"
        placeholder="Comment here..."
        editable={true}
        editorClassName="focus:outline-none px-5 py-4 h-full"
      />
    )
  },
  {
    name: 'Minimal Tiptap 2',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <MinimalTiptapEditor
        throttleDelay={2000}
        className={cn('h-full min-h-56 w-full rounded-xl')}
        editorContentClassName="overflow-auto h-full"
        output="html"
        placeholder="Type your description here..."
        editable={true}
        editorClassName="focus:outline-none px-5 py-4 h-full"
      />
    )
  },
  {
    name: 'Minimal Tiptap 3',
    className: 'col-span-3',
    background: (
      <MinimalTiptapThree
        value={Content}
        throttleDelay={3000}
        className={cn('h-full min-h-56 w-full rounded-xl')}
        editorContentClassName="overflow-auto h-full"
        output="json"
        onChange={value => {
          console.log(value)
        }}
        placeholder="This is your placeholder..."
        editable={true}
        editorClassName="focus:outline-none px-5 py-4 h-full"
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
