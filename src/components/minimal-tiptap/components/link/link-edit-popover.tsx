import type { Editor } from '@tiptap/core'
import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Link2Icon } from '@radix-ui/react-icons'
import { ToolbarButton } from '../toolbar-button'
import { LinkEditBlock } from './link-edit-block'
import { LinkProps } from '../../types'
import { setLink } from '../../utils'

const LinkEditPopover = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = React.useState(false)

  const onSetLink = (props: LinkProps) => {
    setLink(editor, props)
    editor.commands.enter()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('link')}
          tooltip="Link"
          aria-label="Insert link"
          disabled={editor.isActive('codeBlock')}
        >
          <Link2Icon className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-80" align="start" side="bottom">
        <LinkEditBlock editor={editor} close={() => setOpen(false)} onSetLink={onSetLink} />
      </PopoverContent>
    </Popover>
  )
}

export { LinkEditPopover }
