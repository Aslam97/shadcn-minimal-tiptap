import type { Editor } from '@tiptap/core'
import { cn } from '@/lib/utils'
import { CaretDownIcon, ListBulletIcon } from '@radix-ui/react-icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ToolbarButton } from './toolbar-button'
import { activeItemClass } from '../utils'
import { ShortcutKey } from './shortcut-key'

export default function SectionThree({ editor }: { editor: Editor }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('bulletList') || editor.isActive('orderedList')}
          tooltip="Lists"
          className="w-12"
        >
          <ListBulletIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn({ [activeItemClass]: editor.isActive('orderedList') })}
          aria-label="Numbered list"
        >
          Numbered list
          <ShortcutKey keys={['mod', 'shift', '7']} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn({ [activeItemClass]: editor.isActive('bulletList') })}
          aria-label="Bullet list"
        >
          Bullet list
          <ShortcutKey keys={['mod', 'shift', '8']} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
