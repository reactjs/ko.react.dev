---
id: events
title: 합성 이벤트(SyntheticEvent)
permalink: docs/events.html
layout: docs
category: Reference
---

이 문서는 React의 이벤트 시스템 일부를 구성하는 `SyntheticEvent` 래퍼를 설명합니다. 더 많은 정보는 [이벤트 처리하기](/docs/handling-events.html) 문서를 보세요.

## 개요 {#overview}

이벤트 핸들러는 모든 브라우저에서 이벤트를 동일하게 처리하기 위한 이벤트 래퍼 `SyntheticEvent` 객체를 전달받습니다. `stopPropagation()` 와 `preventDefault()`를 포함해서 인터페이스는 브라우저의 고유 이벤트와 같지만 모든 브라우저에서 동일하게 동작합니다.

브라우저의 고유 이벤트가 필요하다면 `nativeEvent` 어트리뷰트를 참조하세요. 합성 이벤트는 브라우저 고유 이벤트에 직접 대응되지 않으며 다릅니다. 예를 들어 `onMouseLeave`에서 `event.nativeEvent`는 `mouseout` 이벤트를 가리킵니다. 구체적인 연결은 공개된 API의 일부가 아니며 언제든지 변경될 수 있습니다. 모든 `합성 이벤트` 객체는 다음 어트리뷰트를 가집니다.

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> 주의
>
<<<<<<< HEAD
> 0.14 버전부터 이벤트 핸들러가 `false`를 반환하더라도 이벤트 전파를 멈추지 않습니다. 대신 `e.stopPropagation()` 또는 `e.preventDefault()`를 필요할 때 호출하세요.

### 이벤트 풀링 {#event-pooling}

`SyntheticEvent`는 [풀링](https://en.wikipedia.org/wiki/Pool_(computer_science))됩니다. 성능상의 이유로 `SyntheticEvent` 객체는 재사용되고 모든 속성은 이벤트 핸들러가 호출된 다음 초기화됩니다. 따라서 비동기적으로 이벤트 객체에 접근할 수 없습니다.

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // 동작하지 않습니다. this.state.clickEvent 은 null만 가지게 될 것입니다.
  this.setState({clickEvent: event});

  // 이벤트 속성을 추출할 수 있습니다.
  this.setState({eventType: event.type});
}
```
=======
> As of v17, `e.persist()` doesn't do anything because the `SyntheticEvent` is no longer [pooled](/docs/legacy-event-pooling.html).
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

> 주의
>
<<<<<<< HEAD
> 비동기적으로 이벤트 속성을 참조하고 싶다면 이벤트 객체의 `event.persist()` 를 호출하세요. 합성 이벤트 풀에서 제거되고 사용자의 코드에서 참조가 가능해집니다.

## 지원하는 이벤트 {#supported-events}

React는 이벤트들을 다른 브라우저에서도 같은 속성을 가지도록 표준화합니다.

다음 이벤트 핸들러는 이벤트 버블링 단계에서 호출됩니다. 캡처 단계에 이벤트 핸들러를 등록하기 위해서는 이벤트 이름에 `Capture`를 덧붙이세요. 예를 들어 `onClick` 대신 `onClickCapture`를 사용해서 캡처 단계에서 클릭 이벤트 핸들러를 사용할 수 있습니다.

- [Clipboard 이벤트](#clipboard-events)
- [Composition 이벤트](#composition-events)
- [Keyboard 이벤트](#keyboard-events)
- [Focus 이벤트](#focus-events)
- [Form 이벤트](#form-events)
- [Generic 이벤트](#generic-events)
- [Mouse 이벤트](#mouse-events)
- [Pointer 이벤트](#pointer-events)
- [Selection 이벤트](#selection-events)
- [Touch 이벤트](#touch-events)
- [UI 이벤트](#ui-events)
- [Wheel 이벤트](#wheel-events)
- [Media 이벤트](#media-events)
- [Image 이벤트](#image-events)
- [Animation 이벤트](#animation-events)
- [Transition 이벤트](#transition-events)
- [기타 이벤트](#other-events)
=======
> As of v0.14, returning `false` from an event handler will no longer stop event propagation. Instead, `e.stopPropagation()` or `e.preventDefault()` should be triggered manually, as appropriate.

## Supported Events {#supported-events}

React normalizes events so that they have consistent properties across different browsers.

The event handlers below are triggered by an event in the bubbling phase. To register an event handler for the capture phase, append `Capture` to the event name; for example, instead of using `onClick`, you would use `onClickCapture` to handle the click event in the capture phase.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

* * *

## 참조 {#reference}

### Clipboard 이벤트 {#clipboard-events}

이벤트 이름

```
onCopy onCut onPaste
```

속성

```javascript
DOMDataTransfer clipboardData
```

* * *

### Composition 이벤트 {#composition-events}

이벤트 이름

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

속성

```javascript
string data

