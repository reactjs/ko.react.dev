---
id: events
title: 합성이벤트
permalink: docs/events.html
layout: docs
category: Reference
---

이 참조는 리액트의 이벤트 시스템 일부를 구성하는 `합성이벤트` 래퍼를 설명합니다. 더 많은 정보는 [이벤트 처리](/docs/handling-events.html) 문서를 보세요.

## 개요 {#overview}

이벤트 핸들러는 브라우저의 통합 브라우저 이벤트 래퍼 `합성이벤트` 객체를 전달받습니다. `stopPropagation()` 와 `preventDefault()`를 포함해서 인터페이스는 브라우저의 고유 이벤트와 같지만 모든 브라우저에서 동일하게 동작합니다.

브라우저의 기본 이벤트가 필요하다면 `nativeEvent` 어트리뷰트로 참조하세요. 모든 `합성이벤트` 객체는 다음 어트리뷰트를 가집니다.

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
DOMEventTarget target
number timeStamp
string type
```

> 메모
>
> 0.14 버전부터 이벤트 핸들러가 `false`를 반환하더라도 이벤트 전파를 멈추지 않습니다. 대신 `e.stopPropagation()` 또는 `e.preventDefault()`를 필요할 때 호출하세요.

### 이벤트 풀링 {#event-pooling}

`합성이벤트`는 [풀링](https://en.wikipedia.org/wiki/Pool_(computer_science))됩니다. `합성이벤트` 객체는 재사용되고 모든 속성은 이벤트 핸들러가 호출된 다음 초기화됩니다. 성능적인 이유가 있습니다. 따라서 비동기적으로 이벤트 객체에 접근할 수 없습니다.

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

> 메모
>
> 비동기적으로 이벤트 속성을 참조하고 싶다면 이벤트 객체의 `event.persist()` 를 호출하세요. 합성 이벤트 풀에서 제거되고 사용자의 코드에서 참조가 가능해집니다.

## 지원 이벤트 목록 {#supported-events}

React는 이벤트들을 다른 브라우저에서도 같은 속성을 가지도록 표준화합니다.

다음 이벤트 핸들러는 이벤트 버블링 단계에서 호출됩니다. 캡처 단계에 이벤트 핸들러를 등록하기 위해서는 이벤트 이름에 `Capture`를 덧붙이세요. 예를 들어 `onClick` 대신 `onClickCapture`를 사용해서 캡처 단계에서 클릭 이벤트 핸들러를 사용할 수 있습니다.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
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

* * *

## 참조 {#reference}

### 클립보드 이벤트 {#clipboard-events}

이벤트 이름

```
onCopy onCut onPaste
```

속성

```javascript
DOMDataTransfer clipboardData
```

* * *

### 합성 이벤트 {#composition-events}

이벤트 이름

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

속성

```javascript
string data

```

* * *

### 키보드 이벤트 {#keyboard-events}

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

### 포커스 이벤트 {#focus-events}

이벤트 이름

```
onFocus onBlur
```

포커스 이벤트는 form 요소 뿐만이 아니라 모든 React DOM 요소에 작동합니다.

속성

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form 이벤트 {#form-events}

이벤트 이름

```
onChange onInput onInvalid onSubmit
```

onChange 이벤트에 대한 더 자세한 정보는 [Forms](/docs/forms.html)을 참조하세요.

* * *

### 마우스 이벤트 {#mouse-events}

이벤트 이름

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

`onMouseEnter` 및 `onMouseLeave` 이벤트는 일반적인 버블링 대신 떠나는 요소에서 들어가는 요소로 전파되고 캡처 단계가 없습니다.

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

### 포인터 이벤트 {#pointer-events}

이벤트 이름

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

`onPointerEnter` 및 `onPointerLeave` 이벤트는 일반적인 버블링 대신 떠나는 요소에서 들어가는 요소로 전파되고 캡처 단계가 없습니다.

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

크로스 브라우저 지원에 대한 메모

포인터 이벤트는 아직 모든 브라우저에서 지원되지 않습니다. (이 문서를 작성할 땐 Chrome, Firefox, Edge 및 Internet Explorer가 지원함.) 표준 폴리필은 `react-dom` 번들을 무겁게 만들기 때문에 React가 직접 브라우저 호환성을 위해 폴리필을 제공하진 않습니다.

어플리케이션이 포인터 이벤트를 의존한다면 직접 서드 파티 포인터 폴리필을 추가하세요.

* * *

### 선택 이벤트 {#selection-events}

이벤트 이름

```
onSelect
```

* * *

### 터치 이벤트 {#touch-events}

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

속성

```javascript
number detail
DOMAbstractView view
```

* * *

### 휠 이벤트 {#wheel-events}

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

### 미디어 이벤트 {#media-events}

이벤트 이름

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### 이미지 이벤트 {#image-events}

이벤트 이름

```
onLoad onError
```

* * *

### 애니메이션 이벤트 {#animation-events}

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

### 트랜지션 이벤트 {#transition-events}

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
