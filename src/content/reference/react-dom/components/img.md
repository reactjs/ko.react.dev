---
title: "<img>"
---

<Intro>

[내장 브라우저 `<img>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/img)를 사용하면 이미지를 삽입할 수 있습니다.

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<img>` {/*img*/}

이미지를 표시하려면 [내장 브라우저 `<img>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/img)를 렌더링합니다.

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

[아래 예시를 참고하세요.](#usage)

#### Props {/*props*/}

`<img>`는 모든 [공통 엘리먼트 Props](/reference/react-dom/components/common#common-props)를 지원합니다.

* `alt`: 문자열. 이미지에 대한 대체 텍스트를 지정합니다. 순수하게 장식용인 이미지에는 빈 문자열을 사용하세요.
* `crossOrigin`: 문자열. 이미지를 가져올 때 사용할 [CORS 정책](https://developer.mozilla.org/ko/docs/Web/HTML/Attributes/crossorigin)을 지정합니다. 가능한 값은 `anonymous`와 `use-credentials`입니다.
* `decoding`: 문자열. 브라우저가 다른 콘텐츠를 표시하기 전에 이미지 디코딩을 기다려야 하는지에 대한 힌트를 지정합니다. 가능한 값은 `async`, `sync`, `auto`(기본값)입니다.
* `fetchPriority`: 문자열. 이미지를 가져올 상대적 우선순위에 대한 힌트를 지정합니다. 가능한 값은 `high`, `low`, `auto`(기본값)입니다. 서버 렌더링 중에는 `fetchPriority="low"`가 React의 [자동 이미지 프리로드](#controlling-image-preloading-during-server-rendering)도 막습니다.
* `height`: 숫자 또는 문자열. 이미지가 렌더링될 높이를 지정합니다.
* `loading`: 문자열. 브라우저가 이미지가 뷰포트에 가까워질 때까지 로드를 지연해야 하는지를 지정합니다. 가능한 값은 `eager`(기본값)와 `lazy`입니다. `loading="lazy"`를 설정하면 React의 [자동 이미지 프리로드](#controlling-image-preloading-during-server-rendering)가 적용되지 않습니다.
* `onError`: [이벤트 핸들러](/reference/react-dom/components/common#event-handler) 함수. 이미지 로드에 실패했을 때 호출됩니다.
* `onLoad`: [이벤트 핸들러](/reference/react-dom/components/common#event-handler) 함수. 이미지 로드가 완료되었을 때 호출됩니다. `onLoad`를 전달하면 클라이언트에서 렌더링되는 View Transition 업데이트 중에 React가 [이미지를 기다리지 않습니다](#waiting-for-an-image-during-a-view-transition).
* `referrerPolicy`: 문자열. 이미지를 가져올 때 보낼 [리퍼러 정보](https://developer.mozilla.org/ko/docs/Web/HTML/Element/img#referrerpolicy)를 지정합니다.
* `sizes`: 문자열. 다양한 페이지 레이아웃에 대한 이미지 크기를 지정합니다. `srcSet`과 함께 사용합니다.
* `src`: 문자열. 이미지의 URL을 지정합니다.
* `srcSet`: 문자열. 브라우저가 선택할 수 있는 하나 이상의 후보 이미지 소스를 지정합니다.
* `useMap`: 문자열. 이미지를 [클라이언트 측 이미지 맵](https://developer.mozilla.org/ko/docs/Web/HTML/Element/map)과 연결합니다.
* `width`: 숫자 또는 문자열. 이미지가 렌더링될 너비를 지정합니다.

#### 주의 사항 {/*caveats*/}

* `src`에 빈 문자열을 전달하지 마세요. 브라우저가 현재 페이지를 다시 요청할 수 있습니다. React는 개발 환경에서 경고하고 해당 어트리뷰트를 생략합니다. 이미지를 렌더링하지 않으려면 `<img>`를 생략하거나 `src`에 `null`을 전달하세요.
* `<img>`는 자식을 가질 수 없고 `dangerouslySetInnerHTML`도 사용할 수 없습니다. 둘 중 하나라도 전달하면 React는 오류를 발생시킵니다.
* `fetchPriority="low"`는 클라이언트에서 렌더링되는 View Transition 업데이트 중에 React가 이미지의 로드를 기다리는 것을 막지 않습니다. 이 동작을 해제하려면 `loading="lazy"` 또는 `onLoad` 핸들러를 사용하세요.

---

## 사용법 {/*usage*/}

### 이미지 표시하기 {/*displaying-an-image*/}

이미지 URL을 `src`에, 텍스트 설명을 `alt`에 전달하세요.

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      width={100}
      height={100}
    />
  );
}
```

```css
img {
  border-radius: 50%;
  object-fit: cover;
}
```

</Sandpack>

이미지의 크기를 알고 있다면 `width`와 `height`를 지정하여 브라우저가 이미지가 로드되기 전에 공간을 확보할 수 있도록 하세요. 장식용 이미지라면 스크린 리더가 무시할 수 있도록 `alt=""`를 전달하세요.

---

### 서버 렌더링 중 이미지 프리로드 제어하기 {/*controlling-image-preloading-during-server-rendering*/}

서버 렌더링 중에 React는 기본적으로 `<img>`에 대한 프리로드 힌트를 자동으로 생성합니다. 이를 통해 브라우저가 렌더링된 HTML에서 `<img>`를 만나기 전에 이미지 가져오기를 시작할 수 있습니다.

이 힌트를 받지 않아야 하는 이미지에는 `loading="lazy"` 또는 `fetchPriority="low"`를 추가하세요.

```js
function ProductPage() {
  return (
    <>
      <img src="hero.jpg" alt="Featured product" />
      <img src="thumbnail.jpg" alt="Related product" loading="lazy" />
      <img src="secondary.jpg" alt="Another product" fetchPriority="low" />
    </>
  );
}
```

이 예시에서 React는 `hero.jpg`에 대해서만 프리로드 힌트를 생성합니다. 서버 API나 프레임워크에 따라 React는 다음 엘리먼트에 해당하는 결과를 렌더링할 수 있습니다.

```html
<link rel="preload" as="image" href="hero.jpg" />
```

React는 대신 `Link` 응답 헤더로 동일한 힌트를 제공할 수도 있습니다. 나머지 두 이미지는 렌더링된 HTML에서 `loading`과 `fetchPriority` props를 그대로 유지하지만, React는 이들에 대한 프리로드 힌트를 생성하지 않습니다. `loading="lazy"` prop은 브라우저에 이미지가 뷰포트에 가까워질 때까지 로드를 지연하도록 요청합니다. `fetchPriority="low"` prop은 이미지가 즉시 로드될 수 있도록 허용하면서도, 브라우저에 더 낮은 우선순위로 가져오도록 지시합니다.

이미지가 `<picture>`나 `<noscript>` 엘리먼트 안에 있는 경우, 또는 `src` 또는 `srcSet`이 데이터 URL인 경우에도 React는 이미지를 자동으로 프리로드하지 않습니다.

프레임워크나 컴포넌트 라이브러리를 통해 이미지를 렌더링하는 경우에는 해당 문서에서 기본 동작을 확인하세요. React는 내부적인 `<img>`의 props를 기반으로 자동 프리로드 생성 여부를 결정합니다. 예를 들어 어떤 이미지 컴포넌트는 기본적으로 `loading="lazy"`를 추가하고, 선택한 이미지를 명시적으로 프리로드하는 별도의 옵션을 제공할 수 있습니다.

명시적인 프리로드 힌트를 만들려면 [`preload`](/reference/react-dom/preload)를 호출하세요.

---

### View Transition 중 이미지 기다리기 {/*waiting-for-an-image-during-a-view-transition*/}

[`<ViewTransition>`](/reference/react/ViewTransition) 업데이트 중에 React는 애니메이션을 시작하기 전에 보이는 이미지가 로드될 때까지 최대 500ms 동안 기다립니다. 여기에는 새로 렌더링된 `<img>` 엘리먼트와 `src` 또는 `srcSet`이 변경되는 기존 이미지가 포함됩니다. `loading="lazy"`를 설정하거나 `onLoad` 핸들러를 추가하면 해당 이미지는 이 동작에서 제외됩니다.

Suspense 경계가 `<ViewTransition>` 내부와 외부에서 콘텐츠를 표시할 때 동일한 이미지가 어떻게 나타나는지 비교해 보세요.

<Sandpack>

```js
import {
  ViewTransition,
  Suspense,
  use,
  useState,
} from 'react';
import { fetchImageSrc } from './image.js';

function Profile({ cacheKey }) {
  const src = use(fetchImageSrc(cacheKey));
  return (
    <div className="card">
      <img src={src} alt="" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [showWithTransition, setShowWithTransition] =
    useState(false);
  const [showWithoutTransition, setShowWithoutTransition] =
    useState(false);
  return (
    <>
      <button onClick={() => setShowWithTransition(true)}>
        Show profile with View Transition
      </button>
      {showWithTransition && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile cacheKey="with-transition" />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <button onClick={() => setShowWithoutTransition(true)}>
        Show profile without View Transition
      </button>
      {showWithoutTransition && (
        <Suspense fallback={<ProfilePlaceholder />}>
          <Profile cacheKey="without-transition" />
        </Suspense>
      )}
    </>
  );
}
```

```js src/image.js hidden
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.
const cache = new Map();

export function fetchImageSrc(cacheKey) {
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, loadImageSrc());
  }
  return cache.get(cacheKey);
}

async function loadImageSrc() {
  // Suspense fallback이 보이도록 응답을 지연시킵니다.
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 이미지가 캐시되지 않도록 고유한 매개변수를 추가합니다.
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`<ViewTransition>`을 사용하면 React는 이미지가 로드되는 동안 최대 500ms까지 스켈레톤을 계속 표시하므로, 이미지가 이미 준비된 상태로 카드가 나타날 수 있습니다. `<ViewTransition>`이 없으면 Suspense는 Promise가 해결되는 즉시 스켈레톤 표시를 중단합니다. 이미지가 아직 로드 중이라면 카드가 먼저 나타나고 이미지는 나중에 나타납니다.
