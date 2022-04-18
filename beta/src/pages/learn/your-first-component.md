---
title: 첫 컴포넌트
---

<Intro>

컴포넌트는 React의 핵심 개념 중 하나입니다. 컴포넌트는 사용자 인터페이스(UI)를 구축하는 토대이기 때문에 컴포넌트에서부터 React로의 여정을 시작하는 것은 완벽한 선택입니다!

</Intro>

<YouWillLearn>

* 컴포넌트가 무엇인지
* React 애플리케이션에서 컴포넌트의 역할
* 첫 React 컴포넌트를 작성하는 방법

</YouWillLearn>

## 컴포넌트: UI를 구성하는 요소  {/*components-ui-building-blocks*/}

웹에서 HTML은 `<h1>`나 `<li>`와 같은 내장된 태그들을 이용하여 아래와 같이 잘 구조화된 문서를 만들 수 있게 해줍니다. 

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

위의 HTML 문서에서 `<article>` 태그는 이 포스트를, `<h1>` 태그는 제목을, `<ol>` 태그는 (간략한) 목차로서 순서가 있는 리스트를 나타냅니다. 사이드바, 아바타, 모달, 드롭다운 등 웹 상에서 볼 수 있는 모든 UI 뒤에는 위와 같은 마크업이 스타일링을 위한 CSS, 상호작용을 위한 JavaScript와 함께 존재합니다.

React는 마크업, CSS, JavaScript를 합쳐 **재사용 가능한 UI 요소**인 컴포넌트로 만들어줍니다. 위 코드에서의 목차는 어떤 페이지에서도 렌더링이 가능한 `<TableOfContents />` 컴포넌트로 작성될 수 있습니다. 속을 들여다보면 이 컴포넌트는 `<article>`, `<h1>` 등의 HTML 태그를 그대로 사용합니다.

HTML 태그와 마찬가지로 전체 페이지를 디자인하기 위하여 여러 컴포넌트를 구성하고 순서를 지정하거나 중첩하는 것이 가능합니다. React 컴포넌트로 작성된 아래 문서 페이지를 참고하세요.

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

