---
id: higher-order-components
title: 고차 컴포넌트
permalink: docs/higher-order-components.html
---

고차 컴포넌트(HOC, Higher Order Component)는 React에서 컴포넌트 로직을 재사용하기 위한 고급 기술입니다. HOC는 React API의 일부분이 아니라 React의 조합 가능한 성질로부터 자연스럽게 등장한 패턴입니다.

구체적으로 고차 컴포넌트는 **컴포넌트를 받아 새로운 컴포넌트를 반환하는 함수입니다.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

컴포넌트가 props를 UI로 변환하는 반면에 고차 컴포넌트는 컴포넌트를 다른 컴포넌트로 변환합니다.

고차 컴포넌트는 Redux의 [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) 나 Relay의 [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) 같은 React 서드파티 라이브러리에서 자주 사용됩니다.

이 문서에서 고차 컴포넌트가 왜 유용한 지 이야기하고 어떻게 작성하는 지 설명합니다.

## 크로스 커팅 문제(Cross-Cutting Concerns)에 고차 컴포넌트 사용하기 {#use-hocs-for-cross-cutting-concerns}

> **주의**
>
> 이전에는 크로스 커팅 문제를 제어하기 위해 mixin 사용을 권장했습니다. 하지만 mixin의 사용으로 얻는 이점보다 더 많은 문제를 일으킨다는 것을 알게 되었습니다. 우리가 mixin을 더 이상 권장하지 않는 이유와 기존 컴포넌트를 어떻게 변환하는지에 대해서 [이 글](/blog/2016/07/13/mixins-considered-harmful.html)을 읽어보세요.

컴포넌트는 React에서 코드 재사용의 기본 단위입니다. 그러나 일부 패턴에서 컴포넌트의 재사용은 잘 어울리지 않을 수 있습니다.

외부로부터 데이터를 구독하여 댓글 목록을 렌더링하는 `CommentList` 컴포넌트로 예를 들겠습니다.

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" 는 글로벌 데이터 소스로 정의되어 있습니다.
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

`CommentList` 와 `BlogPost` 컴포넌트는 동일하지 않습니다. 두 컴포넌트는 `DataSource` 에서 서로 다른 메서드를 호출하며 다른 렌더링 결과를 보여줍니다. 하지만 대부분의 구현체는 동일합니다.

- 컴포넌트가 마운트되면, change 리스너를 `DataSource`에 추가합니다.
- 리스너 안에서, 데이터 소스가 변경되면 `setState`를 호출합니다.
- 컴포넌트가 unmount되면 change 리스너를 제거합니다.

규모가 큰 어플리케이션에서 `DataSource` 를 구독하고 `setState` 를 호출하는 동일한 패턴이 반복적으로 발생한다면, 이 로직을 한 곳에서 정의하고 많은 컴포넌트에서 로직을 공유할 수 있게하는 추상화가 필요하게됩니다. 이 경우에 고차 컴포넌트를 사용하면 좋습니다.

`DataSource` 를 구독하는 `CommentList` 나 `BlogPost` 같은 컴포넌트를 생성하는 함수를 작성할 수 있습니다. 데이터를 prop으로 구독하여 전달받는 자식 컴포넌트를 파라미터 중 하나로 받는 함수를 만듭니다. 이 함수를 `withSubscription` 라고 합시다.

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

첫번째 파라미터는 래핑된 컴포넌트입니다. 두번째 파라미터에는 `DataSource`와 현재 props를 가지고 컴포넌트에서 관심있는 데이터를 검색합니다.

`CommentListWithSubscription` 과 `BlogPostWithSubscription` 가 렌더링될 때 `CommentList` 와 `BlogPost` 는 `DataSource` 에서 가장 최근에 검색된 데이터를 `data` prop으로 전달합니다.

