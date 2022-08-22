---
title: JSX로 마크업 작성하기
---

<Intro>

<<<<<<< HEAD
JSX는 JavaScript를 확장한 문법으로, JavaScript 파일을 HTML과 비슷하게 마크업을 작성할 수 있도록 해줍니다. 컴포넌트를 작성하는 다른 방법도 있지만, 대부분의 React 개발자는 JSX의 간결함을 선호하며, 대부분의 코드베이스에서도 JSX를 사용합니다.
=======
*JSX* is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. Although there are other ways to write components, most React developers prefer the conciseness of JSX, and most codebases use it.
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

</Intro>

<YouWillLearn>

* React에서 마크업과 렌더링 로직을 같이 사용하는 이유
* JSX와 HTML의 차이점
* JSX로 정보를 보여주는 방법

</YouWillLearn>

## JSX: JavaScript에 마크업 넣기 {/*jsx-putting-markup-into-javascript*/}

Web은 HTML, CSS, JavaScript를 기반으로 만들어져왔습니다. 수년 동안 웹 개발자는 HTML로 내용을, CSS로 디자인을, JavaScript로 로직을 작성해왔습니다. 보통은 HTML, CSS, JavaScript를 분리된 파일로 관리합니다! 페이지의 로직은 JavaScript 안에서 분리되어 동작하는 동안, HTML 안에서는 내용이 마크업 되었습니다.

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

<<<<<<< HEAD
그러나 Web은 상호작용하는 작업이 점점 많아지면서, 로직에서 내용을 결정하는 일이 많아졌습니다. JavaScript가 HTML을 담당했습니다! 이것이 바로 **React에서 렌더링 로직과 마크업이 같은 곳에 함께 있게 된 이유입니다. 즉, 컴포넌트에서 말이죠!**
=======
But as the Web became more interactive, logic increasingly determined content. JavaScript was in charge of the HTML! This is why **in React, rendering logic and markup live together in the same place—components.**
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

`Sidebar.js` React component

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

`Form.js` React component

</Diagram>

</DiagramGroup>

버튼의 렌더링 로직과 버튼의 마크업이 함께 있으면, 매번 변화가 생길 때마다 서로 조화를 이룰 수 있습니다. 반대로, 버튼의 마크업과 사이드바의 마크업처럼 서로 관련이 없는 항목끼리는 각각 자체적으로 변경하는 편이 더 안전하기 때문에 서로 분리되도록 합니다.

각각의 React 컴포넌트는 React를 통해 브라우저에 마크업을 렌더링할 수 있는 JavaScript 함수입니다. React 컴포넌트는 JSX라는 확장된 문법을 사용하여 마크업을 나타냅니다. JSX는 HTML과 매우 비슷하지만, 조금 더 엄격하고 동적인 정보를 표시할 수 있습니다. JSX를 이해하는 가장 좋은 방법은 HTML 마크업을 JSX 마크업으로 변환해보는 것입니다.

<Note>

[JSX와 React는 서로 다른 개념](/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) 입니다. 서로 독립적이게 사용이 _가능합니다._

</Note>

## HTML을 JSX로 변환하기 {/*converting-html-to-jsx*/}

다음과 같은 HTML이 있다고 가정해봅시다. (완벽한 코드라고 가정합시다.)

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

이제 이것을 컴포넌트로 만들어볼 겁니다.

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

그냥 HTML을 그대로 복사하여 붙여넣는다면 동작하지 않을 겁니다.


<Sandpack>

