---
meta: "<meta>"
---

<Intro>

[내장 브라우저 `<meta>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/meta)를 사용하면 문서에 메타데이터를 추가할 수 있습니다.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<meta>` {/*meta*/}

문서 메타데이터를 추가하려면 [내장 브라우저 `<meta>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/meta)를 렌더링하세요. 어느 컴포넌트에서나 `<meta>`를 렌더링할 수 있으며, React는 항상 해당 DOM 요소를 문서의 `<head>`에 배치합니다.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### Props {/*props*/}

`<meta>`는 모든 [공통 엘리먼트 Props](/reference/react-dom/components/common#common-props)를 지원합니다.

다음 속성 중 _하나만_ 가져야 합니다. `name`, `httpEquiv`, `charset`, `itemProp`.

`<meta>` 컴포넌트는 지정된 Props에 따라 각각 다른 동작을 합니다.

* `name`: 문자열. 문서에 첨부될 [메타데이터 종류](https://developer.mozilla.org/ko/docs/Web/HTML/Element/meta/name)를 지정합니다.
* `charset`: 문자열. 문서에서 사용되는 문자 인코딩을 지원합니다. 유효한 값은 `"utf-8"` 뿐 입니다.
* `httpEquiv`: 문자열. 문서를 처리할 지시 사항을 지정합니다.
* `itemProp`: 문자열. 문서 전체가 아닌 문서 내 특정 항목에 대한 메타데이터를 지정합니다.
* `content`: 문자열. `name` 또는 `itemProp` Props와 함께 사용 시 첨부될 메타데이터를 지정하거나, `httpEquiv` Props와 함께 사용 시 지시 사항의 동작을 지정합니다.

#### 특수 렌더링 동작 {/*special-rendering-behavior*/}

React는 `<meta>` 컴포넌트가 React 트리 어디에서 렌더링되든 상관없이 해당하는 DOM 요소를 항상 문서의 `<head>` 내에 배치합니다. DOM 내에서 `<head>`는 `<meta>`가 존재할 수 있는 유일한 유효한 위치이지만, 특정 페이지를 나타내는 컴포넌트가 `<meta>` 컴포넌트를 자체적으로 렌더링할 수 있다는 점이 편리하고, 구성 가능성을 유지해 줍니다.

단, `<meta>`에 [`itemProp`](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/itemprop) Props가 있는 경우에는 예외입니다. 이 경우에는 문서에 대한 메타데이터가 아닌 페이지의 특정 부분에 대한 메타데이터를 나타내므로 특수한 동작이 적용되지 않습니다.

---

## 사용법 {/*usage*/}

### 문서에 메타데이터 추가하기 {/*annotating-the-document-with-metadata*/}

키워드, 요약 또는 저자의 이름과 같은 메타데이터를 문서에 추가할 수 있습니다. React는 해당 메타데이터를 문서 `<head>`에 배치하며, React 트리 내에서 어디에 렌더링되든 상관없이 해당 작업이 이루어집니다.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

어느 컴포넌트에서나 `<meta>` 컴포넌트를 렌더링할 수 있습니다. React는 문서 `<head>`에 `<meta>` DOM 노드를 배치합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 문서 내 특정 항목에 메타데이터 추가하기 {/*annotating-specific-items-within-the-document-with-metadata*/}

`itemProp` Props와 함께 `<meta>` 컴포넌트를 사용하여 문서 내 특정 항목에 메타데이터를 추가할 수 있습니다. 이 경우, React는 이러한 주석을 문서 내 `<head>`에 배치하지 않고, 다른 React 컴포넌트처럼 배치합니다.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
