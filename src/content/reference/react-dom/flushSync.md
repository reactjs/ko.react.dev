---
title: flushSync
---

<Pitfall>

`flushSync`를 사용하는 것은 일반적이지 않고 애플리케이션의 성능이 저하될 수 있습니다.

</Pitfall>

<Intro>

`flushSync`는 React에게 제공된 콜백 내부의 모든 업데이트를 동기적으로 처리하도록 강제합니다. DOM이 즉시 업데이트되는 것을 보장합니다.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

`flushSync`를 호출해서 React가 보류 중인 모든 작업을 강제로 처리하고 DOM을 동기적으로 업데이트할 수 있습니다.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

대부분의 경우 `flushSync`를 사용하지 않는 것이 좋습니다. `flushSync`는 최후의 수단으로 사용하세요.

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `callback`: 함수입니다. React는 즉시 콜백을 호출하고 콜백이 포함하는 모든 업데이트를 동기적으로 처리합니다. 또한 보류 중인 업데이트나 effect 또는 effect 내부의 업데이트도 처리할 수 있습니다. `flushSync` 호출로 인해 업데이트가 중단되면 fallback이 다시 표시될 수 있습니다.

#### 반환값 {/*returns*/}

`flushSync`는 `undefined`를 반환합니다.

#### Caveats {/*caveats*/}

* `flushSync`를 사용하면 애플리케이션의 성능이 크게 저하될 수 있습니다. 가급적 사용하지 마세요.
* `flushSync`는 보류 중인 Suspense 바운더리의 `fallback` state를 표시하도록 강제할 수 있습니다.
* `flushSync`는 보류 중인 effect를 실행하고 반환되기 전에 포함된 모든 업데이트를 동기적으로 적용할 수 있습니다.
* `flushSync`는 콜백 내부의 업데이트를 처리할 때 필요한 경우 콜백 외부의 업데이트를 처리할 수 있습니다. 예를 들어 클릭으로 인한 보류 중인 업데이트가 있는 경우 React는 콜백 내부의 업데이트를 처리하기 전에 해당 업데이트를 처리할 수 있습니다.

---

## 사용법 {/*usage*/}

### 써드파티 통합을 위한 flushing 업데이트 {/*flushing-updates-for-third-party-integrations*/}

브라우저 API 또는 UI 라이브러리와 같은 써드파티 코드를 통합할 때 React가 업데이트를 처리하도록 강제하는 과정이 필요할 수 있습니다. `flushSync`를 사용해서 React가 콜백 내부의 모든 <CodeStep step={1}>state updates</CodeStep>를 동기적으로 처리하도록 할 수 있습니다. 

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// By this line, the DOM is updated.
```

이렇게 함으로써 다음 줄의 코드를 실행할 때까지 React가 이미 DOM을 업데이트했음을 보장합니다.

**`flushSync`를 사용하는 것은 일반적이지 않고 자주 사용하면 애플리케이션의 성능이 크게 저하될 수 있습니다.** 애플리케이션이 React API만 사용하고 써드파티 라이브러리와 통합하지 않는다면 `flushSync`는 필요하지 않습니다.

그러나 브라우저 API와 같은 써드파티 코드와 통합할 때는 유용할 수 있습니다.

일부 브라우저 API는 콜백 내부의 결과가 DOM에서 동기적으로 사용될 것으로 예상하므로 콜백이 끝날 때까지 렌더링된 DOM으로 브라우저가 작업할 수 있습니다. 대부분의 경우 React가 이를 자동으로 처리합니다. 그러나 경우에 따라 강제로 동기적 업데이트를 해야할 수 있습니다.

예를 들어 `onbeforeprint` 브라우저 API를 사용하면 프린트 다이얼로그가 열리기 직전에 페이지를 즉시 변경할 수 있습니다. 문서를 더 잘 표시하기 위해 사용자가 정의한 프린트 스타일을 적용하는 데 유용합니다. 아래 예시에서는 `onbeforeprint` 콜백 내부에서 `flushSync`를 사용하여 React state를 DOM으로 즉시 "flush"합니다. 그런 다음 프린트 다이얼로그가 열릴 때까지 `isPrinting`이 "yes"로 표시됩니다.

<Sandpack>

```js App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);
  
  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }
    
    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);
  
  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

`flushSync`를 사용하지 않으면 프린트 다이얼로그는 `isPrinting`을 "no"로 표시합니다. React가 업데이트를 비동기적으로 batch하고 프린트 다이얼로그를 state가 업데이트 되기 전에 표시하기 때문입니다.

<Pitfall>

`flushSync`를 사용하면 애플리케이션의 성능이 크게 저하될 수 있습니다. 보류 중인 Suspense 바운더리가 fallback state를 표시하도록 강제할 수 있습니다.

대부분의 경우 `flushSync`를 사용하지 않을 수 있으므로 최후의 수단으로 사용하세요.

</Pitfall>
