![Minimal Tiptap Editor](https://i.postimg.cc/4yntFTn8/Screenshot-2024-08-30-at-04-54-46.png)

## Overview

The Minimal Tiptap Editor is a lightweight, customizable rich text editor component built for [Shadcn](https://ui.shadcn.com). It provides an intuitive interface for text formatting and editing.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Props](#props)
- [Image Extension](#image-extension)
  - [Customization](#customization)
  - [Handling Image Uploads](#handling-image-uploads)
  - [Error Handling](#error-handling)
- [Toolbar Customization](#toolbar-customization)
- [Key Behaviors](#key-behaviors)
- [Other Projects](#other-projects)
- [License](#license)

## Installation

1. Install the required packages:

```bash
npm install @tiptap/core @tiptap/extension-code-block-lowlight lowlight react-medium-image-zoom @tiptap/extension-color @tiptap/extension-heading @tiptap/extension-horizontal-rule @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-text-style @tiptap/extension-typography @tiptap/pm @tiptap/react @tiptap/starter-kit
```

2. Set up the `TooltipProvider`:

Add the `TooltipProvider` to your root component (e.g., `App.tsx`, `main.tsx`, or equivalent):

```tsx
import { TooltipProvider } from '@/components/ui/tooltip'

export const App = () => {
  return (
    <TooltipProvider>
      {/* Your other components */}
      <YourComponent />
    </TooltipProvider>
  )
}
```

## Dependencies

Ensure you have the following Shadcn components installed in your project:

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
- [Sonner](https://ui.shadcn.com/docs/components/sonner)

## Usage

1. Copy the `minimal-tiptap` directory into your project.
2. Import and use the component in your React application:

```tsx
import { useState } from 'react'
import { Content } from '@tiptap/react'
import { MinimalTiptapEditor } from './minimal-tiptap'

export const App = () => {
  const [value, setValue] = useState<Content>('')

  return (
    <MinimalTiptapEditor
      value={value}
      onChange={setValue}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Type your description here..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
    />
  )
}
```

## Props

The Minimal Tiptap Editor accepts all standard Tiptap editor props, plus these additional props:

| Prop                     | Type                       | Default | Description                                 |
| ------------------------ | -------------------------- | ------- | ------------------------------------------- |
| `value`                  | string                     | -       | Initial editor content                      |
| `onChange`               | function                   | -       | Callback function for content changes       |
| `editorContentClassName` | string                     | -       | CSS class for the EditorContent component   |
| `output`                 | 'html' \| 'json' \| 'text' | 'html'  | Output format of the editor content         |
| `placeholder`            | string                     | -       | Placeholder text for the editor             |
| `editorClassName`        | string                     | -       | CSS class for the editor instance           |
| `throttleDelay`          | number                     | 0       | Delay for throttling editor updates (in ms) |

## Image Extension

### Customization

Customize the Image extension by passing options:

> Note: The `uploadFn` must return the URL of the uploaded image. If you dont specify `uploadFn`, please enable the `allowBase64` option.

```typescript
Image.configure({
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  uploadFn: myCustomUploadFunction,
  onActionSuccess: handleActionSuccess,
  onActionError: handleActionError,
  onValidationError: handleValidationError
})
```

### Handling Image Uploads

Provide a custom `uploadFn` to handle image uploads:

```typescript
const myCustomUploadFunction = async (file: File, editor: Editor) => {
  // Implement your upload logic here
  // Return the URL of the uploaded image
  return 'https://example.com/uploaded-image.jpg'
}

Image.configure({
  uploadFn: myCustomUploadFunction
})
```

### Error Handling

Implement error handling callbacks for a better user experience:

```typescript
Image.configure({
  onActionError: (error, props) => {
    console.error('Image action failed:', error, props)
    // Show user-friendly error message
  },
  onValidationError: errors => {
    console.error('Image validation failed:', errors)
    // Show validation error to the user
  }
})
```

## Toolbar Customization

Customize the toolbar using the `activeActions`, `mainActionCount`, `size`, and `variant` props in various sections:

```typescript
<SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} variant="outline" />

<SectionTwo
  editor={editor}
  activeActions={['bold', 'italic', 'strikethrough', 'code', 'clearFormatting']}
  mainActionCount={2}
/>

<SectionFour editor={editor} activeActions={['orderedList', 'bulletList']} mainActionCount={0} />

<SectionFive editor={editor} activeActions={['codeBlock', 'blockquote', 'horizontalRule']} mainActionCount={0} />
```

To prevent focusing the Dropdown Menu Trigger after clicking a menu item, add:

```typescript
onCloseAutoFocus={event => event.preventDefault()}
```

## Key Behaviors

- Pressing `Enter` or creating a new block removes active formatting marks (bold, italic, strike, underline, code).
- Set `shouldRerenderOnTransaction` to `false` for performance, but this may affect toolbar state updates.

## Other Projects

- [React Fancy Switch](https://github.com/Aslam97/react-fancy-switch)
- [React Confirm Dialog](https://github.com/Aslam97/react-confirm-dialog)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
