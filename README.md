<a href="https://shadcn-minimal-tiptap.vercel.app" target="_blank">
  <img src="https://i.imgur.com/b7DJM4K.png" alt="Minimal Tiptap Editor" />
</a>

This is a Minimal Tiptap Editor Component built for [Shadcn](https://shadcn.com). It provides a simple and clean editor for users to write and format text.

## Installation

Before you can use the Minimal Tiptap Editor Component, you will need to install the following packages:

```bash
npm install @tiptap/extension-image @tiptap/extension-link @tiptap/pm @tiptap/react @tiptap/starter-kit
npm install @radix-ui/react-icons
npm install -D @tailwindcss/typography
```

The Minimal Tiptap Editor Component is depends on the following components from shadcn:

- [Button](https://ui.shadcn.com/docs/components/button)
- [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu)
- [Input](https://ui.shadcn.com/docs/components/input)
- [Label](https://ui.shadcn.com/docs/components/label)
- [Popover](https://ui.shadcn.com/docs/components/popover)
- [Separator](https://ui.shadcn.com/docs/components/separator)
- [Switch](https://ui.shadcn.com/docs/components/switch)
- [Toggle](https://ui.shadcn.com/docs/components/toggle)
- [Tooltip](https://ui.shadcn.com/docs/components/tooltip)
- [Dialog](https://ui.shadcn.com/docs/components/dialog)

Next, copy and paste the code from the `src` directory for `minimal-tiptap` into your project and customize to your needs. The code is yours.

## Props

The Minimal Tiptap Editor Component accepts the following props:

- `value` is the initial value of the editor.
- `outputValue` is the format of the output value. It can be 'html', 'json', or 'text'. Default is 'html'.
- `disabled` is a boolean to disable the editor.
- `contentClass` is a string to add a class to the editor content.
- `onValueChange` is a function that accepts a string and updates the value of the editor.

## Usage

```jsx
import React, { useState } from 'react'
import { MinimalTiptapEditor } from './minimal-tiptap'

export const App = () => {
  const [value, setValue] = useState('')

  return (
    <MinimalTiptapEditor
      value={value}
      onValueChange={setValue}
      outputValue="json"
      disabled={false}
      contentClass="max-w-3xl mx-auto mt-8"
    />
  )
}
```

## Advanced Template

Tiptap just released a new version 2 of their documentation with a advanced template. You can check it out [here](https://tiptap.dev/docs).
