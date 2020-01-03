---
id: testing-recipes
title: 테스팅 방안
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

리액트 컴포넌트를 위한 공통 테스트 패턴 입니다.

> 주의:
>
> 이 페이지는 테스트 러너로 [Jest](https://jestjs.io/)를 사용하는 사람을 대상으로 쓰여 있습니다. 만약 다른 테스트 러너를 사용한다면, 아마도 API가 다를 수 있지만, 전체적인 형태는 거의 비슷할 것입니다. 테스트 환경에 대한 셋팅에 대해 더 알고 싶다면 [Testing Environments](/docs/testing-environments.html)를 참고해 주세요.

이 페이지에서는 함수 컴포넌트를 주로 사용할 것입니다. 하지만, 아래 테스트 전략들은 구현 형태에 의존적이지 않으며 클래스 컴포넌트에서도 잘 작동 합니다.

- [설정/해제](#setup--teardown)
- [`act()`](#act)
- [렌더링](#rendering)
- [데이터 가져오기](#data-fetching)
- [mocking 모듈](#mocking-modules)
- [이벤트](#events)
- [타이머](#timers)
- [스냅샷 테스트](#snapshot-testing)
- [다수의 렌더러](#multiple-renderers)
- [뭔가 부족하다면?](#something-missing)

---

### 설정/해제 {#setup--teardown}

테스트마다 일반적으로 React 트리를 `document`의 DOM 엘리먼트에 렌더링하는데, 이는 DOM 이벤트를 처리 하기 위함 입니다. 테스트가 끝날 때는, 테스트와 관련된 설정 및 값에 대한 정리(clean up)를 하고 `document` 트리에서 마운트 해제를 합니다.

이러한 일을 처리 하는 일반적인 방법은 `beforeEach`와 `afterEach`를 사용하는 것입니다. 위 두 함수는 항상 실행되며 테스트의 영향으로 부터 자신 스스로 격리를 합니다.

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // DOM 엘리먼트를 렌더링 대상으로 설정
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 종료시 정리
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

다른 패턴을 사용할 수도 있지만, 테스트가 실패하더라도 정리(clean up)를 해야 한다는 것을 기억해야 합니다. 테스트는 취약점이 될 수 있고, 하나의 테스트는 다른 테스트의 동작 방식을 변형시킬 수 있습니다. 이는 디버깅을 어렵게 만듭니다.

---

### `act()` {#act}

UI 테스트, 렌더링과 같은 작업, 유저 이벤트, 데이터 가져오기는 유저 인터페이스와의 상호작용하는 "구성단위"로 간주 됩니다. 리액트는 'act()'라 불리는 함수를 제공하는데, 이 함수는 "구성단위"와 관련된 모든 업데이트가 단언이 실행되기 전에 처리되고 DOM에 적용되도록 돕습니다.

```js
act(() => {
  // 렌더링할 컴포넌트
});
// 단언들을 추가
```

위의 함수를 통해 프로그램을 사용할 때 실제 사용자가 경험할 수 있는 수준에 근접한 테스트를 실행 할 수 있습니다. 이 예제의 나머지 부분에서는 `act()`를 사용하여 이를 보장합니다.

`act()`를 직접 사용하다 보면, 코드가 길어질 때가 있습니다. 이를 간결하게 하고 싶을 때는 `act()`로 감싸여 있는 [React Testing Library] (https://testing-library.com/react)와 같은 라이브러리를 사용할 수 있습니다.

> 주의:
>
> `act`라는 이름은 [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) 패턴에서 유래되었습니다.

---

### 렌더링 {#rendering}

일반적으로 주어진 props에 따라 컴포넌트 렌더링이 제대로 되었는지 테스트하고 싶을 때가 있습니다. 이때, prop을 기반으로 메시지를 렌더링하는 간단한 컴포넌트를 아래와 같이 고려해 보세요. 

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

위 컴포넌트의 테스트를 아래와 같이 작성할 수 있습니다.

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // 렌터링 타켓으로 DOM 엘리먼트를 셋팅 합니다.
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리(clean up) 합니다.
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### 데이터 가져오기 {#data-fetching}

모든 테스트에서 리얼 API를 호출하는 대신에 mock 호출로 더미 데이터를 가져올 수 있습니다. "가짜" 데이터를 사용하여 mocking 데이터를 가져오는 것은 백 엔드를 사용할 수 없기 때문에 비정상적인 테스트를 방지하고 더 빠르게 실행할 수 있습니다. 주의: 애플리케이션의 모든 기능이 잘 작동하는지 테스트 할 수 있는 ["end-to-end"](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) 프레임 워크를 사용하여 테스트의 일부분을 테스트 할 수 있습니다.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

위 컴포넌트의 테스트를 아래와 같이 작성할 수 있습니다.

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // 렌터링 타켓으로 DOM 엘리먼트를 셋팅 합니다.
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리(clean up) 합니다.
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // resolved promises를 적용하려면 `act()`의 비동기 버전을 사용하세요.
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // 테스트가 완전히 격리되도록 mock을 제거하세요.
  global.fetch.mockRestore();
});
```

---

### Mocking 모듈 {#mocking-modules}

일부 모듈은 테스트 환경에서 제대로 작동하지 않거나 테스트 자체에 필수적이지 않을 수 있습니다. 이러한 모듈을 더미 모듈로 대체하는 방식으로 mocking 하여 코드에 대한 테스트를 더욱 쉽게 작성할 수 있습니다.

서드파티인 `GoogleMap` 컴포넌트를 내장하는 `Contact` 컴포넌트를 고려해 보세요.

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

테스트에서 컴포넌트를 로드하지 않는다면, 더미 컴포넌트에 대한 종속성을 mock 처리하고 테스트를 실행할 수 있습니다.

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // 렌터링 타켓으로 DOM 엘리먼트를 셋팅 합니다.
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리(clean up) 합니다.
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### 이벤트 {#events}

DOM 요소에 실제 DOM 이벤트를 전달한 다음 결과에 단언 처리를 하는 것이 좋습니다. `Toggle` 구성 요소를 고려해 보세요.

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

위 컴포넌트의 테스트를 아래와 같이 작성할 수 있습니다.

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // 렌터링 타켓으로 DOM 엘리먼트를 셋팅 합니다.
  container = document.createElement("div");
  // 이벤트가 제대로 작동하기 위해 container는 반드시 document에 적용되어야 합니다.
  document.body.appendChild(container);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리(clean up) 합니다.
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // 버튼 엘리먼트에 클릭 이벤트를 트리거 하세요.
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

다른 DOM 이벤트와 속성들은 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)에 기술되어 있습니다. 리액트는 자동으로 이벤트를 document에 위임하기 때문에 리액트 리스너에 도달하기 위해 생성하는 이벤트마다 `{bubbles : true}` 를 전달해야 합니다.

> 주의:
>
> 리액트 테스팅 라이브러리는 이벤트를 발생시키기 위한 [더욱 간결한 함수](https://testing-library.com/docs/dom-testing-library/api-events)를 제공합니다. 

---

### 타이머 {#timers}

코드는 `setTimeout` 과 같은 타이머 기반 함수를 사용하여 향후 더 많은 작업을 예약 할 수 있습니다. 이 예제에서 다중 선택 패널은 선택을 기다렸다가 5초 이내에 선택하지 않으면 시간이 초과합니다.

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

[Jest's timer mocks](https://jestjs.io/docs/en/timer-mocks)를 활용하고 컴포넌트의 다양한 상태를 테스트하여 테스트 코드를 작성할 수 있습니다.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // 렌터링 타켓으로 DOM 엘리먼트를 셋팅 합니다.
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리(clean up) 합니다.
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // 시간을 100ms만큼 앞당긴다.
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // 그리고 5초만큼 앞당긴다.
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // 마운트를 해제한다.
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

일부 테스트에서만 가짜 타이머를 사용할 수 있습니다. 위에서 우리는`jest.useFakeTimers()`를 호출함으로써 그것들을 가능하게 했습니다. 그들이 제공하는 주요 장점은 테스트가 실제로 5초 동안 실행될 필요가 없으며 테스트를 위해 컴포넌트 코드를 더 복잡하게 만들 필요가 없다는 것입니다.

---

### 스냅샷 테스트 {#snapshot-testing}

Jest와 같은 프레임워크를 사용하면 [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing)을 사용하여 데이터의 "스냅샷" 을 저장할 수 있습니다. 이를 통해 렌더링 된 컴포넌트 출력을 "저장" 하고 변경 사항을 스냅샷 변경 사항으로 명시적으로 커밋해야합니다.

이 예제에서는 인라인 스냅샷으로 저장하기 전에 컴포넌트를 렌더링하고 렌더링 된 HTML을 [`pretty`](https://www.npmjs.com/package/pretty) 패키지를 사용해서 포맷을 변환합니다.

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // 렌터링 타켓으로 DOM 엘리먼트를 셋팅 합니다.
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리(clean up) 합니다.
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... jest에 의해 자동으로 채워집니다 ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... jest에 의해 자동으로 채워집니다 ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... jest에 의해 자동으로 채워집니다 ... */
});
```

일반적으로 스냅샷을 사용하는 것보다 더 구체적인 단언을 만드는 것이 좋습니다. 이러한 종류의 테스트에는 구현 세부 정보가 포함되어있어 쉽게 중단 할 수 있으며 팀은 스냅샷 손상에 민감하지 않을 수 있습니다. 선택적으로 [일부 자식 컴포넌트를 mocking](#mocking-modules)을 사용하면 스냅샷의 크기를 줄이고 코드 리뷰를 위한 가독성을 유지할 수 있습니다.

---

### 다수의 렌더러 {#multiple-renderers}

드문 경우이지만 여러 렌더러를 사용하는 컴포넌트에서 테스트를 실행할 때가 있을 수 있습니다. 예를 들어, 자식 컴포넌트 내에서 `ReactDOM.render` 를 내부적으로 사용하여 일부 콘텐츠를 렌더링하는 `react-test-renderer` 가 있는 컴포넌트에서 스냅샷 테스트를 실행할 수 있습니다. 이 시나리오에서는 렌더러에 해당하는 `act()`로 업데이트를 래핑 할 수 있습니다.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### 뭔가 부족하다면? {#something-missing}

만약 일반적인 시나리오가 다루어지지 않은 경우 [issue tracker](https://github.com/reactjs/reactjs.org/issues) 에 알려주십시오.
