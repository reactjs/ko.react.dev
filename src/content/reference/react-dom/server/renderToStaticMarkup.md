---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` 상호작용하지 않는 React 트리를 HTML 문자열로 렌더링합니다.

```js
const html = renderToStaticMarkup(reactNode)
```

</Intro>

<InlineToc />

---

## 참조 {/*reference*/}

### `renderToStaticMarkup(reactNode)` {/*rendertostaticmarkup*/}

서버에서 `renderToStaticMarkup`을 호출하여 앱을 HTML로 렌더링합니다.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

상호작용하지 않는 React 컴포넌트의 HTML 출력을 생성합니다.

[아래 예시를 참고하세요.](#usage)

#### 파라미터 {/*parameters*/}

* `reactNode`: HTML로 렌더링할 React 노드입니다. 예를 들어, `<Page />`와 같은 JSX 노드입니다.

#### 반환 {/*returns*/}

HTML 문자열을 반환합니다.

#### 주의 사항 {/*caveats*/}

* `renderToStaticMarkup`의 출력값은 hydrate 될 수 없습니다.

* `renderToStaticMarkup`은 Suspense를 제한적으로 지원합니다. 만약 suspense 컴포넌트라면, `renderToStaticMarkup`은 즉시 HTML을 fallback으로 보냅니다.

* `renderToStaticMarkup`은 브라우저에서 동작하지만, 클라이언트 코드에서 사용되는 건 권장하지 않습니다. 브라우저에서 컴포넌트를 HTML로 렌더링해야 하는 경우, [HTML 을 DOM 노드로 렌더링해서 가져오세요.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## 사용법 {/*usage*/}

### 상호작용하지 않는 React 트리를 HTML 문자열로 렌더링하기 {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

`renderToStaticMarkup`을 서버 응답과 함께 보낼 수 있는 HTML 문자열로 앱에 렌더링하기 위해 호출하세요:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

이것은 React 컴포넌트의 상호작용하지 않는 초기 HTML 결과가 생성됩니다.

<Pitfall>

이 메서드는 **hydrate 될 수 없고 상호작용하지 않는 HTML** 을 렌더링합니다. 이 메서드는 React를 간단한 정적 페이지 생성기로 사용하거나 이메일과 같은 완전히 정적인 콘텐츠를 렌더링할 때 유용합니다.

상호작용을 위한 앱은 서버에서 [`renderToString`](/reference/react-dom/server/renderToString)을, 클라이언트에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용해야 합니다.

</Pitfall>
