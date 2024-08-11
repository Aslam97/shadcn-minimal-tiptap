<a href="https://shadcn-minimal-tiptap.vercel.app" target="_blank">
  <img src="https://i.postimg.cc/7P03FZkh/Screenshot-2024-08-11-at-22-15-02.png" border="0" alt="Minimal Tiptap Editor" />
</a>

# Minimal Tiptap Editor

This is a Minimal Tiptap Editor Component built for [Shadcn](https://ui.shadcn.com). It provides a simple and clean editor for users to write and format text.

## Installation

Before you can use the Minimal Tiptap Editor Component, you need to install the following packages:

```bash
npm install @tiptap/core @tiptap/extension-heading @tiptap/extension-horizontal-rule @tiptap/extension-image @tiptap/extension-link @tiptap/pm @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-task-item @tiptap/extension-task-list @tiptap/extension-typography @tiptap/extension-code-block-lowlight @tiptap/extension-color @tiptap/extension-text-style lowlight
```

The Minimal Tiptap Editor Component depends on the following components from Shadcn:

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
- [Toggle Group](https://ui.shadcn.com/docs/components/toggle-group)

Next, copy the `minimal-tiptap` directory and paste into your project. The code is yours to use and modify.

## Props

The Minimal Tiptap Editor Component accepts all the props from the Tiptap Editor Component. The following are additional props:

- `value` is the initial value of the editor.
- `onChange` is a function that receives the value of the editor.
- `editorContentClassName` is a string to add a class to the `EditorContent` component.
- `output` is the format of the output value. It can be `'html'`, `'json'`, or `'text'`. Default is `'html'`.
- `placeholder` is a string to display as a placeholder in the editor.
- `editorClassName` is a string to add a class to the `useEditor` hooks. which is the editor itself.
- `throttleDelay` is a number to delay the throttle of the editor. Default is `1000`.

## Usage

```tsx
import { useState } from 'react'
import { MinimalTiptapEditor } from './minimal-tiptap'

export const App = () => {
  const [value, setValue] = useState('')

  return (
    <MinimalTiptapEditor
      value={value}
      onChange={setValue}
      throttleDelay={2000}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Type your description here..."
      autofocus={true}
      immediatelyRender={true}
      editable={true}
      injectCSS={true}
      shouldRerenderOnTransaction={false}
      editorClassName="focus:outline-none"
    />
  )
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
