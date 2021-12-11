---
title: Writing Markup with JSX

title: JSX로 마크업 작성하기
---

<Intro>

JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. Although there are other ways to write components, most React developers prefer the conciseness of JSX, and most codebases use it.

JSX는 JavaScript를 확장한 문법으로, JavaScript 파일을 HTML과 비슷하게 마크업을 작성할 수 있도록 해줍니다. 컴포넌트를 작성하는 다른 방법도 있지만, 대부분의 React 개발자는 JSX의 간결함을 선호하며, 대부분의 코드베이스에서도 JSX를 사용합니다.

</Intro>

<YouWillLearn>

* Why React mixes markup with rendering logic
* How JSX is different from HTML
* How to display information with JSX

* React에서 마크업과 렌더링 로직을 같이 사용하는 이유
* JSX와 HTML의 차이점
* JSX로 정보를 보여주는 방법

</YouWillLearn>

## JSX: Putting markup into JavaScript {/*jsx-putting-markup-into-javascript*/}

## JSX: JavaScript에 마크업 넣기 {/*jsx-putting-markup-into-javascript*/}

The Web has been built on HTML, CSS, and JavaScript. For many years, web developers kept content in HTML, design in CSS, and logic in JavaScript—often in separate files! Content was marked up inside HTML while the page's logic lived separately in JavaScript:

Web은 HTML, CSS, JavaScript를 기반으로 만들어져왔습니다. 수년 동안 웹 개발자는 HTML로 내용을, CSS로 디자인을, JavaScript로 로직을 작성해왔습니다. 보통은 HTML, CSS, JavaScript을 분리된 파일로 관리합니다! 페이지의 로직은 JavaScript 안에서 분리되어 동작하는 동안, HTML 안에서는 내용이 마크업 되었습니다.

![HTML and JavaScript living in separate files](/images/docs/illustrations/i_html_js.svg)

![분리된 파일로 이루어진 HTML과 JavaScript](/images/docs/illustrations/i_html_js.svg)

But as the Web became more interactive, logic increasingly determined content. JavaScript was in charge of the HTML! This is why **in React, rendering logic and markup live together in the same place—components!**

그러나 Web은 상호작용하는 작업이 점점 많아지면서, 로직에서 내용을 결정하는 일이 많아졌습니다. JavaScript가 HTML을 담당했습니다! 이것이 바로 **React에서 렌더링 로직과 마크업이 같은 곳에 함께 있게 된 이유입니다. 즉, 컴포넌트에서 말이죠!**

![JavaScript functions sprinkled with markup](/images/docs/illustrations/i_jsx.svg)
![마크업을 뿌려주는 JavaScript 함수](/images/docs/illustrations/i_jsx.svg)

Keeping a button's rendering logic and markup together ensures that they stay in sync with each other on every edit. Conversely, details that are unrelated, such as the button's markup and a sidebar's markup, are isolated from each other, making it safer to change either of them on their own.

버튼의 렌더링 로직과 버튼의 마크업이 함께 있으면, 매번 변화가 생길 때마다 서로 조화를 이룰 수 있습니다. 반대로, 버튼의 마크업과 사이드바의 마크업처럼 서로 관련이 없는 항목끼리는 각각 자체적으로 변경하는 편이 더 안전하기 때문에 서로 분리되도록 합니다.

Each React component is a JavaScript function that may contain some markup that React renders into the browser. React components use a syntax extension called JSX to represent that markup. JSX looks a lot like HTML, but it is a bit stricter and can display dynamic information. The best way to understand this is to convert some HTML markup to JSX markup.

각각의 React 컴포넌트는 React를 통해 브라우저에 마크업을 렌더링할 수 있는 JavaScript 함수입니다. React 컴포넌트는 JSX라는 확장된 문법을 사용하여 마크업을 나타냅니다. JSX는 HTML과 매우 비슷하지만, 조금 더 엄격하고 동적인 정보를 표시할 수 있습니다. JSX를 이해하는 가장 좋은 방법은 HTML 마크업을 JSX 마크업으로 변환해보는 것입니다.

