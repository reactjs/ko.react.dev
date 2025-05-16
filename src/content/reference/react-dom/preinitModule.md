---
title: preinitModule
---

<Note>

[React 기반 프레임워크](/learn/start-a-new-react-project)에서는 리소스 로딩을 자동으로 처리해주는 경우가 많기 때문에 이 API를 직접 호출할 필요가 없을 수도 있습니다. 자세한 내용은 사용하는 프레임워크의 문서를 참고하세요.

</Note>

<Intro>

`preinitModule`은 ESM 모듈을 미리 가져오고 평가(evaluate)할 수 있게 해줍니다.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

ESM 모듈을 사전에 preinit하려면, `react-dom` 패키지에서 `preinitModule` 함수를 호출하세요.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[아래 예제를 더 참고하세요.](#usage)

`preinitModule` 함수는 브라우저에 해당 모듈을 다운로드하고 실행할 수 있다는 힌트를 제공하므로, 로딩 시간을 단축하는 데 도움이 됩니다. `preinit`된 모듈은 다운로드가 완료되는 즉시 실행됩니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열입니다. 다운로드하고 실행할 모듈의 URL입니다.
* `options`: 객체입니다. 다음 속성을 포함합니다:
  *  `as`: 필수 문자열입니다. 반드시 `'script'`여야 합니다.
  *  `crossOrigin`: 문자열입니다. 사용할 [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)을 지정합니다. 가능한 값은 `anonymous` 또는 `use-credentials`입니다.
  *  `integrity`: 문자열입니다. 모듈의 암호학적 해시로, [무결성을 검증](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)하는 데 사용됩니다.
  *  `nonce`: 문자열입니다. 엄격한 Content Security Policy를 사용할 때 모듈을 허용하기 위한 암호학적 [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)입니다.

#### 반환값 {/*returns*/}

`preinitModule`은 값을 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* 동일한 `href`로 `preinitModule`을 여러 번 호출해도, 한 번 호출한 것과 동일한 효과만 발생합니다.
* 브라우저에서는 컴포넌트를 렌더링할 때, 이펙트 안에서, 이벤트 핸들러 등 어떤 상황에서도 `preinitModule`을 호출할 수 있습니다.
* 서버 측 렌더링이나 Server Components를 렌더링할 때는, `preinitModule`는 컴포넌트를 렌더링하는 중이거나 렌더링에서 파생된 비동기 컨텍스트 내에서 호출한 경우에만 효과가 있습니다. 그 외의 호출은 무시됩니다.


---

## 사용법 {/*usage*/}

### 렌더링 중 사전 로딩하기 {/*preloading-when-rendering*/}

특정 모듈이 현재 컴포넌트나 자식 컴포넌트에서 사용될 것임을 알고 있고, 해당 모듈이 다운로드 즉시 평가되어 효과를 발휘해도 괜찮다면, 컴포넌트를 렌더링할 때 `preinitModule`을 호출하세요.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

모듈을 다운로드하되 즉시 실행하지 않으려면 [`preloadModule`](/reference/react-dom/preloadModule)을 사용하세요. ESM 모듈이 아닌 스크립트를 사전 초기화하려면 [`preinit`](/reference/react-dom/preinit)을 사용하세요.

### 이벤트 핸들러에서 사전 로딩하기 {/*preloading-in-an-event-handler*/}

이벤트 핸들러에서 모듈이 필요해질 페이지나 상태로 전환하기 전에 `preinitModule`을 호출하세요. 이렇게 하면 새로운 페이지나 상태를 렌더링할 때보다 더 일찍 로딩을 시작할 수 있습니다.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