```js
export default function TodoList() {
  return (
    // 이것은 동작하지 않습니다!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

왜냐하면 JSX는 더 엄격하고 HTML보다 몇 가지 규칙이 더 있기 때문입니다! 위의 오류 메시지를 읽으면 마크업을 수정하도록 안내하고 있습니다. 또는 아래의 가이드를 따를 수 있습니다.

<Note>

대부분의 경우 React의 화면 오류 메시지는 문제가 있는 곳을 찾는 데 도움이 됩니다. 막히면 읽어주세요!

</Note>

## JSX의 규칙 {/*the-rules-of-jsx*/}

### 1. 하나의 루트 엘리먼트로 반환하기 {/*1-return-a-single-root-element*/}

한 컴포넌트에서 여러 엘리먼트를 반환하려면, **하나의 부모 태그로 감싸주세요.**

예를 들면, 다음과 같이 `<div>`를 사용할 수 있습니다.

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


마크업에 `<div>`를 추가하고 싶지 않다면, `<>`와 `</>`로 대체할 수 있습니다.

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

이 빈 태그를 *[React fragment](TODO)*라고 합니다. React fragments는 브라우저상의 HTML 트리 구조에서 흔적을 남기지 않고 그룹화해줍니다.

<DeepDive title="왜 여러 JSX 태그를 하나로 감싸야 할까요?">

JSX는 HTML처럼 보이지만 내부적으로는 일반 JavaScript 객체로 변환됩니다. 하나의 배열로 감싸지 않은 하나의 함수에서는 두 개의 객체를 반환(리턴)할 수 없습니다. 따라서 또 다른 태그나 fragment로 감싸지 않으면 두 개의 JSX 태그를 반환할 수 없습니다.

</DeepDive>

### 2. 모든 태그는 닫아주기 {/*2-close-all-the-tags*/}

JSX에서는 태그를 명시적으로 닫아야 합니다. `<img>`처럼 자동으로 닫아주는 태그는 반드시 `<img />` 형태로 작성해야 하며, `<li>oranges`와 같은 래핑 태그도 `<li>oranges</li>` 형태로 작성해야 합니다.

다음과 같이 Hedy Lamarr의 이미지와 리스트의 항목들을 닫아줍니다.

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. <s>모두</s> 대부분 캐멀 케이스로! {/*3-camelcase-salls-most-of-the-things*/}

JSX는 JavaScript로 바뀌고 JSX에서 작성된 어트리뷰트는 JavaScript 객체의 키가 됩니다. 컴포넌트에서는 종종 어트리뷰트를 변수로 읽고 싶은 경우가 있습니다. 그러나 JavaScript는 변수명에 제한이 있습니다. 예를 들면, 변수명에 대시를 포함하거나 `class`처럼 예약어를 사용할 수 없습니다.

이것이 바로 React에서 HTML과 SVG의 어트리뷰트 대부분이 캐멀 케이스로 작성되는 이유입니다. 예를 들면, `stroke-width` 대신 `strokeWidth`로 사용합니다. `class`는 예약어이기 때문에, React에서는 [DOM의 프로퍼티에 대응한](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) 이름을 따서 `className`으로 대신 작성합니다.

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

[React DOM 엘리먼트에서 이러한 어트리뷰트를 찾을](TODO) 수 있습니다. 하나가 틀려도 걱정하지 마세요. React는 [브라우저 콘솔](https://developer.mozilla.org/docs/Tools/Browser_Console)에서 수정할 수 있는 부분을 메시지로 알려줍니다.

<Gotcha>

역사적 이유로, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA)와 [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes)의 어트리뷰트는 HTML에서와 동일하게 대시를 사용하여 작성합니다.

</Gotcha>

### 추천-팁: JSX 변환기 사용하기 {/*pro-tip-use-a-jsx-converter*/}

기존 마크업에서 모든 어트리뷰트를 변환하는 것은 지루할 수 있습니다! [변환기](https://transform.tools/html-to-jsx)를 사용하여 기존 HTML과 SVG를 JSX로 변환하는 것을 추천합니다. 변환기는 매우 유용하지만 그래도 JSX를 혼자서 편안하게 작성할 수 있도록 어트리뷰트를 어떻게 쓰는지 이해하는 것도 중요합니다.

최종 코드는 다음과 같습니다.

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

지금까지 JSX가 존재하는 이유와 컴포넌트에서 JSX를 쓰는 방법에 대해 알아보았습니다.

* React 컴포넌트는 서로 관련이 있는 마크업과 렌더링 로직을 함께 그룹화합니다.
* JSX는 HTML과 비슷하지만 몇 가지 차이점이 있습니다. 필요한 경우 [변환기](https://transform.tools/html-to-jsx)를 사용할 수 있습니다.
* 오류 메시지는 종종 마크업을 수정할 수 있도록 올바른 방향을 알려줍니다.

</Recap>



<Challenges>

### 일부 HTML을 JSX로 변환해보기 {/*convert-some-html-to-jsx*/}

다음은 컴포넌트에 HTML을 붙여넣었지만 올바른 JSX가 아닙니다. 수정해보세요.

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

직접 수정할지 변환기를 사용할지는 여러분에게 달려 있습니다!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