<Note>

[JSX and React are two separate things](/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) you _can_ use independently of each other.

[JSX와 React는 서로 다른 개념](/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)입니다. 서로 독립적이게 사용이 _가능합니다._

</Note>

## Converting HTML to JSX {/*converting-html-to-jsx*/}

## HTML을 JSX로 변환하기 {/*converting-html-to-jsx*/}

Suppose that you have some (perfectly valid) HTML:

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

And you want to put it into your component:

이제 이것을 컴포넌트로 만들어볼 겁니다.

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

If you copy and paste it as is, it will not work:

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

This is because JSX is stricter and has a few more rules than HTML! If you read the error messages above, they'll guide you to fix the markup, or you can follow the guide below.

왜냐하면 JSX는 더 엄격하고 HTML보다 몇 가지 규칙이 더 있기 때문입니다! 위의 오류 메시지를 읽으면 마크업을 수정하도록 안내하고 있습니다. 또는 아래의 가이드를 따를 수 있습니다.

<Note>

Most of the times, React's on-screen error messages will help you find where the problem is. Give them a read if you get stuck!

대부분의 경우 React의 화면 오류 메시지는 문제가 있는 곳을 찾는 데 도움이 됩니다. 막히면 읽어주세요!

</Note>

## The Rules of JSX {/*the-rules-of-jsx*/}

## JSX의 규칙 {/*the-rules-of-jsx*/}

### 1. Return a single root element {/*1-return-a-single-root-element*/}

### 1. 하나의 루트 엘리먼트로 반환하기 {/*1-return-a-single-root-element*/}

To return multiple elements from a component, **wrap them with a single parent tag**.

For example, you can use a `<div>`:

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


If you don't want to add an extra `<div>` to your markup, you can write `<>` and `</>` instead:

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

This empty tag is called a *[React fragment](TODO)*. React fragments let you group things without leaving any trace in the browser HTML tree.

이 빈 태그를 *[React fragment](TODO)*라고 합니다. React fragments는 브라우저상의 HTML 트리 구조에서 흔적을 남기지 않고 그룹화해줍니다.

<DeepDive title="Why do multiple JSX tags need to be wrapped?">

<DeepDive title="왜 여러 JSX 태그를 하나로 감싸야 할까요?">

JSX looks like HTML, but under the hood it is transformed into plain JavaScript objects. You can't return two objects from a function without wrapping them into an array. This explains why you also can't return two JSX tags without wrapping them into another tag or a fragment.

JSX는 HTML처럼 보이지만 내부적으로는 일반 JavaScript 객체로 변환합니다. 하나의 배열로 감싸지 않은 하나의 함수에서는 두 개의 객체를 반환(리턴)할 수 없습니다. 따라서 또다른 태그나 fragment로 감싸지 않으면 두 개의 JSX 태그를 반환할 수 없습니다.

</DeepDive>

### 2. Close all the tags {/*2-close-all-the-tags*/}
### 2. 모든 태그는 닫아주기 {/*2-close-all-the-tags*/}

JSX requires tags to be explicitly closed: self-closing tags like `<img>` must become `<img />`, and wrapping tags like `<li>oranges` must be written as `<li>oranges</li>`.

This is how Hedy Lamarr's image and list items look closed:

JSX에서는 태그를 명시적으로 닫아야 합니다. `<img>`처럼 자동으로 닫아주는 태그는 반드시 `<img />` 형태로 작성해야하며, `<li>oranges`와 같은 래핑 태그도 `<li>oranges</li>` 형태로 작성해야 합니다.

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

### 3. camelCase <s>all</s> most of the things! {/*3-camelcase-salls-most-of-the-things*/}

### 3. <s>모두</s> 대부분 캐멀 케이스로! {/*3-camelcase-salls-most-of-the-things*/}

