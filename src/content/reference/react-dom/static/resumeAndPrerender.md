---
title: resumeAndPrerender
---

<Intro>

`resumeAndPrerender`는 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)을 사용하여 사전 렌더링된 React 트리를 정적 HTML 문자열로 이어서 렌더링합니다.

```js
const {prelude, postponed} = await resumeAndPrerender(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

이 API는 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)에 의존합니다. Node.js에서는 [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)을 대신 사용하세요.

</Note>

---

## 레퍼런스 {/*reference*/}

### `resumeAndPrerender(reactNode, postponedState, options?)` {/*resumeandprerender*/}

`resumeAndPrerender`를 호출하여 사전 렌더링된 React 트리를 정적 HTML 문자열로 이어서 렌더링합니다.

```js
import { resumeAndPrerender } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, response) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerender(<App />, postponedState, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

클라이언트에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출하여 서버에서 생성된 HTML을 상호작용할 수 있도록 만듭니다.

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: `prerender`(또는 이전 `resumeAndPrerender`)를 호출할 때 사용한 React 노드입니다. 예를 들어 `<App />`과 같은 JSX 엘리먼트입니다. 전체 문서를 나타낼 것으로 예상되므로 `App` 컴포넌트는 `<html>` 태그를 렌더링해야 합니다.
* `postponedState`: [사전 렌더링 API](/reference/react-dom/static/index)가 반환한 불투명한 `postpone` 객체로, 저장해 둔 곳(예: redis, 파일 또는 S3)에서 불러옵니다.
* `options`**(선택사항)**: 스트리밍 옵션을 가진 객체입니다.
  * `signal`**(선택사항)**: [서버 렌더링을 중단](#aborting-server-rendering)하고 나머지를 클라이언트에서 렌더링하기 위한 [중단 신호<sup>Abort Signal</sup>](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)입니다.
  * `onError`**(선택사항)**: [복구 가능](#recovering-from-errors-outside-the-shell)하거나 [그렇지 않은](#recovering-from-errors-inside-the-shell) 서버 오류가 발생할 때마다 호출되는 콜백입니다. 기본적으로 `console.error`만 호출합니다. 이 함수를 재정의하여 [크래시 리포트를 로깅](#logging-crashes-on-the-server)하는 경우 `console.error`를 계속 호출해야 합니다.

#### 반환값 {/*returns*/}

`prerender`는 Promise를 반환합니다.
- 렌더링에 성공하면 Promise는 다음을 포함하는 객체로 resolve됩니다.
  - `prelude`: HTML의 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)입니다. 이 스트림을 사용해 응답을 청크로 보내거나 전체 스트림을 문자열로 읽을 수 있습니다.
  - `postponed`: `prerender`가 중단된 경우 [`resume`](/reference/react-dom/server/resume) 또는 [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender)에 전달할 수 있는 JSON 직렬화 가능한 불투명 객체입니다.
- 렌더링에 실패하면 Promise는 reject됩니다. [이를 이용해 대체 셸을 출력하세요.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### 주의 사항 {/*caveats*/}

`nonce`는 사전 렌더링할 때 사용할 수 없는 옵션입니다. Nonce는 요청마다 고유해야 하며, [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)로 애플리케이션을 보호하기 위해 Nonce를 사용한다면 Nonce 값을 사전 렌더링 자체에 포함하는 것은 부적절하고 안전하지 않습니다.

<Note>

### `resumeAndPrerender`는 언제 사용해야 하나요? {/*when-to-use-prerender*/}

정적 `resumeAndPrerender` API는 정적 서버 사이드 생성(SSG)에 사용됩니다. `renderToString`과 달리 `resumeAndPrerender`는 resolve되기 전에 모든 데이터가 로드되기를 기다립니다. 따라서 Suspense를 사용해 가져와야 하는 데이터를 포함해 전체 페이지의 정적 HTML을 생성하기에 적합합니다. 콘텐츠가 로드되는 대로 스트리밍하려면 [renderToReadableStream](/reference/react-dom/server/renderToReadableStream)과 같은 스트리밍 서버 사이드 렌더링(SSR) API를 사용하세요.

`resumeAndPrerender`는 중단할 수 있으며, 이후 다른 `resumeAndPrerender`로 이어서 진행하거나 `resume`으로 재개하여 부분 사전 렌더링을 지원합니다.

</Note>

---

## 사용법 {/*usage*/}

### 더 읽어보기 {/*further-reading*/}

`resumeAndPrerender`는 [`prerender`](/reference/react-dom/static/prerender)와 유사하게 동작하지만, 이전에 시작했다가 중단된 사전 렌더링 과정을 이어서 진행하는 데 사용할 수 있습니다.
사전 렌더링된 트리를 재개하는 방법에 대한 자세한 내용은 [resume 문서](/reference/react-dom/server/resume#resuming-a-prerender)를 참조하세요.
