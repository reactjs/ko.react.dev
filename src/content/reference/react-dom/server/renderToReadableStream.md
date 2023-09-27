---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream`는 [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)를 이용해 React tree를 그립니다.

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

이 API는 [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)에 의존합니다. Node.js의 경우, [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)를 대신 사용합니다.

</Note>

---

## Reference {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

`renderToReadableStream`를 호출해 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)으로 사용자가 작성한 React tree를 HTML처럼 렌더링합니다.

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

클라이언트에서, [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출해 서버에서 생성된 HTML을 상호작용 가능하도록 만듭니다.

[아래에서 더 많은 예시를 참고하세요.](#usage)

#### Parameter {/*parameters*/}

* `reactNode`: 사용자가 HTML로 렌더하고 하고자하는 React node입니다. `<App />`같은 JSX 요소가 그 예시입니다. reactNode 인자는 문서 전체를 표현할 수 있는 것이어야하며, 따라서 `App` 컴포넌트는 `<html>`에 렌더됩니다.

* **optional** `options`: 스트리밍 옵션을 지정할 수 있는 객체입니다.
  * **optional** `bootstrapScriptContent`: 지정될 경우, 해당 문자열은 `<script>` 태그에 인라인 형식으로 추가됩니다.
  * **optional** `bootstrapScripts`: 문자열 배열 형식의 단수 혹은 복수의 URL로 페이지에 함께 작성될 `<script>` 태그에 사용됩니다. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출할 떄, `<script>` 태그를 포함 시키기 위해 사용합니다. 클라이언트에서 React가 실행되길 원하지 않는다면, 제외시켜주세요.
  * **optional** `bootstrapModules`: `bootstrapScripts`와 비슷합니다, 하지만 [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)형식으로 추가됩니다.
  * **optional** `identifierPrefix`: React가 ID로서 사용할 문자열 앞머리로 [`useId`](/reference/react/useId)로 생성된 문자열입니다. 같은 페이지에서 여러 root를 사용할 때, 각 root간의 충돌을 방지하기 위해 유용합니다. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)에 전달한 앞머리와 반드시 동일해야합니다.
  * **optional** `namespaceURI`: 문자열로 스트림을 위한 기준 [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris)입니다. 일반 HTML에 해당하는 기본값이 설정되어있습니다. SVG를 위해 `'http://www.w3.org/2000/svg'`를 설정하거나 MathML을 위해 `'http://www.w3.org/1998/Math/MathML'`을 설정할 수 있습니다.
  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)를 허용하기 위한 [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) (한번만 사용되는) 문자열입니다.
  * **optional** `onError`: [회복할 수 있든](#recovering-from-errors-outside-the-shell) 있든 [없든] 상관없이, 서버에서 에러가 발생할 때마다 호출되는 콜백입니다. 기본적으로, 이 콜백은 `console.error`만 호출합니다. [크래시 리포트를 로그하기](#logging-crashes-on-the-server) 위해 오버라이드하거나, [상태 코드를 조정하기](#setting-the-status-code) 위해 오버라이드할 수 있습니다.
  * **optional** `progressiveChunkSize`: 청크의 바이트 수를 설정합니다. [기본 휴리스틱에 대해 더 읽어보기.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **optional** `signal`: [서버 렌더링을 취소](#aborting-server-rendering)하고, 그 나머지를 클라이언트에 렌더하기 위한 [거절 신호(abort signal)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)를 설정합니다.

#### 반환값 {/*returns*/}

`renderToReadableStream`는 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환합니다.

- [shell](#specifying-what-goes-into-the-shell)렌더링에 성공했다면, 반환된 Promise는 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)으로 해결됩니다.
- [shell](#specifying-what-goes-into-the-shell)렌더링에 실패하면, 반환된 Promise는 취소됩니다. [shell 렌더링에 실패시, 이것을 이용해 실패 결과를 출력하세요.](#recovering-from-errors-inside-the-shell)

반환된 스트림은 다음과 같은 추가적인 프로퍼티를 가지고 있습니다.

* `allReady`: 모든 추가 [컨텐츠](#streaming-more-content-as-it-loads)와 [shell](#specifying-what-goes-into-the-shell)의 렌더링을 포함한 모든 렌더링이 완료된 Promise의 추가 프로퍼티입니다. [크롤러와 정적 생성을 위해](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) `await stream.allReady`를 응답 반환 전에 사용할 수 있습니다. 설정 시엔, 로딩 진행 상태를 받을 수 없습니다. 스트림은 최종 HTML을 포함할 것입니다.

---

## 사용 예시 {/*usage*/}

### Readable Web Stream을 이용해 React tree를 HTML처럼 렌더링하기 {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

`renderToReadableStream`를 호출해 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)을 통해 React tree를 HTML처럼 렌더링합니다.

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

<CodeStep step={1}>root 컴포넌트</CodeStep>와 함께, <CodeStep step={2}>bootstrap `<script>` 경로</CodeStep> 리스트를 제공해야합니다. 제공된 root 컴포넌트는 **최상위 `<html>` 태그를 포함한 모든 문서를 포함해서** 반환되어야 합니다.

예를 들어, 다음과 같은 형태가 되어야 합니다:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React는 [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)와 <CodeStep step={2}>bootstrap `<script>` 태그들</CodeStep>을 결과 HTML 스트림에 주입합니다:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... 사용자가 직접 작성한 컴포넌트의 HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

클라이언트에선, 추가된 bootstrap 스크립트는 [`hydrateRoot`를 호출해 `document` 전체를 hydrate 해야합니다:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

이 과정은 서버에서 렌더링된 HTML에 이벤트 리스너들을 붙이고, HTML을 상호작용 가능하게 만듭니다.

<DeepDive>

#### 빌드 결과물에서 CSS와 JS의 경로 읽어오기 {/*reading-css-and-js-asset-paths-from-the-build-output*/}

JS와 CSS같은 최종 에셋들에 대한 URL들은 종종 빌드 후에 해시됩니다. 예를 들어, `styles.css` 대신 `styles.123456.css`와 같은 형태로 끝날 수 있습니다. 에셋들의 파일명을 해시하는 것은 모든 빌드의 결과물이 각각 다른 파일명을 가지도록 보장합니다. 이는 정적 에셋들에 대한 장기 캐싱을 안전하게 활성화할 수 있도록 해줍니다: 즉, 특정 이름의 파일 내용은 절대 바뀌지 않는 다는 것을 보장합니다.

하지만, 빌드 후에 에셋들의 URL을 알 수 없다면, 소스 코드에 URL을 넣을 수 없습니다. 예를 들어, JSX에 `"/styles.css"`를 하드코딩하는 것은 작동하지 않습니다. 소스 코드에 URL을 넣지 않으려면, 루트 컴포넌트는 props로 전달된 맵에서 실제 파일명을 읽어야합니다:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

서버에선 `<App assetMap={assetMap} />`을 렌더하고, 에셋 URL들과 함께 `assetMap`을 전달합니다:

```js {1-5,8,9}
// 빌드 도구로부터 이 JSON을 얻어야합니다. 예를 들어, 빌드 결과물에서 읽어올 수 있습니다.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

