![Minimal Tiptap Editor](https://i.postimg.cc/fbq7dbPj/Screenshot-2024-08-18-at-19-56-56.png)

## Overview

The Minimal Tiptap Editor is a lightweight, customizable rich text editor component built for [Shadcn](https://ui.shadcn.com). It provides an intuitive interface for text formatting and editing.

## Table of Contents

1. [Installation](#installation)
2. [Dependencies](#dependencies)
3. [Usage](#usage)
4. [Props](#props)
5. [Toolbar Customization](#toolbar-customization)
6. [Key Behaviors](#key-behaviors)
7. [Other Projects](#other-projects)
8. [License](#license)

## Installation

Install the required packages:

```bash
npm install @tiptap/core @tiptap/extension-heading @tiptap/extension-horizontal-rule @tiptap/extension-image @tiptap/extension-link @tiptap/pm @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-task-item @tiptap/extension-task-list @tiptap/extension-typography @tiptap/extension-code-block-lowlight @tiptap/extension-color @tiptap/extension-text-style lowlight
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

| Prop                     | Type                       | Default | Description                                 |
| ------------------------ | -------------------------- | ------- | ------------------------------------------- |
| `value`                  | string                     | -       | Initial editor content                      |
| `onChange`               | function                   | -       | Callback function for content changes       |
| `editorContentClassName` | string                     | -       | CSS class for the EditorContent component   |
| `output`                 | 'html' \| 'json' \| 'text' | 'html'  | Output format of the editor content         |
| `placeholder`            | string                     | -       | Placeholder text for the editor             |
| `editorClassName`        | string                     | -       | CSS class for the editor instance           |
| `throttleDelay`          | number                     | 1000    | Delay for throttling editor updates (in ms) |

Plus all props from the Tiptap Editor Component.

## Toolbar Customization

The Toolbar component offers extensive customization options, allowing you to control which editing options are available, their order, and how they are displayed. This customization is primarily achieved through the `activeActions` and `mainActionCount` props in various sections.

### Ordering and Display of Actions

- **Order of Actions**: The order of items in the `activeActions` array directly determines the order in which they appear in the toolbar.
- **Inclusion of Actions**: Only the items specified in `activeActions` will be shown.
- **Main Actions vs Dropdown**: The `mainActionCount` prop determines how many actions are displayed as primary buttons versus being placed in a dropdown menu.

### Customizable Sections

#### SectionOne: Heading Levels

```typescript
<SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />
```

Customization Options:

- `activeLevels`: Array of numbers representing heading levels to include (1-6).
- Example: `[3, 1, 2]` shows options for H3, H1, and H2 in that order.

#### SectionTwo: Text Formatting

```typescript
<SectionTwo
  editor={editor}
  activeActions={['bold', 'italic', 'strikethrough', 'code', 'clearFormatting']}
  mainActionCount={2}
/>
```

Customization Options:

- `activeActions`: Array of text formatting options to include.
- `mainActionCount`: Number of actions to display as primary buttons.

#### SectionFour: List Formatting

```typescript
<SectionFour editor={editor} activeActions={['orderedList', 'bulletList']} mainActionCount={0} />
```

Customization Options:

- `activeActions`: Array of list formatting options to include.
- `mainActionCount`: Number of actions to display as primary buttons.

#### SectionFive: Block Formatting

```typescript
<SectionFive editor={editor} activeActions={['codeBlock', 'blockquote', 'horizontalRule']} mainActionCount={0} />
```

Customization Options:

- `activeActions`: Array of block formatting options to include.
- `mainActionCount`: Number of actions to display as primary buttons.

### General Behavior

- The order in `activeActions` determines the display order in the toolbar.
- Only items in `activeActions` are shown, allowing for both inclusion/exclusion and ordering.
- `mainActionCount` determines button vs dropdown display:
  - If 0, all actions are in the dropdown.
  - If 1, the first action is a button, the rest are in the dropdown.
  - If >= number of `activeActions`, all actions are buttons.

By adjusting these props, you can create a toolbar tailored to your specific editing needs, showing only the tools you want, in the order you prefer, and with the display style that suits your interface best.

## Key Behaviors

- Pressing `Enter` removes active states for 'bold', 'italic', 'strike', 'underline', and 'code'.
- Set `shouldRerenderOnTransaction` to `true` (default) to maintain active states.

## Other Projects

- [React Fancy Switch](https://github.com/Aslam97/react-fancy-switch)
- [React Confirm Dialog](https://github.com/Aslam97/react-confirm-dialog)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