```

* * *

### Keyboard 이벤트 {#keyboard-events}

이벤트 이름

```
onKeyDown onKeyPress onKeyUp
```

속성

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

`key` 속성은 [DOM 레벨 3 이벤트 명세](https://www.w3.org/TR/uievents-key/#named-key-attribute-values)에 있는 어떤 값이든 가질 수 있습니다.

* * *

### Focus 이벤트 {#focus-events}

이벤트 이름

```
onFocus onBlur
```

포커스 이벤트는 form 엘리먼트 뿐만이 아니라 모든 React DOM 엘리먼트에 작동합니다.

속성

```js
DOMEventTarget relatedTarget
```

#### onFocus

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```


* * *

### Form 이벤트 {#form-events}

이벤트 이름

```
onChange onInput onInvalid onReset onSubmit
```

onChange 이벤트에 대한 더 자세한 정보는 [폼 문서](/docs/forms.html)를 참조하세요.

* * *

### Generic 이벤트 {#generic-events}

이벤트 이름

```
onError onLoad
```

* * *

### Mouse 이벤트 {#mouse-events}

이벤트 이름

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

`onMouseEnter` 및 `onMouseLeave` 이벤트는 일반적인 버블링 대신 마우스가 떠나는 엘리먼트에서 들어가는 엘리먼트로 전파되고 캡처 단계가 없습니다.

속성

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Pointer 이벤트 {#pointer-events}

이벤트 이름

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

`onPointerEnter` 및 `onPointerLeave` 이벤트는 일반적인 버블링 대신 포인터가 떠나는 엘리먼트에서 들어가는 엘리먼트로 전파되고 캡처 단계가 없습니다.

속성

[W3 명세](https://www.w3.org/TR/pointerevents/)에 정의된 대로 포인터 이벤트는 [마우스 이벤트](#mouse-events)와 다음 속성을 포함해 확장합니다.

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

크로스 브라우저 지원 주의사항

포인터 이벤트는 아직 모든 브라우저에서 지원되지 않습니다(이 문서를 작성하는 시점엔 Chrome, Firefox, Edge 및 Internet Explorer가 지원합니다). 표준 폴리필은 `react-dom` 번들을 무겁게 만들기 때문에 React가 직접 브라우저 호환성을 위해 폴리필을 제공하진 않습니다.

애플리케이션이 포인터 이벤트를 의존한다면 직접 서드 파티 포인터 폴리필을 추가하세요.

* * *

### Selection 이벤트 {#selection-events}

이벤트 이름

```
onSelect
```

* * *

### Touch 이벤트 {#touch-events}

이벤트 이름

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

속성

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI 이벤트 {#ui-events}

이벤트 이름

```
onScroll
```

<<<<<<< HEAD
속성
=======
>Note
>
>Starting with React 17, the `onScroll` event **does not bubble** in React. This matches the browser behavior and prevents the confusion when a nested scrollable element fires events on a distant parent.

Properties:
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel 이벤트 {#wheel-events}

이벤트 이름

```
onWheel
```

속성

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Media 이벤트 {#media-events}

이벤트 이름

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image 이벤트 {#image-events}

이벤트 이름

```
onLoad onError
```

* * *

### Animation 이벤트 {#animation-events}

이벤트 이름

```
onAnimationStart onAnimationEnd onAnimationIteration
```

속성

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Transition 이벤트 {#transition-events}

이벤트 이름

```
onTransitionEnd
```

속성

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### 기타 이벤트 {#other-events}

이벤트 이름

```
onToggle
```
