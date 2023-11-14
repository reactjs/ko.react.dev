---
title: "'use server'"
canary: true
---

<Canary>

`'use server'`는 [React 서버 컴포넌트를 사용](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)하거나 그와 호환되는 라이브러리를 만들 때에만 필요합니다. 

</Canary>


<Intro>

`'use server'`는 클라이언트 측 코드에서 호출할 수 있는 서버 측 함수를 표시합니다.

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `'use server'` {/*use-server*/}

함수가 클라이언트에서 실행될 수 있음을 표시하기 위해, 비동기 함수의 맨 위에 `'use server';`를 추가하세요.

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

이 함수는 클라이언트에 전달될 수 있습니다. 클라이언트에서 호출되면, 직렬화된 인자의 사본을 포함하는 서버로의 네트워크 요청이 생성됩니다. 서버 함수가 값을 반환하면, 그 값은 직렬화되고 클라이언트에 반환됩니다.

또는, 파일의 맨 위에 `'use server';`를 추가하여 그 파일의 모든 export를 클라이언트 컴포넌트 파일을 포함한 어디서든 사용할 수 있는 비동기 서버 함수로 표시할 수 있습니다.

#### 주의사항 {/*caveats*/}

* `'use server'`로 표시된 함수의 매개변수는 완전히 클라이언트가 제어합니다. 보안을 위해, 항상 신뢰할 수 없는 입력으로 취급하여, 인자를 적절하게 검증하고 이스케이프하는지 확인하세요.
* 동일한 파일에서 클리아언트 측과 서버 측 코드가 섞이는 혼란을 피하기 위해, `'use server'`는 서버 측 파일에서만 사용할 수 있습니다. 그 결과로 나온 함수는 props를 통해 클라이언트 컴포넌트에 전달될 수 있습니다.
* 기본 네트워크 호출은 항상 비동기적이기 때문에, `'use server'`는 오직 비동기 함수에서만 사용할 수 있습니다.
* `'use server'`와 같은 directive는 함수나 파일의 맨 위에 있어야 하며, import를 포함한 다른 코드보다 위(directive 위 주석은 괜찮습니다.)에 있어야 합니다. 이는 백틱이 아닌 작은따옴표나 큰따옴표로 작성되어야 합니다. (`'use xyz'` directive 형식은 `useXyz()` Hook 네이밍 컨벤션과 비슷하지만, 유사성은 우연입니다.)

## 사용법 {/*usage*/}

<Wip>
이 섹션은 작업 중입니다.

이 API는 React 서버 컴포넌트를 지원하는 모든 프레임워크에서 사용할 수 있습니다. 그들의 추가 문서를 찾아보세요.
* [Next.js 문서](https://nextjs.org/docs/getting-started/react-essentials)
* 추가 예정
</Wip>
