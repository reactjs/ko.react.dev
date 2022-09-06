---
id: integrating-with-other-libraries
title: 다른 라이브러리와 통합하기
permalink: docs/integrating-with-other-libraries.html
---

React는 어떤 웹 애플리케이션에서든 사용할 수 있습니다. 다른 애플리케이션에 포함될 수 있으며 약간의 노력으로 React 안에 다른 애플리케이션 포함할 수 있습니다. 이 가이드는 [jQuery](https://jquery.com/)와 [Backbone](https://backbonejs.org/)의 통합에 중점을 맞추어 일반적인 몇 가지 사용 사례를 살펴봅니다. 동일한 아이디어로 기존 코드와 컴포넌트를 통합하는 데도 적용할 수 있습니다.

## DOM 조작 플러그인과 통합하기 {#integrating-with-dom-manipulation-plugins}

React는 React의 외부 DOM에서 일어나는 변화를 인식하지 못합니다. 자체 내부 표현에 따라서 업데이트를 할지 말지 결정합니다. 그리고 다른 라이브러리와 같은 DOM 노드를 다룬다면 React는 혼란스러울 것이며 복구할 방법이 없습니다.

React를 DOM에 영향을 미치는 다른 방법과 결합하는 것이 불가능하거나 심지어 어렵다는 것을 의미하지 않습니다. 각각의 작업을 염두에 두기만 하면 됩니다. 

충돌을 피하는 가장 쉬운 방법은 React 컴포넌트가 업데이트되지 않게 막는 것입니다. React가 업데이트할 필요가 없는 빈 `<div>` 같은 요소를 렌더링하면 됩니다.

### 어떻게 문제에 접근하는가 {#how-to-approach-the-problem}

이를 설명하기 위해 일반적인 jQuery 플러그인을 위한 래퍼에 대해 간략하게 알아보겠습니다.

최상위 DOM 엘리먼트에 [ref](/docs/refs-and-the-dom.html)를 붙입니다. `componentDidMount` 내부에서 jQuery 플러그인에 전달하기 위해 최상위 DOM 엘리먼트에 대한 참조를 얻습니다.

마운팅 후 React가 DOM에 건드리는 것을 방지하기 위해 `render()` 메서드에서 빈 `<div />`를 반환합니다. 해당 `<div />` 요소는 프로퍼티나 자식을 가지지 않기 때문에 React가 업데이트할 이유가 없습니다. jQuery 플러그인이 DOM의 일부를 다룰수 있게 자유롭게 관리할 수 있습니다.

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

`componentDidMount`, `componentWillUnmount` 두 가지의 [생명주기 메서드](/docs/react-component.html#the-component-lifecycle)를 정의했다는 것을 주의합니다. 많은 jQuery 플러그인은 DOM에 이벤트 리스너를 등록하므로 `componentWillUnmount` 안에서 해제하는 것이 중요합니다. 플러그인이 해제를 위한 메서드를 제공하지 않는다면 자체적으로 해당 메서드를 제공해야 합니다. 메모리 누수를 방지하기 위해 플러그인이 등록한 모든 이벤트 리스너를 제거해야 하는 것을 잊어서는 안 됩니다.

### jQuery Chosen 플러그인과 통합하기 {#integrating-with-jquery-chosen-plugin}

이러한 컨셉의 더 구체적인 예시를 위해 `<select>` 입력을 다루는 플러그인 [Chosen](https://harvesthq.github.io/chosen/)에 대한 간단한 래퍼를 작성해 보겠습니다.

>**주의**
>
>이 방법이 가능하다고 해서 React 앱에 대한 최상의 접근 방법임을 의미하지는 않습니다. 가능하다면 React 컴포넌트를 사용하는 것을 권장합니다. React 컴포넌트는 React 애플리케이션에서 더 쉽게 재사용할 수 있으며, 해당 동작과 모양에 대해 더 많은 제어를 제공해 줍니다.

먼저, Chosen이 DOM에 무엇을 하는지 봅시다.

`<select>` DOM 노드에서 Chosen을 호출하면 원본 DOM 노드의 어트리뷰트를 읽고 인라인 스타일로 숨깁니다. 그리고 `<select>` 바로 뒤에 고유의 시각적 표현을 가진 별도의 DOM 노드를 추가합니다. 그런 다음 jQuery 이벤트를 발생시켜 변경 사항에 대해 알립니다.

`<Chosen>` 래퍼 React 컴포넌트로 만든 API라고 가정해 보겠습니다.

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

간결함을 위해 [비제어 컴포넌트](/docs/uncontrolled-components.html)로 구현하겠습니다.

먼저, `<div>`로 감싸인 `<select>`를 반환하는 `render()` 메서드가 있는 빈 컴포넌트를 생성합니다.

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

별도의 `<div>`로 `<select>`를 어떻게 감쌌는지 주의하세요. Chosen이 전달한 `<select>` 노드 바로 다음에 다른 DOM 요소를 추가하기 때문에 필요합니다. 하지만 React가 관여하는 한, `<div>`는 항상 단일 자식만 가집니다. React 업데이트가 Chosen이 추가한 DOM 노드와 충돌하지 않게 하는 방법입니다. React 흐름 외부에서 DOM을 수정하는 경우 React가 해당 DOM 노드를 건드릴 이유가 없는지 확인해야 합니다.

다음으로 생명주기 메서드를 구현해 보겠습니다. `componentDidMount`에서 `<select>` 노드의 ref를 사용하여 Chosen을 초기화합니다. 그리고 `componentWillUnmount`에서 이를 해제해야 합니다.

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**CodePen에서 사용해보세요**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

React는 `this.el` 필드에 특별한 의미를 부여하지 않습니다. 이전에 `render()` 메서드에서 `ref`에 이 필드를 할당했기 때문에 작동합니다.

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

컴포넌트를 렌더링하기에 충분하지만, 값이 변경될 때마다 알림을 받기를 원합니다. 이를 위해 Chosen이 관리하는 `<select>`에서 jQuery change 이벤트를 구독합니다.

Chosen에 `this.props.onChange`를 바로 전달하지 않습니다. 왜냐하면 컴포넌트의 props가 여러 번 변경될 수 있으며 이벤트 핸들러를 포함하고 있기 때문입니다. 그 대신에 `this.props.onChange`를 호출하는 `handleChange()` 메서드를 선언하고 jQuery `change` 이벤트로 구독합니다.

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**CodePen에서 사용해보세요**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

마지막으로 해야 할 남은 한 가지 있습니다. React에서 prop는 여러 번 바꿀 수 있습니다. 예를 들어 부모 컴포넌트의 state가 변경되면 <Chosen> 컴포넌트가 다른 자식을 가질 수 있습니다. 통합을 사용하는 위치에서는 prop이 업데이트할 때 마다 수동으로 DOM을 업데이트해야 합니다. 더 이상 React가 DOM을 관리하지 않습니다.

Chosen 문서에서 따르면 jQuery `trigger()` API를 사용하여 원본 DOM 엘리먼트의 변경 사항에 대해 알 수 있습니다. React가 `<select>`안에 `this.props.children`을 업데이트하지만 Chosen에게 자식 목록의 변경에 알려주는 `componentDidUpdate()` 생명주기 메서드도 추가합니다.

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

React 변화로 `<select>` 자식 관리가 될 때 Chosen이 해당 DOM 엘리먼트 업데이트를 알 수 있습니다.

`Chosen` 컴포넌트의 완전한 구현은 다음과 같습니다.

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**CodePen에서 사용해보세요**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## 다른 뷰 라이브러리와 통합하기 {#integrating-with-other-view-libraries}

[`createRoot()`](/docs/react-dom-client.html#createRoot)의 유연성 덕분에 다른 애플리케이션에 React를 포함할 수 있습니다.

React는 일반적으로 시작 시에 단일 루트 React 컴포넌트를 DOM에 로드하는 데 사용되지만 `createRoot()`는 앱처럼 크거나 버튼처럼 작은 UI의 독립적인 부분에 대해 여러 번 호출 할 수 있습니다.

실제로 Facebook에서 React를 사용되는 방식입니다. 이렇게 하면 React에서 애플리케이션을 한 부분씩 작성할 수 있으며 이를 기존의 서버에서 생성한 템플릿 및 다른 클라이언트 사이드 코드와 결합을 할 수 있습니다.

### 문자열 기반 렌더링을 React로 바꾸기 {#replacing-string-based-rendering-with-react}

이전 웹 애플리케이션의 일반적인 패턴은 `$el.html(htmlString)`처럼 DOM의 청크를 문자열로 기술하고 DOM에 삽입하는 것입니다. 코드 베이스의 이러한 점들은 React를 소개하는데 완벽합니다. 문자열 기반 렌더링을 React 컴포넌트로 다시 작성하면 됩니다.

다음 jQuery 구현은...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

React 컴포넌트를 사용해서 재작성할 수 있습니다.

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

$('#btn').click(function() {
  alert('Hello!');
});
```

여기에서 더 많은 로직을 컴포넌트로 옮기고 일반적인 React practices를 채택할 수 있습니다. 예를 들어 컴포넌트에서 동일한 컴포넌트를 여러 번 렌더링할 수 있으므로 ID에 의존하지 않는 것이 좋습니다. 대신 [React 이벤트 시스템](/docs/handling-events.html)을 사용하고 React `<button>` 요소에 클릭 핸들러를 직접 등록하면 됩니다.

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}
```

[**CodePen에서 사용해보세요**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

이런 격리된 컴포넌트를 원하는 만큼 가질 수 있으며 `ReactDOM.createRoot()`를 사용해서 다른 DOM 컨테이너로 렌더링할 수 있습니다. 점점 앱의 더 많은 부분을 React로 변환하면 더 큰 컴포넌트로 결합할 수 있고 `ReactDOM.createRoot()` 호출을 계층 구조 상위로 옮길 수 있습니다.

### Backbone 뷰 안에 React 포함하기 {#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) 뷰는 일반적으로 HTML 문자열 또는 문자열로 제공되는 템플릿 함수를 사용하여 DOM 엘리먼트를 위한 콘텐츠를 생성합니다. 이 프로세스 또한 React 컴포넌트 렌더링으로 대체할 수 있습니다.

아래에서 `ParagraphView`라는 Backbone 뷰를 생성합니다. Backbone (`this.el`)이 제공하는 DOM 요소에 React `<Paragraph>` 컴포넌트를 렌더링하기 위해 Backbone의 `render()` 함수를 오버라이드합니다. 여기서도 [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot) 사용하고 있습니다.

```js{7,11,15}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  initialize(options) {
    this.reactRoot = ReactDOM.createRoot(this.el);
  },
  render() {
    const text = this.model.get('text');
    this.reactRoot.render(<Paragraph text={text} />);
    return this;
  },
  remove() {
    this.reactRoot.unmount();
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**CodePen에서 사용해보세요**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

`remove` 메서드 안에서 `root.unmount()` 호출하여 분리가 됐을 때 React가 컴포넌트 트리와 관련된 이벤트 핸들러와 다른 리소스를 등록 해지하는 것이 중요합니다.

React 트리안에서 컴포넌트가 사라질 때 자동으로 클린업이 실행되지만, 전체 트리를 수동으로 제거하기 때문에 이 메서드를 반드시 호출해야 합니다.

## 모델 레이어와 통합하기 {#integrating-with-model-layers}

[React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), 또는 [Redux](https://redux.js.org/) 와 같이 일반적으로 단방향 데이터 흐름을 사용하는 것을 권장하지만 React 컴포넌트는 다른 프레임워크 또는 라이브러리에 있는 모델 레이어를 사용할 수 있습니다.

### React 컴포넌트 안에서 Backbone 모델 사용하기 {#using-backbone-models-in-react-components}

React 컴포넌트로부터 [Backbone](https://backbonejs.org/) 모델, 컬렉션을 소비하는 가장 쉬운 방법은 다양한 변경 이벤트를 감지하거나 수동으로 업데이트를 하는 것입니다.

모델 렌더링을 담당하는 컴포넌트는 `'change'` 이벤트에 수신하는 반면 컬렉션 렌더링을 담당하는 컴포넌트는 `'add'`, `'remove'` 이벤트를 수신합니다.
두 경우 새로운 데이터와 함께 컴포넌트를 다시 렌더링하기 위해 [`this.forceUpdate()`](/docs/react-component.html#forceupdate)를 호출합니다.

아래의 예시에서, `List` 컴포넌트는 개별적으로 렌더링하기 위해 `Item` 컴포넌트를 사용해서 Backbone 컬렉션을 렌더링합니다. 

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**CodePen에서 사용해보세요**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)


### Backbone 모델에서 데이터 추출하기 {#extracting-data-from-backbone-models}

위에 대한 접근 방법은 React 컴포넌트가 Backbone 모델과 컬렉션을 알고 있어야 합니다. 나중에 다른 데이터 관리 솔루션으로 이전할 계획이 있다면 Backbone에 대한 지식을 코드의 가능한 한 적은 부분에 집중하고자 할 수 있습니다.

해결책은 변경할 때마다 순수 데이터로 모델의 어트리뷰트를 추출하는 것입니다. 그리고 이 논리를 한곳에 모아둡니다. 그다음은 Backbone 모델의 모든 어트리뷰트를 state로 추출하여 감싼 컴포넌트로 데이터를 전달하는 [고차함수 컴포넌트](/docs/higher-order-components.html) 입니다.

이 방법은, 고차함수 컴포넌트만 Backbone 모델 내부에 대해서 알고 있으면 됩니다. 그리고 앱 안에 있는 대부분 컴포넌트는 Backbone에 대해 몰라도 됩니다.

아래의 예시에서 모델의 어트리뷰트를 복사해서 초기 상태로 만듭니다. `change` 이벤트를 구독하고 언마운트시 구독 해제합니다. 이벤트가 발생했을 때 모델의 현재 어트리뷰트와 함께 state를 업데이트합니다. 마지막으로 `model` prop 자체가 변경되면 이전 모델을 구독 해제하고 새로운 모델을 구독합니다.

이 예시는 Backbone을 사용한 작업과 관련하여 모든 것을 망라하는 것이 아니라 일반적인 방법으로 어떻게 접근하는지에 아이디어를 줄 수 있습니다.

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

사용하는 방법은 `NameInput` React 컴포넌트를 Backbone 모델과 연결합니다. 그리고 input의 값이 바뀔 때마다 `firstName` 어트리뷰트를 업데이트합니다.

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Example model={model} />);
```

[**CodePen에서 사용해보세요**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

이 기술은 Backbone에 제한되지 않습니다. 생명주기 메서드 안에서 변화를 구독하고 선택적으로 로컬 React state로 데이터를 복사한다면 React를 다른 모델 라이브러리와 사용할 수 있습니다.