서버가 `<App assetMap={assetMap} />`를 렌더한 이후엔, 클라이언트에서도 hydration 에러를 피하기 위해 `assetMap`과 함께 렌더해야합니다. `assetMap`을 직렬화하고 클라이언트에 전달하기 위해 다음과 같이 할 수 있습니다:

```js {9-10}
// 빌드 도구로부터 이 JSON을 얻어야합니다.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // 주의: 이 데이터는 사용자가 생성하지 않았기 때문에 stringify()를 사용해도 안전합니다.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

위의 예시에서, `bootstrapScriptContent` 옵션은 클라이언트에서 `window.assetMap` 전역 변수를 설정하는 인라인 `<script>` 태그를 추가합니다. 이는 클라이언트 코드가 동일한 `assetMap`을 읽을 수 있게 해줍니다:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

클라이언트와 서버는 모두 같은 `assetMap` prop을 이용해 `App`을 렌더하므로, hydration 에러가 일어나지 않습니다.

</DeepDive>

---

### 더 많은 컨텐츠를 스트리밍하면서 로드하기 {/*streaming-more-content-as-it-loads*/}

스트리밍은 사용자가 모든 데이터를 서버로부터 로드해오기 전에 컨텐츠를 볼 수 있도록 합니다. 예를 들어, 프로필 커버사진, 친구들과 사진들이 있는 사이드바 그리고 포스트 목록을 보여주는 프로필 페이지를 생각해봅시다:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

`<Posts />`의 데이터를 불러오는데 약간의 시간이 필요하다고 가정해봅시다. 이 경우, 사용자가 포스트 목록을 기다리지 않고도 프로필 페이지의 나머지 컨텐츠를 볼 수 있도록 하고 싶을 것입니다. 이를 위해, [`<Suspense>`를 사용해 `Posts`를 감싸주세요:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

이렇게 하면 React는 `Posts`가 모든 데이터를 불러오기 전까지, HTML 스트리밍을 시작합니다. React는 먼저 로딩 대체 컨텐츠인 `<PostsGlimmer />`를 HTML로 보내고, `Posts`의 데이터 로딩이 완료되면, `<PostsGlimmer />`를 `<Posts />`로 교체할 HTML과 인라인 `<script>` 태그를 함께 보냅니다. 사용자 입장에선, 먼저 `<PostsGlimmer />`를 보고, 후에 `<Posts />`를 보게 됩니다.

더 정밀한 로딩 순서를 만들기 위해 [`<Suspense>` 경계를 중첩](/reference/react/Suspense#revealing-nested-content-as-it-loads) 할 수 있습니다:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```


