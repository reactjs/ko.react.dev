---
title: 첫 번째 컴포넌트
---

<Intro>

*컴포넌트*는 React의 핵심 개념 중 하나입니다. 컴포넌트는 사용자 인터페이스(UI)를 구축하는 기반이 되므로 React 여정을 시작하기에 완벽한 곳입니다!

</Intro>

<YouWillLearn>

* 컴포넌트가 무엇일까
* React 애플리케이션에서 컴포넌트의 역할
* 첫 번째 React 컴포넌트를 작성하는 방법

</YouWillLearn>

## 컴포넌트: UI 구성 요소 {/*components-ui-building-blocks*/}

웹에서는 HTML을 통해 `<h1>`, `<li>`와 같은 태그를 사용하여 풍부한 구조의 문서를 만들 수 있습니다.

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

이 마크업은 `<article>`, 제목 `<h1>`, (축약된) 목차를 정렬된 목록 `<ol>`로 나타냅니다. 이와 같은 마크업은 스타일을 위한 CSS, 상호작용을 위한 JavaScript와 결합하여 웹에서 볼 수 있는 모든 사이드바, 아바타, 모달, 드롭다운 등 모든 UI의 기반이 됩니다.

React를 사용하면 마크업, CSS, JavaScript를 **앱의 재사용 가능한 UI 요소인** 사용자 정의 "컴포넌트"로 결합할 수 있습니다. 위에서 본 목차 코드는 모든 페이지에 렌더링할 수 있는 `<TableOfContents />` 컴포넌트로 전환될 수 있습니다. 내부적으로는 여전히 `<article>`, `<h1>` 등과 같은 동일한 HTML태그를 사용합니다.

HTML 태그와 마찬가지로 컴포넌트를 작성, 순서 지정 및 중첩하여 전체 페이지를 디자인할 수 있습니다. 예를 들어, 여러분이 읽고 있는 문서 페이지는 React 컴포넌트로 구성되어 있습니다.

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