```js
// 이 함수는 컴포넌트를 매개변수로 받고...
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

고차 컴포넌트는 입력된 컴포넌트를 수정하지 않으며 상속을 사용하여 동작을 복사하지도 않습니다. 오히려 고차 컴포넌트는 원래 컴포넌트를 컨테이너 컴포넌트에 *래핑하여* *조정합니다*. 고차 컴포넌트는 사이드 이펙트가 전혀 없는 순수 함수입니다.

이게 전부입니다. 래핑된 컴포넌트는 출력물을 렌더링하는 데 사용되는 `data`, 새로운 prop을 포함한 컨테이너의 모든 props를 전달받습니다. 고차 컴포넌트는 데이터가 사용되는 이유 및 방법과 연관이 없으며 래핑된 컴포넌트는 데이터가 어디서부터 왔는지와 관련 없습니다.

`withSubscription` 는 일반 함수이기때문에 원하는 갯수의 인수를 추가할 수 있습니다. 예를 들어 래핑된 컴포넌트로부터 고차 컴포넌트를 더 격리시키기 위해 `data` prop 이름을 설정 가능하게 만들 수 있습니다. 혹은 `shouldComponentUpdate` 설정을 위한 인수를 받게 하거나 데이터 소스를 설정하는 인수를 받게할 수도 있습니다. 고차 컴포넌트가 컴포넌트 정의 방법을 완전히 제어할 수 있기 때문에 이런 작업들이 모두 가능합니다.

컴포넌트와 마찬가지로 withSubscription 과 래핑된 컴포넌트 간 계약(contract)은 완전히 props 기반입니다. 이렇게하면 래핑된 컴포넌트에 동일한 props를 제공한다면 다른 고차 컴포넌트를 쉽게 교차할 수 있습니다. 예를 들어 데이터를 가져오는 라이브러리를 변경하는 경우 유용하게 사용할 수 있습니다.

## 원본 컴포넌트를 변환하지마세요. Composition을 사용하세요.
. {#dont-mutate-the-original-component-use-composition}

고차 컴포넌트 내부에서 컴포넌트의 프로토타입을 수정(또는 변형)하지 않도록 합니다.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent 는 props를 받을때 마다 log를 남깁니다.
const EnhancedComponent = logProps(InputComponent);
```

There are a few problems with this. One is that the input component cannot be reused separately from the enhanced component. More crucially, if you apply another HOC to `EnhancedComponent` that *also* mutates `componentDidUpdate`, the first HOC's functionality will be overridden! This HOC also won't work with function components, which do not have lifecycle methods.

Mutating HOCs are a leaky abstraction—the consumer must know how they are implemented in order to avoid conflicts with other HOCs.

Instead of mutation, HOCs should use composition, by wrapping the input component in a container component:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

위 고차 컴포넌트는 충돌 가능성을 피하면서 변형 버전과 동일하게 작동합니다. 이 방법은 클래스 컴포넌트와 함수형 컴포넌트에서도 동일하게 작동합니다. 그리고 순수한 함수이기 때문에 다른 고차 컴포넌트와 같이 구성하거나 심지어 자체적으로 구성할 수 있습니다.

고차 컴포넌트와 컨테이너 컴포넌트 라 불리는 패턴이 유사함을 느꼈을 수 있습니다. 컨테이너 컴포넌트는 high-level과 low-level의 관심사를 분리하는 전략의 일부입니다. 컨테이너는 구독 및 state 같은 것을 관리하고 UI 렌더링같은 것을 처리하는 컴포넌트에 props를 전달합니다. 고차 컴포넌트는 컨테이너를 그 구현체 중 일부에 사용하고있습니다. 고차 컴포넌트는 파라미터화된 컨테이너 컴포넌트 정의로 생각할 수 있습니다.

## 컨벤션: 래핑된 컴포넌트를 통해 관련없는 Props 전달하기 {#convention-pass-unrelated-props-through-to-the-wrapped-component}

고차 컴포넌트는 컴포넌트에 기능을 추가합니다. 고차 컴포넌트는 맺음(contract)을 과감하게 변경해서는 안됩니다. 고차 컴포넌트는 반환된 컴포넌트에서는 래핑된 컴포넌트와 비슷한 인터페이스가 있어야합니다.

고차 컴포넌트는 특정 관심사과 관련이 없는 props를 통해야합니다. 대부분의 고차 컴포넌트에는 다음과 같은 렌더링 메서드가 포함되어있습니다.

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

이 컨벤션은 고차 컴포넌트의 유연성과 재사용성을 확인하는데 도움이 됩니다.

## 컨벤션: 합성 가능성(Composability) 최대화하기 {#convention-maximizing-composability}

고차 컴포넌트는 여러가지 방법으로 작성할 수 있습니다. 때때로 단일 인수로 래핑된 컴포넌트만 받을 때도 있습니다.

```js
const NavbarWithRouter = withRouter(Navbar);
```

일반적으로 고차 컴포넌트는 추가 인수를 허용합니다. Relay 예제에서 config 객체는 컴포넌트의 데이터 의존성을 지정하기 위해 사용합니다.

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

고차 컴포넌트에 대한 가장 일반적인 사용은 다음과 같습니다.

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*주목!* 위 코드를 분해해보면 어떤 동작을 하는지 쉽게 알 수 있습니다.

