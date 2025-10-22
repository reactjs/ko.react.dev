---
title: <ViewTransition>
version: canary
---

<Canary>

**The `<ViewTransition />` API is currently only available in React’s Canary and Experimental channels.** 

[Learn more about React’s release channels here.](/community/versioning-policy#all-release-channels)

</Canary>

<Intro>

`<ViewTransition>`을 사용하면 Transition 내부에서 업데이트되는 엘리먼트에 애니메이션을 적용할 수 있습니다.


```js
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

엘리먼트를 `<ViewTransition>`으로 감싸면 [Transition](/reference/react/useTransition) 내부에서 업데이트할 때 애니메이션을 적용할 수 있습니다. React는 다음 휴리스틱을 사용하여 View Transition이 애니메이션에 활성화되는지 판단합니다.

- `enter`: 해당 Transition에서 `ViewTransition` 자체가 삽입되면 활성화됩니다.
- `exit`: 해당 Transition에서 `ViewTransition` 자체가 삭제되면 활성화됩니다.
- `update`: `ViewTransition` 내부에서 React가 수행하는 DOM 변경(예: 프로퍼티 변경)이 있거나 인접한 형제 엘리먼트의 영향으로 `ViewTransition` 경계 자체의 크기나 위치가 변경되는 경우 활성화됩니다. 중첩된 `ViewTransition`이 있으면 변경이 부모가 아닌 해당 항목에 적용됩니다.
- `share`: 이름이 지정된 `ViewTransition`이 삭제된 서브트리 내부에 있고 같은 이름을 가진 다른 이름 있는 `ViewTransition`이 같은 Transition에서 삽입된 서브트리의 일부인 경우 공유 엘리먼트 Transition을 형성하며, 삭제된 것에서 삽입된 것으로 애니메이션됩니다.

기본적으로 `<ViewTransition>`은 부드러운 크로스 페이드(브라우저 기본 View Transition)로 애니메이션됩니다. `<ViewTransition>` 컴포넌트에 [View Transition 클래스](#view-transition-class)를 제공하여 애니메이션을 커스터마이징할 수 있습니다. 각 트리거 유형에 대해 애니메이션을 커스터마이징할 수 있습니다([View Transition 스타일링](#styling-view-transitions) 참고).

<DeepDive>

#### `<ViewTransition>`은 어떻게 작동하나요? {/*how-does-viewtransition-work*/}

내부적으로 React는 `<ViewTransition>` 컴포넌트 내부에 중첩된 가장 가까운 DOM 노드의 인라인 스타일에 `view-transition-name`을 적용합니다. `<ViewTransition><div /><div /></ViewTransition>`처럼 여러 형제 DOM 노드가 있을 경우, React는 각 노드의 이름이 고유하도록 접미사를 추가하지만, 개념적으로는 동일한 전환에 속하는 것으로 간주합니다.

React는 내부적으로 `startViewTransition`을 자체적으로 호출하므로 직접 호출해서는 안됩니다. 실제로 페이지에서 다른 스크립트나 코드가 ViewTransition을 실행하고 있다면 React가 이를 중단합니다. 따라서 React 자체를 사용하여 이를 조정하는 것을 권장합니다. 과거에 ViewTransition을 트리거하는 다른 방법이 있었다면 내장 방법으로 마이그레이션하는 것을 권장합니다.

다른 React ViewTransition이 이미 실행 중이라면, React는 그것들을 완료할 때까지 다음 전환을 시작하지 않습니다. 그러나 중요한 점은 첫 번째 전환이 진행되는 동안 여러 업데이트가 발생하면, 그 업데이트들은 모두 하나로 묶여 처리된다는 것입니다. 예를 들어 A에서 B로 이동하는 전환을 시작했다고 가정합시다. 그 사이에 C로 가는 업데이트가 발생하고 다시 D로 가는 업데이트가 발생한다면, 첫 번째 A->B 애니메이션이 끝난 후 다음 애니메이션은 B에서 D로 전환됩니다.

`getSnapshotBeforeUpdate` 생명주기는 `startViewTransition` 전에 호출되고 일부 `view-transition-name`은 동시에 업데이트됩니다.

그런 다음 React는 `startViewTransition`을 호출합니다. `updateCallback` 내부에서 React는 다음을 수행합니다.

- DOM에 변경을 적용하고 `useInsertionEffect`를 호출합니다.
- 폰트가 로드될 때까지 기다립니다.
- componentDidMount, componentDidUpdate, useLayoutEffect, refs를 호출합니다.
- 대기 중인 탐색이 완료될 때까지 기다립니다.
- 그런 다음 React는 레이아웃의 변경 사항을 측정하여 어떤 경계가 애니메이션되어야 하는지 확인합니다.

`startViewTransition`의 ready Promise가 해결된 이후, React는 `view-transition-name`을 되돌립니다. 그 다음 React는 `onEnter`, `onExit`, `onUpdate`, `onShare` 콜백들을 호출하여 애니메이션에 대해 수동으로 프로그래밍 방식의 제어를 할 수 있도록 합니다. 이 호출은 내장된 기본 애니메이션이 이미 계산된 이후에 이루어집니다.

이 시퀀스 중간에 `flushSync`가 발생하면 동기적으로 완료되어야 하는 특성 때문에 React는 해당 Transition을 건너뜁니다.

`startViewTransition`의 finished Promise가 해결된 이후에 React는 `useEffect`를 호출합니다. 이렇게 하면 `useEffect`가 애니메이션 성능에 영향을 주지 않도록 방지할 수 있습니다. 그러나 이것이 반드시 보장되는 것은 아닙니다. 만약 애니메이션이 실행되는 도중에 다른 `setState`가 발생하면, 순차적 동작 보장을 유지하기 위해 `useEffect`를 더 일찍 호출해야 할 수도 있습니다.

</DeepDive>

#### Props {/*props*/}

기본적으로 `<ViewTransition>`은 부드러운 크로스 페이드로 애니메이션됩니다. 이러한 프로퍼티로 애니메이션을 커스터마이즈하거나 공유 엘리먼트 Transition을 지정할 수 있습니다.

* **optional** `enter`: 문자열 또는 객체. "enter"가 활성화될 때 적용할 [View Transition 클래스](#view-transition-class)입니다.
* **optional** `exit`: 문자열 또는 객체. "exit"이 활성화될 때 적용할 [View Transition 클래스](#view-transition-class)입니다.
* **optional** `update`: 문자열 또는 객체. "update"가 활성화될 때 적용할 [View Transition 클래스](#view-transition-class)입니다.
* **optional** `share`: 문자열 또는 객체. 공유 엘리먼트가 활성화될 때 적용할 [View Transition 클래스](#view-transition-class)입니다.
* **optional** `default`: 문자열 또는 객체. 다른 일치하는 활성화 프로퍼티가 없을 때 사용되는 [View Transition 클래스](#view-transition-class)입니다.
* **optional** `name`: 문자열 또는 객체. 공유 엘리먼트 transition에 사용되는 View Transition의 이름입니다. 제공되지 않으면 React는 예상치 못한 애니메이션을 방지하기 위해 각 View Transition에 대해 고유한 이름을 사용합니다.

#### 콜백 {/*events*/}

이 콜백을 사용하면 [animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) API를 사용하여 애니메이션을 명령적으로 조정할 수 있습니다.

* **optional** `onEnter`: 함수. React는 "enter" 애니메이션 후에 `onEnter`를 호출합니다.
* **optional** `onExit`: 함수. React는 "exit" 애니메이션 후에 `onExit`를 호출합니다.
* **optional** `onShare`: 함수. React는 "share" 애니메이션 후에 `onShare`를 호출합니다.
* **optional** `onUpdate`: 함수. React는 "update" 애니메이션 후에 `onUpdate`를 호출합니다.

각 콜백은 다음을 인수로 받습니다.
- `element`: 애니메이션된 DOM 엘리먼트입니다.
- `types`: 애니메이션에 포함된 [Transition 타입](/reference/react/addTransitionType)입니다.

### View Transition 클래스 {/*view-transition-class*/}

View Transition 클래스는 ViewTransition이 활성화될 때 Transition 중에 React가 적용하는 CSS 클래스 이름입니다. 문자열 또는 객체일 수 있습니다.
- `string`: 활성화될 때 자식 엘리먼트에 추가되는 `class`입니다. `'none'`이 제공되면 클래스가 추가되지 않습니다.
- `object`: 자식 엘리먼트에 추가되는 클래스는 `addTransitionType`으로 추가된 View Transition 타입과 일치하는 키입니다. 객체는 일치하는 타입이 없을 때 사용할 `default`도 지정할 수 있습니다.

값 `'none'`은 특정 트리거에 대해 View Transition이 활성화되지 않도록 하는 데 사용할 수 있습니다.

### View Transition 스타일링 {/*styling-view-transitions*/}

<Note>

웹에서 View Transition의 많은 초기 예시에서 [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name)을 사용한 다음 `::view-transition-...(my-name)` 선택자를 사용하여 스타일을 지정하는 것을 볼 수 있습니다. 그러나 이러한 방식으로 스타일링하는 것을 권장하지 않습니다. 대신, 일반적으로 View Transition 클래스를 사용하는 것을 권장합니다.

</Note>

`<ViewTransition>`의 애니메이션을 커스터마이즈하려면 활성화 프로퍼티 중 하나에 View Transition 클래스를 제공할 수 있습니다. View Transition 클래스는 ViewTransition이 활성화될 때 React가 자식 엘리먼트에 적용하는 CSS 클래스 이름입니다.

예를 들어 "enter" 애니메이션을 커스터마이즈하려면 `enter` 프로퍼티에 클래스 이름을 제공합니다.


```js
<ViewTransition enter="slide-in">
```

`<ViewTransition>`이 "enter" 애니메이션을 활성화하면 React는 클래스 이름 `slide-in`을 추가합니다. 그런 다음 [View Transition 가상 선택자](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements)를 사용하여 이 클래스를 참조하여 재사용 가능한 애니메이션을 구축할 수 있습니다.

```css
::view-transition-group(.slide-in) {
  
}
::view-transition-old(.slide-in) {

}
::view-transition-new(.slide-in) {

}
```
향후 CSS 라이브러리에서 View Transition 클래스를 사용한 내장 애니메이션을 추가하여 사용하기 쉽게 만들 수 있습니다.

#### 주의 사항 {/*caveats*/}

- By default, `setState` updates immediately and does not activate `<ViewTransition>`, only updates wrapped in a [Transition](/reference/react/useTransition). You can also use [`<Suspense>`](/reference/react/Suspense) to opt-in to a Transition to [reveal content](/reference/react/Suspense#revealing-content-together-at-once).
- `<ViewTransition>` creates an image that can be moved around, scaled and cross-faded. Unlike Layout Animations you may have seen in React Native or Motion, this means that not every individual Element inside of it animates its position. This can lead to better performance and a more continuous feeling, smooth animation compared to animating every individual piece. However, it can also lose continuity in things that should be moving by themselves. So you might have to add more `<ViewTransition>` boundaries manually as a result.
- Many users may prefer not having animations on the page. React doesn't automatically disable animations for this case. We recommend that using the `@media (prefers-reduced-motion)` media query to disable animations or tone them down based on user preference. In the future, CSS libraries may have this built-in to their presets.
- Currently, `<ViewTransition>` only works in the DOM. We're working on adding support for React Native and other platforms.

---


## 사용법 {/*usage*/}

### enter/exit에서 엘리먼트 애니메이션 적용하기 {/*animating-an-element-on-enter*/}

Enter/Exit Transition은 `<ViewTransition>`이 Transition에서 컴포넌트에 의해 추가되거나 제거될 때 발생합니다.

```js
function Child() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

`setShow`가 호출되면 `show`가 `true`로 바뀌고 `Child` 컴포넌트가 렌더링됩니다. `setShow`가 `startTransition` 내부에서 호출되고 `Child`가 다른 DOM 노드보다 먼저 `ViewTransition`을 렌더링하면 `enter` 애니메이션이 발생합니다.

`show`가 다시 `false`로 바뀌면 `exit` 애니메이션이 발생합니다.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

`<ViewTransition>`은 DOM 노드보다 앞에 배치되어야만 활성화됩니다. `Child`가 다음과 같다면 애니메이션이 발생하지 않습니다.

```js [3, 5]
function Component() {
  return <ViewTransition>Hi</ViewTransition>;
}
```

</Pitfall>

---
### 공유 엘리먼트 애니메이션 적용하기 {/*animating-a-shared-element*/}

일반적으로 `<ViewTransition>`에 이름을 할당하는 것보다 React가 자동으로 이름을 할당하도록 하는 것을 권장합니다. 이름을 할당하고 싶은 경우는 하나의 트리가 마운트 해제되고 다른 트리가 동시에 마운트될 때 완전히 다른 컴포넌트 간에 애니메이션을 적용하여 연속성을 보존하고자 할 때입니다.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

하나의 트리가 마운트 해제되고 다른 트리가 마운트될 때 마운트 해제되는 트리와 마운트되는 트리에서 동일한 이름이 존재하는 쌍이 있으면 둘 다에서 "share" 애니메이션이 발생합니다. 마운트 해제되는 쪽에서 마운트되는 쪽으로 애니메이션이 적용됩니다.

exit/enter 애니메이션과 달리 삭제되거나 새로 마운트된 트리의 깊숙한 곳에서도 적용될 수 있습니다. `<ViewTransition>`이 exit/enter에도 해당한다면 "share" 애니메이션이 우선순위를 갖습니다.

Transition이 먼저 한쪽을 마운트 해제하고 새로운 이름이 마운트되기 전에 `<Suspense>` 폴백이 표시되는 경우 공유 엘리먼트 Transition은 발생하지 않습니다.

<Sandpack>

```js
import {
  ViewTransition,
  useState,
  startTransition
} from "react";
import {Video, Thumbnail, FullscreenVideo} from "./Video";
import videos from "./data";

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return <FullscreenVideo
      video={videos[0]}
      onExit={() => startTransition(() => setFullscreen(false))}
    />
  }
  return <Video
    video={videos[0]}
    onClick={() => startTransition(() => setFullscreen(true))}
  />
}

```

```js src/Video.js
import {ViewTransition} from "react";

const THUMBNAIL_NAME = "video-thumbnail"

export function Thumbnail({ video, children }) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({ video, onClick }) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button
          className="close-button"
          onClick={onExit}
        >
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```


```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>


<Note>

한 쌍의 마운트된 쪽이나 마운트 해제된 쪽 중 하나가 뷰포트 밖에 있으면 쌍이 형성되지 않습니다. 이는 무언가가 스크롤될 때 뷰포트 안팎으로 날아가는 것을 방지합니다. 대신 일반적인 enter/exit로 자체적으로 처리됩니다.

동일한 컴포넌트 인스턴스가 위치를 변경하는 경우에는 이런 일이 발생하지 않으며 "update"가 발생합니다. 한 위치가 뷰포트 밖에 있어도 애니메이션이 적용됩니다.

현재 한 가지 특이한 점이 있는데, 깊게 중첩된 마운트 해제된 `<ViewTransition>`이 뷰포트 안에 있고, 마운트되는 쪽이 뷰포트 밖에 있는 경우, 해당 마운트 해제된 요소는 부모 애니메이션의 일부로 동작하는 대신, 깊게 중첩되어 있더라도 자체적인 "exit" 애니메이션으로 동작하게 됩니다.

</Note>

<Pitfall>

전체 앱에서 동시에 동일한 `name`으로 마운트된 것이 하나만 있어야 한다는 것이 중요합니다. 따라서 충돌을 피하기 위해 `name`에 고유한 네임스페이스를 사용하는 것이 중요합니다. 이를 확실히 하기 위해 가져올 수 있는 별도 모듈에 상수를 추가하는 것이 좋습니다.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>


---

### 목록에서 항목 순서 변경 애니메이션 적용하기 {/*animating-reorder-of-items-in-a-list*/}


```js
items.map(item => <Component key={item.id} item={item} />)
```

콘텐츠를 업데이트하지 않고 목록 순서를 변경할 때 DOM 노드 밖에 있으면 목록의 각 `<ViewTransition>`에서 "update" 애니메이션이 발생합니다. enter/exit 애니메이션과 유사합니다.

이는 이 `<ViewTransition>`에서 애니메이션이 발생한다는 의미입니다.

```js
function Component() {
  return <ViewTransition><div>...</div></ViewTransition>;
}
```
<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
  

```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

하지만 다음은 각 개별 항목에 애니메이션을 적용하지 않습니다.

```js
function Component() {
  return <div><ViewTransition>...</ViewTransition></div>;
}
```
대신 부모 `<ViewTransition>`이 크로스 페이드됩니다. 부모 `<ViewTransition>`이 없으면 별도의 애니메이션이 적용되지 않습니다.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
  

```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

이는 컴포넌트가 자체적으로 순서 변경 애니메이션을 제어할 수 있도록 하고 싶을 때는 리스트 안에 래퍼 요소를 두지 않는 것이 좋다는 뜻입니다.

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

위 규칙은 항목 중 하나가 크기 조정을 위해 업데이트되어 형제 항목들이 크기 조정되는 경우에도 적용되며, 이는 형제 `<ViewTransition>`도 애니메이션시키지만 직접적인 형제인 경우에만 해당합니다.

이것은 업데이트가 발생하여 레이아웃이 크게 변경될 때, 페이지에 있는 모든 `<ViewTransition>`을 각각 개별적으로 애니메이션하지 않는다는 뜻입니다. 그렇게 하면 실제 변화와 관계없는 많은 산만한 애니메이션이 발생해 주의를 흐트러뜨리게 됩니다. 따라서 React는 개별 애니메이션을 언제 트리거할지에 대해 보다 보수적으로 동작합니다.

<Pitfall>

목록 순서를 변경할 때 아이덴티티를 보존하기 위해 키를 적절히 사용하는 것이 중요합니다. "name"이나 공유 엘리먼트 Transition을 사용하여 순서 변경을 애니메이션할 수 있을 것 같지만 한쪽이 뷰포트 밖에 있으면 발생하지 않습니다. 리스트를 재정렬하는 애니메이션을 만들 때는, 해당 항목이 화면에 보이지 않는 위치로 이동했음을 사용자에게 보여주는 것이 중요한 경우가 많습니다.

</Pitfall>

---

### Suspense 콘텐츠에서 애니메이션 적용하기 {/*animating-from-suspense-content*/}

다른 Transition과 마찬가지로 React는 애니메이션을 실행하기 전에 데이터와 새로운 CSS(`<link rel="stylesheet" precedence="...">`)를 기다립니다. 이에 더해 ViewTransition은 새로운 폰트가 나중에 깜빡이는 것을 방지하기 위해 애니메이션을 시작하기 전에 새로운 폰트가 로드될 때까지 최대 500ms까지 기다립니다. 같은 이유로 ViewTransition으로 래핑된 이미지는 이미지가 로드될 때까지 기다립니다.

새로운 Suspense 경계 인스턴스 내부에 있으면 폴백이 먼저 표시됩니다. Suspense 경계가 완전히 로드된 후 `<ViewTransition>`이 콘텐츠로 전환되는 애니메이션을 실행합니다.

현재 이 동작은 클라이언트 측 Transition에서만 발생합니다. 향후에는 초기 로드 중에 서버의 콘텐츠가 일시 중단될 때 스트리밍 SSR에 대한 Suspense 경계도 애니메이션할 예정입니다.

`<ViewTransition>`을 배치하는 위치에 따라 Suspense 경계를 애니메이션하는 두 가지 방법이 있습니다.

Update:

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```
이 시나리오에서 콘텐츠가 A에서 B로 바뀔 때 "update"로 처리되며 적절한 경우 해당 클래스를 적용합니다. A와 B 모두 동일한 view-transition-name을 갖게 되므로 기본적으로 크로스 페이드로 작동합니다.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: "loading"}
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition,
  Suspense
} from 'react';
import {Video, VideoPlaceholder} from "./Video";
import {useLazyVideoData} from "./data"

