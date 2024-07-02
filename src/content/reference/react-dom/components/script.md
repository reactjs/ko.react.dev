---
script: "<script>"
canary: true
---

<Canary>

React의 `<script>` 확장은 현재 React의 카나리(Canary) 버전 및 실험 채널에서만 사용할 수 있습니다. React의 안정적인 릴리즈에서는 `<script>`가 [내장 브라우저 HTML 컴포넌트](https://react.dev/reference/react-dom/components#all-html-components)로만 작동합니다. 여기에서 [React의 릴리즈 채널](/community/versioning-policy#all-release-channels)에 대해 자세히 알아보십시오.

</Canary>

<Intro>

[내장된 브라우저 `<script>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)를 사용하면 문서의 제목을 지정할 수 있습니다.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<script>` {/*script*/}

문서에 인라인 또는 외부 스크립트를 추가하려면 [내장된 브라우저 `<script>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)를 렌더링하십시오. `<script>`는 어떤 컴포넌트에서든 렌더링할 수 있으며, React는 [특정 경우](#special-rendering-behavior)에 해당 DOM 요소를 문서의 head에 배치하고 동일한 스크립트를 중복 제거합니다.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### Props {/*props*/}

`<script>`는 [모든 컴포넌트 속성](/reference/react-dom/components/common#props)을 지원합니다.

다음 중 하나의 속성을 가져야 합니다.

* `children`: 문자열. 인라인 스크립트의 소스 코드
* `src`: 문자열. 외부 스크립트의 URL

다른 지원되는 속성들:

* `async`: 불리언 값. 문서의 나머지가 처리될 때까지 스크립트 실행을 브라우저에게 연기할 수 있도록 합니다. — 성능을 위한 우선적인 동작 방식입니다.
*  `crossOrigin`: 문자열. 사용할 [CORS 정책](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)입니다. 가능한 값은 `anonymous`와 `use-credentials`입니다.
* `fetchPriority`: 문자열. 여러 스크립트를 동시에 가져올 때 브라우저가 스크립트를 우선순위로 순위 지정할 수 있도록 합니다. `"high"`, `"low"`, 또는 `"auto"` (기본값)일 수 있습니다.
* `integrity`: 문자열. 스크립트의 암호화 해시로, [진위성을 검증](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)합니다.
* `noModule`: 불리언 값. ES 모듈을 지원하는 브라우저에서 스크립트를 비활성화합니다. — ES 모듈을 지원하지 않는 브라우저에 대한 대체 스크립트를 허용합니다.
* `nonce`: 문자열. 엄격한 콘텐츠 보안 정책을 사용할 때 [리소스를 허용하기 위해](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) 사용하는 암호화된 nonce입니다.
* `referrer`: 문자열. 스크립트를 가져오고 스크립트가 다시 가져온 리소스를 가져올 때 보낼 [Referer 헤더를 지정합니다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy)
* `type`: 문자열. 스크립트가 [전통적인 스크립트, ES 모듈 또는 import 맵](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type)인지를 나타냅니다.

React의 [스크립트의 특수 처리](#special-rendering-behavior)를 비활성화하는 속성들:

* `onError`: 함수. 스크립트가 로딩에 실패할 때 호출됩니다.
* `onLoad`: 함수. 스크립트의 로딩이 완료되었을 때 호출됩니다.

React에서 **권장되지 않는** 속성들:

* `blocking`: 문자열. `"render"`로 설정하면 페이지가 스크립트시트를 로드할 때까지 브라우저에게 페이지를 렌더링하지 말라고 지시합니다. React는 Suspense를 사용하여 더 세밀한 제어를 제공합니다.
* `defer`: 문자열. 문서가 로딩될 때까지 브라우저가 스크립트를 실행하지 못하도록 합니다. 스트리밍 서버에 렌더링된 컴포넌트와 호환되지 않습니다. 대신 `async` 속성을 사용하세요.

#### 특별한 렌더링 동작 {/*special-rendering-behavior*/}

<<<<<<< HEAD
React는 `<script>` 컴포넌트를 문서의 `<head>`로 이동시키고, 동일한 스크립트를 중복으로 처리하며 스크립트가 로딩 중일 때 [중단](/reference/react/Suspense)할 수 있습니다.
=======
React can move `<script>` components to the document's `<head>` and de-duplicate identical scripts.
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1

이 동작을 사용하려면 `src` 와 `async={true}` 속성을 제공하세요. React는 `src`가 동일한 경우에만 스크립트를 중복 처리합니다. 스크립트를 안전하게 이동하려면 `async` 속성이 반드시 true여야 합니다.

<<<<<<< HEAD
만약 `onLoad` 또는 `onError` 속성 중 하나라도 제공하면 특별한 동작이 없습니다. 이는 이러한 속성이 스크립트의 로딩을 컴포넌트 내에서 수동으로 관리한다는 것을 나타내기 때문입니다.

이 특별한 처리에는 두 가지 주의사항이 있습니다.
=======
This special treatment comes with two caveats:
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1

* React는 스크립트를 렌더링한 후에 속성 변경을 무시합니다. (개발 환경에서 이러한 경우에는 경고가 표시됩니다.)
* React는 컴포넌트를 마운트 해제한 후에도 DOM에 스크립트를 남길 수 있습니다. (스크립트는 DOM에 삽입될 때 한 번만 실행되므로 이것은 영향을 미치지 않습니다.)

---

## 사용법 {/*usage*/}

### 외부 스크립트 렌더링 {/*rendering-an-external-script*/}

<<<<<<< HEAD
특정 스크립트에 의존하여 컴포넌트를 올바르게 표시해야 한다면, 컴포넌트 내에서 `<script>`를 렌더링할 수 있습니다.

만약 `src` and `async` 속성을 제공하면 스크립트가 로드되는 동안 컴포넌트가 중단됩니다. React는 `src`가 동일한 스크립트를 중복 처리하여 동일한 스크립트를 DOM에 한 번만 삽입하며, 여러 컴포넌트가 렌더링해도 같은 동작을 수행합니다.
=======
If a component depends on certain scripts in order to be displayed correctly, you can render a `<script>` within the component.
However, the component might be committed before the script has finished loading.
You can start depending on the script content once the `load` event is fired e.g. by using the `onLoad` prop.

React will de-duplicate scripts that have the same `src`, inserting only one of them into the DOM even if multiple components render it.
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
스크립트를 사용할 때 [preinit](/reference/react-dom/preinit) 함수를 호출하는 것이 유익할 수 있습니다. 이 함수를 호출하면 `<script>` 컴포넌트를 그냥 렌더링하는 것보다 브라우저가 스크립트를 더 빨리 가져오도록 할 수 있습니다. 예를 들어 [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)를 보내는 것입니다.
</Note>

### 인라인 스크립트 렌더링 {/*rendering-an-inline-script*/}

<<<<<<< HEAD
인라인 스크립트를 포함하려면 render the `<script>` 컴포넌트를 자식으로 스크립트 소스 코드와 함께 렌더링하세요. 인라인 스크립트는 중복 처리되거나 문서 `<head>`로 이동되지 않으며, 외부 리소스를 로드하지 않기 때문에 컴포넌트가 중단되지 않습니다.
=======
To include an inline script, render the `<script>` component with the script source code as its children. Inline scripts are not de-duplicated or moved to the document `<head>`.
>>>>>>> 53fbed3f676013508fb9cce22a3fc8664b1dc5a1

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