JSX turns into JavaScript and attributes written in JSX become keys of JavaScript objects. In your own components, you will often want to read those attributes into variables. But JavaScript has limitations on variable names. For example, their names can't contain dashes or be reserved words like `class`.

JSX는 JavaScript로 바뀌고 JSX에서 작성된 어트리뷰트는 JavaScript 객체의 키가 됩니다. 컴포넌트에서는 종종 어트리뷰트를 변수로 읽고 싶은 경우가 있습니다. 그러나 JavaScript는 변수명에 제한이 있습니다. 예를 들면, 변수명에 대시를 포함하거나 `class`처럼 예약어를 사용할 수 없습니다.

This is why, in React, many HTML and SVG attributes are written in camelCase. For example, instead of `stroke-width` you use `strokeWidth`. Since `class` is a reserved word, in React you write `className` instead, named after the [corresponding DOM property](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

이것이 바로 React에서 HTML과 SVG의 어트리뷰트 대부분이 캐멀 케이스로 작성되는 이유입니다. 예를 들면, `stroke-width` 대신 `strokeWidth`으로 사용합니다. `class`는 예약어이기 때문에, React에서는 [DOM의 프로퍼티에 대응한](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) 이름을 따서 `className`으로 대신 작성합니다.

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

You can [find all these attributes in the React DOM Elements](TODO). If you get one wrong, don't worry—React will print a message with a possible correction to the [browser console](https://developer.mozilla.org/docs/Tools/Browser_Console).

[React DOM 엘리먼트에서 이러한 어트리뷰트를 찾을](TODO) 수 있습니다. 하나가 틀려도 걱정하지 마세요. React는 [브라우저 콘솔](https://developer.mozilla.org/docs/Tools/Browser_Console)에서 수정할 수 있는 부분을 메시지로 알려줍니다.

<Gotcha>

For historical reasons, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) and [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) attributes are written as in HTML with dashes.

역사적인 이유로, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA)와 [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes)의 어트리뷰트는 HTML에서와 동일하게 대시를 사용하여 작성합니다.

</Gotcha>

### Pro-tip: Use a JSX Converter {/*pro-tip-use-a-jsx-converter*/}

### 추천-팁: JSX 변환기 사용하기 {/*pro-tip-use-a-jsx-converter*/}

Converting all these attributes in existing markup can be tedious! We recommend using a [converter](https://transform.tools/html-to-jsx) to translate your existing HTML and SVG to JSX. Converters are very useful in practice, but it's still worth understanding what is going on so that you can comfortably write JSX on your own.

Here is your final result:

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

Now you know why JSX exists and how to use it in components:

지금까지 JSX가 존재하는 이유와 컴포넌트에서 JSX를 쓰는 방법에 대해 알아보았습니다.

* React components group rendering logic together with markup because they are related.
* JSX is similar to HTML, with a few differences. You can use a [converter](https://transform.tools/html-to-jsx) if you need to.
* Error messages will often point you in the right direction to fixing your markup.

* React 컴포넌트는 서로 관련이 있는 마크업과 렌더링 로직을 함께 그룹화합니다.
* JSX는 HTML과 비슷하지만 몇 가지 차이점이 있습니다. 필요한 경우 [변환기](https://transform.tools/html-to-jsx)를 사용할 수 있습니다.
* 오류 메시지는 종종 마크업을 수정할 수 있도록 올바른 방향을 알려줍니다.

</Recap>



<Challenges>

### Convert some HTML to JSX {/*convert-some-html-to-jsx*/}
### 일부 HTML을 JSX로 변환해보기 {/*convert-some-html-to-jsx*/}

This HTML was pasted into a component, but it's not valid JSX. Fix it:

다음은 컴포넌트에 HTML을 붙여 넣었지만 올바른 JSX가 아닙니다. 수정해보세요.

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

Whether to do it by hand or using the converter is up to you!
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