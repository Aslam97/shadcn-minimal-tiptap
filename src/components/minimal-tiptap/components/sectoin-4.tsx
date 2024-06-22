import type { Editor } from '@tiptap/core'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CaretDownIcon, CodeIcon, DividerHorizontalIcon, PlusIcon, QuoteIcon } from '@radix-ui/react-icons'
import { ToolbarButton } from './toolbar-button'
import { activeItemClass } from '../utils'
import { ShortcutKey } from './shortcut-key'
import { LinkEditPopover } from './link/link-edit-popover'
import { ImageEditDialog } from './image/image-edit-dialog'

export default function SectionFour({ editor }: { editor: Editor }) {
  return (
    <>
      {/* LINK */}
      <LinkEditPopover editor={editor} />

      {/* IMAGE */}
      <ImageEditDialog editor={editor} />

      {/* INSERT ELEMENTS */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            isActive={editor.isActive('codeBlock') || editor.isActive('blockquote')}
            tooltip="Insert elements"
            className="w-12"
          >
            <PlusIcon className="size-5" />
            <CaretDownIcon className="size-5" />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn({
              [activeItemClass]: editor.isActive('codeBlock')
            })}
          >
            <CodeIcon className="mr-2 size-4" />
            Code block
            <ShortcutKey keys={['```']} withBg />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn({
              [activeItemClass]: editor.isActive('blockquote')
            })}
          >
            <QuoteIcon className="mr-2 size-4" />
            Blockquote
            <ShortcutKey keys={['>']} withBg />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <DividerHorizontalIcon className="mr-2 size-4" />
            Divider
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
