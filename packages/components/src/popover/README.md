# Popover

`Popover` is a react component that can be used to show any content in a
popover.

## `Popover`

### Properties

#### `autoPosition { bool } - default: true`

Defines if the Popover should be automatically positioned under specific
circumstances. For instance when the window is scrolled, the viewport is
resized, etc.

#### `autoRtl { bool } - default: true`

Defines if the Popover should automatically be adjusted for right-to-left
contexts. `autoRtl={ true }` will swap `right` and `left` position props in RTL
context.

#### `className { string } - optional`

Set a custom className for the main container. Keep in mind that `popover`
className will be always added to the instance.

#### `closeOnEsc { bool } - default: true`

#### `context { DOMElement | ref }`

The `context` property must be set to a DOMElement or React ref to the element
the popover should be attached to (point to).

#### `customPosition { object }`

Provide a custom position to render the popover at. The parent component takes all
responsibility for moving the popover on resize and scroll.

Example:

`{ left: 100, top: 20, positionClass: 'bottom' }`

You can specify `positionClass` to control which way the popover arrow points.

#### `id { string } - optional`

Use this optional property to set a Popover identifier among all of the Popover
instances. This property has been thought for development purpose.

#### `ignoreContext`

The `ignoreContext` lets you specify a component that you want to be on the
inside clickOutside context. So a context that you want to ignore. In most
cases this is not needed but if you want to also have a label
that can trigger the opening and closing of the Popover then you need to pass
in the label component as a reference.

#### `isVisible { bool } default - false`

By controlling the popover's visibility through the `isVisible` property, the
popover itself is responsible for providing any CSS transitions to
animate the opening/closing of the popover. This also keeps the parent's code
clean and readable, with a minimal amount of boilerplate code required to show
a popover.

#### `position { string } - default: 'top'`

The `position` property can be one of the following values:

- `top`
- `top left`
- `top right`
- `bottom`
- `bottom left`
- `bottom right`
- `left`
- `right`

This describes the position of the popover relative to the thing it is pointing
at. If the arrow is supposed to point at something to the top and left of the
Popover, the correct value for `position` is `bottom right`.

#### `showDelay { number } - default: 0 (false)`

Adds a delay before to show the popover. Its value is defined in `milliseconds`.

#### `onClose { func }`

The popover's `onClose` property must be set, and should modify the parent's
state such that the popover's `isVisible` property will be false when `render`
is called.

#### `onShow { func } - optional`

This function will be executed when the popover is shown.

#### `focusOnShow { bool } - default: true`

Defines whether or not the `Popover` should receive the focus when it shows.

### Usage notes

#### Within modals / dialogs

When using a popover within a modal applying the class `is-dialog-visible` to the `Popover` component will cause it to gain the correct `z-index` to allow it to display correctly within the modal.

```jsx
<Popover className="is-dialog-visible" />
```
