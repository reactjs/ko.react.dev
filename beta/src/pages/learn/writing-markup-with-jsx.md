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

Suppose that you have some (perfectly valid) HTML:

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

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

If you copy and paste it as is, it will not work:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
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

<Note>

Most of the times, React's on-screen error messages will help you find where the problem is. Give them a read if you get stuck!

</Note>

## The Rules of JSX {/*the-rules-of-jsx*/}

### 1. Return a single root element {/*1-return-a-single-root-element*/}

To return multiple elements from a component, **wrap them with a single parent tag**.

For example, you can use a `<div>`:

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

<DeepDive title="Why do multiple JSX tags need to be wrapped?">

JSX looks like HTML, but under the hood it is transformed into plain JavaScript objects. You can't return two objects from a function without wrapping them into an array. This explains why you also can't return two JSX tags without wrapping them into another tag or a fragment.

</DeepDive>

### 2. Close all the tags {/*2-close-all-the-tags*/}

JSX requires tags to be explicitly closed: self-closing tags like `<img>` must become `<img />`, and wrapping tags like `<li>oranges` must be written as `<li>oranges</li>`.

This is how Hedy Lamarr's image and list items look closed:

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

JSX turns into JavaScript and attributes written in JSX become keys of JavaScript objects. In your own components, you will often want to read those attributes into variables. But JavaScript has limitations on variable names. For example, their names can't contain dashes or be reserved words like `class`.

This is why, in React, many HTML and SVG attributes are written in camelCase. For example, instead of `stroke-width` you use `strokeWidth`. Since `class` is a reserved word, in React you write `className` instead, named after the [corresponding DOM property](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

You can [find all these attributes in the React DOM Elements](TODO). If you get one wrong, don't worry—React will print a message with a possible correction to the [browser console](https://developer.mozilla.org/docs/Tools/Browser_Console).

<Gotcha>

For historical reasons, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) and [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) attributes are written as in HTML with dashes.

</Gotcha>

### Pro-tip: Use a JSX Converter {/*pro-tip-use-a-jsx-converter*/}

Converting all these attributes in existing markup can be tedious! We recommend using a [converter](https://transform.tools/html-to-jsx) to translate your existing HTML and SVG to JSX. Converters are very useful in practice, but it's still worth understanding what is going on so that you can comfortably write JSX on your own.

Here is your final result:

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

* React components group rendering logic together with markup because they are related.
* JSX is similar to HTML, with a few differences. You can use a [converter](https://transform.tools/html-to-jsx) if you need to.
* Error messages will often point you in the right direction to fixing your markup.

</Recap>



<Challenges>

### Convert some HTML to JSX {/*convert-some-html-to-jsx*/}

This HTML was pasted into a component, but it's not valid JSX. Fix it:

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