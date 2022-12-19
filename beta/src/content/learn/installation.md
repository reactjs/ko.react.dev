---
title: 설치
---

<Intro>

React는 처음부터 점진적으로 적용할 수 있도록 설계되었고, React를 필요한 만큼 적게 혹은 많이 사용할 수 있습니다. React를 맛보기로 사용해 보고 싶다거나 HTML 페이지에 대화형 기능(interactivity)을 추가하고 싶다거나 복잡한 React 기반 앱을 시작하고 싶다면 이 섹션이 시작하는 데에 도움을 줄 것입니다.

</Intro>

<YouWillLearn isChapter={true}>

* [HTML 페이지에 React 추가하기](/learn/add-react-to-a-website)
* [독립형 React 프로젝트 시작하기](/learn/start-a-new-react-project)
* [편집기 설정하기](/learn/editor-setup)
* [React 개발자 도구 설치하기](/learn/react-developer-tools)

</YouWillLearn>

## React 사용해보기 {/*try-react*/}

React를 사용하기 위해서 따로 설치할 것은 없습니다. sandbox를 사용해 보세요.

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

You can edit it directly or open it in a new tab by pressing the "Fork" button in the upper right corner.

Most pages in the React documentation contain sandboxes like this. Outside of the React documentation, there are many online sandboxes that support React: for example, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), or [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### 로컬에서 React 시도하기 {/*try-react-locally*/}

<<<<<<< HEAD:beta/src/pages/learn/installation.md
로컬에서 React를 사용해 보려면 [이 HTML 페이지를 다운로드하세요](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html). 여러분의 편집기와 브라우저에서 이것을 여세요.
=======
To try React locally on your computer, [download this HTML page.](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) Open it in your editor and in your browser!
>>>>>>> 868d525a74b717a10e0f61bb576213e133aa8d07:beta/src/content/learn/installation.md

## 페이지에 React 추가하기 {/*add-react-to-a-page*/}

기존 사이트에서 작업 중이고 단지 약간의 React만 추가하는 것이라면 [스크립트 태그로 React를 추가할 수 있습니다.](/learn/add-react-to-a-website)]

## React 프로젝트 시작하기 {/*start-a-react-project*/}

여러분이 React로 [독립형 프로젝트를 시작](/learn/start-a-new-react-project)할 준비가 되었다면 쾌적한 개발자 경험을 위한 최소의 툴체인을 설정할 수 있습니다. 또한, 즉시 많은 결정을 해야 하는 프레임워크로 시작할 수도 있습니다.

## 다음 단계 {/*next-steps*/}

매일 접하게 될 가장 중요한 React 개념을 둘러보려면 [빠른 시작](/learn) 가이드로 이동해주세요.
