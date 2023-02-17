---
id: accessibility
title: 접근성
permalink: docs/accessibility.html
---

## 접근성이 필요한 이유 {#why-accessibility}

웹 접근성(별칭: [**a11y**](https://en.wiktionary.org/wiki/a11y))은 모두가 사용할 수 있도록 웹사이트를 디자인, 개발하는 것을 의미합니다. 보조과학기술(assistive technology)들이 웹페이지들을 해석할 수 있도록 접근성을 갖추는 것이 필요합니다.

React는 접근성을 갖춘 웹사이트를 만들 수 있도록 모든 지원을 하고 있으며, 대부분은 표준 HTML 기술이 사용됩니다.

## 표준 및 지침 {#standards-and-guidelines}

### WCAG {#wcag}

[Web Content Accessibility Guidelines](https://www.w3.org/WAI/intro/wcag)는 접근성을 갖춘 웹사이트를 만드는 데 필요한 지침을 제공합니다.

아래 WCAG 체크리스트를 통해 간략하게 살펴볼 수 있습니다.

- [Wuhcag의 WCAG 체크리스트](https://www.wuhcag.com/wcag-checklist/)
- [WebAIM의 WCAG 체크리스트](https://webaim.org/standards/wcag/checklist)
- [The A11Y Project의 체크리스트](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

[Web Accessibility Initiative - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) 문서에는 접근성을 갖춘 JavaScript 위젯을 만드는 데 필요한 기술들이 담겨있습니다.

참고로, JSX에서는 모든 `aria-*` HTML 어트리뷰트를 지원하고 있습니다. React에서 대부분의 DOM 프로퍼티와 어트리뷰트에 대한 값이 캐멀 케이스로 지원되는 반면, `aria-*`와 같은 어트리뷰트는 일반적인 HTML과 마찬가지로 hypen-case(혹은 kebab-case, lisp-case 등)로 작성해야 합니다.

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## 시맨틱 HTML {#semantic-html}
시맨틱 HTML은 웹 애플리케이션에 있어 접근성의 기초입니다. 정보의 의미가 강조되는 HTML 엘리먼트를 웹 사이트에서 사용하면 자연스럽게 접근성이 갖추어지곤 합니다.

- [MDN HTML 엘리먼트 참고](https://developer.mozilla.org/ko/docs/Web/HTML/Element)

가끔 React로 구성한 코드가 돌아가게 만들기 위해 `<div>`와 같은 엘리먼트를 사용해 HTML의 의미를 깨트리곤 합니다. 특히, 목록(`<ol>`, `<ul>`, `<dl>`)과 HTML `<table>`을 사용할 때 문제가 두드러집니다. 이 경우에는, [React Fragment](/docs/fragments.html)를 사용하여 여러 엘리먼트를 하나로 묶어주는 것을 권장합니다.

예시는 아래와 같습니다.

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

다른 엘리먼트와 마찬가지로, Fragment는 배열의 각 항목을 매핑할 때에도 사용할 수 있습니다.

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // 항목을 매핑할 때 Fragment는 반드시 `key` 프로퍼티가 있어야 합니다.
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Fragment 태그에 어떤 props도 필요하지 않고, 사용하고 있는 도구에서 지원한다면, 아래와 같이 [짧게 줄여 쓸 수](/docs/fragments.html#short-syntax) 있습니다.

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

더 자세한 내용은 [Fragment](/docs/fragments.html) 문서를 참고해주시기 바랍니다.

## 접근성 있는 폼 {#accessible-forms}

### 라벨링 {#labeling}
`<input>`과 `<textarea>` 같은 모든 HTML 폼 컨트롤은 구분할 수 있는 라벨이 필요합니다. 스크린 리더를 사용하는 사용자를 위해 자세한 설명이 담긴 라벨을 제공해야 합니다.

다음은 라벨을 제공하는 방법에 관한 자료입니다.

- [W3C에서 제공하는 엘리먼트 라벨링 방법](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM에서 제공하는 엘리먼트 라벨링 방법](https://webaim.org/techniques/forms/controls)
- [The Paciello Group이 설명한 접근 가능한 이름들](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

이와 같은 표준 HTML에 대한 예시들이 React에 바로 사용될 수 있으나, `for` 어트리뷰트 만은 JSX에서 `htmlFor`로 사용하는 것에 주의하시기 바랍니다.

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### 사용자들에게 오류 안내하기 {#notifying-the-user-of-errors}

오류 상황은 모든 사용자가 알 수 있어야 합니다. 아래 링크는 스크린 리더에 오류 문구를 노출하는 방법을 설명합니다.

- [The W3C demonstrates user notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM looks at form validation](https://webaim.org/techniques/formvalidation/)

## 포커스 컨트롤 {#focus-control}

모든 웹 애플리케이션은 키보드만 사용하여 모든 동작을 할 수 있어야 합니다.

- [WebAIM이 말하는 키보드 접근성](https://webaim.org/techniques/keyboard/)

### 키보드 포커스와 포커스 윤곽선 {#keyboard-focus-and-focus-outline}

키보드 포커스는 키보드 입력을 받아들일 수 있는 DOM 내의 현재 엘리먼트를 나타냅니다. 아래 이미지와 비슷하게 포커스 윤곽선이 표시됩니다.

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

위와 같은 윤곽선을 다른 포커스 윤곽선으로 교체할 때만 `outline: 0`과 같은 윤곽선을 제거하는 CSS를 사용합니다.

### 원하는 콘텐츠로 건너뛸 수 있는 방법 {#mechanisms-to-skip-to-desired-content}

애플리케이션은 사용자들의 키보드 탐색을 돕고 탐색 속도를 높일 수 있도록, 이전에 탐색한 영역을 건너뛸 방법을 제공해야 합니다.

Skiplinks 또는 Skip Navigation Link들은 키보드 사용자가 페이지와 상호작용할 때만 표시되는 숨겨진 탐색 링크입니다. 내부의 페이지 앵커와 약간의 스타일링으로 매우 쉽게 구현할 수 있습니다.

- [WebAIM - Skip Navigation Links](https://webaim.org/techniques/skipnav/)

또한, 보조과학기술에 의해 사용자들이 이러한 섹션으로 빠르게 이동할 수 있도록,  `<main>`과 `<aside>` 같이 대표성을 띠는 랜드마크 엘리먼트와 역할들을 사용해 페이지 영역을 나누어야 합니다.

이러한 엘리먼트들을 사용해 접근성을 높이는 방법은 아래의 글을 참고해주시기 바랍니다.

- [접근 가능한 랜드마크(Accessible Landmarks)](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### 프로그래밍적으로 포커스 관리하기 {#programmatically-managing-focus}

React 애플리케이션들은 런타임 동안 지속해서 HTML DOM을 변경하기 때문에, 가끔 키보드 포커스를 잃거나 예상치 못한 엘리먼트에 포커스를 맞추곤 합니다. 이를 수정하기 위해, 프로그래밍적으로 키보드 포커스를 올바른 방향으로 변경해주어야 합니다. 예를 들어, 모달이 닫힌 후에는 모달을 열었던 버튼으로 키보드 포커스를 다시 맞춰주어야 합니다.

MDN Web Docs에서 [키보드로 탐색이 가능한 JavaScript 위젯](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)을 만드는 방법에 관해 설명한 글이 있습니다.

React에서 포커스를 지정하려면,  [DOM 엘리먼트에 ref를 사용](/docs/refs-and-the-dom.html)할 수 있습니다.

이를 사용해 JSX 컴포넌트 클래스 안에서 엘리먼트에 대한 ref를 먼저 생성합니다.

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // DOM 엘리먼트를 저장할 textInput이라는 ref을 생성합니다.
    this.textInput = React.createRef();
  }
  render() {
  // `ref` 콜백으로 텍스트 input DOM을 저장합니다.
  // 인스턴스 필드의 엘리먼트 (예를 들어, this.textInput)
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

그 후에, 컴포넌트 내에서 필요할 때마다 포커스를 지정할 수 있습니다.

 ```javascript
 focus() {
   // DOM API를 사용해 텍스트 input에 정확히 포커스를 맞춥니다.
   // 주의: ‘현재’의 DOM 노드에 접근하고 있습니다.
   this.textInput.current.focus();
 }
 ```

가끔씩 부모 컴포넌트가 자식 컴포넌트 내의 엘리먼트에 포커스를 잡아야 할 때가 있습니다. 이때는 자식 컴포넌트에 특별한 프로퍼티를 주어 [DOM ref를 부모 컴포넌트로 노출](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)하는 방식으로 부모의 ref를 자식의 DOM 노드에 넘겨줄 수 있습니다.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// 이제 필요할 때마다 포커스를 잡을 수 있습니다.
this.inputElement.current.focus();
```

고차 컴포넌트([Higher Order Component](/docs/higher-order-components.html))를 사용하여 컴포넌트를 확장할 때는 감싸진 컴포넌트에 React에서 제공하는 `forwardRef` 함수를 사용하여 [ref를 넘겨줄 수 있습니다](/docs/forwarding-refs.html). 서드 파티 고차 컴포넌트에서 ref를 넘겨줄 수 없다면, 위와 같은 패턴을 여전히 차선책으로 사용할 수 있습니다.

매우 좋은 포커스 관리 예시로 [react-aria-modal](https://github.com/davidtheclark/react-aria-modal)을 들 수 있습니다. 완전히 접근 가능한 모달 창에 대한 드문 예시입니다. 첫 포커스를 취소 버튼에 맞출 뿐 만 아니라(키보드 사용자가 실수로 확인 동작을 일으키지 않도록 막아줌), 키보드 포커스를 모달 안으로 한정해주며, 모달이 닫힐 때 모달을 열게 했던 엘리먼트에 포커스를 잡아줍니다.

>주의
>
>키보드 포커스는 매우 중요한 접근성 기능이지만, 동시에 매우 조심해서 사용해야 하는 기능이기도 합니다. 사용자가 애플리케이션을 어떻게 사용하길 원하는지 예측하지 말고 키보드 포커스 흐름이 흐트러졌을 때 이를 고치려는 방법으로 사용하기 바랍니다.

## 마우스와 포인터 이벤트 {#mouse-and-pointer-events}

마우스 혹은 포인터 이벤트로 노출된 모든 기능을 키보드만으로 사용할 수 있도록 보장해야 합니다. 포인터 장치만 고려할 경우, 키보드 사용자들이 애플리케이션을 사용하지 못하는 경우가 많습니다.

아래는 클릭 이벤트로 인해 접근성이 떨어지게 되는 예시입니다. 열린 팝오버의 바깥을 클릭해 팝오버를 닫을 수 있는 ‘외부 클릭 패턴(outside click pattern)’입니다.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

일반적으로 팝오버를 닫는 `click` 이벤트를 `window` 객체에 붙여 구현합니다.

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

이는 포인터 장치 사용자들에게는 괜찮으나, 키보드 사용자들에게는 기능적으로 문제가 생깁니다. 다음 엘리먼트로 탭을 이동할 때 `window` 객체가 `click` 이벤트를 받을 수 없기 때문입니다. 이로 인해, 기능이 가려져 사용자들이 애플리케이션을 제대로 사용할 수 없게 됩니다.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

`onBlur`와 `onFocus` 같은 적절한 이벤트 핸들러를 사용하여 같은 기능을 제공할 수 있습니다.

```javascript{19-29,31-34,37,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // setTimeout을 사용해 다음 순간에 팝오버를 닫습니다.
  // 엘리먼트의 다른 자식에 포커스가 맞춰져있는지 확인하기 위해 필요합니다.
  // 새로운 포커스 이벤트가 발생하기 전에
  // 블러(blur) 이벤트가 발생해야 하기 때문입니다.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // 자식이 포커스를 받으면, 팝오버를 닫지 않습니다.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React는 블러와 포커스 이벤트를 부모에 버블링해줍니다.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

이 코드는 포인터 장치 사용자와 키보드 사용자 모두에게 기능을 제공합니다. 동시에 스크린 리더 사용자들을 지원하기 위해 `aria-*` props를 추가했습니다. 단순함을 위해 `방향키`로 조작하는 기능은 구현하지 않았습니다.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

이것은 포인터와 마우스 이벤트에만 의존해 키보드 사용자의 사용성을 해치는 많은 예시 중 하나입니다. 항상 키보드로 테스트하면 바로 문제가 되는 영역을 확인하고, 키보드 핸들러를 추가하여 수정할 수 있습니다.

## 더욱 복잡한 위젯 {#more-complex-widgets}

복잡한 사용자 경험으로 접근성이 떨어져서는 안 됩니다. 접근성을 쉽게 지원하는 방법은 가능한 한 HTML에 맞게 코딩하는 것이며, 복잡한 위젯 역시 접근성있게 코딩할 수 있습니다.

여기서는 [ARIA 역할](https://www.w3.org/TR/wai-aria/#roles)과 [ARIA 상태 및 프로퍼티](https://www.w3.org/TR/wai-aria/#states_and_properties)에 대한 지식이 필요합니다. 이들은 JSX에서 모두 지원되는 HTML 어트리뷰트로 채워진 도구 상자로, 이를 통해 완전히 접근성 있고 기능이 우수한 React 컴포넌트를 구성할 수 있습니다.

각각의 위젯 타입은 명확한 디자인 패턴이 있으며, 사용자와 사용자 에이전트 모두 특정 방향으로 기능하는 것이 요구됩니다.

- [ARIA Authoring Practices Guide (APG) - Design Patterns and Examples](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/article/practical-aria-examples/)
- [Inclusive Components](https://inclusive-components.design/)

## 기타 고려사항 {#other-points-for-consideration}

### 언어 설정 {#setting-the-language}

스크린 리더 소프트웨어들이 올바른 음성을 선택할 수 있도록, 페이지 텍스트에 인간 언어(human language)를 나타내야 합니다.

- [WebAIM - 문서 언어](https://webaim.org/techniques/screenreader/#language)

### 문서 제목 설정 {#setting-the-document-title}

문서의 `<title>`이 현재 페이지에 대한 올바른 설명을 담아야 합니다. 이를 통해 사용자들이 현재 페이지의 맥락을 놓치지 않도록 할 수 있습니다.

- [WCAG - 문서 제목 요건 이해하기](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

React에서는 [React Document Title 컴포넌트](https://github.com/gaearon/react-document-title)를 사용해 설정할 수 있습니다.

### 색 대비 {#color-contrast}

읽을 수 있는 모든 글에 충분한 색 대비를 주어, 저시력 사용자들이 최대한 읽을 수 있도록 해야 합니다.

- [WCAG - 색 대비 요건 이해하기](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [색 대비에 대한 모든 것과 이를 다시 생각해야 하는 이유](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [The A11Y Project - 색 채도란](https://a11yproject.com/posts/what-is-color-contrast/)

웹사이트의 모든 항목에 대해 적절한 색 조합을 일일이 계산하는 것은 지루할 수 있습니다. [Colorable을 사용해 접근 가능한 모든 색 조합 표를 계산](https://colorable.jxnblk.com/)할 수 있습니다.

아래에 언급된 aXe와 WAVE 도구 모두 색 대비에 대한 테스트가 포함되어 있어, 색 대비에 대한 오류를 알려줍니다.

색 대비에 대한 테스트 기능을 확장할 경우, 아래 도구를 사용할 수 있습니다.

- [WebAIM - 색 채도 검사기](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - 색 채도 분석기](https://www.paciellogroup.com/resources/contrastanalyser/)

## 개발 및 테스트 도구 {#development-and-testing-tools}

접근 가능한 웹 애플리케이션을 만들 수 있도록 도와주는 여러 도구가 있습니다.

### 키보드 {#the-keyboard}

가장 쉬우면서도 가장 중요한 검사 중 하나는 웹사이트 전체가 키보드만으로도 사용될 수 있는지 테스트하는 것입니다. 방법은 아래와 같습니다.

1. 마우스의 연결을 해제하세요.
2. `Tab`과 `Shift+Tab`을 사용해 이동하세요.
3. `Enter`를 사용해 엘리먼트를 활성화하세요.
4. 메뉴와 드롭다운과 같은 일부 엘리먼트는 필요하다면 키보드 방향키를 사용해 조작합니다.

### 개발 보조 도구 {#development-assistance}

일부 접근성 기능들은 JSX 코드에서 바로 확인할 수 있습니다. 종종 ARIA 역할, 상태 및 프로퍼티에 대한 인텔리센스(intellisense) 검사 기능이 JSX를 인식하는 IDE에 미리 제공되는 경우가 있습니다. 아래와 같은 도구 역시 사용할 수 있습니다.

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

ESLint 플러그인인 [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)는 JSX 내의 접근성 문제에 대해 즉각적인 AST 린팅 피드백을 제공합니다. 많은 IDE가 코드 분석과 소스 코드 창에 이런 결과를 통합할 수 있도록 해줍니다.

[Create React App](https://github.com/facebookincubator/create-react-app)에서는 해당 플러그인의 일부 규칙들이 활성화되어 있습니다. 더 많은 접근성 기능을 활성화하려면, 프로젝트 최상위에 아래와 같이  `.eslintrc` 파일을 생성합니다.

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### 브라우저에서 접근성 테스트하기 {#testing-accessibility-in-the-browser}

브라우저에서 접근성 검수를 받을 수 있는 여러 도구가 있습니다. 여기서 소개하는 것들은 HTML의 기술적인 접근성만을 테스트하기 때문에, 다른 도구들과 함께 사용하는 것을 권장합니다.

#### aXe와 aXe-core, react-axe {#axe-axe-core-and-react-axe}

Deque Systems에서는 자동으로 애플리케이션의 종단 간(end-to-end) 접근성을 테스트하는 [aXe-core](https://github.com/dequelabs/axe-core)를 제공합니다. 이 모듈은 Selenium과의 연동이 포함되어있습니다.

[The Accessibility Engine](https://www.deque.com/products/axe/) 또는 aXe는 aXe-core 기반의, 접근성 검사를 위한 브라우저 확장기능입니다.

또는, [@axe-core/react](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react) 모듈을 사용해 개발 혹은 디버깅 중에 이러한 접근성 문제를 콘솔에 바로 띄울 수 있습니다.

#### WebAIM WAVE {#webaim-wave}

[Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/)은 또 다른 브라우저 확장 기능입니다.

#### 접근성 검사기와 접근성 트리 {#accessibility-inspectors-and-the-accessibility-tree}

[접근성 트리](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/)는 스크린 리더와 같은 보조과학기술에 노출되어야 하는 DOM 엘리먼트에 접근 가능한 객체가 담긴 DOM 트리의 하위 집합입니다.

일부 브라우저에서는 접근성 트리 안의 각 엘리먼트의 접근성 정보를 손쉽게 확인할 수 있습니다.

- [Firefox에서 접근성 검사기를 사용하는 방법](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Chrome에서 접근성 검사기를 사용하는 방법](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [OS X Safari에서 접근성 검사기를 사용하는 방법](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### 스크린 리더 {#screen-readers}

접근성 테스트의 일환으로 스크린 리더를 사용한 테스트 역시 진행되어야 합니다.

브라우저와 스크린 리더 조합에 주의해주시기 바랍니다. 선택한 스크린 리더에 가장 적합한 브라우저에서 애플리케이션을 테스트하기 바랍니다.

### 일반적으로 사용되는 스크린 리더 {#commonly-used-screen-readers}

#### Firefox의 NVDA {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/)(별칭: NVDA)는 널리 사용되는 오픈소스 윈도우 스크린 리더입니다.

NVDA를 효과적으로 사용하는 방법은 아래를 참조해주시기 바랍니다.

- [WebAIM - NVDA를 사용한 웹 접근성 측정](https://webaim.org/articles/nvda/)
- [Deque -NVDA 키보드 단축키](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### Safari의 VoiceOver {#voiceover-in-safari}

VoiceOver는 애플 기기에 통합된 스크린 리더입니다.

VoiceOver를 활성화 및 사용하는 방법은 아래를 참조해주시기 바랍니다.

- [WebAIM - VoiceOver를 사용한 웹 접근성 측정](https://webaim.org/articles/voiceover/)
- [Deque - OS X용 VoiceOver 키보드 단축키](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - iOS용 VoiceOver 단축키](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### Internet Explorer의 JAWS {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) 또는 JAWS는 윈도우에서 주로 쓰이는 스크린 리더입니다.

JAWS를 효과적으로 사용하는 방법은 아래를 참조해주시기 바랍니다.

- [WebAIM - JAWS를 사용한 웹 접근성 측정](https://webaim.org/articles/jaws/)
- [Deque - JAWS 키보드 단축키](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### 기타 스크린 리더 {#other-screen-readers}

#### Google Chrome의 ChromeVox {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/)는 Chromebook에 통합된 스크린 리더이며 Google Chrome의 [확장기능](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)으로 사용할 수 있습니다.

ChromeVox를 효과적으로 사용하는 방법은 아래를 참조해주시기 바랍니다.

- [Google Chromebook 도움말 - 내장 스크린 리더 사용법](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic 키보드 단축키](https://www.chromevox.com/keyboard_shortcuts.html)
