---
id: shallow-renderer
title: 얕은 렌더러
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**불러오기**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // npm에서 ES5를 사용하는 경우
```

## 개요 {#overview}

React를 위한 유닛 테스트를 작성할 때 얕은 렌더링이 유용할 수 있습니다. 얕은 렌더링은 컴포넌트를 "한 단계 깊이"로 렌더링할 수 있으며 인스턴스화 또는 렌더링 되지 않는 자식 컴포넌트의 동작에 대해 걱정 없이 렌더링 메서드가 무엇을 반환하는지에 대해 검증할 수 있습니다. 이 작업은 DOM이 필요하지 않습니다.

예를 들어 다음 컴포넌트가 있는 경우

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

다음과 같이 검증할 수 있습니다.

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

얕은 테스팅은 현재 몇 가지 제한 사항이 있습니다. 다시 말해 refs를 지원하지 않습니다.

> 주의
>
> 우리는 또한 Enzyme의 [Shallow Rendering API](https://airbnb.io/enzyme/docs/api/shallow.html)를 확인해 볼 것을 권장합니다. 같은 기능에 대해 더 높은 수준의 API를 제공합니다.

## 참조 {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

shallowRenderer는 테스트 중인 컴포넌트를 렌더링하는 "장소(place)"로 생각할 수 있으며 이것으로부터 컴포넌트의 출력을 추출할 수 있습니다.

<<<<<<< HEAD
`shallowRenderer.render()`는 [`ReactDOM.render()`](/docs/react-dom.html#render)와 비슷하지만 DOM을 요구하지 않으며 오직 한 단계 깊이만을 렌더링합니다. 이것은 컴포넌트의 자식들이 어떻게 구현되었는지 신경 쓰지 않고 독립적으로 테스트할 수 있음을 의미합니다.
=======
`shallowRenderer.render()` is similar to [`root.render()`](/docs/react-dom-client.html#createroot) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

`shallowRenderer.render()`가 호출된 후 `shallowRenderer.getRenderOutput()`을 사용하여 얕게 렌더링 된 출력을 얻을 수 있습니다.

그러면 출력에 대해 검증을 시작할 수 있습니다.
