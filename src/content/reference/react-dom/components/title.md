---
title: "<title>"
---

<Intro>

[내장 브라우저 `<title>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)를 사용하면 문서의 제목을 지정할 수 있습니다.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<title>` {/*title*/}

문서의 제목을 지정하려면 [내장 브라우저 `<title>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)를 렌더링하세요. `<title>`은 어떤 컴포넌트에서든 렌더링할 수 있으며, React는 항상 해당하는 DOM 요소를 문서의 `<head>`에 배치합니다.

```js
<title>My Blog</title>
```

[아래 예시를 참고하세요.](#usage)

#### Props {/*props*/}

`<title>`은 모든 [공통 엘리먼트 Props](/reference/react-dom/components/common#common-props)를 지원합니다.

* `children`: `<title>`은 자식으로 텍스트만 허용합니다. 이 텍스트는 문서의 제목이 됩니다. 텍스트만 렌더링하는 한, 사용자 정의 컴포넌트도 전달할 수 있습니다.

#### 특별한 렌더링 동작 {/*special-rendering-behavior*/}

React는 `<title>` 컴포넌트에 해당하는 DOM 요소를 React 트리 내 어디에서 렌더링하든 항상 문서의 `<head>` 내에 배치합니다. `<head>`는 DOM 내에서 `<title>`이 존재할 수 있는 유일한 위치이지만, 특정 페이지를 나타내는 컴포넌트가 자체적으로 `<title>`을 렌더링할 수 있으면 편리하고 구성 가능하게 유지됩니다.

여기에는 두 가지 예외가 있습니다.
* `<title>`이 `<svg>` 컴포넌트 내에 있는 경우, 특별한 동작이 없습니다. 이 맥락에서는 문서의 제목을 나타내는 것이 아니라 [해당 SVG 그래픽에 대한 접근성 주석](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)이기 때문입니다.
* `<title>`에 [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) 속성이 있는 경우, 특별한 동작이 없습니다. 이 경우 문서의 제목이 아니라 페이지의 특정 부분에 대한 메타데이터를 나타내기 때문입니다.

<Pitfall>

한 번에 하나의 `<title>`만 렌더링하세요. 여러 구성 요소가 동시에 `<title>` 태그를 렌더링하면 React는 모든 제목을 문서의 `<head>`에 배치합니다. 이렇게 되면 브라우저와 검색 엔진의 동작이 정의되지 않습니다.

</Pitfall>

---

## 사용법 {/*usage*/}

### 문서 제목 설정하기 {/*set-the-document-title*/}

텍스트를 자식으로 갖는 `<title>` 컴포넌트를 어떤 컴포넌트에서도 렌더링할 수 있습니다. React는 문서의 `<head>`에 `<title>` DOM 노드를 배치합니다.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### 제목에 변수 사용하기 {/*use-variables-in-the-title*/}

`<title>` 컴포넌트의 자식은 단일 텍스트 문자열이어야 합니다. (또는 단일 숫자나 `toString` 메서드를 가진 단일 객체). JSX 중괄호를 다음과 같이 사용하면 명확하지 않을 수 있습니다.

```js
<title>Results page {pageNumber}</title> // 🔴 Problem: This is not a single string
```

실제로는 `<title>` 컴포넌트에 두 개의 요소로 구성된 배열이 자식으로 전달됩니다. (문자열 `"Results page"`와 `pageNumber`의 값.) 이는 오류를 발생시킵니다. 대신에 문자열 보간을 사용하여 `<title>`에 단일 문자열을 전달하세요.

```js
<title>{`Results page ${pageNumber}`}</title>
```

