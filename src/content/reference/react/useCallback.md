---
title: useCallback
---

<Intro>

`useCallback`은 리렌더링 간에 함수 정의를 캐싱해 주는 React Hook입니다.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

리렌더링 간에 함수 정의를 캐싱하려면 컴포넌트의 최상단에서 `useCallback`을 호출하세요.

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[아래에서 더 많은 예시를 확인해보세요.](#usage)

#### 매개변수 {/*parameters*/}

* `fn`: 캐싱할 함숫값입니다. 이 함수는 어떤 인자나 반환값도 가질 수 있습니다. React는 첫 렌더링에서 이 함수를 반환합니다. (호출하는 것이 아닙니다!) 다음 렌더링에서 `dependencies` 값이 이전과 같다면 React는 같은 함수를 다시 반환합니다. 반대로 `dependencies` 값이 변경되었다면 이번 렌더링에서 전달한 함수를 반환하고 나중에 재사용할 수 있도록 이를 저장합니다. React는 함수를 호출하지 않습니다. 이 함수는 호출 여부와 호출 시점을 개발자가 결정할 수 있도록 반환됩니다.

* `dependencies`: `fn` 내에서 참조되는 모든 반응형 값의 목록입니다. 반응형 값은 props와 state, 그리고 컴포넌트 안에서 직접 선언된 모든 변수와 함수를 포함합니다. 린터가 [React를 위한 설정](/learn/editor-setup#linting)으로 구성되어 있다면 모든 반응형 값이 의존성으로 올바르게 명시되어 있는지 검증합니다. 의존성 목록은 항목 수가 일정해야 하며 `[dep1, dep2, dep3]`처럼 인라인으로 작성해야 합니다. React는 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교 알고리즘을 이용해 각 의존성을 이전 값과 비교합니다.

#### 반환값 {/*returns*/}

최초 렌더링에서는 `useCallback`은 전달한 `fn`함수를 그대로 반환합니다.

후속 렌더링에서는 이전 렌더링에서 이미 저장해 두었던 `fn`함수를 반환하거나 (의존성이 변하지 않았을 때), 현재 렌더링 중에 전달한 `fn`함수를 그대로 반환합니다.
#### 주의사항 {/*caveats*/}

* `useCallback`은 Hook이므로, **컴포넌트의 최상위 레벨** 또는 커스텀 Hook에서만 호출할 수 있습니다. 반복문이나 조건문 내에서 호출할 수 없습니다. 이 작업이 필요하다면 새로운 컴포넌트로 분리해서 state를 새 컴포넌로 옮기세요.
* React는 **특별한 이유가 없는 한 캐시 된 함수를 삭제하지 않습니다.** 예를 들어 개발 환경에서는 컴포넌트 파일을 편집할 때 React가 캐시를 삭제합니다. 개발 환경과 프로덕션 환경 모두에서, 초기 마운트 중에 컴포넌트가 일시 중단되면 React는 캐시를 삭제합니다. 앞으로 React는 캐시 삭제를 활용하는 더 많은 기능을 추가할 수 있습니다. 예를 들어, React에 가상화된 목록에 대한 빌트인 지원이 추가한다면, 가상화된 테이블 뷰포트에서 스크롤 밖의 항목에 대해 캐시를 삭제하는것이 적절할 것 입니다. 이는 `useCallback`을 성능 최적화 방법으로 의존하는 경우에 개발자의 예상과 일치해야 합니다. 그렇지 않다면 [state 변수](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) 나 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)가 더 적절할 수 있습니다.
---

## 용법 {/*usage*/}

### 컴포넌트의 리렌더링 건너뛰기 {/*skipping-re-rendering-of-components*/}

렌더링 성능을 최적화할 때 자식 컴포넌트에 넘기는 함수를 캐싱할 필요가 있습니다. 먼저 이 작업을 수행하는 방법에 대한 구문을 살펴본 다음 어떤 경우에 유용한지 알아보겠습니다.

컴포넌트의 리렌더링 간에 함수를 캐싱하려면 함수 정의를 `useCallback` Hook으로 감싸세요.

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback`에게 두 가지를 전달해야 합니다

1. 리렌더링 간에 캐싱할 함수 정의
2. 함수에서 사용되는 컴포넌트 내부의 모든 값을 포함하고 있는 <CodeStep step={2}>의존성 목록</CodeStep>

최초 렌더링에서 `useCallback`으로부터 <CodeStep step={3}>반환되는 함수</CodeStep>는 호출시에 전달할 함수입니다.

이어지는 렌더링에서 React는 <CodeStep step={2}>의존성</CodeStep>을 이전 렌더링에서 전달한 의존성과 비교합니다. 의존성 중 하나라도 변한 값이 없다면([`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 비교), `useCallback`은 전과 똑같은 함수를 반환합니다. 그렇지 않으면 `useCallback`은 *이번* 렌더링에서 전달한 함수를 반환합니다.

