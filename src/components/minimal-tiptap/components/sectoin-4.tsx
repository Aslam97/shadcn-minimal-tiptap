import type { Editor } from '@tiptap/core'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  CaretDownIcon,
  CodeIcon,
  DividerHorizontalIcon,
  ImageIcon,
  Link2Icon,
  PlusIcon,
  QuoteIcon
} from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { ToolbarButton } from './toolbar-button'
import { activeItemClass } from '../utils'
import { ShortcutKey } from './shortcut-key'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function SectionFour({ editor }: { editor: Editor }) {
  const [openLink, setOpenLink] = useState(false)
  const [openImage, setOpenImage] = useState(false)

  return (
    <>
      {/* LINK */}
      <Popover open={openLink} onOpenChange={setOpenLink}>
        <PopoverTrigger asChild>
          <ToolbarButton isActive={editor.isActive('link')} tooltip="Link">
            <Link2Icon className="size-5" />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-80" align="start" side="bottom">
          <LinkEditBlock editor={editor} close={() => setOpenLink(false)} />
        </PopoverContent>
      </Popover>

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

const LinkEditBlock = ({ editor, close }: { editor: Editor; close: () => void }) => {
  const [field, setField] = useState<{
    text?: string
    link: string
    openInNewTab?: boolean
  }>({
    text: '',
    link: '',
    openInNewTab: false
  })

  const { href, target } = editor.getAttributes('link')
  const { from, to } = editor.state.selection
  const text = editor.state.doc.textBetween(from, to, ' ')

  const data = useMemo(() => {
    return {
      text,
      link: href,
      openInNewTab: target === '_blank' ? true : false
    }
  }, [href, target, text])

  // on mount, set the field values to the current link
  useEffect(() => {
    setField(data)
  }, [data])

  const setLink = () => {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .insertContent({
        type: 'text',
        text: field.text ?? field.link,
        marks: [
          {
            type: 'link',
            attrs: {
              href: field.link,
              target: field.openInNewTab ? '_blank' : null
            }
          }
        ]
      })
      .setLink({ href: field.link })
      .focus()
      .run()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Link</Label>
        <Input
          type="url"
          required
          placeholder="Paste a link"
          value={field.link ?? ''}
          onChange={e => setField({ ...field, link: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <Label>Display text (optional)</Label>
        <Input
          type="text"
          placeholder="Text to display"
          value={field.text ?? ''}
          onChange={e => setField({ ...field, text: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label>Open in New Tab</Label>
        <Switch
          checked={field.openInNewTab}
          onCheckedChange={() => setField({ ...field, openInNewTab: !field.openInNewTab })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="ghost" type="button" onClick={close}>
          Cancel
        </Button>
        <Button onClick={() => setLink()}>Insert</Button>
      </div>
    </div>
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
