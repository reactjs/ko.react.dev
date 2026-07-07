---
title: resumeAndPrerenderToNodeStream
---

<Intro>

`resumeAndPrerenderToNodeStream`은 사전 렌더링된 React 트리를 [Node.js Stream](https://nodejs.org/api/stream.html)을 사용해 정적 HTML 문자열로 이어서 렌더링합니다.

```js
const {prelude, postponed} = await resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

이 API는 Node.js 전용입니다. Deno나 최신 엣지 런타임처럼 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)를 지원하는 환경에서는 [`prerender`](/reference/react-dom/static/prerender)를 사용해야 합니다.

</Note>

---

## 레퍼런스 {/*reference*/}

### `resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)` {/*resumeandprerendertolnodestream*/}

`resumeAndPrerenderToNodeStream`을 호출해 사전 렌더링된 React 트리를 정적 HTML 문자열로 이어서 렌더링합니다.

```js
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, writable) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerenderToNodeStream(<App />, JSON.parse(postponedState));
  prelude.pipe(writable);
}
```

클라이언트에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출해 서버에서 생성된 HTML을 상호작용할 수 있도록 만듭니다.

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: `prerender` 또는 이전 `resumeAndPrerenderToNodeStream`을 호출할 때 전달한 React 노드입니다. 예를 들어 `<App />`과 같은 JSX 엘리먼트입니다. 전체 문서를 나타낼 것으로 예상되므로 `App` 컴포넌트는 `<html>` 태그를 렌더링해야 합니다.
* `postponedState`: [prerender API](/reference/react-dom/static/index)에서 반환된 불투명한 `postpone` 객체로, 저장해 둔 위치(예: Redis, 파일, S3)에서 불러옵니다.
* `options`**(선택사항)**: 스트리밍 옵션을 지정할 수 있는 객체입니다.
  * `signal`**(선택사항)**: [서버 렌더링을 중단](/reference/react-dom/server/renderToPipeableStream#aborting-server-rendering)하고 나머지를 클라이언트에서 렌더링할 수 있게 하는 [중단 신호](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)입니다.
  * `onError`**(선택사항)**: 서버 오류가 발생할 때마다, [복구 가능](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell) 또는 [불가능](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell) 여부와 관계없이 호출되는 콜백입니다. 기본적으로 `console.error`만 호출합니다. [충돌 보고를 기록](/reference/react-dom/server/renderToPipeableStream#logging-crashes-on-the-server)하도록 재정의하는 경우에도 반드시 `console.error`를 호출해야 합니다.

#### 반환값 {/*returns*/}

`resumeAndPrerenderToNodeStream`은 Promise를 반환합니다.
- 렌더링에 성공하면 Promise는 다음을 포함한 객체로 resolve됩니다.
  - `prelude`: HTML을 담은 [Node.js Stream](https://nodejs.org/api/stream.html)입니다. 이 스트림을 사용해 응답을 청크 단위로 전송하거나, 전체 스트림을 문자열로 읽을 수 있습니다.
  - `postponed`: JSON으로 직렬화 가능한 불투명 객체입니다. `resumeAndPrerenderToNodeStream`이 중단된 경우 [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) 또는 [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)에 전달할 수 있습니다.
- 렌더링에 실패하면 Promise는 reject됩니다. [이 값을 사용해 fallback 셸을 출력하세요.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### 주의 사항 {/*caveats*/}

사전 렌더링 시 `nonce` 옵션은 사용할 수 없습니다. Nonce는 요청마다 고유해야 하며 [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)로 애플리케이션을 보호할 때 Nonce 값을 사전 렌더링 결과에 포함하는 것은 부적절하고 안전하지 않습니다.

<Note>

### `resumeAndPrerenderToNodeStream`은 언제 사용해야 하나요? {/*when-to-use-prerender*/}

정적 `resumeAndPrerenderToNodeStream` API는 정적 서버 사이드 생성(SSG)에 사용합니다. `renderToString`과 달리 `resumeAndPrerenderToNodeStream`은 모든 데이터가 로드될 때까지 기다린 후에 resolve됩니다. 이는 Suspense를 사용해 가져와야 하는 데이터를 포함해 전체 페이지의 정적 HTML을 생성하는 데 적합합니다. 콘텐츠가 로드되는 동안 스트리밍하려면 [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)과 같은 스트리밍 서버 사이드 렌더링(SSR) API를 사용하세요.

부분 사전 렌더링을 지원하기 위해 `resumeAndPrerenderToNodeStream`은 중단할 수 있으며, 이후 다른 `resumeAndPrerenderToNodeStream`으로 이어서 진행하거나 `resume`으로 재개할 수 있습니다.

</Note>

---

## 사용법 {/*usage*/}

### 추가로 읽어보기 {/*further-reading*/}

`resumeAndPrerenderToNodeStream`은 [`prerender`](/reference/react-dom/static/prerender)와 비슷하게 동작하지만, 이전에 시작했다가 중단된 사전 렌더링 과정을 이어서 진행하는 데 사용할 수 있습니다.
사전 렌더링된 트리 재개에 대한 자세한 내용은 [resume 문서](/reference/react-dom/server/resume#resuming-a-prerender)를 확인하세요.