이 예시를 보았을 때, React가 더 빠르게 스트리밍을 시작하게 할 수 있습니다. `<ProfileLayout>`과 `<ProfileCover>`는 어떤 `<Suspense>` 경계에도 감싸져있지 않기 때문에, React는 먼저 이 두 컴포넌트를 렌더링합니다. 하지만, `Sidebar`나 `Friends` 혹은 `Photos`가 데이터를 불러올 필요가 있는 경우엔, `BigSpinner`를 대체 HTML로 보냅니다. 그 후, 데이터가 더 불러와지면, 더 많은 컨텐츠가 보여지게 되고 이 과정은 모든 컨텐츠가 보여질 때까지 반복됩니다.

스트리밍은 브라우저에서 React 자체가 로드되거나 앱이 상호 작용 가능해질 때까지 기다릴 필요가 없습니다. 서버로부터 로딩되는 HTML 콘텐츠는 `<script>` 태그 중 하나가 로드되기 전까지 점진적으로 표시될 것입니다.

[스트리밍 HTML이 어떻게 동작하는지 더 읽어보기.](https://github.com/reactwg/react-18/discussions/37)

<Note>

Suspense-가능한 데이터 소스만이 Suspense 컴포넌트를 활성화합니다. 이는 다음과 같습니다:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 나 [Next.js](https://nextjs.org/docs/getting-started/react-essentials) 같은 Suspense-가능한 프레임워크로 데이터를 가져오기
- [`lazy`](/reference/react/lazy)를 이용해 Lazy-loading 컴포넌트가 된 코드

Suspense는 Effect나 이벤트 핸들러 내부에서 데이터를 불러올 경우, **이를, 감지하지 못합니다.**

`Posts` 컴포넌트에서 데이터를 불러오는 정확한 방법은, 위에 설명된 프레임워크에 따라 달라집니다. Suspense-가능한 프레임워크를 이용하는 경우, 데이터를 불러오는 방법과 그 자세한 사항은 해당 프레임워크 문서에서 찾으실 수 있습니다.

주관적으로 제시된 프레임워크 없이 Suspense-가능한 데이터 불러오기 방법은 아직 지원하지 않습니다. 프레임워크 없이 Suspense-가능한 데이터를 만들고 불러오는 방법은 아직 불안정하고 문서화되지 않았습니다. 데이터 소스를 Suspense와 함께 융합하는 방법은 공식적인 API는 React의 향후 버전에서 지원될 예정입니다.

</Note>

---

### Specifying what goes into the shell {/*specifying-what-goes-into-the-shell*/}

앱에서 `<Suspense>` 경계 밖에 있는 부분을 *shell*이라고 합니다:


```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

이는 유저가 보는 최초의 로딩 상태를 정해줍니다:

```js {3-5,13}
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

만약, `<Suspense>` 경계를 root에 걸어 앱 전체를 감쌌다면, shell은 spinner만을 보여줄 것입니다. 하지만, 이는 사용자 경험에 있어서 좋지 않습니다. 큰 spinner를 보는 것은 비록 더 기다리게 될 지 언정, 실제 레이아웃이 나타나는 것보다 더 느리고 더 짜증나는 경험을 줄 수 있습니다. 이런 이유로 개발자들은 `<Suspense>` 경계를 통해 shell을 전체 페이지 레이아웃의 뼈대처럼 *최소한으로 완성된* 상태이다라는 느낌을 줄 수 있도록 하고 싶을 것입니다.

`renderToReadableStream`를 비동기 호출하여 모든 shell이 렌더될 때까지 `stream`으로 위 문제를 해결합니다. 보통, `stream`을 가진 응답을 생성하고 반환함으로서 스트리밍을 시작합니다.

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

`stream`이 반환되었을 때, 중첩된 내부의 `<Suspense>` 경계의 컴포넌트는 아직 데이터를 로딩중일 수도 있습니다.

---

### 서버의 충돌을 로깅하기 {/*logging-crashes-on-the-server*/}

기본적으로, 서버의 모든 에러는 콘솔에 로깅됩니다. 이 기본 동작을 오버라이드하여 크래시 리포트를 로깅할 수 있습니다:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

만약 `onError`를 직접 제공했다면, 위와 같이 콘솔에 오류를 로깅하는 것도 잊지 마세요.

---

### shell 내부의 에러로부터 회복하기 {/*recovering-from-errors-inside-the-shell*/}

이번 예시에서, shell은 `ProfileLayout`, `ProfileCover` 그리고 `PostsGlimmer`를 포함하고 있습니다.

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

만약, 위의 컴포넌트들을 렌더링하다가 에러가 발생했다면, React는 클라이언트로 보낼 의미있는 HTML을 가지고 있지 않을 것 입니다. 이런 때를 대비해 `renderToReadableStream`을 `try...catch`로 감싸 서버 렌더링에 의존하지 않는 대체 HTML을 보낼 수 있도록 하세요.

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

shell을 렌더링하면서 에러가 발생한다면, `onError`와 `catch` 블록이 동시에 실행됩니다. `onError`는 에러를 보고하기 위해 사용하고, `catch` 블록은 대체 HTML 문서를 보내기 위해 사용하세요. 대체 HTML은 반드시 에러 페이지일 필요는 없습니다. 대신, 클라이언트에서만 렌더링되는 대체 shell을 포함할 수 있습니다.

---

### shell 외부의 에러로부터 회복하기 {/*recovering-from-errors-outside-the-shell*/}

이번 예시에서, `<Posts />` 컴포넌트는 `<Suspense>`에 감싸져있기 때문에, shell의 일부가 *아닙니다.*

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` 컴포넌트 혹은 그 내부 어딘가에서 에러가 발생했을 경우, React는 [에러로 부터 회복하려고 할 것입니다:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

1. 가장 가까운 `<Suspense>` 경계의 로딩 대체인 (`PostsGlimmer`)를 HTML로 보냅니다.
2. 서버에서 더이상의 `Posts`와 그 내부를 렌더링하는 것을 "포기"합니다.
3. 클라이언트에서 자바스크립트 코드가 로딩되었을 때, React는 `Posts`를 다시 렌더링하려고 시도할 것입니다.

만약 클라이언트에서도 `Posts` 렌더링 재시도가 실패한다면, React는 클라이언트에서 에러를 던지게 됩니다. 렌더링 중에 일어난 모든 에러과 함께, [가장 가까운 부모 에러 경계](/reference/react/Component#static-getderivedstatefromerror)로 유저에게 어떤 에러를 보여줘야할 지를 결정하게 됩니다. 실제로는, 사용자가 에러가 복구될 수 없다는 것이 확실시 될 때까지 로딩 표시기를 보고있어야 한 다는 것을 의미합니다.

클라이언트에서 `Posts` 렌더링 재시도가 성공하면, 서버에서 온 로딩 대체 HTML이 클라이언트에서 렌더링된 결과로 교체됩니다. 사용자는 서버에서 에러가 있었는지 모를 것입니다. 하지만, 서버의 `onError` 콜백과 클라이언트의 [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) 콜백은 그대로 실행됩니다. 이를 통해 에러 내용을 받아서 로깅할 수 있습니다.

---

### 상태 코드 설정하기 {/*setting-the-status-code*/}

스트리밍은 트레이드오프를 동반합니다. 사용자가 컨텐츠를 더 빨리 볼 수 있도록 페이지를 스트리밍하겠지만, 한번 스트리밍을 시작하면, 응답 상태 코드를 설정할 수 없습니다.

앱을 shell(`<Suspense>` 경계 바깥의 모든 것)과 나머지 컨텐츠들로 [나누는 것](#specifying-what-goes-into-the-shell)으로, 이 문제는 이미 해결된 것입니다. 만약 shell에 에러가 있다면, `catch` 블록이 실행되기 때문에, 상태 코드를 설정할 수 있습니다. 혹은, 클라이언트에서 에러가 복구된 다는 것을 알고 있다면, 그냥 "OK"를 보낼 수도 있습니다.

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

만약 shell 바깥 (`<Suspense>` 경계의 안쪽)에서 에러가 발생했다면, React는 렌더링을 멈추지 않을 것입니다. 즉, `onError` 콜백은 실행되지만, `catch` 블록은 실행되지 않은 채로 코드가 계속해서 실행된다는 의미입니다. 그 이유는, [위에서 설명했던 것 처럼](#recovering-from-errors-outside-the-shell), React가 클라이언트에서 해당 에러를 복구하려고 하기 때문입니다.

하지만, 그래도 상태 코드를 설정하고 싶다면, 오류가 발생했다는 사실을 이용하여 상태 코드를 설정할 수 있습니다:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

이는, 초기 shell 콘텐츠를 생성하는 동안 발생한 shell 외부에서 일어난 에러만 잡을 것이므로, 완전한 방법은 아닙니다. 만약, 어떤 컨텐츠가 정말 중요해서 해당 컨텐츠에 발생한 에러를 알고 싶다면, 그것을 shell 안으로 옮겨 에러를 알아낼 수 있습니다.

---

### 각기 다른 방식으로 다른 종류의 에러를 처리하기 {/*handling-different-errors-in-different-ways*/}

[`Error` 서브클래스를 직접 만들 수 있고](https://javascript.info/custom-errors), [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) 연산자를 이용해 어떤 에러가 발생했는지 구별할 수 있습니다. 예를 들어, `NotFoundError`라는 서브클래스를 정의했고 이를 컴포넌트에서 발생시켰다고 한다면, `onError`에서 에러를 저장하고 응답을 반환하기 전에 에러 타입에 따라 다른 동작을 할 수 있습니다:

```js {2-3,5-15,22,28,33}
async function handler(request) {
  let didError = false;
  let caughtError = null;

  function getStatusCode() {
    if (didError) {
      if (caughtError instanceof NotFoundError) {
        return 404;
      } else {
        return 500;
      }
    } else {
      return 200;
    }
  }

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

명심해야 할 것은, shell을 전송하고 스트리밍을 시작한 후엔 상태 코드를 변경할 수 없다는 것입니다.

---

### 정적 생성과 크롤러를 위해 모든 컨텐츠가 로딩되는 것을 기다리기 {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

스트리밍은 사용자가 컨텐츠 상호작용이 가능해지는 것을 기다리지 않고도 컨텐츠를 볼 수 있어 더 나은 사용자 경험을 제공합니다.

하지만, 크롤러가 이 페이지를 방문했을 때, 혹은 페이지를 빌드했을 때 정적으로 생성한 경우엔 컨텐츠가 점진적으로 드러나는 것이 아니라 모든 컨텐츠가 처음부터 모두 불러와진 다음 최종 HTML 출력물을 생성하는 것을 원할 것입니다.

`stream.allReady` Promise를 기다림으로써 모든 컨텐츠가 로드될 때까지 기다릴 수 있습니다:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... depends on your bot detection strategy ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

일반적인 방문자라면 컨텐츠를 점진적으로 받게 될 것입니다. 크롤러라면, 모든 컨텐츠가 로드될 때까지 기다린 후에 최종 HTML을 받게 될 것입니다. 하지만, 이는 크롤러가 모든 데이터를 받을 때까지 기다려야 한다는 것으로, 그 중에 어떤 데이터가 로드되는데 느리거나 에러가 발생할 수 있는 상황까지 기다려야 한다는 것을 의미합니다. 따라서 앱의 특성에 따라 크롤러에게 shell을 보내는 것이 더 좋을 수도 있습니다.

---

### 서버 렌더링 멈추기 {/*aborting-server-rendering*/}

일정 시간이 지난 후, 서버에게 강제로 렌더링을 "포기"하라고 할 수 있습니다.

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
  }
}
```

React는 나머지 로딩 대체 내용을 HTML로 내보낼 것이고, 클라이언트에서 그 나머지 렌더링을 계속할 것입니다.
