---
id: uncontrolled-components
title: 비제어 컴포넌트
permalink: docs/uncontrolled-components.html
prev: refs-and-the-dom.html
next: optimizing-performance.html
---

대부분 경우에 폼을 구현하는데 [제어 컴포넌트](/docs/forms.html#controlled-components)를 사용하는 것이 좋습니다. 제어 컴포넌트에서 폼 데이터는 React 컴포넌트에서 다루어집니다. 대안인 비제어 컴포넌트는 DOM 자체에서 폼 데이터가 다루어집니다.

모든 state 업데이트에 대한 이벤트 핸들러를 작성하는 대신 비제어 컴포넌트를 만들려면 [ref를 사용](/docs/refs-and-the-dom.html)하여 DOM에서 폼 값을 가져올 수 있습니다.

예를 들어 아래 코드는 비제어 컴포넌트에 단일 이름을 허용합니다.

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

비제어 컴포넌트는 DOM에 신뢰 가능한 출처를 유지하므로 비제어 컴포넌트를 사용할 때 React와 non-React 코드를 통합하는 것이 쉬울 수 있습니다. 빠르고 간편하게 적은 코드를 작성할 수 있지만, 그 외에는 일반적으로 제어된 컴포넌트를 사용해야 합니다.

특정 상황에서 사용해야 하는 컴포넌트의 타입이 명확하지 않은 경우, [제어 입력과 비제어 입력에 대한 글](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)이 도움이 될 것입니다.

### 기본 값 {#default-values}

React 렌더링 생명주기에서 폼 엘리먼트의 `value` 어트리뷰트는 DOM의 value를 대체합니다. 비제어 컴포넌트를 사용하면 React 초깃값을 지정하지만, 그 이후의 업데이트는 제어하지 않는 것이 좋습니다. 이러한 경우에 `value` 어트리뷰트 대신 `defaultValue`를 지정할 수 있습니다.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

또한 `<input type="checkbox">`와 `<input type="radio">`는 `defaultChecked`를 지원하고 `<select>`와 `<textarea>`는 `defaultValue`를 지원합니다.

## 파일 입력 태그 {#the-file-input-tag}

HTML에서 `<input type="file">`은 사용자가 장치 저장소에서 하나 이상의 파일을 선택하여 서버에 업로드하거나 [파일 API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)를 사용하여 JavaScript로 조작할 수 있습니다.

```html
<input type="file" />
```

React에서 `<input type="file" />`은 프로그래밍적으로 값을 설정 할 수 없고 사용자만이 값을 설정할 수 있기때문에 항상 비제어 컴포넌트입니다.

파일 API를 사용하여 파일과 상호작용해야 합니다. 아래 예시에서는 제출 핸들러에서 파일에 접근하기 위해서 [DOM 노드의 ref](/docs/refs-and-the-dom.html)를 만드는 방법을 보여주고 있습니다.

`embed:uncontrolled-components/input-type-file.js`

**[CodePen에서 실행하기](codepen://uncontrolled-components/input-type-file)**
