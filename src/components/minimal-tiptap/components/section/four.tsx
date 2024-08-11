import type { Editor } from '@tiptap/core'
import { cn } from '@/lib/utils'
import { CaretDownIcon, ListBulletIcon } from '@radix-ui/react-icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ToolbarButton } from '../toolbar-button'
import { ShortcutKey } from '../shortcut-key'

interface ListItem {
  label: string
  isActive: (editor: Editor) => boolean
  onClick: (editor: Editor) => void
  shortcutKeys: string[]
}

const listItems: ListItem[] = [
  {
    label: 'Numbered list',
    isActive: editor => editor.isActive('orderedList'),
    onClick: editor => editor.chain().focus().toggleOrderedList().run(),
    shortcutKeys: ['mod', 'shift', '7']
  },
  {
    label: 'Bullet list',
    isActive: editor => editor.isActive('bulletList'),
    onClick: editor => editor.chain().focus().toggleBulletList().run(),
    shortcutKeys: ['mod', 'shift', '8']
  }
]

export const SectionFour = ({ editor }: { editor: Editor }) => {
  const isAnyListActive = listItems.some(item => item.isActive(editor))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isActive={isAnyListActive} tooltip="Lists" aria-label="Lists" className="w-12">
          <ListBulletIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full" onCloseAutoFocus={event => event.preventDefault()}>
        {listItems.map(item => (
          <DropdownMenuItem
            key={item.label}
            onClick={() => item.onClick(editor)}
            className={cn('flex flex-row items-center justify-between gap-4', { 'bg-accent': item.isActive(editor) })}
            aria-label={item.label}
          >
            <span className="grow">{item.label}</span>
            <ShortcutKey keys={item.shortcutKeys} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SectionFour