```js
// connect 다른 함수를 반환하는 함수 입니다.
const enhance = connect(commentListSelector, commentListActions);
// 반환된 함수는 Redux store에 연결된 컴포넌트를 반환하하는
// 고차 함수 캄포넌트 입니다.
const ConnectedComment = enhance(CommentList);
```
다르게 말하면 `connect` 는 고차 컴포넌트를 반환하는 고차 함수입니다.

이 형태는 혼란스럽거나 불필요하게 보일 수 있지만 매우 유용한 속성입니다. `connect` 함수에 의해 반환된 것과 같은 단일 인수 고차 컴포넌트는 `Component => Component` 특징을 가지고 있습니다. 출력 타입이 입력 타입과 동일한 함수는 정말 쉽게 조합할 수 있습니다.

```js
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(This same property also allows `connect` and other enhancer-style HOCs to be used as decorators, an experimental JavaScript proposal.)

The `compose` utility function is provided by many third-party libraries including lodash (as [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose), and [Ramda](https://ramdajs.com/docs/#compose).

## Convention: Wrap the Display Name for Easy Debugging {#convention-wrap-the-display-name-for-easy-debugging}

The container components created by HOCs show up in the [React Developer Tools](https://github.com/facebook/react-devtools) like any other component. To ease debugging, choose a display name that communicates that it's the result of a HOC.

The most common technique is to wrap the display name of the wrapped component. So if your higher-order component is named `withSubscription`, and the wrapped component's display name is `CommentList`, use the display name `WithSubscription(CommentList)`:

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

고차 컴포넌트에는 React가 처음이라면 알아차리기 어려운 몇가지 주의사항이 있습니다.

### render 메서드 안에서 고차 컴포넌트를 사용하지 마세요 {#dont-use-hocs-inside-the-render-method}

재조정(reconciliation)으로 알려진 React의 비교 알고리즘은 컴포넌트의 개별성(identity)를 가지고 기존 서브트리를 업데이트 해야하는지 아니면 버리고 새로운 노드를 마운트 해야할지 결정합니다. `render`에서 반환된 컴포넌트가 이전에 렌더링된 컴포넌트와 동일하다면(`===`) React가 새로운 서브트리와 비교하여 재귀적으로 서브트리를 업데이트합니다. 만약 동일하지 않다면 이전 서브트리는 완전히 마운트 해제됩니다.

일반적으로 위 내용에 대해 생각할 필요 없습니다. 하지만 컴포넌트의 렌더 메소드 안에서 고차 컴포넌트를 사용할 수 없기 때문에 고차 컴포넌트를 사용할때는 위 내용을 짚고 넘어가야합니다.

```js
render() {
  // render가 호출될 때마다 새로운 버전의 EnhancedComponent가 생성됩니다.
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // 때문에 매번 전체 서브트리가 마운트 해제 후 다시 마운트 됩니다!
  return <EnhancedComponent />;
}
```

여기서 성능상의 문제 뿐만 아니라 컴포넌트가 다시 마운트 되면서 컴포넌트의 state와 컴포넌트의 하위 항목들이 손실됩니다.

Instead, apply HOCs outside the component definition so that the resulting component is created only once. Then, its identity will be consistent across renders. This is usually what you want, anyway.

In those rare cases where you need to apply a HOC dynamically, you can also do it inside a component's lifecycle methods or its constructor.

### Static Methods Must Be Copied Over {#static-methods-must-be-copied-over}

Sometimes it's useful to define a static method on a React component. For example, Relay containers expose a static method `getFragment` to facilitate the composition of GraphQL fragments.

When you apply a HOC to a component, though, the original component is wrapped with a container component. That means the new component does not have any of the static methods of the original component.

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

To solve this, you could copy the methods onto the container before returning it:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

However, this requires you to know exactly which methods need to be copied. You can use [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) to automatically copy all non-React static methods:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Another possible solution is to export the static method separately from the component itself.

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs Aren't Passed Through {#refs-arent-passed-through}

While the convention for higher-order components is to pass through all props to the wrapped component, this does not work for refs. That's because `ref` is not really a prop — like `key`, it's handled specially by React. If you add a ref to an element whose component is the result of a HOC, the ref refers to an instance of the outermost container component, not the wrapped component.

The solution for this problem is to use the `React.forwardRef` API (introduced with React 16.3). [Learn more about it in the forwarding refs section](/docs/forwarding-refs.html).