다시 말하면, `useCallback`은 의존성이 변하기 전까지 리렌더링 간에 함수를 캐싱합니다.

**이 기능이 언제 유용한지 예시를 통해 살펴보겠습니다.**

`handleSubmit` 함수를 `ProductPage`에서 `ShippingForm` 컴포넌트로 전달한다고 가정해 봅시다.

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme` prop을 토글 하면 앱이 잠시 멈춘다는 것을 알게 되었는데, JSX에서 `<ShippingForm />`을 제거하면 앱이 빨라진 것처럼 느껴집니다. 이것은 `<ShippingForm />` 컴포넌트의 최적화를 시도해 볼 가치가 있다는 것을 나타냅니다.

**기본적으로, 컴포넌트가 리렌더링할 때 React는 이것의 모든 자식을 재귀적으로 재랜더링합니다.** 이것이 `ProductPage`가 다른 `theme` 값으로 리렌더링 할 때, `ShippingForm` 컴포넌트 **또한** 리렌더링 하는 이유입니다. 이 것은 리렌더링에 많은 계산을 요구하지 않는 컴포넌트에서는 괜찮습니다. 하지만 리렌더링이 느린 것을 확인한 경우, `ShippingForm`을 [`memo`](/reference/react/memo)로 감싸면 마지막 렌더링과 동일한 props일 때 리렌더링을 건너뛰도록 할 수 있습니다.

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**이렇게 변경한 `ShippingForm`은 모든 props가 마지막 렌더링과 *같다면* 리렌더링을 건너뜁니다.** 여기가 함수 캐싱이 중요해지는 순간입니다! `useCallback` 없이 `handleSubmit`을 정의했다고 가정해 봅시다.

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // theme이 바뀔때마다 다른 함수가 될 것입니다...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... 그래서 ShippingForm의 props는 같은 값이 아니므로 매번 리렌더링 할 것입니다.*/}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**자바스크립트에서 `function () {}` 나 `() => {}`은 항상 _다른_ 함수를 생성합니다.** 이것은 `{}` 객체 리터럴이 항상 새로운 객체를 생성하는 방식과 유사합니다. 보통의 경우에는 문제가 되지 않지만, 여기서는 `ShippingForm` props는 절대 같아질 수 없고 [`memo`](/reference/react/memo) 최적화는 동작하지 않을 것이라는 걸 의미합니다. 여기서 `useCallback`이 유용하게 사용됩니다.

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // React에게 리렌더링 간에 함수를 캐싱하도록 요청합니다...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...이 의존성이 변경되지 않는 한...

  return (
    <div className={theme}>
      {/* ...ShippingForm은 같은 props를 받게 되고 리렌더링을 건너뛸 수 있습니다.*/}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**`handleSubmit`을 `useCallback`으로 감쌈으로써 리렌더링 간에 이것이 (의존성이 변경되기 전까지는) 같은 함수라는 것을 보장합니다.** 특별한 이유가 없다면 함수를 꼭 `useCallback`으로 감쌀 필요는 없습니다. 이 예시에서의 이유는 ['memo'](/reference/react/memo)로 감싼 컴포넌트에 전달하기 때문에 해당 함수가 리렌더링을 건너뛸 수 있기 때문입니다. `useCallback`이 필요한 다른 이유는 이 페이지의 뒷부분에서 설명하겠습니다.

<Note>

**`useCallback`은 성능 최적화를 위한 용도로만 사용해야 합니다.** 만약 코드가 `useCallback` 없이 작동하지 않는다면 먼저 근본적인 문제를 찾아 해결해야 합니다. 그다음에 `useCallback`을 다시 추가할 수 있습니다. 

</Note>

<DeepDive>

#### useCallback과 useMemo는 어떤 연관이 있나요? {/*how-is-usecallback-related-to-usememo*/}

[`useMemo`](/reference/react/useMemo)가 `useCallback`과 함께 쓰이는 것을 자주 봤을 것입니다. 두 hook은 모두 자식 컴포넌트를 최적화할 때 유용합니다. 무언가를 전달할 때 [memoization](https://ko.wikipedia.org/wiki/%EB%A9%94%EB%AA%A8%EC%9D%B4%EC%A0%9C%EC%9D%B4%EC%85%98)(다른 말로는 캐싱)을 할 수 있도록 해줍니다.

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // 함수를 호출하고 그 결과를 캐싱합니다.
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // 함수 자체를 캐싱합니다.
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

차이점은 *무엇을* 캐싱하는지 입니다.

* **[`useMemo`](/reference/react/useMemo) 는 호출한 함수의 결과값을 캐싱합니다.** 이 예시에서는 `computeRequirements(product)` 함수 호출 결과를 캐싱해서 `product`가 변경되지 않는 한 이 결과값이 변경되지 않도록 합니다. 이것은 불필요하게 `ShippingForm`을 리렌더링하지 않고 `requirements` 객체를 넘겨줄 수 있도록 해줍니다. 필요할 때 React는 렌더링 중에 넘겨주었던 함수를 호출하여 결과를 계산합니다.
* **`useCallback`은 *함수 자체*를 캐싱합니다.** `useMemo`와 달리, 전달한 함수를 호출하지 않습니다. 그 대신, 전달한 함수를 캐싱해서 `productId`나 `referrer`이 변하지 않으면 `handleSubmit` 자체가 변하지 않도록 합니다. 이것은 불필요하게 `ShippingForm`을 리렌더링하지 않고 `handleSubmit` 함수를 전달할 수 있도록 해줍니다. 함수의 코드는 사용자가 폼을 제출하기 전까지 실행되지 않을 것입니다.

이미 [`useMemo`](/reference/react/useMemo)에 익숙하다면 `useCallback`을 다음과 같이 생각하는 것이 도움이 될 수 있습니다.

```js
// (React 내부의) 간단한 구현
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[`useMemo`와 `useCallback`의 차이점에 대해 더 알아보세요.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### 항상 useCallback을 사용해야 할까요? {/*should-you-add-usecallback-everywhere*/}

이 사이트처럼 대부분의 상호작용이 (페이지 전체나 전체 부문을 교체하는 것처럼) 굵직한 경우, 보통 memoization이 필요하지 않습니다. 반면에 앱이 (도형을 이동하는 것과 같이) 미세한 상호작용을 하는 그림 편집기 같은 경우, memoization이 매우 유용할 수 있습니다.

`useCallback`으로 함수를 캐싱하는 것은 몇 가지 경우에만 가치 있습니다.

- [`memo`](/reference/react/memo)로 감싸진 컴포넌트에 prop으로 넘깁니다. 이 값이 변하지 않으면 리렌더링을 건너뛰고 싶습니다. memoization은 의존성이 변했을 때만 컴포넌트가 리렌더링하도록 합니다. 
- 넘긴 함수가 나중에 어떤 Hook의 의존성으로 사용됩니다. 예를 들어, `useCallback`으로 감싸진 다른 함수가 이 함수에 의존하거나, [`useEffect`](/reference/react/useEffect)에서 이 함수에 의존합니다.

다른 경우에서 `useCallback`으로 함수를 감싸는 것은 아무런 이익이 없습니다. 또한 이렇게 하는 것이 큰 불이익을 가져오지도 않으므로  일부 팀은 개별적인 경우를 따로 생각하지 않고, 가능한 한 많이 memoization하는 방식을 택합니다. 단점은 코드의 가독성이 떨어지는 것입니다. 또한, 모든 memoization이 효과적인 것은 아닙니다. "항상 새로운" 하나의 값이 있다면 전체 컴포넌트의 memoization을 깨기에 충분합니다.

`useCallback`이 함수의 *생성*을 막지 않는다는 점을 주의하세요. 항상 함수를 생성하지만 (이건 괜찮습니다!), 그러나 React는 변경이 없는 경우에는 무시하고 캐시된 함수를 반환합니다

**실제로 몇 가지 원칙을 따르면 많은 memoization을 불필요하게 만들 수 있습니다.**

1. 컴포넌트가 다른 컴포넌트를 시각적으로 감싸고 있다면 [JSX를 자식으로 받게](/learn/passing-props-to-a-component#passing-jsx-as-children) 하세요. 감싸는 컴포넌트가 자신의 상태를 업데이트하면, React는 자식들은 리렌더링할 필요가 없다는 것을 알게 됩니다.
1. 가능한 한 로컬 상태를 선호하고, [컴포넌트 간 상태 공유](/learn/sharing-state-between-components)를 필요 이상으로 하지 마세요. 폼이나 항목이 호버되었는지와 같은 일시적인 상태를 트리의 상단이나 전역 상태 라이브러리에 유지하지 마세요.
1. [렌더링 로직을 순수하게 유지](/learn/keeping-components-pure)하세요. 컴포넌트를 리렌더링하는 것이 문제를 일으키거나 눈에 띄는 시각적인 형체를 생성한다면, 그것은 컴포넌트의 버그입니다! memoization을 추가하는 대신 버그를 해결하세요.
1. [상태를 업데이트하는 불필요한 Effects](/learn/you-might-not-need-an-effect)를 피하세요. React 앱에서 대부분의 성능 문제는 Effects로부터 발생한 연속된 업데이트가 컴포넌트를 계속해서 렌더링하는 것이 원인입니다.
1. [Effects에서 불필요한 의존성을 제거](/learn/removing-effect-dependencies)하세요. 예를 들어, memoization 대신 객체나 함수를 Effect 안이나 컴포넌트 외부로 이동시키는 것이 더 간단한 경우가 많습니다.

만약 특정 상호작용이 여전히 느리게 느껴진다면, [React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용하여, 어떤 컴포넌트가 memoization을 가장 필요로 하는지 살펴보고, 필요한 곳에 memoization을 추가하세요. 이런 원칙들은 컴포넌트를 더 쉽게 디버깅하고 이해할 수 있도록 해주기 때문에 어떤 경우라도 따르는 것이 좋습니다. 장기적으로 이러한 문제를 해결하기 위해 우리는 [memoization을 자동화하는 기술](https://www.youtube.com/watch?v=lGEMwh32soc)을 연구하고 있습니다.

</DeepDive>

<Recipes titleText="useCallback과 함수를 직접 선언하는 것의 차이점" titleId="examples-rerendering">

#### `useCallback`과 `memo`로 리렌더링 건너뛰기 {/*skipping-re-rendering-with-usecallback-and-memo*/}

이 예시에서 `ShippingForm` 컴포넌트는 **인위적으로 느리게 만들었기 때문에** 렌더링하는 React 컴포넌트가 실제로 느릴 때 어떤 일이 일어나는 지 볼 수 있습니다. 카운터를 증가시키고 테마를 토글 해보세요.

카운터를 증가시키면 느려진 `ShippingForm`이 리렌더링하기 때문에 느리다고 느껴집니다. 이는 예상된 동작입니다. 카운터가 변경되었으므로 사용자의 새로운 선택을 화면에 반영해야 하기 때문입니다.

다음으로 테마를 토글 해보세요. **`useCallback`을 [`memo`](/reference/react/memo)와 함께 사용한 덕분에, 인위적인 지연에도 불구하고 빠릅니다!** `ShippingForm`은 `handleSubmit` 함수가 변하지 않았기 때문에 리렌더링을 건너뛰었습니다. `productId` 와 `referrer` (`useCallback`의 의존성) 모두 마지막 렌더링으로부터 변하지 않았기 때문에 `handleSubmit` 함수도 변하지 않았습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 요청을 보낸다고 생각하세요...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 매우 느린 코드를 재현하기 위해 500ms동안 아무것도 하지 않습니다
  }

  function handleSubmit(e) {
    e.preventDefault(); 
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 컴포넌트를 항상 리렌더링하기 {/*always-re-rendering-a-component*/}

이 예시에서 `ShippingForm` 컴포넌트 또한 **인위적으로 느리게 만들었기 때문에** 렌더링하는 React 컴포넌트가 실제로 느릴 때 어떤 일이 일어나는 지 볼 수 있습니다. 카운터를 증가시키고 테마를 토글 해보세요.

이전 예시와 다르게 지금은 테마를 토글 하는 것도 느립니다! **이 버전에서는 `useCallback`을 호출하고 있지 않기** 때문에 `handleSubmit`은 항상 새로운 함수이고, 느려진 `ShippingForm` 컴포넌트는 리렌더링을 건너뛸 수 없습니다. 

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 요청을 보낸다고 생각하세요...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 매우 느린 코드를 재현하기 위해 500ms동안 아무것도 하지 않습니다
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


하지만 여기 같지만 **인위적인 지연이 제거된** 코드가 있습니다. `useCallback`이 없을 때 차이가 크게 느껴지시나요?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 요청을 보낸다고 생각하세요...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


많은 경우에 memoization이 없어도 코드는 잘 동작합니다. 상호작용이 충분히 빠르다면 memoization을 사용하지 않아도 됩니다.

프로덕션 모드로 React를 실행시키고, [React Developer Tools](/learn/react-developer-tools)를 비활성화하고, 앱 사용자와 유사한 기기를 사용해서 앱을 실제로 느리게 만드는 원인을 실감해야 한다는 것을 명심하세요.

<Solution />

</Recipes>

---

### Memoized 콜백에서 상태 업데이트하기 {/*updating-state-from-a-memoized-callback*/}

때때로 memoized 콜백에서 이전 상태를 기반으로 상태를 업데이트해야 할 때가 있습니다.

`handleAddTodo` 함수는 `todos`로부터 다음 할 일을 계산하기 때문에 이를 의존성으로 명시했습니다. 

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

보통은 memoized 함수가 가능한 한 적은 의존성을 갖는 것이 좋습니다. 다음 상태를 계산하기 위해 어떤 상태를 읽는 경우, [업데이트 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 대신 넘겨줌으로써 의존성을 제거할 수 있습니다.

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ todos 의존성은 필요하지 않습니다.
  // ...
```

여기서 `todos`를 의존성으로 만들고 안에서 값을 읽는 대신, React에 *어떻게* 상태를 업데이트할지에 대한 지침을 넘겨줍니다. [업데이트 함수에 대해 더 알아보세요.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Effect가 너무 자주 실행되는 것을 방지하기 {/*preventing-an-effect-from-firing-too-often*/}

가끔 [Effect 안에서 함수를 호출해야 할 수도 있습니다.](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

이것은 문제를 발생시킵니다. [모든 반응형 값은 Effect의 의존성으로 선언되어야 합니다.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) 하지만 `createOptions`를 의존성으로 선언하면 Effect가 채팅방과 계속 재연결되는 문제가 발생합니다.


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 문제점: 이 의존성은 매 렌더링마다 변경됩니다.
  // ...
```

이를 해결하기 위해, Effect에서 호출하려는 함수를 `useCallback`으로 감쌀 수 있습니다.

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomId가 변경될 때만 변경됩니다.

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ createOptions가 변경될 때만 변경됩니다.
  // ...
```

이것은 리렌더링 간에 `roomId`가 같다면 `createOptions` 함수는 같다는 것을 보장합니다. **하지만, 함수 의존성을 제거하는 것이 더 좋습니다.** 함수를 Effect *안으로* 이동시키세요.

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallback이나 함수 의존성이 필요하지 않습니다.
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId가 변경될 때만 변경됩니다.
  // ...
```

이제 코드는 더 간단해졌고 `useCallback`은 필요하지 않습니다. [Effect의 의존성 제거에 대해 더 알아보세요.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### 커스텀 Hook 최적화하기 {/*optimizing-a-custom-hook*/}

[커스텀 Hook](/learn/reusing-logic-with-custom-hooks)을 작성하는 경우, 반환하는 모든 함수를 `useCallback`으로 감싸는 것이 좋습니다.

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

이렇게 하면 Hook을 사용하는 컴포넌트가 필요할 때 가지고 있는 코드를 최적화할 수 있습니다.

---

## 문제 해결 {/*troubleshooting*/}

### 컴포넌트가 렌더링 될 때마다 `useCallback`이 다른 함수를 반환합니다. {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

두 번째 인수로 의존성 배열을 지정했는지 확인하세요!

의존성 배열을 까먹으면 `useCallback`은 매번 새로운 함수를 반환합니다.

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 매번 새로운 함수를 반환합니다: 의존성 배열 없음
  // ...
```

다음은 두 번째 인수로 의존성 배열을 넘겨주도록 수정한 코드입니다.

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ 불필요하게 새로운 함수를 반환하지 않습니다.
  // ...
```

이것이 도움이 되지 않는다면 의존성 중 적어도 하나가 이전 렌더링과 다른 것이 문제입니다. 의존성을 콘솔에 직접 기록하여 이 문제를 디버깅할 수 있습니다.

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

그런 다음 콘솔에서 서로 다른 렌더링의 배열을 마우스 오른쪽 클릭 후 "전역 변수로 저장"을 선택할 수 있습니다. 첫 번째 것이 `temp1`, 두 번째 것이 `temp2`로 저장됐다면, 브라우저 콘솔을 통해 각 의존성이 두 배열에서 같은지 확인할 수 있습니다.

```js
Object.is(temp1[0], temp2[0]); // 첫 번째 의존성이 배열 간에 동일한가요?
Object.is(temp1[1], temp2[1]); // 두 번째 의존성이 배열 간에 동일한가요?
Object.is(temp1[2], temp2[2]); // ... 나머지 모든 의존성도 확인합니다  ...
```

어떤 의존성이 memoization을 깨고 있는지 찾았다면 이를 제거하거나 [memoization](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)하는 방법을 찾으세요.

---

### 반복문에서 각 항목마다 `useCallback`을 호출하고 싶지만, 이것은 허용되지 않습니다. {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` 컴포넌트가 [`memo`](/reference/react/memo)로 감싸져 있다고 생각해 봅시다. `ReportList` 컴포넌트가 렌더링 될 때마다, 모든 `Chart` 항목이 리렌더링 하는 것을 막고 싶습니다. 하지만 반복문에서 `useCallback`을 호출할 수 없습니다.

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 이렇게 반복문 안에서 useCallback을 호출할 수 없습니다.
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

대신 개별 항목을 컴포넌트로 분리하고, 거기에 `useCallback`을 넣으세요.

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ useCallback을 최상위 레벨에서 호출하세요
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

대안으로 마지막 스니펫에서 `useCallback`을 제거하고 대신 `Report` 자체를 [`memo`](/reference/react/memo)로 감싸도 됩니다. `item` prop이 변경되지 않으면 `Report`는 리렌더링하지 않기 때문에 `Chart`도 리렌더링을 건너뜁니다.

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