프로젝트가 성장함에 따라 이미 작성한 컴포넌트를 재사용하여 많은 디자인을 구성할 수 있으므로 개발 속도가 빨라집니다. 위의 목차는 `<TableOfContents />`를 사용하여 어떤 화면에도 추가할 수 있습니다! [Chakra UI](https://chakra-ui.com/), [Material UI.](https://material-ui.com/)와 같은 React 오픈 소스 커뮤니티에서 공유되는 수천 개의 컴포넌트로 프로젝트를 빠르게 시작할 수도 있습니다.

## 컴포넌트 정의하기 {/*defining-a-component*/}

기존에는 웹 페이지를 만들 때 웹 개발자가 컨텐츠를 마크업한 다음 JavaScript를 뿌려 상호작용을 추가했습니다. 이는 웹에서 상호작용이 중요했던 시절에 효과적이였습니다. 이제는 많은 사이트와 모든 앱에서 상호작용을 기대합니다. React는 동일한 기술을 사용하면서도 상호작용을 우선시합니다. **React 컴포넌트는 *마크업으로 뿌릴 수 있는 JavaScript* 함수입니다.** 그 모습은 다음과 같습니다.(아래 예시는 편집할 수 있습니다.)

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

컴포넌트를 빌드하는 방법은 다음과 같습니다.

### 1단계: 컴포넌트 내보내기 {/*step-1-export-the-component*/}

`export default` 접두사는 [표준 JavaScript 구문](https://developer.mozilla.org/docs/web/javascript/reference/statements/export)입니다(React에만 해당되지 않습니다). 이 접두사를 사용하면 나중에 다른 파일에서 가져올 수 있도록 파일에 주요 기능을 표시할 수 있습니다. (더 자세한 내용은 [컴포넌트 Importing 및 Exporting](/learn/importing-and-exporting-components)을 참고하세요!)

### 2단계: 함수 정의하기 {/*step-2-define-the-function*/}

`function Profile() { }`을 사용하면 `Profile`이라는 이름의 JavaScript함수를 정의할 수 있습니다.

<Pitfall>

React 컴포넌트는 일반 JavaScript 함수이지만, **이름은 대문자로 시작해야 하며** 그렇지 않으면 작동하지 않습니다!

</Pitfall>

### 3단계: 마크업 추가하기 {/*step-3-add-markup*/}

이 컴포넌트는 `src` 및 `alt` 속성을 가진 `<img />` 태그를 반환합니다. `<img />`는 HTML처럼 작성되었지만 실제로는 JavaScript입니다! 이 구문을 [JSX](/learn/writing-markup-with-jsx)라고 하며, JavaScript 안에 마크업을 삽입할 수 있습니다.

반환문은 이 컴포넌트에서처럼 한 줄에 모두 작성할 수 있습니다.

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

그러나 마크업이 모두 `return` 키워드와 같은 라인에 있지 않은 경우에는 다음과 같이 괄호로 묶어야 합니다.

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

괄호가 없으면 `return` 뒷 라인에 있는 모든 코드가 [무시됩니다](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## 컴포넌트 사용하기 {/*using-a-component*/}

이제 `Profile` 컴포넌트를 정의했으므로 다른 컴포넌트 안에 중첩할 수 있습니다. 예를 들어 여러 `Profile` 컴포넌트를 사용하는 `Gallery` 컴포넌트를 내보낼 수 있습니다.

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

대소문자의 차이에 주목하세요.

* `<section>`은 소문자이므로 React는 HTML태그를 가리킨다고 이해합니다.
* `<Profile />`은 대문자 `p`로 시작하므로 React는 `Profile`이라는 컴포넌트를 사용하고자 한다고 이해합니다.

그리고 `Profile`은 더 많은 `<img />`가 포함되어 있습니다. 결국 브라우저에 표시되는 내용은 다음과 같습니다.

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### 컴포넌트 중첩 및 구성 {/*nesting-and-organizing-components*/}

Components are regular JavaScript functions, so you can keep multiple components in the same file. This is convenient when components are relatively small or tightly related to each other. If this file gets crowded, you can always move `Profile` to a separate file. You will learn how to do this shortly on the [page about imports.](/learn/importing-and-exporting-components)

컴포넌트는 일반 JavaScript함수이므로 같은 파일에 여러 컴포넌트를 포함할 수 있습니다. 컴포넌트가 상대적으로 작거나 서로 밀접하게 관련되어 있을 때 편리합니다. 이 파일이 복잡해지면 언제든지 `Profile`을 별도의 파일로 옮길 수 있습니다. 이 방법은 바로 다음 챕터인 [컴포넌트의 importing과 exporting](/learn/importing-and-exporting-components) 페이지에서 확인할 수 있습니다.

`Profile` 컴포넌트는 `Gallery`안에서 렌더링되기 때문에(심지어 여러번 렌더링됩니다!), `Gallery`는 각 `Profile`을 "자식"으로 렌더링하는 **부모 컴포넌트**라고 말할 수 있습니다. 컴포넌트를 한 번 정의한 다음 원하는 곳에서 원하는 만큼 여러 번 사용할 수 있다는 점이 바로 React의 마법입니다.

<Pitfall>

컴포넌트는 다른 컴포넌트를 렌더링할 수 있지만, **그 정의를 중첩해서는 안 됩니다.** 

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

The snippet above is [very slow and causes bugs.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Instead, define every component at the top level:

위 스니펫은 [매우 느리고 버그를 촉발합니다.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) 대신 최상위 레벨에서 컴포넌트를 정의하세요.

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

자식 컴포넌트에 부모 컴포넌트의 일부 데이터가 필요한 경우, 정의를 중첩하는 대신 [props로 전달](/learn/passing-props-to-a-component)하세요.

</Pitfall>

<DeepDive>

#### 컴포넌트의 모든 것 {/*components-all-the-way-down*/}

<<<<<<< HEAD
React 애플리케이션은 "root"컴포넌트에서 시작됩니다. 보통 새 프로젝트를 시작할 때 자동으로 생성됩니다. 예를 들어, [CodeSandbox](https://codesandbox.io/) 또는 [Create React App](https://create-react-app.dev/)를 사용하는 경우, root 컴포넌트에서 `src/App.js`에 정의됩니다. [Next.js](https://nextjs.org/)프레임워크를 사용하는 경우, root 컴포넌트는 `pages/index.js`에 정의됩니다. 이 예제에서는 root 컴포넌트를 내보내고 있습니다.
=======
Your React application begins at a "root" component. Usually, it is created automatically when you start a new project. For example, if you use [CodeSandbox](https://codesandbox.io/) or if you use the framework [Next.js](https://nextjs.org/), the root component is defined in `pages/index.js`. In these examples, you've been exporting root components.
>>>>>>> 842c24c9aefaa60b7ae9b46b002bd1b3cf4d31f3

대부분의 React 앱은 모든 부분에서 컴포넌트를 사용합니다. 즉, 버튼과 같이 재사용 가능한 부분뿐만 아니라 사이드바, 목록, 그리고 궁극적으로 전체 페이지와 같은 큰 부분에도 컴포넌트를 사용하게 됩니다! 컴포넌트는 한 번만 사용되더라도 UI 코드와 마크업을 정리하는 편리한 방법입니다.

[React 기반 프레임워크들](/learn/start-a-new-react-project)은 이를 한 단계 더 발전시킵니다. 빈 HTML파일을 사용하고 React가 JavaScript로 페이지 관리를 "다룰 수 있게" 하도록 하는 대신, React 컴포넌트에서 HTML을 자동으로 생성하기도합니다. 이를 통해 JavaScript 코드가 로드되기 전에 앱에서 일부 컨텐츠를 표시할 수 있습니다.

Still, many websites only use React to [add interactivity to existing HTML pages.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) They have many root components instead of a single one for the entire page. You can use as much—or as little—React as you need.

그렇지만 여전히 많은 웹사이트들은 React를 [약간의 상호작용을 추가하는 용도로만](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) 사용합니다. 이러한 웹사이트에는 전체 페이지에 하나의 root 컴포넌트가 아닌 여러 개의 root 컴포넌트가 있습니다. 필요한 만큼 React를 많이 또는 적게 사용할 수 있습니다.

</DeepDive>

<Recap>

이제 막 React를 처음 사용해 보았습니다! 몇 가지 핵심 사항을 요약해 보겠습니다.

* React를 사용하면 앱의 **재사용 가능한 UI 요소**인 컴포넌트를 만들 수 있습니다.
* React 앱에서 모든 UI는 컴포넌트입니다.
* React 컴포넌트는 다음 몇 가지를 제외하고는 일반적인 JavaScript 함수입니다.

  1. 컴포넌트의 이름은 항상 대문자로 시작합니다.
  2. JSX 마크업을 반환합니다.

</Recap>



<Challenges>

#### 컴포넌트 내보내기 {/*export-the-component*/}

root 컴포넌트를 내보내지 않았기 때문에 이 샌드박스는 작동하지 않습니다.

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

정답을 확인하기 전에 직접 해결해 보세요

<Solution>

함수 정의 앞에 `export default`를 추가하세요.

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

이 예제에서 왜 'export'만으로 해결되지 않는지 궁금할 것입니다. [컴포넌트의 importing과 exporting](/learn/importing-and-exporting-components)에서 'export'와 'export default'의 차이점을 배울 수 있습니다.

</Solution>

#### return문을 고치세요 {/*fix-the-return-statement*/}

이 `return`문에는 문제가 있습니다. 고칠 수 있나요?

<Hint>

이 문제를 해결하려고 시도하는 동안 “예기치 않은 토큰” 오류가 발생할 수 있습니다. 이 경우 세미콜론이 닫는 괄호 *뒤에* 나타나는지 확인하세요. `return ( )` 안에 세미콜론을 남겨두면 오류가 발생합니다

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

다음과 같이 return문을 한 줄로 이동하여 이 컴포넌트를 수정할 수 있습니다.

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

또는 반환된 JSX 마크업을 괄호 안에 감싸서 `return` 바로 뒤에 열 수 있습니다.

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

#### 실수를 찾아내세요 {/*spot-the-mistake*/}

`Profile` 컴포넌트가 선언되고 사용되는 방식에 문제가 있습니다. 실수를 발견할 수 있을까요? (React가 컴포넌트를 일반 HTML 태그와 어떻게 구분하는지 기억해 보세요!)

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

React 컴포넌트 이름은 대문자로 시작해야 합니다.

`function profile()`을 `function Profile()`로 변경한 다음 모든 `<profile />`을 `<Profile />`로 변경합니다.

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

#### 컴포넌트를 새로 작성해 보세요. {/*your-own-component*/}

컴포넌트를 처음부터 작성해 보세요. 유효한 이름을 지정하고 마크업을 반환할 수 있습니다. 아이디어가 떠오르지 않는다면 `<h1>Good job!</h1>` 라고 표시하는 `Congratulations` 컴포넌트를 작성할 수 있습니다. export를 잊지 마세요!

<Sandpack>

```js
// Write your component below!

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
