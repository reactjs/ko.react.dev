---
id: uncontrolled-components
title: 제어되지 않은 컴포넌트
permalink: docs/uncontrolled-components.html
---
폼(Form)을 구현하기 위해서 대부분의 경우에 [제어된 컴포넌트(controlled components)](/docs/forms.html)를 사용할 것을 권장합니다. 제어된 컴포넌트에서 폼 정보는 리액트 컴포넌트에 의해 제어됩니다. 이에 대한 대안으로 제어되지 않은 컴포넌트(uncontrolled components)를 사용할 수 있으며, 이 경우 DOM 스스로에 의하여 폼 정보가 처리됩니다. 

제어되지 않은 컴포넌트를 작성하면 매 상태 변화에 대한 이벤트 핸들러를 작성하는 대신에 [ref](/docs/refs-and-the-dom.html)를 활용함으로써 DOM에서 폼에 대한 값을 가져올 수 있습니다.

예를 들어, 아래 코드는 제어되지 않은 컴포넌트로부터 한 개의 이름을 받아옵니다. 

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

[**CodePen에서 시도 해보세요**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

제어되지 않은 컴포넌트는 진실의 근원(source of truth)을 DOM 안에 가지고 있기 때문에 리액트와 리액트로 작성되지 않은 코드의 통합을 용이하게 만들어 주기도 합니다. 또한 당신이 정돈되지 않고 빠르게 구현하고자 할 때에 살짝 적은 양의 코드로도 가능케 하기도 합니다. 하지만 대부분의 경우에는 제어된 컴포넌트를 사용해야 합니다. 

만약 아직도 특정 상황에서 어떤 종류의 컴포넌트를 사용해야 하는지 확실치 않다면 [제어된 vs 제어되지 않은 입력](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)이라는 아티클이 선택에 도움이 될 것입니다. 

### 기본 값 {#default-values}

리액트의 랜더링 수명 주기(rendering lifecycle) 동안에 DOM에 있는 값은 폼 요소 중 하나인 `value` 속성에 의해 덮어 쓰일 것입니다. 하지만 제어되지 않은 컴포넌트를 사용하면서 때로는 리액트가 초깃값을 설정해 주면서도 이어질 갱신에 대해서는 제어하지 않은 채로 놔두길 원할 수 도 있습니다. 이를 해결하기 위해서 `value` 대신에 `defaultValue` 속성을 명시해줄 수 있습니다. 

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

이처럼, `<input type="checkbox">` 와 `<input type="radio">` 는  `defaultChecked`를 지원하고, `<select>` 와 `<textarea>` 는 `defaultValue`를 지원합니다.

## 파일 입력 태그 {#the-file-input-tag}

HTML에서는 유저가 한 개 이상의 파일을 그들 장치의 저장소에서 서버로 업로드 하거나 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)를 통하여 JavaScript로 처리되도록  `<input type="file">` 를 사용합니다. 

```html
<input type="file" />
```

리액트에서 `<input type="file" />`는 유저에 의해서만 값이 설정될 수 있고 프로그램적으로는 제어될 수 없기 때문에 항상 제어되지 않은 컴포넌트에 속합니다. 

파일들과 상호작용 하기 위해서는 File API를 사용해야만 합니다. 아래 예시는 제출 핸들러(submit handler) 속에서 파일(들)에 접근하기 위해서 [DOM 노드에 참조(ref)하기](/docs/refs-and-the-dom.html)를 생성하는 방법에 대해 보여줍니다. 

`embed:uncontrolled-components/input-type-file.js`

[CodePen에서 시도 해보세요](codepen://uncontrolled-components/input-type-file)
