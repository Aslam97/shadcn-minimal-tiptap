![Minimal Tiptap Editor](https://i.postimg.cc/GhfcqBpm/Screenshot-2024-08-19-at-19-43-06.png)

## Overview

The Minimal Tiptap Editor is a lightweight, customizable rich text editor component built for [Shadcn](https://ui.shadcn.com). It provides an intuitive interface for text formatting and editing.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Props](#props)
- [Key Behaviors](#key-behaviors)
- [Toolbar Customization](#toolbar-customization)
  - [SectionOne](#sectionone)
  - [SectionTwo](#sectiontwo)
  - [SectionFour](#sectionfour)
  - [SectionFive](#sectionfive)
  - [General Behavior](#general-behavior)
    - [Prevent focusing Dropdown Menu Trigger after clicking on the menu item](#prevent-focusing-dropdown-menu-trigger-after-clicking-on-the-menu-item)
- [Other Projects](#other-projects)
- [License](#license)

## Installation

Install the required packages:

```bash
npm install @tiptap/core @tiptap/extension-code-block-lowlight @tiptap/extension-color @tiptap/extension-heading @tiptap/extension-horizontal-rule @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-text-style @tiptap/extension-typography @tiptap/pm @tiptap/react @tiptap/starter-kit
```

## Dependencies

This component relies on the following Shadcn components:

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

Ensure these components are installed in your Shadcn project.

## Usage

1. Copy the `minimal-tiptap` directory into your project.
2. Import and use the component in your React application:

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
      editorClassName="focus:outline-none"
    />
  )
}
```

## Props

The Minimal Tiptap Editor accepts **all the tiptap editor props**. And the following additional props:

| Prop                     | Type                       | Default | Description                                 |
| ------------------------ | -------------------------- | ------- | ------------------------------------------- |
| `value`                  | string                     | -       | Initial editor content                      |
| `onChange`               | function                   | -       | Callback function for content changes       |
| `editorContentClassName` | string                     | -       | CSS class for the EditorContent component   |
| `output`                 | 'html' \| 'json' \| 'text' | 'html'  | Output format of the editor content         |
| `placeholder`            | string                     | -       | Placeholder text for the editor             |
| `editorClassName`        | string                     | -       | CSS class for the editor instance           |
| `throttleDelay`          | number                     | 1000    | Delay for throttling editor updates (in ms) |

## Key Behaviors

- When pressing `Enter` or creating a new block, it removes active formatting marks if any of these active: **bold**, **italic**, **strike**, **underline**, and **code**.
- For performance, Tiptap offers `shouldRerenderOnTransaction` prop that can be set to `false` to prevent unnecessary re-renders. But this can cause issues with the toolbar state. To avoid this, leave the prop as `true` (default) to ensure the toolbar state is updated correctly. or if you don't care about the active state in the toolbar, you can set it to `false`.

## Toolbar Customization

The Toolbar component offers extensive customization options, allowing you to control which editing options are available, their order, and how they are displayed. This customization is primarily achieved through the `activeActions` and `mainActionCount` props in various sections.

#### SectionOne

```typescript
<SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />
```

#### SectionTwo

```typescript
<SectionTwo
  editor={editor}
  activeActions={['bold', 'italic', 'strikethrough', 'code', 'clearFormatting']}
  mainActionCount={2}
/>
```

#### SectionFour

```typescript
<SectionFour editor={editor} activeActions={['orderedList', 'bulletList']} mainActionCount={0} />
```

#### SectionFive

```typescript
<SectionFive editor={editor} activeActions={['codeBlock', 'blockquote', 'horizontalRule']} mainActionCount={0} />
```

### General Behavior

- The order in `activeActions` determines the display order in the toolbar.
- Only items in `activeActions` are shown, allowing for both inclusion/exclusion and ordering.
- `mainActionCount` determines button vs dropdown display:
  - If 0, all actions are in the dropdown.
  - If 1, the first action is a button, the rest are in the dropdown.
  - If >= number of `activeActions`, all actions are buttons.

By adjusting these props, you can create a toolbar tailored to your specific editing needs, showing only the tools you want, in the order you prefer, and with the display style that suits your interface best.

#### Prevent focusing Dropdown Menu Trigger after clicking on the menu item

To prevent the Dropdown Menu Trigger from focusing after clicking on the menu item, you can add `onCloseAutoFocus` in the Dropdown Menu component.

```typescript
onCloseAutoFocus={event => event.preventDefault()}
```

## Other Projects

- [React Fancy Switch](https://github.com/Aslam97/react-fancy-switch)
- [React Confirm Dialog](https://github.com/Aslam97/react-confirm-dialog)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
