---
id: test-renderer
title: 테스트 렌더러
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**불러오기**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // npm에서 ES5를 사용하는 경우
```

## 개요 {#overview}

이 패키지는 DOM 혹은 네이티브 모바일 환경의 제약 없이, React 컴포넌트를 순수한 JavaScript 객체로 렌더링하는데 사용할 수 있는 React 렌더러를 제공합니다.

기본적으로, 이 패키지를 사용하면 브라우저나 [jsdom](https://github.com/tmpvar/jsdom) 없이 React DOM 또는 React Native 컴포넌트에 의해 렌더링된 플랫폼 뷰 계층의 스냅샷을 쉽게 찍을 수 있도록 도와줍니다.



예시

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Jest의 스냅샷 테스트 기능으로 JSON 트리의 복사본을 파일로 자동 저장하여 테스트 내에서 변경되지 않았는지 확인할 수 있습니다. [자세히 알아보기](https://jestjs.io/docs/en/snapshot-testing)

또한, 결과물을 순회하며 특정 노드를 찾아 원하는 값을 가지고 있는지 검증하는 데 사용할 수 있습니다.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)
* [`TestRenderer.act()`](#testrendereract)

### TestRenderer instance {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## 참조 {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

전달된 React 엘리먼트로 `TestRenderer`  인스턴스를 생성합니다. 실제 DOM을 사용하지 않지만, 컴포넌트 트리 전체를 메모리상에 렌더링하기 때문에 원하는 값을 가졌는지 검증할 수 있습니다. 반환된 인스턴스는 [다음과 같은 함수와 속성을 가지고 있습니다.](#testrenderer-instance)

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

[`react-dom/test-utils`의 `act()`](/docs/test-utils.html#act)와 비슷하게, `TestRenderer.act`는 검증을 위한 컴포넌트들을 준비합니다. `TestRenderer.create` 와 `trestRenderer.update`를 호출을 이 버전의 `act()`를 사용해서 감싸주세요.

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // The component being tested

// 컴포넌트를 렌더링합니다.
let root;
act(() => {
  root = create(<App value={1}/>)
});

// root를 검증합니다.
expect(root.toJSON()).toMatchSnapshot();

// 몇몇의 다른 props를 업데이트합니다.
act(() => {
  root = root.update(<App value={2}/>);
})

// root를 검증합니다.
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

렌더링 된 트리를 나타내는 객체를 반환합니다. 이 트리는 같은 플랫폼 고유의 노드(예: `<div>`, `<View>`)와, 그러한 노드의 속성만을 가지고 있습니다. 사용자가 작성한 컴포넌트는 나타나지 않습니다. 이 함수는 [스냅샷 테스팅](https://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest) 시 유용하게 사용할 수 있습니다.

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

렌더링 된 트리를 나타내는 객체를 반환합니다. `toJSON()`에서 반환되는 값보다 더욱 자세한 정보가 반환되며, 반환 값에는 사용자가 작성한 컴포넌트 역시 포함되어있습니다. 테스트 렌더러 위에 별도의 검증(assertion) 라이브러리를 만드는 것이 아니라면 이 함수는 필요하지 않을 것입니다.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

메모리 내의 트리를 새로운 최상위 엘리먼트로 다시 렌더링합니다. 이 함수를 사용해 최상위 엘리먼트에서의 React 업데이트를 시뮬레이션할 수 있습니다. 새로운 엘리먼트가 이전 엘리먼트와 같은 타입과 키(key)를 가지고 있다면 트리를 업데이트합니다. 그렇지 않다면, 새로운 트리를 새로 마운트합니다.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

메모리 내의 트리를 마운트 해제하고 적절한 생명주기 이벤트를 발생시킵니다.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

최상위 엘리먼트에 대응하는 인스턴스가 존재하면 값을 반환합니다. 최상위 엘리먼트가 함수 컴포넌트일 경우, 함수 컴포넌트에는 인스턴스가 없기 때문에 작동하지 않습니다.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

트리 내에서 특정 노드를 검증할 때 유용한 최상위 "테스트 인스턴스" 객체를 반환합니다. 이것을 사용하여 더욱 깊이 있는 다른 "테스트 인스턴스"를 찾을 수 있습니다.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

`test(testInstance)`에 대해 `true`를 반환하는 단 하나의 자식 테스트 인스턴스를 찾아 반환합니다. 해당되는 인스턴스가 하나가 아니라면 오류를 반환합니다.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

주어진 타입(type)에 해당하는 단 하나의 자식 테스트 인스턴스를 찾아 반환합니다. 해당되는 인스턴스가 하나가 아니라면 오류를 반환합니다.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

주어진 `props` 들에 해당하는 단 하나의 자식 테스트 인스턴스를 찾아 반환합니다. 해당되는 인스턴스가 하나가 아니라면 오류를 반환합니다.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

`test(testInstance)`에 대해 `true`를 반환하는 모든 자식 테스트 인스턴스들을 찾아 반환합니다.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

주어진 타입(type)에 해당하는 모든 자식 테스트 인스턴스들을 찾아 반환합니다.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

주어진 `props` 들에 해당하는 모든 자식 테스트 인스턴스들을 찾아 반환합니다.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

이 테스트 인스턴스에 해당하는 컴포넌트 인스턴스입니다. 함수 컴포넌트에는 인스턴스가 없기 때문에 클래스 컴포넌트에서만 사용할 수 있습니다. 주어진 컴포넌트 내부의 `this`와 같습니다.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

이 테스트 인스턴스에 해당하는 컴포넌트의 타입입니다. 예를 들어, `<Button />` 컴포넌트의 타입은 `Button` 입니다.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

이 테스트 인스턴스에 해당하는 컴포넌트의 props들입니다. 예를 들어, `<Button size="small" />` 컴포넌트는 `{size: 'small'}` 이라는 props들을 가지고 있습니다.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

이 테스트 인스턴스의 부모입니다.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

이 테스트 인스턴스의 자식들입니다.

## Ideas {#ideas}

커스텀 모의 ref를 만들어주는 `createNodeMock` 함수를 `TestRenderer.create`에 추가로 넘길 수 있습니다. `createNodeMock`은 현재의 엘리먼트를 받아 모의 ref 객체를 반환할 것입니다. 이것은 ref에 의존하는 컴포넌트를 테스트할 때 유용합니다.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // 모의 focus 함수 생성
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
