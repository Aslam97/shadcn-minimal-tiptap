import type { Editor } from '@tiptap/core'
import { cn } from '@/lib/utils'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CaretDownIcon, CodeIcon, DividerHorizontalIcon, ImageIcon, PlusIcon, QuoteIcon } from '@radix-ui/react-icons'
import { ToolbarButton } from './toolbar-button'
import { activeItemClass } from '../utils'
import { ShortcutKey } from './shortcut-key'
import { LinkEditPopover } from './link/link-edit-popover'

export default function SectionFour({ editor }: { editor: Editor }) {
  const [openImage, setOpenImage] = useState(false)

  return (
    <>
      {/* LINK */}
      <LinkEditPopover editor={editor} />

      {/* IMAGE */}
      <Dialog open={openImage} onOpenChange={setOpenImage}>
        <DialogTrigger asChild>
          <ToolbarButton isActive={editor.isActive('image')} tooltip="Image" aria-label="Image">
            <ImageIcon className="size-5" />
          </ToolbarButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select image</DialogTitle>
          </DialogHeader>
          <ImageBlock editor={editor} close={() => setOpenImage(false)} />
        </DialogContent>
      </Dialog>

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

const ImageBlock = ({ editor, close }: { editor: Editor; close: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [link, setLink] = useState<string>('')

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleLink = () => {
    editor.chain().focus().setImage({ src: link }).run()
    close()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const reader = new FileReader()
    reader.onload = e => {
      const src = e.target?.result as string
      editor.chain().setImage({ src }).focus().run()
    }

    reader.readAsDataURL(files[0])
    close()
  }

  return (
    <div>
      <div className="space-y-1">
        <Label>Attach an image link</Label>
        <div className="flex">
          <Input
            type="url"
            required
            placeholder="https://example.com"
            value={link}
            className="grow"
            onChange={e => setLink(e.target.value)}
          />
          <Button className="ml-2 inline-block" onClick={handleLink}>
            Submit
          </Button>
        </div>
      </div>
      <Button className="mt-6 w-full" onClick={handleClick}>
        Upload from your computer
      </Button>
      <input type="file" accept="image/*" ref={fileInputRef} multiple className="hidden" onChange={handleFile} />
    </div>
  )
}
