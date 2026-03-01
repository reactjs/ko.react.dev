---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream`은 사전 렌더링된 React 트리를 파이프 가능한 [Node.js Stream](https://nodejs.org/api/stream.html)으로 스트리밍합니다.

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

이 API는 Node.js 전용입니다. Deno 및 최신 엣지 런타임처럼 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)을 지원하는 환경에서는 [`resume`](/reference/react-dom/server/resume)을 대신 사용하세요.

</Note>

---

## 레퍼런스 {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

`resumeToPipeableStream`을 호출해 사전 렌더링된 React 트리의 렌더링을 재개하고, 이를 HTML로 [Node.js Stream](https://nodejs.org/api/stream.html#writable-streams)에 렌더링합니다.


```js
import { resumeToPipeableStream } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: `prerender`를 호출할 때 전달한 React 노드입니다. 예를 들어, `<App />`과 같은 JSX 엘리먼트입니다. 전체 문서를 나타낼 것으로 예상되므로 `App` 컴포넌트는 `<html>` 태그를 렌더링해야 합니다.
* `postponedState`: [prerender API](/reference/react-dom/static/prerender)에서 반환된 불분명한 `postpone` 객체로, 저장해 둔 위치(예: Redis, 파일, S3)에서 불러옵니다.
* **optional** `options`: 스트리밍 옵션을 지정할 수 있는 객체입니다.
  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)에서 스크립트를 허용하기 위한 [`nonce`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) 문자열입니다.
  * **optional** `signal`: [서버 렌더링을 중단](/reference/react-dom/server/renderToPipeableStream#aborting-server-rendering)하고 나머지를 클라이언트에서 렌더링할 수 있게 하는 [중단 신호](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)입니다.
  * **optional** `onError`: 서버 오류가 발생할 때마다, [복구 가능](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell) 또는 [불가능](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)에 관계없이 호출되는 콜백입니다. 기본적으로 `console.error`만 호출합니다. [충돌 보고를 기록](/reference/react-dom/server/renderToPipeableStream#logging-crashes-on-the-server)하도록 재정의하는 경우에도 반드시 `console.error`를 호출해야 합니다.
  * **optional** `onShellReady`: [셸](/reference/react-dom/server/renderToPipeableStream#specifying-what-goes-into-the-shell)이 렌더링된 직후에 실행되는 콜백입니다. 여기서 `pipe`를 호출해 스트리밍을 시작할 수 있습니다. React는 HTML 로딩 폴백을 콘텐츠로 대체하는 인라인 `<script>` 태그와 함께 셸 뒤에 [추가 콘텐츠를 스트리밍](/reference/react-dom/server/renderToPipeableStream#streaming-more-content-as-it-loads)합니다.
  * **optional** `onShellError`: 초기 셸을 렌더링하는 데 오류가 발생하면 호출되는 콜백입니다. 오류를 인자로 받습니다. 스트림에서 아직 바이트가 전송되지 않았고, `onShellReady`나 `onAllReady`도 호출되지 않으므로 [폴백 HTML 셸을 출력](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)하거나 prelude를 사용할 수 있습니다.


#### 반환값 {/*returns*/}

`resumeToPipeableStream`은 두 개의 메서드를 가진 객체를 반환합니다.

* `pipe`는 HTML을 제공된 [쓰기 가능한 Node.js 스트림](https://nodejs.org/api/stream.html#writable-streams)으로 출력합니다. 스트리밍을 활성화하려면 `onShellReady`에서, 크롤러와 정적 생성을 사용하려면 `onAllReady`에서 `pipe`를 호출합니다.
* `abort`를 사용하면 [서버 렌더링을 중단](/reference/react-dom/server/renderToPipeableStream#aborting-server-rendering)하고 나머지는 클라이언트에서 렌더링할 수 있습니다.

#### 주의 사항 {/*caveats*/}

- `resumeToPipeableStream`은 `bootstrapScripts`, `bootstrapScriptContent`, `bootstrapModules` 옵션을 받지 않습니다. 대신 `postponedState`를 생성하는 `prerender` 호출에 이 옵션들을 전달해야 합니다. 또한 쓰기 가능한 스트림에 부트스트랩 콘텐츠를 수동으로 주입할 수도 있습니다.
- `prerender`와 `resumeToPipeableStream`에서 접두사가 동일해야 하므로, `resumeToPipeableStream`은 `identifierPrefix`를 받지 않습니다.
- `nonce`는 prerender에 전달할 수 없으므로, prerender에 스크립트를 제공하지 않는 경우에만 `resumeToPipeableStream`에 `nonce`를 전달해야 합니다.
- `resumeToPipeableStream`은 사전 렌더링이 완전히 완료되지 않은 컴포넌트를 찾을 때까지 루트부터 다시 렌더링합니다. 사전 렌더링이 완전히 완료된 컴포넌트(해당 컴포넌트와 자식들의 사전 렌더링이 모두 완료된 경우)만 완전히 건너뜁니다.

## 사용법 {/*usage*/}

### 추가로 읽어보기 {/*further-reading*/}

재개 동작은 `renderToPipeableStream`과 유사합니다. 더 많은 예시는 [`renderToPipeableStream`의 사용법 섹션](/reference/react-dom/server/renderToPipeableStream#usage)을 확인하세요.
[`prerenderToNodeStream`의 사용법 섹션](/reference/react-dom/static/prerenderToNodeStream#usage)에는 `prerenderToNodeStream` 사용 방법에 대한 예시가 포함되어 있습니다.
