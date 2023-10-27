---
title: "공통 컴포넌트 (예시: <div>)"
---

<Intro>

모든 내장 브라우저 컴포넌트 (예시: [`<div>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/div))는 공통의 props와 이벤트를 지원합니다.

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### 공통 컴포넌트 (예시: `<div>`) {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[아래의 예시를 더 참고하세요.](#usage)

#### Props {/*common-props*/}

아래의 특별한 React props 들은 내장된 모든 컴포넌트에서 지원합니다.

* `children`: React 노드(엘리먼트, 문자열, 숫자, [portal,](/reference/react-dom/createPortal) `null`, `undefined` 그리고 불리언 타입과 같은 빈 노드, 또는 다른 React 노드의 배열) 입니다. 컴포넌트 내부의 콘텐츠를 지정합니다. JSX를 사용하면 일반적으로`<div><span /></div>`의 예시처럼 태그를 중첩하여 `children` prop를 암묵적으로 지정합니다.

* `dangerouslySetInnerHTML`: 원시 HTML 문자열이 포함된`{ __html: '<p>some html</p>' }`형식의 객체입니다. DOM 노드의 [`innerHTML`](https://developer.mozilla.org/ko/docs/Web/API/Element/innerHTML) 프로퍼티를 덮어쓰고 전달된 HTML을 내부에 표시합니다. 이것은 매우 주의해서 사용해야 합니다. 내부 HTML을 신뢰할 수 없는 경우 (예시: 사용자 데이터를 기반으로 하는 경우) [XSS](https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8_%EA%B0%84_%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8C%85) 취약점이 발생할 수 있습니다. [`dangerouslySetInnerHTML`에 대해 더 알아보려면 읽어보세요.](#dangerously-setting-the-inner-html)

* `ref`: [`useRef`](/reference/react/useRef)나 [`createRef`](/reference/react/createRef)의 ref 객체, 또는 [`ref` 콜백 함수](#ref-callback)거나 [legacy refs](https://ko.legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)의 문자열입니다. 해당 ref는 해당 노드의 DOM 엘리먼트로 채워집니다. [ref를 사용하여 DOM을 조작하는 방법에 대해 더 자세히 알아보세요.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: 불리언 타입입니다. `true` 일 때, 일반적으로 같이 사용하지 않는 `children`과 `contentEditable={true}`가 모두 존재하는 엘리먼트에 대해 React에서 발생하는 경고를 나타내지 않습니다. 이는`contentEditable` 콘텐츠를 수동으로 관리하는 텍스트 입력 라이브러리를 빌드할 때 사용됩니다.

* `suppressHydrationWarning`: 불리언 타입입니다. [서버 렌더링](/reference/react-dom/server)을 사용할 때, 일반적으로 서버와 클라이언트가 서로 다른 콘텐츠를 렌더링하면 경고가 표시됩니다. 일부 드문 사례(예시: 타임스탬프)에서는 정확한 일치를 보장하기가 매우 어렵거나 불가능합니다. `suppressHydrationWarning`를 `true`로 설정하면, React는 해당 엘리먼트의 어트리뷰트와 콘텐츠가 일치하지 않아도 경고를 표시하지 않습니다. 이는 한 단계의 깊이에서만 작동하며, 탈출구로 사용하기 위한 것입니다. 과도하게 사용하지 마세요. [suppressing hydration 오류에 대해서 읽어보세요.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: `{ fontWeight: 'bold', margin: 20 }`와 같이 CSS 스타일이 있는 객체입니다. DOM의 [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) 프로퍼티에서 `fontWeight` 대신 `font-weight`로 작성하는 것과 마찬가지로 CSS 프로퍼티의 이름도 `camelCase`로 작성해야 합니다. 또한 문자열이나 숫자를 값으로 전달할 수 있습니다. `width: 100`와 같은 숫자를 전달한다면 React는 [단위가 없는 프로퍼티](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57)가 아니라면 자동으로 `px` ("픽셀")로 값을 추가합니다. `style`은 스타일 값을 미리 알 수 없는 동적 스타일에만 사용하는 것을 권장합니다. 그 외의 경우에는 `className`을 사용하여 일반 CSS 클래스를 사용하는 것이 더 효율적입니다. [`className`과 `style`에 대해서 더 자세히 알아보세요.](#applying-css-styles)

아래의 표준 DOM props 들은 내장된 모든 컴포넌트에서 지원합니다.

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): A string. Specifies a keyboard shortcut for the element. [Not generally recommended.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA attributes let you specify the accessibility tree information for this element. See [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) for a complete reference. In React, all ARIA attribute names are exactly the same as in HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): A string. Specifies whether and how the user input should be capitalized.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): A string. Specifies the element's CSS class name. [Read more about applying CSS styles.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): A boolean. If `true`, the browser lets the user edit the rendered element directly. This is used to implement rich text input libraries like [Lexical.](https://lexical.dev/) React warns if you try to pass React children to an element with `contentEditable={true}` because React will not be able to update its content after user edits.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Data attributes let you attach some string data to the element, for example `data-fruit="banana"`. In React, they are not commonly used because you would usually read data from props or state instead.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Either `'ltr'` or `'rtl'`. Specifies the text direction of the element.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): A boolean. Specifies whether the element is draggable. Part of [HTML Drag and Drop API.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): A string. Specifies which action to present for the enter key on virtual keyboards.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): A string. For [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) and [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), lets you [associate the label with some control.](/reference/react-dom/components/input#providing-a-label-for-an-input) Same as [`for` HTML attribute.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React uses the standard DOM property names (`htmlFor`) instead of HTML attribute names.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): A boolean or a string. Specifies whether the element should be hidden.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): A string. Specifies a unique identifier for this element, which can be used to find it later or connect it with other elements. Generate it with [`useId`](/reference/react/useId) to avoid clashes between multiple instances of the same component.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): A string. If specified, the component will behave like a [custom element.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): A string. Specifies what kind of keyboard to display (for example, text, number or telephone).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): A string. Specifies which property the element represents for structured data crawlers.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): A string. Specifies the language of the element.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): An [`AnimationEvent` handler](#animationevent-handler) function. Fires when a CSS animation completes.
* `onAnimationEndCapture`: A version of `onAnimationEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): An [`AnimationEvent` handler](#animationevent-handler) function. Fires when an iteration of a CSS animation ends, and another one begins.
* `onAnimationIterationCapture`: A version of `onAnimationIteration` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): An [`AnimationEvent` handler](#animationevent-handler) function. Fires when a CSS animation starts.
* `onAnimationStartCapture`: `onAnimationStart`, but fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when a non-primary pointer button was clicked.
* `onAuxClickCapture`: A version of `onAuxClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: An [`InputEvent` handler](#inputevent-handler) function. Fires before the value of an editable element is modified. React does *not* yet use the native [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) event, and instead attempts to polyfill it using other events.
* `onBeforeInputCapture`: A version of `onBeforeInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: A [`FocusEvent` handler](#focusevent-handler) function. Fires when an element lost focus. Unlike the built-in browser [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) event, in React the `onBlur` event bubbles.
* `onBlurCapture`: A version of `onBlur` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the primary button was clicked on the pointing device.
* `onClickCapture`: A version of `onClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): A [`CompositionEvent` handler](#compositionevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) starts a new composition session.
* `onCompositionStartCapture`: A version of `onCompositionStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): A [`CompositionEvent` handler](#compositionevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) completes or cancels a composition session.
* `onCompositionEndCapture`: A version of `onCompositionEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): A [`CompositionEvent` handler](#compositionevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) receives a new character.
* `onCompositionUpdateCapture`: A version of `onCompositionUpdate` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the user tries to open a context menu.
* `onContextMenuCapture`: A version of `onContextMenu` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): A [`ClipboardEvent` handler](#clipboardevent-handler) function. Fires when the user tries to copy something into the clipboard.
* `onCopyCapture`: A version of `onCopy` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): A [`ClipboardEvent` handler](#clipboardevent-handler) function. Fires when the user tries to cut something into the clipboard.
* `onCutCapture`: A version of `onCut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the user clicks twice. Corresponds to the browser [`dblclick` event.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
* `onDoubleClickCapture`: A version of `onDoubleClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): A [`DragEvent` handler](#dragevent-handler) function. Fires while the user is dragging something. 
* `onDragCapture`: A version of `onDrag` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when the user stops dragging something. 
* `onDragEndCapture`: A version of `onDragEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when the dragged content enters a valid drop target. 
* `onDragEnterCapture`: A version of `onDragEnter` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): A [`DragEvent` handler](#dragevent-handler) function. Fires on a valid drop target while the dragged content is dragged over it. You must call `e.preventDefault()` here to allow dropping.
* `onDragOverCapture`: A version of `onDragOver` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when the user starts dragging an element.
* `onDragStartCapture`: A version of `onDragStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when something is dropped on a valid drop target.
* `onDropCapture`: A version of `onDrop` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: A [`FocusEvent` handler](#focusevent-handler) function. Fires when an element receives focus. Unlike the built-in browser [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) event, in React the `onFocus` event bubbles.
* `onFocusCapture`: A version of `onFocus` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when an element programmatically captures a pointer.
* `onGotPointerCaptureCapture`: A version of `onGotPointerCapture` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): A [`KeyboardEvent` handler](#keyboardevent-handler) function. Fires when a key is pressed.
* `onKeyDownCapture`: A version of `onKeyDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): A [`KeyboardEvent` handler](#keyboardevent-handler) function. Deprecated. Use `onKeyDown` or `onBeforeInput` instead.
* `onKeyPressCapture`: A version of `onKeyPress` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): A [`KeyboardEvent` handler](#keyboardevent-handler) function. Fires when a key is released.
* `onKeyUpCapture`: A version of `onKeyUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when an element stops capturing a pointer.
* `onLostPointerCaptureCapture`: A version of `onLostPointerCapture` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer is pressed down.
* `onMouseDownCapture`: A version of `onMouseDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer moves inside an element. Does not have a capture phase. Instead, `onMouseLeave` and `onMouseEnter` propagate from the element being left to the one being entered.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer moves outside an element. Does not have a capture phase. Instead, `onMouseLeave` and `onMouseEnter` propagate from the element being left to the one being entered.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer changes coordinates.
* `onMouseMoveCapture`: A version of `onMouseMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer moves outside an element, or if it moves into a child element.
* `onMouseOutCapture`: A version of `onMouseOut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer is released.
* `onMouseUpCapture`: A version of `onMouseUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when the browser cancels a pointer interaction.
* `onPointerCancelCapture`: A version of `onPointerCancel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer becomes active.
* `onPointerDownCapture`: A version of `onPointerDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer moves inside an element. Does not have a capture phase. Instead, `onPointerLeave` and `onPointerEnter` propagate from the element being left to the one being entered.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer moves outside an element. Does not have a capture phase. Instead, `onPointerLeave` and `onPointerEnter` propagate from the element being left to the one being entered.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer changes coordinates.
* `onPointerMoveCapture`: A version of `onPointerMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer moves outside an element, if the pointer interaction is cancelled, and [a few other reasons.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: A version of `onPointerOut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer is no longer active.
* `onPointerUpCapture`: A version of `onPointerUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): A [`ClipboardEvent` handler](#clipboardevent-handler) function. Fires when the user tries to paste something from the clipboard.
* `onPasteCapture`: A version of `onPaste` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): An [`Event` handler](#event-handler) function. Fires when an element has been scrolled. This event does not bubble.
* `onScrollCapture`: A version of `onScroll` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): An [`Event` handler](#event-handler) function. Fires after the selection inside an editable element like an input changes. React extends the `onSelect` event to work for `contentEditable={true}` elements as well. In addition, React extends it to fire for empty selection and on edits (which may affect the selection).
* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires when the browser cancels a touch interaction.
* `onTouchCancelCapture`: A version of `onTouchCancel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires when one or more touch points are removed.
* `onTouchEndCapture`: A version of `onTouchEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires one or more touch points are moved.
* `onTouchMoveCapture`: A version of `onTouchMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires when one or more touch points are placed.
* `onTouchStartCapture`: A version of `onTouchStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): A [`TransitionEvent` handler](#transitionevent-handler) function. Fires when a CSS transition completes.
* `onTransitionEndCapture`: A version of `onTransitionEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): A [`WheelEvent` handler](#wheelevent-handler) function. Fires when the user rotates a wheel button.
* `onWheelCapture`: A version of `onWheel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): A string. Specifies the element role explicitly for assistive technologies.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): A string. Specifies the slot name when using shadow DOM. In React, an equivalent pattern is typically achieved by passing JSX as props, for example `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): A boolean or null. If explicitly set to `true` or `false`, enables or disables spellchecking.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): A number. Overrides the default Tab button behavior. [Avoid using values other than `-1` and `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): A string. Specifies the tooltip text for the element.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Either `'yes'` or `'no'`. Passing `'no'` excludes the element content from being translated.

사용자 정의 어트리뷰트를 props로 전달할 수도 있습니다. (예시: `mycustomprop="someValue"`) 이는 서드파티 라이브러리와 통합할 때 유용할 수 있습니다. 사용자 정의 어트리뷰트의 이름은 소문자이어야 하며 `on`으로 시작하지 않아야 합니다. 값은 문자열로 변환됩니다. `null` 또는 `undefined`를 전달하면 사용자 정의 어트리뷰트가 제거됩니다.

다음의 이벤트는 [`<form>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form) 엘리먼트에 대해서만 발생합니다.

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 폼을 재설정할 때 발생합니다.
* `onResetCapture`: `onReset`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onSubmit`](https://developer.mozilla.org/ko/docs/Web/API/HTMLFormElement/submit_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 폼을 제출할 때 발생합니다.
* `onSubmitCapture`: `onSubmit`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.

다음의 이벤트는 [`<dialog>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/dialog) 엘리먼트에 대해서만 발생합니다. 그리고 브라우저 이벤트와 달리 React에서는 버블링이 발생합니다.

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 사용자가 대화상자를 닫으려고 할 때 발생합니다.
* `onCancelCapture`: `onCancel`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 대화 상자가 닫혔을 때 발생합니다.
* `onCloseCapture`: `onClose`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.

다음의 이벤트는 [`<details>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/details) 엘리먼트에 대해서만 발생합니다. 그리고 브라우저 이벤트와 달리 React에서는 버블이 발생합니다.

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 세부사항을 토글할 때 발생합니다.
* `onToggleCapture`: `onToggle`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
capture-phase-events)

다음의 이벤트는 [`<img>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/link) 그리고 [SVG `<image>`](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial/SVG_Image_Tag) 엘리먼트들에 대해서 발생합니다. 그리고 브라우저 이벤트와 달리 React에서는 버블링이 발생합니다.

* `onLoad`: [`이벤트` 핸들러](#event-handler) 함수입니다. 자원이 로드되면 발생합니다.
* `onLoadCapture`: `onLoad`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 자원을 로드할 수 없을 때 발생합니다.
* `onErrorCapture`: `onError`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.

다음의 이벤트는 [`<audio>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/audio) 및 [`<video>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/video)와 같은 자원에 대해 발생합니다. 그리고 브라우저 이벤트와 달리 React에서는 버블이 발생합니다.

* [`onAbort`](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement/abort_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 자원이 완전히 로드되지 않았지만 오류로 인한 것이 아닌 경우 발생합니다.
* `onAbortCapture`: `onAbort`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onCanPlay`](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement/canplay_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 재생을 시작하기에 충분한 데이터가 있지만 버퍼링 없이 끝까지 재생할 수 없을 때 발생합니다.
* `onCanPlayCapture`: `onCanPlay`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onCanPlayThrough`](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement/canplaythrough_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 데이터가 충분하여 끝까지 버퍼링 없이 재생을 시작할 수 있을 때 발생합니다.
* `onCanPlayThroughCapture`: `onCanPlayThrough`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 미디어 지속 시간이 업데이트되면 발생합니다.
* `onDurationChangeCapture`: `onDurationChange`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 미디어가 비어있을 때 발생합니다.
* `onEmptiedCapture`: `onEmptied`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): [`이벤트` 핸들러](#event-handler) 함수입니다. 브라우저에서 암호화된 미디어를 발견하면 발생합니다.
* `onEncryptedCapture`: `onEncrypted`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 재생할 내용이 남아 있지 않아 재생이 중지되면 발생합니다.
* `onEndedCapture`: `onEnded`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 리소스를 로딩할 수 없을 때 발생합니다.
* `onErrorCapture`: `onError`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 현재 재생 프레임이 로딩되면 발생합니다.
* `onLoadedDataCapture`: `onLoadedData`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 메타데이터가 로딩될 때 발생합니다.
* `onLoadedMetadataCapture`: `onLoadedMetadata`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 브라우저가 자원 로딩을 시작하면 발생합니다.
* `onLoadStartCapture`: `onLoadStart`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 미디어가 일시 중지되었을 때 발생합니다.
* `onPauseCapture`: `onPause`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 미디어가 더 이상 일시 정지되지 않을 때 발생합니다.
* `onPlayCapture`: `onPlay`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 미디어 재생이 시작되거나 재시작될 때 발생합니다.
* `onPlayingCapture`: `onPlaying`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 자원이 로드되는 동안 주기적으로 실행됩니다.
* `onProgressCapture`: `onProgress`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 재생 속도가 변경되면 발생합니다.
* `onRateChangeCapture`: `onRateChange`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* `onResize`: [`이벤트` 핸들러](#event-handler) 함수입니다. 동영상 크기가 변경될 때 발생합니다.
* `onResizeCapture`: `onResize`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 탐색 작업이 완료되면 발생합니다.
* `onSeekedCapture`: `onSeeked`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 탐색 작업이 시작될 때 발생합니다.
* `onSeekingCapture`: `onSeeking`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 브라우저가 데이터를 기다리지만 계속 로드되지 않을 때 발생합니다.
* `onStalledCapture`: `onStalled`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 자원 로딩이 일시 중단되었을 때 발생합니다.
* `onSuspendCapture`: `onSuspend`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 현재 재생 시간이 업데이트될 때 발생합니다.
* `onTimeUpdateCapture`: `onTimeUpdate`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 볼륨이 변경되었을 때 발생합니다.
* `onVolumeChangeCapture`: `onVolumeChange`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전입니다.
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): [`이벤트` 핸들러](#event-handler) 함수입니다. 일시적인 데이터 부족으로 인해 재생이 중지된 경우 발생합니다.
* `onWaitingCapture`: `onWaiting`의 [캡처 단계](/learn/responding-to-events#capture-phase-events)에서 발생하는 버전입니다. 

#### 주의사항 {/*common-caveats*/}

- `children`과 `dangerouslySetInnerHTML`을 동시에 전달할 수 없습니다.
- 일부 이벤트(예시: `onAbort`, `onLoad`)는 브라우저에서 버블링이 발생하지 않지만, React에서는 버블링이 발생합니다.

---

### `ref` 콜백 함수 {/*ref-callback*/}

[`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref) 에서 반환되는 ref 객체 대신 `ref` 속성에 함수를 전달할 수 있습니다.

```js
<div ref={(node) => console.log(node)} />
```

[`ref` 콜백에 대한 예시를 참조하세요.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

`<div>` DOM 노드가 화면에 추가될 때, React는 `node`를 인수로 사용하여 `ref` 콜백을 호출합니다. 해당 `<div>` DOM 노드가 제거되면 React는 `null`을 인수로 사용하여 `ref` 콜백을 호출합니다.

React는 *다른* `ref` 콜백을 전달할 때 마다 `ref` 콜백을 호출합니다. 위의 예시에서 `(node) => { ... }` 는 모든 렌더링에서 다른 함수입니다. 컴포넌트가 다시 렌더링 될 때, *이전* 함수는 `null`을 인수로 사용하여 호출되고 *다음* 함수는 DOM 노드를 사용하여 호출됩니다.

#### 매개변수 {/*ref-callback-parameters*/}

* `node`: DOM 노드 또는 `null`입니다. React는 ref가 연결될 때 DOM 노드를 전달하고 ref가 분리되면 `null`을 전달합니다. 모든 렌더링에서 `ref` 콜백에 대해 동일한 함수를 전달하는 경우를 제외하고, 컴포넌트를 다시 렌더링할 마다 콜백이 일시적으로 분리되었다가 다시 연결됩니다.

#### 반환 값 {/*returns*/}

`ref` 콜백에서는 아무것도 반환하지 않습니다.

---

### React 이벤트 객체 {/*react-event-object*/}

이벤트 핸들러는 *React 이벤트 객체*를 받게 되며, "합성 이벤트"라고도 합니다.

```js
<button onClick={e => {
  console.log(e); // React 이벤트 객체
}} />
```

이것은 기본 DOM 이벤트와 같은 표준을 준수하지만 일부 브라우저의 불일치를 수정합니다. 


일부 React의 이벤트는 브라우저의 네이티브 이벤트에 직접 매핑되지 않습니다. 예를 들어 `onMouseLeave`에서 `e.nativeEvent`는 `mouseout` 이벤트를 가리킵니다. 특정 매핑은 퍼블릭 API의 일부가 아니며 추후 변경될 수 있습니다. 어떠한 이유로 기본 브라우저 이벤트가 필요한 경우 `e.nativeEvent`에서 읽어와야 합니다.  

#### 프로퍼티 {/*react-event-object-properties*/}

React 이벤트 객체는 표준 [`Event`](https://developer.mozilla.org/ko/docs/Web/API/Event) 프로퍼티의 일부를 구현했습니다.

* [`bubbles`](https://developer.mozilla.org/ko/docs/Web/API/Event/bubbles): 불리언 타입입니다. 이벤트가 DOM을 통해 버블링되는지 여부를 반환합니다. 
* [`cancelable`](https://developer.mozilla.org/ko/docs/Web/API/Event/cancelable): 불리언 타입입니다. 이벤트를 취소할 수 있는지를 반환합니다.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): DOM 노드입니다. React 트리에서 현재 핸들러가 연결된 노드를 반환합니다.
* [`defaultPrevented`](https://developer.mozilla.org/ko/docs/Web/API/Event/defaultPrevented): 불리언 타입입니다. `preventDefault`가 호출되었는지 여부를 반환합니다.
* [`eventPhase`](https://developer.mozilla.org/ko/docs/Web/API/Event/eventPhase): 숫자 타입입니다. 이벤트가 현재 어느 단계에 있는지 반환합니다.
* [`isTrusted`](https://developer.mozilla.org/ko/docs/Web/API/Event/isTrusted): 불리언 타입입니다. 사용자에 의해 이벤트가 시작되었는지에 대한 여부를 반환합니다. 
* [`target`](https://developer.mozilla.org/ko/docs/Web/API/Event/target): DOM 노드입니다. (멀리 있는 자식일 수도 있는)이벤트가 발생한 노드를 반환합니다.
* [`timeStamp`](https://developer.mozilla.org/ko/docs/Web/API/Event/timeStamp): 숫자 타입입니다. 이벤트가 발생한 시간을 반환합니다.

추가로 React 이벤트 객체는 다음과 같은 프로퍼티를 제공합니다.

* `nativeEvent`: DOM [`Event`](https://developer.mozilla.org/ko/docs/Web/API/Event) 이벤트입니다. 원래의 브라우저 이벤트 객체입니다.

#### 메서드 {/*react-event-object-methods*/}

React 이벤트 객체는 표준 [`Event`](https://developer.mozilla.org/ko/docs/Web/API/Event) 메서드의 일부를 구현 했습니다.

* [`preventDefault()`](https://developer.mozilla.org/ko/docs/Web/API/Event/preventDefault): 이벤트에 대한 기본 브라우저 동작을 방지합니다.
* [`stopPropagation()`](https://developer.mozilla.org/ko/docs/Web/API/Event/stopPropagation): React 트리를 통한 이벤트 전파를 중지합니다.

추가로 React 이벤트 객체는 다음과 같은 프로퍼티를 제공합니다.

* `isDefaultPrevented()`: `preventDefault`가 호출되었는지에 대한 여부를 나타내는 불리언 값을 반환합니다.
* `isPropagationStopped()`: `stopPropagation`이 호출되었는지에 대한 여부를 나타내는 불리언 값을 반환합니다.
* `persist()`: React DOM에서는 사용되지 않습니다. React Native에서는 이벤트가 발생한 후 이벤트의 프로퍼티를 읽으려면 해당 함수를 호출해야 합니다.
* `isPersistent()`: React DOM에서는 사용되지 않습니다. React Native에서는 `persist`가 호출되었는지 여부를 반환합니다.

#### 주의사항 {/*react-event-object-caveats*/}

* `currentTarget`, `eventPhase`, `target`, `type`의 값은 React 코드가 예상하는 값을 반영합니다. 내부적으로는 React는 이벤트 핸들러를 루트에 첨부하지만, React 이벤트 객체에는 반영되지 않습니다. 예를 들어 `e.currentTarget`은 기본`e.nativeEvent.currentTarget`과 동일하지 않을 수 있습니다. 폴리필 된 이벤트의 경우 `e.type` (React 이벤트 타입)이 `e.nativeEvent.type` (기본 타입)과 다를 수 있습니다.

---

### `AnimationEvent` 핸들러 함수 {/*animationevent-handler*/}

[CSS 애니메이션](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations) 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### 매개변수 {/*animationevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`AnimationEvent`](https://developer.mozilla.org/ko/docs/Web/API/AnimationEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`animationName`](https://developer.mozilla.org/ko/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/ko/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` 핸들러 함수 {/*clipboadevent-handler*/}

[클립보드의 API](https://developer.mozilla.org/ko/docs/Web/API/Clipboard_API) 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### 매개변수 {/*clipboadevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`ClipboardEvent`](https://developer.mozilla.org/ko/docs/Web/API/ClipboardEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다. 

  * [`clipboardData`](https://developer.mozilla.org/ko/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` 핸들러 함수 {/*compositionevent-handler*/}

[입력 메서드 편집기 (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### 매개변수 {/*compositionevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` 핸들러 함수 {/*dragevent-handler*/}

[HTML 드래그 앤 드롭 API](https://developer.mozilla.org/ko/docs/Web/API/HTML_Drag_and_Drop_API) 이벤트의 이벤트 핸들러 유형입니다.

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### 매개변수 {/*dragevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다. 
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  이는 상속된 [`MouseEvent`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent)의 프로퍼티도 포함합니다.

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)의 프로퍼티도 포함합니다.

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` 핸들러 함수 {/*focusevent-handler*/}

포커싱 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[예시를 참조하세요.](#handling-focus-events)

#### 매개변수 {/*focusevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다. 
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)의 프로퍼티도 포함합니다.

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` 핸들러 함수 {/*event-handler*/}

일반 이벤트를 위한 이벤트 핸들러 유형입니다.

#### 매개변수 {/*event-handler-parameters*/}

* `e`: 추가 프로퍼티가 없는 [React 이벤트 객체](#react-event-object)입니다.

---

### `InputEvent` 핸들러 함수 {/*inputevent-handler*/}

`onBeforeInput` 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### 매개변수 {/*inputevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`InputEvent`](https://developer.mozilla.org/ko/docs/Web/API/InputEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다. 
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` 핸들러 함수 {/*keyboardevent-handler*/}

키보드 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[예시를 참조하세요.](#handling-keyboard-events)

#### 매개변수 {/*keyboardevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`KeyboardEvent`](https://developer.mozilla.org/ko/docs/Web/API/KeyboardEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/ko/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)의 프로퍼티도 포함합니다.

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` 핸들러 함수 {/*mouseevent-handler*/}

마우스 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[예시를 참조하세요.](#handling-mouse-events)

#### 매개변수 {/*mouseevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`MouseEvent`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)의 프로퍼티도 포함합니다.

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` 핸들러 함수 {/*pointerevent-handler*/}

[포인터 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[예시를 참조하세요.](#handling-pointer-events)

#### 매개변수 {/*pointerevent-handler-parameters*/}

* `e`: 다음과 같은 추가[`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  이는 상속된 [`MouseEvent`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent)의 프로퍼티도 포함합니다.

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)의 프로퍼티도 포함합니다.

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` 핸들러 함수 {/*touchevent-handler*/}

[터치 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### 매개변수 {/*touchevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  또한 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)의 프로퍼티도 포함합니다.

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` 핸들러 함수 {/*transitionevent-handler*/}

CSS 전환 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### 매개변수 {/*transitionevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent)의 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` 핸들러 함수 {/*uievent-handler*/}

일반적인 UI 이벤트를 위한 이벤트 핸들러 유형입니다.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### 매개변수 {/*uievent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 프로퍼티를 가진 [React 이벤트 객체](#react-event-object)입니다.
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` 핸들러 함수 {/*wheelevent-handler*/}

`onWheel` 이벤트에 대한 이벤트 핸들러 유형입니다.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### 매개변수 {/*wheelevent-handler-parameters*/}

* `e`: 다음과 같은 추가 [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)의 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다.
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  또한 다음과 같이 상속된 [`MouseEvent`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent)의 프로퍼티도 포함합니다.

* [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
* [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
* [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
* [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
* [`clientX`](https://developer.mozilla.org/ko/docs/Web/API/MouseEvent/clientX)
* [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
* [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
* [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
* [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
* [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
* [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
* [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
* [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
* [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
* [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
* [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  더불어 아래의 상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent)의 프로퍼티도 포함합니다.

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## 사용법 {/*usage*/}

### CSS 스타일 적용하기 {/*applying-css-styles*/}

리액트는 [`className`](https://developer.mozilla.org/ko/docs/Web/API/Element/className)을 사용하여 CSS 클래스를 지정합니다. 이것은 HTML의 클래스 속성처럼 작동합니다.

```js
<img className="avatar" />
```

그런 다음 별도의 CSS 파일에 CSS 규칙을 지정합니다.

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React는 CSS 파일을 추가하는 방법을 규정하지 않습니다. 가장 간단한 방법은 HTML에 [`<link>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/link) 태그를 추가하는 것입니다. 빌드 도구나 프레임워크를 사용하고 있다면, 해당 기술의 문서를 참조하여 프로젝트에 CSS 파일을 추가하는 방법을 알아보세요.

때때로 스타일 값은 데이터에 따라 달라집니다. `style` 어트리뷰트를 사용하여 일부 스타일을 동적으로 전달할 수 있습니다.

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


위의 예시에서 `style={{}}`은 특별한 구문이 아니라 `style={ }`와 같이 [중괄호가 있는 JSX](/learn/javascript-in-jsx-with-curly-braces) 내에 있는 일반 `{}` 객체입니다. 스타일이 자바스크립트 변수에 의존하는 경우에만 `style` 어트리뷰트를 사용하는 것이 좋습니다.

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### 여러 CSS 클래스를 조건부로 적용하기 위해 어떻게 해야하나요? {/*how-to-apply-multiple-css-classes-conditionally*/}

조건부로 CSS 클래스를 적용하려면 JavaScript를 사용하여 `className` 직접 문자열을 생성해야 합니다.

예를 들어 `className={'row ' + (isSelected ? 'selected': '')}`는 `isSelected`가 `true`인지의 여부에 따라 `className="row"` 또는 `className="row selected"`를 생성합니다.

가독성을 높이고 싶다면 [`classnames`](https://github.com/JedWatson/classnames)와 같은 작은 헬퍼 라이브러리를 사용할 수 있습니다.

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

이는 조건부 클래스가 여러 개 있는 경우 특히 편리합니다.

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### ref를 사용하여 DOM 노드 조작하기 {/*manipulating-a-dom-node-with-a-ref*/}

때로는 JSX에서 태그와 연결된 브라우저 DOM 노드를 가져와야 하는 경우가 있습니다. 예를 들어 버튼이 클릭 될 때 `<input>` 에 포커싱을 맞추려면 브라우저의 `<input>` DOM 노드에서 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출하면 됩니다. 

태그에 대한 브라우저의 DOM 노드를 가져오려면 [ref를 선언](/reference/react/useRef)하고 해당 태그에 `ref` 어트리뷰트로 전달합니다.

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React는 DOM 노드가 화면에 렌더링 된 후 `inputRef.current` 에 넣습니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

[refs를 사용한 DOM 조작하기](/learn/manipulating-the-dom-with-refs) 및 [더 많은 예제](/reference/react/useRef#examples-dom)에 대해 더 자세히 읽어보세요.

고급 사용 사례의 경우 `ref` 어트리뷰트는 [콜백 함수](#ref-callback)도 허용합니다.

---

### 내부 HTML을 위험하게 설정하는 경우 {/*dangerously-setting-the-inner-html*/}

다음과 같이 원시 HTML 문자열을 엘리먼트에 전달할 수 있습니다.

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**이것은 위험합니다. 기본 DOM의 [`innerHTML`](https://developer.mozilla.org/ko/docs/Web/API/Element/innerHTML) 프로퍼티와 마찬가지로 각별히 주의해야 합니다. 마크업이 완전히 신뢰할 수 있는 출처에서 제공되는 것이 아니라면,  [XSS](https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8_%EA%B0%84_%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8C%85) 취약점이 쉽게 나타날 수 있습니다.**

예를 들어, 마크다운을 HTML로 변환하는 라이브러리를 사용할 때, 해당 파서에 버그가 없고 사용자가 자신의 입력만 볼 수 있다고 믿는다면 다음과 같이 결과 HTML을 표시할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // 출력되는 HTML이 동일한 사용자에게 표시되고,
  // 이 마크다운 파서에 버그가 없다고 
  // 신뢰하기 때문에 안전합니다.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

임의의 HTML을 렌더링하는 것이 왜 위험한지를 알아보려면 위의 코드를 다음과 같이 바꿔보세요.

```js {1-4,7,8}
const post = {
  // 이 content가 데이터베이스에 저장되어 있다고 가정해보겠습니다.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 보안 취약점: 신뢰할 수 없는 입력을 dangerouslySetInnerHTML로 전달했습니다.
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML에 포함된 코드가 실행됩니다. 해커는 이 보안 허점을 이용하여 사용자의 정보를 훔치거나 사용자 대신 작업을 수행할 수 있습니다. **신뢰할 수 있고 유해한 정보가 포함되어 있지 않은 데이터를 사용할 때만 `dangerouslySetInnerHTML`을 사용하세요.**

---

### 마우스 이벤트 처리 {/*handling-mouse-events*/}

이 예시는 일반적인 [마우스 이벤트](#mouseevent-handler)와 해당 이벤트가 언제 발생하는지 보여줍니다.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### 포인터 이벤트 처리 {/*handling-pointer-events*/}

이 예시는 일반적인 [포인터 이벤트](#pointerevent-handler)와 해당 이벤트가 언제 발생하는지 보여줍니다.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### 포커스 이벤트 처리 {/*handling-focus-events*/}

React에서는 [focus 이벤트](#focusevent-handler)가 버블링됩니다. 부모 엘리먼트의 바깥 부분에서 발생한 이벤트가 focus 혹은 blur인지 구분하기 위해 `currentTarget`과 `relatedTarget`를 사용할 수 있습니다.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // children간의 focus를 이동할 때는 발생되지 않음.
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // children간의 focus를 이동할 때는 발생되지 않음.
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### 키보드 이벤트 처리 {/*handling-keyboard-events*/}

이 예시는 일반적인 [키보드 이벤트](#keyboardevent-handler)와 해당 이벤트가 언제 발생하는지 보여줍니다.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
