import type { Editor } from '@tiptap/core'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { LinkProps } from '../../types'
import { cn } from '@/lib/utils'

interface LinkEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor
  onSetLink: ({ url, text, openInNewTab }: LinkProps) => void
  close?: () => void
}

const LinkEditBlock = ({ editor, onSetLink, close, className, ...props }: LinkEditBlockProps) => {
  const formRef = React.useRef<HTMLDivElement>(null)

  const [field, setField] = React.useState<LinkProps>({
    url: '',
    text: '',
    openInNewTab: false
  })

  const data = React.useMemo(() => {
    const { href, target } = editor.getAttributes('link')
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to, ' ')

    return {
      url: href,
      text,
      openInNewTab: target === '_blank' ? true : false
    }
  }, [editor])

  React.useEffect(() => {
    setField(data)
  }, [data])

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault()

    if (formRef.current) {
      const isValid = Array.from(formRef.current.querySelectorAll('input')).every(input => input.checkValidity())

      if (isValid) {
        onSetLink(field)
        close?.()
      } else {
        formRef.current.querySelectorAll('input').forEach(input => {
          if (!input.checkValidity()) {
            input.reportValidity()
          }
        })
      }
    }
  }

  return (
    <div ref={formRef}>
      <div className={cn('space-y-4', className)} {...props}>
        <div className="space-y-1">
          <Label>Link</Label>
          <Input
            type="url"
            required
            placeholder="Paste a link"
            value={field.url ?? ''}
            onChange={e => setField({ ...field, url: e.target.value })}
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
          <Label>Open in new tab</Label>
          <Switch
            checked={field.openInNewTab}
            onCheckedChange={checked => setField({ ...field, openInNewTab: checked })}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {close && (
            <Button variant="ghost" type="button" onClick={close}>
              Cancel
            </Button>
          )}

          <Button type="button" onClick={handleClick}>
            Insert
          </Button>
        </div>
      </div>
    </div>
  )
}

export { LinkEditBlock }
