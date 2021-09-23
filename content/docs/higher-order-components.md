---
id: higher-order-components
title: 고차 컴포넌트
permalink: docs/higher-order-components.html
---

고차 컴포넌트(HOC, Higher Order Component)는 컴포넌트 로직을 재사용하기 위한 React의 고급 기술입니다. 고차 컴포넌트(HOC)는 React API의 일부가 아니며, React의 구성적 특성에서 나오는 패턴입니다.

구체적으로, **고차 컴포넌트는 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수입니다.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

컴포넌트는 props를 UI로 변환하는 반면에, 고차 컴포넌트는 컴포넌트를 새로운 컴포넌트로 변환합니다.

고차 컴포넌트(HOC)는 Redux의 [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect)와 Relay의 [`createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer)와 같은 서드 파티 React 라이브러리에서 흔하게 볼 수 있습니다.

이 문서에서는 고차 컴포넌트가 유용한 이유를 보여주고, 직접 작성하는 방법에 대해 알아보겠습니다.

## 횡단 관심사(Cross-Cutting Concerns)에 고차 컴포넌트 사용하기 {#use-hocs-for-cross-cutting-concerns}

> **주의**
>
> 이전에는 횡단 관심사 문제를 제어하기 위해 mixin 사용을 권장했습니다. 하지만 mixin을 사용하는 것은 더 많은 문제를 일으킨다는 것을 알게 되었습니다. 우리가 mixin을 더 이상 권장하지 않는 이유와 기존 컴포넌트를 어떻게 변환하는지에 대해서 [이 글](/blog/2016/07/13/mixins-considered-harmful.html)을 읽어보세요.

컴포넌트는 React에서 코드 재사용의 기본 단위입니다. 그러나 어떤 패턴은 기존 컴포넌트에 잘 적용되지 않을 수 있습니다.

외부로부터 데이터를 구독하여 댓글 목록을 렌더링하는 `CommentList` 컴포넌트를 예로 들겠습니다.

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" 는 글로벌 데이터 소스입니다.
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // 변화감지를 위해 리스너를 추가합니다.
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // 리스너를 제거합니다.
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // 데이터 소스가 변경될때 마다 comments를 업데이트합니다.
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

그리고 블로그 포스트를 구독하기 위해 위와 비슷한 패턴으로 컴포넌트를 작성합니다.

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList`와 `BlogPost` 컴포넌트는 동일하지 않습니다. 두 컴포넌트는 `DataSource`에서 서로 다른 메서드를 호출하며 다른 렌더링 결과를 보여줍니다. 하지만 대부분의 구현체는 동일합니다.

- 컴포넌트가 마운트되면, change 리스너를 `DataSource`에 추가합니다.
- 리스너 안에서, 데이터 소스가 변경되면 `setState`를 호출합니다.
- 컴포넌트가 마운트 해제되면 change 리스너를 제거합니다.

규모가 큰 애플리케이션에서 `DataSource`를 구독하고 `setState` 를 호출하는 동일한 패턴이 반복적으로 발생한다고 가정해봅시다.
그렇게 된다면 이 로직을 한 곳에서 정의하고 많은 컴포넌트에서 로직을 공유할 수 있게 하는 추상화가 필요하게 됩니다.
이러한 경우에 고차 컴포넌트를 사용하면 좋습니다.

`DataSource` 를 구독하는 `CommentList` 나 `BlogPost` 같은 컴포넌트를 생성하는 함수를 작성할 수 있습니다. 구독한 데이터를 prop으로 전달받는 자식 컴포넌트를 파라미터 중 하나로 받는 함수를 만듭니다. 이 함수를 `withSubscription` 라고 합시다.

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

첫 번째 파라미터는 래핑된 컴포넌트입니다. 두 번째 파라미터에는 `DataSource`와 현재 props를 가지고 컴포넌트에서 관심 있는 데이터를 검색합니다.

`CommentListWithSubscription` 과 `BlogPostWithSubscription` 가 렌더링될 때 `CommentList` 와 `BlogPost` 는 `DataSource` 에서 가장 최근에 검색된 데이터를 `data` prop으로 전달합니다.
```js
// 이 함수는 컴포넌트를 매개변수로 받고..
function withSubscription(WrappedComponent, selectData) {
  // ...다른 컴포넌트를 반환하는데...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... 구독을 담당하고...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... 래핑된 컴포넌트를 새로운 데이터로 랜더링 합니다!
      // 컴포넌트에 추가로 props를 내려주는 것에 주목하세요.
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

고차 컴포넌트는 입력된 컴포넌트를 수정하지 않으며 상속을 사용하여 동작을 복사하지도 않습니다. 오히려 고차 컴포넌트는 원본 컴포넌트를 컨테이너 컴포넌트로 *포장(Wrapping)*하여 *조합(compose)*합니다. 고차 컴포넌트는 사이드 이펙트가 전혀 없는 순수 함수입니다.

이게 전부입니다! 래핑된 컴포넌트는 새로운 props, `data`와 함께 컨테이너의 모든 props를 전달받으며, 이 데이터들은 출력을 렌더링하는 데 사용됩니다. 고차 컴포넌트는 데이터가 사용되는 이유 및 방법과 연관이 없으며 래핑된 컴포넌트는 데이터가 어디서부터 왔는지와 관련이 없습니다.

`withSubscription` 는 일반 함수이기 때문에 원하는 개수의 인수를 추가할 수 있습니다. 예를 들어 래핑된 컴포넌트로부터 고차 컴포넌트를 더 격리시키기 위해 `data` prop 이름을 설정할 수 있게 만들 수 있습니다. 혹은 `shouldComponentUpdate` 설정을 위한 인수를 받게 하거나 데이터 소스를 설정하는 인수를 받게할 수도 있습니다. 고차 컴포넌트가 컴포넌트 정의 방법을 완전히 제어할 수 있기 때문에 이런 작업이 모두 가능합니다.

컴포넌트와 마찬가지로 `withSubscription`과 래핑된 컴포넌트 간 계약(contract)은 완전히 props 기반입니다. 이렇게하면 래핑된 컴포넌트에 동일한 props를 제공한다면 다른 고차 컴포넌트를 쉽게 변경할 수 있습니다. 예를 들어 데이터를 가져오는 라이브러리를 변경하는 경우 유용하게 사용할 수 있습니다.

## 원본 컴포넌트를 변경하지 마세요. 조합(Composition)하세요. {#dont-mutate-the-original-component-use-composition}

고차 컴포넌트 내부에서 컴포넌트의 프로토타입을 수정(또는 변경)하지 않도록 합니다.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // 원본의 입력을 반환한다는 것은 이미 변형되었다는 점을 시사합니다.
  return InputComponent;
}

// EnhancedComponent 는 props를 받을 때 마다 log를 남깁니다.
const EnhancedComponent = logProps(InputComponent);
```

여기엔 몇 가지의 문제가 있습니다. 그 중 하나는 입력된 컴포넌트를 확장된(enhanced) 컴포넌트와 별도로 재사용 할 수 없다는 것입니다. 더 중요한 것은, `componentDidUpdate`를 변형하는 `EnhancedComponent`에 또 다른 HOC를 적용하면 첫 번째 HOC의 기능은 무시됩니다! 이 HOC는 생명주기 메서드가 없는 함수 컴포넌트에서도 작동하지 않습니다.

변경(mutation)된 HOC는 누출된 추상화(leaky abstraction)입니다. Consumer는 다른 HOC와의 충돌을 피하기 위하여 어떻게 구현되어있는지 반드시 알아야 합니다.

HOC는 변경(mutation)대신에 입력 컴포넌트를 컨테이너 구성요소로 감싸서 조합(composition)을 사용해야 합니다.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // 들어온 component를 변경하지 않는 container입니다. 좋아요!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

위 고차 컴포넌트는 충돌 가능성을 피하면서 프로토타입을 직접 변경하는 버전과 동일하게 작동합니다. 이 방법은 클래스 컴포넌트와 함수 컴포넌트에서도 동일하게 작동합니다. 그리고 순수한 함수이기 때문에 다른 고차 컴포넌트와 같이 조합하거나 심지어 자체적으로 조합할 수 있습니다.

고차 컴포넌트와 컨테이너 컴포넌트라 불리는 패턴이 유사하다고 느낄 수 있습니다. 컨테이너 컴포넌트는 high-level과 low-level 관심사를 분리하는 전략 중 하나입니다. 컨테이너는 구독 및 state 같은 것을 관리하고 UI 렌더링 같은 것을 처리하는 컴포넌트에 props를 전달합니다. 고차 컴포넌트는 컨테이너를 그 구현체 중 일부에 사용하고 있습니다. 고차 컴포넌트는 매개변수화된 컨테이너 컴포넌트 정의로 생각할 수 있습니다.

## 컨벤션: 래핑된 컴포넌트를 통해 관련없는 Props 전달하기 {#convention-pass-unrelated-props-through-to-the-wrapped-component}

고차 컴포넌트는 컴포넌트에 기능을 추가합니다. 고차 컴포넌트는 정의(contract)를 과감하게 변경해서는 안됩니다. 고차 컴포넌트에서 반환된 컴포넌트는 래핑된 컴포넌트와 비슷한 인터페이스가 있어야합니다.

고차 컴포넌트는 특정 관심사와 관련이 없는 props를 활용해야 합니다. 대부분의 고차 컴포넌트에는 다음과 같은 렌더링 메서드가 포함되어있습니다.

```js
render() {
  // 이 HOC에만 해당되므로 추가된 props는 걸러내어 이 HOC에 전달되지 않도록 합니다.
  const { extraProp, ...passThroughProps } = this.props;

  // 이 Props는 일반적으로 Status값 또는 Instance method 입니다.
  const injectedProp = someStateOrInstanceMethod;

  // wrapped component에 props를 전달합니다.
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

이 컨벤션은 고차 컴포넌트의 유연성과 재사용성을 보장하는데 도움이 됩니다.

## 컨벤션: 조합 가능성(Composability) 끌어올리기 {#convention-maximizing-composability}

고차 컴포넌트는 여러 가지 방법으로 작성할 수 있습니다. 때때로 단일 인수로 래핑된 컴포넌트만 받을 때도 있습니다.

```js
const NavbarWithRouter = withRouter(Navbar);
```

일반적으로 고차 컴포넌트는 추가 인수를 허용합니다. Relay 예시에서 config 객체는 컴포넌트의 데이터 의존성을 지정하기 위해 사용합니다.

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

고차 컴포넌트에 대한 가장 일반적인 사용은 다음과 같습니다.

```js
// React Redux의 `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*주목!* 위 코드를 분해해보면 어떤 동작을 하는지 쉽게 알 수 있습니다.

```js
// connect는 다른 함수를 반환하는 함수 입니다.
const enhance = connect(commentListSelector, commentListActions);
// 반환된 함수는 Redux store에 연결된 컴포넌트를 반환하는
// 고차 함수 컴포넌트 입니다.
const ConnectedComment = enhance(CommentList);
```
다르게 말하면 `connect` 는 고차 컴포넌트를 반환하는 고차 함수입니다.

이 형태는 혼란스럽거나 불필요하게 보일 수 있지만 매우 유용한 속성입니다. `connect` 함수에 의해 반환된 것과 같은 단일 인수 고차 컴포넌트는 `Component => Component` 특징을 가지고 있습니다. 출력 타입이 입력 타입과 동일한 함수는 정말 쉽게 조합할 수 있습니다.

```js
// 이렇게 하는 대신에...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... 함수 구성 유틸리티를 사용할 수 있습니다.
// compose(f, g, h)는 (...args) => f(g(h(...args)))와 같습니다.
const enhance = compose(
  // 둘 다 단일 매개변수의 HOC입니다.
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(이와 동일한 속성을 통해서 실험단계인 `connect`와 기타 인핸서 스타일의 HOC를 데코레이터로 사용할 수 있습니다.)

`compose` 유틸리티 기능(효용 함수)는 lodash (as [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose), and [Ramda](https://ramdajs.com/docs/#compose)를 포함한 많은 서드 파티 라이브러리에서 제공하고 있습니다.

## 컨벤션: 간단한 디버깅을 위한 디스플레이 네임 작성 방법 {#convention-wrap-the-display-name-for-easy-debugging}

다른 구성 요소와 마찬가지로 HOC로 만든 컨테이너 구성 요소도 [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools)에 표시됩니다. 디버깅을 쉽게 하려면 HOC의 결과임을 알리는 디스플레이 네임을 작성합니다.

가장 일반적인 방법은 HOC의 이름으로 내부 컴포넌트명을 감싸는 것입니다. 따라서 HOC의 이름이 `withSubscription`이고, HOC 내부의 컴포넌트의 이름이 `CommentList` 인 경우, 디스플레이 네임은 `WithSubscription(CommentList)`을 사용합니다.

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## 주의사항 {#caveats}

고차 컴포넌트에는 React가 처음이라면 알아차리기 어려운 몇 가지 주의사항이 있습니다.

### render 메서드 안에서 고차 컴포넌트를 사용하지 마세요 {#dont-use-hocs-inside-the-render-method}

재조정(reconciliation)으로 알려진 React의 비교 알고리즘은 컴포넌트의 개별성(identity)을 가지고 기존 서브트리를 업데이트 해야 하는지 아니면 버리고 새로운 노드를 마운트 해야 할지 결정합니다. `render`에서 반환된 컴포넌트가 이전에 렌더링 된 컴포넌트와 동일하다면(`===`) React가 새로운 서브트리와 비교하여 재귀적으로 서브트리를 업데이트합니다. 동일하지 않다면 이전 서브트리는 완전히 마운트 해제됩니다.

일반적으로 위 내용에 대해 생각할 필요는 없습니다. 하지만 컴포넌트의 render 메서드 안에서 고차 컴포넌트를 사용할 수 없기 때문에 고차 컴포넌트를 사용할 때는 위 내용을 짚고 넘어가야 합니다.

```js
render() {
  // render가 호출될 때마다 새로운 버전의 EnhancedComponent가 생성됩니다.
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // 때문에 매번 전체 서브트리가 마운트 해제 후 다시 마운트 됩니다!
  return <EnhancedComponent />;
}
```

여기서 성능상의 문제뿐만 아니라 컴포넌트가 다시 마운트 되면서 컴포넌트의 state와 컴포넌트의 하위 항목들이 손실됩니다.

대신에 컴포넌트의 정의 바깥에 HOC를 적용하여 컴포넌트가 한 번만 생성되도록 합니다. 그러면 해당 component는 여러번 렌더링이 되더라도 일관성을 유지합니다.
일반적으로 렌더링이 여러번 되어도 바뀌길 원하는 사람은 없을 것이라고 생각합니다.

드문 경우로 HOC를 동적으로 적용해야 할 경우에는 컴포넌트의 생명주기 메서드 또는 생성자 내에 작성 할 수 있습니다.

### 정적 메서드는 반드시 따로 복사하세요 {#static-methods-must-be-copied-over}

React 컴포넌트에 정적 메서드를 정의하는 것이 유용할 때도 있습니다. 예를 들어 Relay 컨테이너는 GraphQL 구성을 용이하게 하기 위해 정적 메서드 `getFragment`를 노출합니다.

컴포넌트에 HOC를 적용하면, 기존 컴포넌트는 컨테이너의 컴포넌트로 감싸집니다. 즉, 새 컴포넌트는 기존 컴포넌트의 정적 메서드를 가지고 있지 않습니다.

```js
// 정적 함수를 정의합니다
WrappedComponent.staticMethod = function() {/*...*/}
// HOC를 적용합니다
const EnhancedComponent = enhance(WrappedComponent);

// 향상된 컴포넌트에는 정적 메서드가 없습니다.
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

이 문제를 해결하려면 메서드를 반환하기 전에 컨테이너에 복사합니다.

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // 복사 할 메서드를 정확히 알아야 합니다.
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

그러나 복사해야 할 메서드를 정확히 알아야 할 필요가 있습니다. [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)를 사용하여 모든 non-React 정적 메서드를 자동으로 복사할 수 있습니다.

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

또 다른 해결 방법은 정적 메서드를 컴포넌트와 별도로 내보내는 것입니다.

```js
// 대신에...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...메서드를 각각 내보내고...
export { someFunction };

// ...불러오는 모듈에서 두개를 다 임포트합니다.
import MyComponent, { someFunction } from './MyComponent.js';
```

### ref는 전달되지 않는다 {#refs-arent-passed-through}

고차 컴포넌트는 모든 props를 래핑된 컴포넌트에 전달하는 것이 원칙이지만, refs에서는 작동하지 않습니다. 이는 React에서 `ref`가 실제 prop이 아닌 `key`처럼 특별하게 취급되기 때문입니다. 컴포넌트가 HOC의 결과인 엘리먼트에 ref를 추가하는 경우, ref는 래핑된 컴포넌트가 아닌 가장 바깥쪽 컨테이너 컴포넌트의 인스턴스를 나타냅니다.

이 문제의 해결 방법은 `React.forwardRef` API를 사용하는 것입니다. (React 16.3에 도입됨) [자세한 내용은 Forwarding Refs 섹션을 참조](/docs/forwarding-refs.html).
