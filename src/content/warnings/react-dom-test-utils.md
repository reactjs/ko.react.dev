---
title: react-dom/test-utils 지원 중단 경고
---

## ReactDOMTestUtils.act() 경고 {/*reactdomtestutilsact-warning*/}

`react-dom/test-utils`의 `act`는 더 이상 사용되지 않습니다. 대신 `react`의 `act`를 사용하세요.

변경 전:

```js
import {act} from 'react-dom/test-utils';
```

변경 후:

```js
import {act} from 'react';
```

## 나머지 ReactDOMTestUtils API {/*rest-of-reactdomtestutils-apis*/}

`act`를 제외한 모든 API는 제거되었습니다.

React 팀은 안정적으로 지원되는 최신 테스트 환경을 위해 테스트를 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)로 마이그레이션하는 것을 권장합니다.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument`는 `@testing-library/react`의 `render`로 대체할 수 있습니다.

변경 전:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

변경 후:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate`는 `@testing-library/react`의 `fireEvent`로 대체할 수 있습니다.

변경 전:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

변경 후:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

`fireEvent`는 이벤트 핸들러를 단순히 호출하는 것이 아니라 엘리먼트에 실제 이벤트를 디스패치한다는 점에 주의하세요.

### 제거된 모든 API 목록 {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