프로젝트가 커질수록, 이미 작성된 컴포넌트를 재사용하면 빠른 속도로 원하는 디자인을 구성할 수 있다는 것을 발견할 것입니다. 위에서 작성한 목차 코드는 `<TableOfContents />`의 형태로 어느 화면에든 추가될 수 있습니다! 심지어는 [Chakra UI](https://chakra-ui.com/) 또는 [Material UI](https://material-ui.com/)와 같은 React 오픈 소스 커뮤니티에 공유된 수많은 컴포넌트를 사용하여 프로젝트에 바로 뛰어들 수도 있습니다.

## 컴포넌트 정의하기 {/*defining-a-component*/}

전통적으로 웹 페이지를 만들 때 웹 개발자들은 콘텐츠를 먼저 마크업으로 작성한 다음 Javascript 코드를 얹어 상호작용을 추가하였습니다. 상호작용이 웹에서 꼭 필요하진 않지만 있으면 좋은 것이던 시절에는 이러한 방식이 잘 작동했습니다. 그러나 이제는 많은 사이트와 모든 애플리케이션에 상호작용이 필요합니다. React는 이전과 동일한 기술을 사용하면서도 상호작용을 우선시합니다. **즉, React 컴포넌트는 _마크업을 뿌릴 수 있는_ Javascript 함수입니다.** 아래 예시를 살펴보세요. (마음껏 편집해도 좋습니다)

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

컴포넌트를 작성하는 방법은 다음과 같습니다.

### 1단계: 컴포넌트 내보내기 {/*step-1-export-the-component*/}

`export default`문은 React에 한정되지 않는 [표준 JavaScript 문법](https://developer.mozilla.org/docs/web/javascript/reference/statements/export)입니다. 이를 사용하면 현재 파일에서 내보낸 메인 함수를 나중에 다른 파일에서 불러와 사용할 수 있습니다. (자세한 내용은 [컴포넌트 import 및 export 하기](/learn/importing-and-exporting-components)를 참고하세요!)

### 2단계: 함수 정의하기 {/*step-2-define-the-function*/}

`function Profile() { }`문은 `Profile`이라는 이름의 JavaScript 함수를 정의합니다.

<Gotcha>

React 컴포넌트는 일반적인 JavaScript 함수이지만, 제대로 작동하기 위해서는 **함수 이름이 대문자로 시작해야만 합니다**!

</Gotcha>

### 3단계: 마크업 추가하기 {/*step-3-add-markup*/}

위에서 작성한 컴포넌트는 `src` 와 `alt` 속성을 갖는 `<img />` 태그를 반환합니다. `<img />`는 HTML과 같은 방식으로 작성되었지만 속을 들여다보면 사실은 JavaScript 코드입니다! 이처럼 마크업을 JavaScript 내부로 포함하는 문법을 [JSX](/learn/writing-markup-with-jsx) 라고 합니다.

아래 컴포넌트와 같이 return 문을 한 줄로 작성할 수도 있습니다.

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

<<<<<<< HEAD
그러나 반환하려는 마크업이 return 문과 모두 같은 줄에 있지 않다면 다음과 같이 괄호로 묶어야 합니다.
=======
But if your markup isn't all on the same line as the `return` keyword, you must wrap it in a pair of parentheses like this:
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Gotcha>

괄호로 묶어 주지 않으면 `return` 다음 줄의 코드는 [모두 무시될 것입니다](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Gotcha>

## 컴포넌트 사용하기 {/*using-a-component*/}

이제 `Profile` 컴포넌트를 정의하였으니, 다른 컴포넌트의 내부에서 이 컴포넌트를 중첩하여 사용할 수 있습니다. 예를 들어 다음과 같이 여러 개의 `Profile` 컴포넌트를 사용하는 `Gallery` 컴포넌트를 작성하여 내보낼 수 있습니다.

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### 브라우저에 표시되는 내용 {/*what-the-browser-sees*/}

다음과 같은 대소문자 차이에 주목하세요.

* `<section>` 은 소문자로 작성되었기 때문에 HTML 태그를 의미한다는 것을 React가 알 수 있습니다.
* `<Profile />` 은 대문자 `P`로 시작하기 때문에 `Profile`이라는 컴포넌트를 의미한다는 것을 React가 알 수 있습니다.

또한 `Profile` 컴포넌트 내부에 `<img />` 태그와 같은 HTML이 더 존재합니다. 결과적으로 브라우저에는 다음과 같은 내용이 표시됩니다.

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### 컴포넌트 중첩 및 구성 {/*nesting-and-organizing-components*/}

컴포넌트는 일반적인 JavaScript 함수이므로, 여러 컴포넌트를 하나의 동일한 파일에 작성할 수 있습니다. 이러한 방식은 컴포넌트들이 상대적으로 작거나 서로 밀접하게 연관되어 있을 때 편리합니다. 이 파일이 복잡해지면 언제든지 `Profile` 컴포넌트를 별도의 파일로 옮겨 작성할 수 있습니다. 이 방법은 곧 [import에 대한 페이지](/learn/importing-and-exporting-components)에서 배울 것입니다.

`Profile` 컴포넌트가 `Gallery` 컴포넌트의 내부에 (심지어 여러 번) 렌더링 되기 때문에, `Gallery` 컴포넌트는 **부모 컴포넌트**이며 `Profile` 컴포넌트는 "자녀 컴포넌트"라고 할 수 있습니다. 이것은 React 마법의 일부입니다. 컴포넌트를 한 번 정의하고 나면, 원하는 곳에서 몇 번이고 다시 사용할 수 있습니다.

<DeepDive title="컴포넌트로 처음부터 끝까지">

React 애플리케이션은 루트 컴포넌트에서 시작됩니다. 일반적으로 루트 컴포넌트는 새 프로젝트를 시작할 때 자동으로 생성됩니다. 예를 들어, [CodeSandbox](https://codesandbox.io/) 또는 [Create React App](https://create-react-app.dev/)을 사용하는 경우 `src/App.js`에 루트 컴포넌트가 정의됩니다. [Next.js](https://nextjs.org/) 프레임워크를 사용하는 경우, 루트 컴포넌트가 `pages/index.js`에 정의됩니다. 정의된 루트 컴포넌트는 자동으로 내보내집니다.

대부분의 React 애플리케이션은 모든 것에 컴포넌트를 사용합니다. 즉, 버튼과 같이 재사용 가능한 작은 컴포넌트뿐만 아니라 사이드바, 목록, 그리고 궁극적으로는 전체 페이지에 이르기까지 더 큰 컴포넌트들을 사용할 수 있습니다. 컴포넌트는 꼭 재사용되지 않더라도 UI와 마크업을 구성하는 편리한 방법입니다.

Next.js와 같은 프레임워크는 이러한 과정을 한 단계 더 발전시킵니다. 빈 HTML을 사용하여 React가 JavaScript로 페이지를 관리하는 역할을 떠맡는 대신, 프레임워크는 React 컴포넌트로부터 자동으로 HTML*까지* 생성합니다. 이렇게 하면 애플리케이션은 JavaScript 코드가 로딩되기 전에 일부 콘텐츠를 먼저 표시할 수 있습니다.

여전히 많은 웹사이트는 [약간의 상호작용을 추가](/learn/add-react-to-a-website)하기 위한 목적으로만 React를 사용하고 있습니다. 이러한 사이트들은 전체 페이지에 대해 한 개가 아닌 여러 개의 루트 컴포넌트를 갖습니다. 사용자들은 React를 많거나 적게 딱 필요한 만큼만 사용할 수 있습니다.

</DeepDive>

<Recap>

지금까지 React를 처음으로 맛보았습니다! 몇 가지 핵심 사항을 요약해봅시다.

* React를 사용하여 **애플리케이션에 재사용 가능한 UI 엘리먼트**인 컴포넌트를 생성할 수 있습니다.
* React 애플리케이션에서 모든 UI 조각은 컴포넌트입니다.
* React 컴포넌트는 다음과 같은 특징을 제외하면 일반적인 JavaScript 함수와 같습니다.

  1. 컴포넌트의 이름은 대문자로 시작해야 합니다.
  2. 컴포넌트는 JSX 마크업을 반환합니다.

</Recap>



<Challenges>

### 컴포넌트 내보내기 {/*export-the-component*/}

아래 예제는 루트 컴포넌트를 내보내지 않았기 때문에 제대로 작동하지 않습니다.

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

아래 해결책을 보기 전에 위 예제를 스스로 고쳐보도록 시도해보세요!

<Solution>

다음과 같이 함수 정의 앞에 `export default`문을 추가합니다.

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

`export` 문만 추가해서는 문제가 해결되지 않는 이유가 궁금할 수 있습니다. `export` 문과 `export default` 문의 차이점에 대해서는 [컴포넌트 import 및 export 하기](/learn/importing-and-exporting-components)에서 확인할 수  있습니다.

</Solution>

### return 문 수정하기 {/*fix-the-return-statement*/}

아래 `return` 문에 잘못된 점이 있습니다. 잘못된 점을 찾아 고쳐보세요.

<Hint>

수정하는 과정에서 "Unexpected token" 에러를 마주할 수 있습니다. 그런 경우, 세미콜론이 닫는 괄호 *뒤에* 위치하는지 확인해보세요. 세미콜론이 `return ( )` 문 안에 위치한다면 에러가 발생할 수 있습니다.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

아래와 같이 return 문을 한 줄로 만들어 해결할 수 있습니다.

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

또는 `return` 바로 뒤에 괄호를 열어 반환할 JSX 마크업을 감싸서 해결할 수도 있습니다.

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

### 잘못된 점 찾아내기 {/*spot-the-mistake*/}

아래 `Profile` 컴포넌트를 정의하고 사용하는 방식에 잘못된 점이 있습니다. 어떤 점이 잘못되었는지 찾을 수 있나요? (React가 컴포넌트와 일반적인 HTML 태그를 어떻게 구별하는지 되새겨보세요!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React 컴포넌트의 이름은 반드시 대문자로 시작해야 합니다.

`function profile()`을 `function Profile()`로 수정하고, `<profile />`을 모두 `<Profile />`로 수정해보세요.

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

### 나만의 컴포넌트 {/*your-own-component*/}

컴포넌트를 처음부터 작성해보세요. 유효한 범위 내에서 자유롭게 이름을 붙이고 마크업을 반환하도록 작성해보세요. 어떤 컴포넌트를 작성할지 생각나지 않는다면, `<h1>Good job!</h1>` 을 보여주는 `Congratulations` 컴포넌트를 작성해도 좋습니다. 컴포넌트를 내보내는 것을 잊지 마세요!

<Sandpack>

```js
// 아래에 나만의 컴포넌트를 작성해보세요!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>