function LazyVideo() {
  const video = useLazyVideoData();
  return (
    <Video video={video}/>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from "react";

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(90deg, rgba(173, 216, 230, 0.3) 25%, rgba(135, 206, 250, 0.5) 50%, rgba(173, 216, 230, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Enter/Exit:

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

이 시나리오에서는 각각 고유한 `view-transition-name`을 갖는 두 개의 별도 ViewTransition 인스턴스입니다. 이는 `<A>`의 "exit"와 `<B>`의 "enter"로 처리됩니다.

`<ViewTransition>` 경계를 배치하는 위치에 따라 다른 효과를 얻을 수 있습니다.

---
### 애니메이션 제외하기 {/*opting-out-of-an-animation*/}

때로는 전체 페이지와 같은 큰 기존 컴포넌트를 래핑하고 테마 변경과 같은 일부 업데이트를 애니메이션하고 싶지만 전체 페이지 내부의 모든 업데이트가 업데이트될 때 크로스 페이드에 포함되는 것을 원하지 않을 수 있습니다. 특히 점진적으로 더 많은 애니메이션을 추가하는 경우에 그렇습니다.

클래스 "none"을 사용하여 애니메이션을 제외할 수 있습니다. 자식을 "none"으로 래핑하면 부모가 여전히 발생하는 동안 자식에 대한 업데이트 애니메이션을 비활성화할 수 있습니다.

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">
      {children}
    </ViewTransition>
  </div>
</ViewTransition>
```

이는 테마가 변경될 때만 애니메이션되며 자식만 업데이트될 때는 애니메이션되지 않습니다. 자식은 여전히 자체 `<ViewTransition>`으로 다시 참여할 수 있지만 최소한 다시 수동으로 제어하는 방식이 됩니다.

---

### 애니메이션 커스터마이징 {/*customizing-animations*/}

기본적으로 `<ViewTransition>`은 브라우저의 기본 크로스 페이드를 포함합니다.

애니메이션을 커스터마이징하려면 `<ViewTransition>` 컴포넌트에 props를 제공하여 `<ViewTransition>`이 활성화되는 방식에 따라 사용할 애니메이션을 지정할 수 있습니다.

예를 들어 기본 크로스 페이드 애니메이션을 느리게 할 수 있습니다.

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

그리고 View Transition 클래스를 사용하여 CSS에서 slow-fade를 정의합니다.

```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`default` 설정 외에도 `enter`, `exit`, `update`, `share` 애니메이션에 대한 구성을 제공할 수 있습니다.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### 타입으로 애니메이션 커스터마이징하기 {/*customizing-animations-with-types*/}
특정 활성화 트리거에 대해 특정 Transition 타입이 활성화될 때 자식 엘리먼트에 클래스 이름을 추가하기 위해 [`addTransitionType`](/reference/react/addTransitionType) API를 사용할 수 있습니다. 이를 통해 각 Transition 타입에 대한 애니메이션을 커스터마이징할 수 있습니다.

예를 들어 모든 앞으로 및 뒤로 네비게이션에 대한 애니메이션을 커스터마이징하려면,

```js
<ViewTransition default={{
  'navigation-back': 'slide-right',
  'navigation-forward': 'slide-left',
 }}>
  <div>...</div>
</ViewTransition>
 
// 라우터에서:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

ViewTransition이 "navigation-back" 애니메이션을 활성화하면 React는 "slide-right" 클래스 이름을 추가합니다. ViewTransition이 "navigation-forward" 애니메이션을 활성화하면 React는 "slide-left" 클래스 이름을 추가합니다.

향후 라우터와 다른 라이브러리들이 표준 view-transition 타입과 스타일에 대한 지원을 추가할 수 있습니다.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from "react";
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter={
        {
          "add-video-back": "slide-in-back",
          "add-video-forward": "slide-in-forward"
        }
      }
      exit={
        {
          "remove-video-back": "slide-in-forward",
          "remove-video-forward": "slide-in-back"
        }
      }>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-back")
              } else {
                addTransitionType("add-video-back")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >⬅️</button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-forward")
              } else {
                addTransitionType("add-video-forward")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >➡️</button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### View Transition 지원 라우터 구축하기 {/*building-view-transition-enabled-routers*/}

스크롤 복원이 애니메이션 중에 정상적으로 동작하도록, React는 대기 중인 내비게이션이 완료될 때까지 기다립니다. 네비게이션이 React에서 차단되는 경우 `useEffect`는 교착 상태로 이어질 수 있으므로 라우터는 `useLayoutEffect`에서 차단을 해제해야 합니다.

"뒤로" 네비게이션 중처럼 레거시 popstate 이벤트에서 `startTransition`이 시작되면 스크롤과 폼 복원이 올바르게 작동하도록 동기적으로 완료되어야 합니다. 이는 View Transition 애니메이션 실행과 충돌합니다. 따라서 React는 popstate에서 애니메이션을 건너뜁니다. 따라서 뒤로 버튼에 대해서는 애니메이션이 실행되지 않습니다. Navigation API를 사용하도록 라우터를 업그레이드하여 이를 해결할 수 있습니다.

---

## 문제 해결 {/*troubleshooting*/}

### `<ViewTransition>`이 활성화되지 않습니다 {/*my-viewtransition-is-not-activating*/}

`<ViewTransition>` only activates if it is placed before any DOM node:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

해결하려면 `<ViewTransition>`이 다른 DOM 노드보다 앞에 오도록 하세요.

```js [3, 5] 
function Component() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}
```

### "동일한 이름으로 마운트된 `<ViewTransition name=%s>` 컴포넌트가 두 개 있습니다."라는 오류가 발생합니다 {/*two-viewtransition-with-same-name*/}

이 오류는 동일한 `name`을 가진 두 개의 `<ViewTransition>` 컴포넌트가 동시에 마운트될 때 발생합니다.


```js [3]
function Item() {
  // 🚩 모든 항목이 동일한 "name"을 갖게 됩니다.
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} />)}
    </>
  );
}
```

이는 View Transition에서 오류를 발생시킵니다. 개발 중에 React는 이 문제를 감지하여 표면화하고 두 개의 오류를 기록합니다.

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

There are two `<ViewTransition name=%s>` components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

The existing `<ViewTransition name=%s>` duplicate has this stack trace.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

해결하려면 `name`이 고유하도록 하거나 이름에 `id`를 추가하여 전체 앱에서 동일한 이름을 가진 `<ViewTransition>`이 한 번에 하나만 마운트되도록 하세요.

```js [3]
function Item({id}) {
  // ✅ 모든 항목이 고유한 "name"을 갖게 됩니다.
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} item={item} />)}
    </>
  );
}
```
