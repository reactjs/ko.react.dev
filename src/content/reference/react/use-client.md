---
title: "'use client'"
canary: true
---

<Canary>
`'use client'` 는 [React 서버 컴포넌트를 사용](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)하거나 그와 호환되는 라이브러리를 만들 때에만 사용합니다.
</Canary>


<Intro>

`'use client'`는 컴포넌트가 클라이언트에서 실행되는 소스 파일을 표시합니다.

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `'use client'` {/*use-client*/}

파일의 맨 위에 `'use client';`를 추가하여 가져온 위치와 관계없이 파일(사용하는 모든 하위 컴포넌트를 포함)이 클라이언트에서 실행됨을 표시합니다. 

```js
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

서버 컴포넌트에서 `'use client'`라고 표시된 파일을 가져오면 [호환할 수 있는 번들러](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)는 import를 서버 전용 코드와 클라이언트 코드 사이의 분리점으로 처리합니다. 모듈 그래프의 이 지점 이하의 컴포넌트는 [`useState`](/reference/react/useState)와 같은 클라이언트 전용 React 기능을 사용할 수 있습니다.

#### 주의사항 {/*caveats*/}

* 클라이언트 전용 React 기능을 사용하는 모든 파일에 `'use client'`를 추가할 필요는 없으며 서버 컴포넌트 파일에서 가져온 파일에만 추가할 필요가 있습니다. `'use client'`는 서버 전용 코드와 클라이언트 코드의 _경계_ 를 나타내며 트리 아래에 있는 컴포넌트는 클라이언트에서 자동으로 실행됩니다. 서버 컴포넌트에서 렌더링하려면 `'use client'` 파일에서 내보내는 컴포넌트가 직렬화할 수 있는 props를 가져야 합니다.
* 서버 파일에서 `'use client'` 파일을 가져오면 React 컴포넌트로 렌더링하거나 props를 통해 클라이언트 컴포넌트로 전달할 수 있습니다. 그 외의 용도로는 예외가 발생합니다.
* 다른 클라이언트 파일에서 `'use client'` 파일을 가져오면 directive는 아무런 효과가 없습니다. 이를 통해 서버와 클라이언트 컴포넌트에서 동시에 사용할 수 있는 클라이언트 전용 컴포넌트를 작성할 수 있습니다.
* `'use client'` 파일의 모든 코드와 그것이 가져온 (직접적으로 또는 간접적으로) 모듈은 클라이언트 모듈 그래프의 일부가 될 것이고 브라우저에서 렌더링 되기 위해 클라이언트로 보내지고 실행되어야 합니다. 클라이언트 bundle 크기를 줄이고 서버의 이점을 최대한 활용하기 위해 가능하면 트리에서 `'use client'` directive와 state를 낮게 이동시키고 렌더링 된 서버 컴포넌트들을 [자식으로](/learn/passing-props-to-a-component#passing-jsx-as-children) 클라이언트 컴포넌트에 전달합니다.
* props는 서버-클라이언트 경계를 넘어 직렬화되기 때문에 이러한 directive의 배치는 클라이언트로 전송되는 데이터의 양에 영향을 미칠 수 있음에 유의하고 필요 이상으로 큰 데이터 구조를 피해야 합니다.
* `<MarkdownRenderer>`와 같이 서버 전용 기능과 클라이언트 전용 기능을 모두 사용하지 않는 컴포넌트는 일반적으로 `'use client'`로 표시해서는 안 됩니다. 이렇게 하면 서버 컴포넌트에서 사용할 때는 서버 전용으로 렌더링할 수 있지만 클라이언트 컴포넌트에서 사용할 때는 클라이언트 bundle에 추가됩니다.
* npm에 게시된 라이브러리는 직렬화할 수 있는 props를 사용하여 클라이언트 전용 React 기능으로 렌더링할 수 있는 React 컴포넌트에 `'use client'`를 포함해야 합니다. 이를 통해 해당 컴포넌트가 서버 컴포넌트에 의해 import 되어 렌더링 될 수 있습니다. 그렇지 않으면 사용자는 라이브러리 컴포넌트를 자신의 `'use client'` 파일로 감쌀 필요가 있어 번거로울 수 있고 나중에 라이브러리가 서버로 로직을 이동하는 것을 방지할 수 있습니다. 사전 번들 된 파일을 npm에 게시할 때는 서버에서 직접 사용할 수 있는 export가 포함된 bundle과는 별도로 `'use client'`라고 표시된 bundle이 포함되도록 해야 합니다.
* 클라이언트 컴포넌트는 서버 측 렌더링(SSR) 또는 빌드 타임 정적 사이트 생성(SSG)의 일부로 실행될 것입니다. 이는 React 컴포넌트의 초기 렌더링 출력을 HTML로 변환하여 JavaScript bundle이 다운로드 되기 전에 렌더링할 수 있습니다. 하지만 데이터베이스에서 직접 읽는 것과 같은 서버 전용 기능은 사용할 수 없습니다.
* `'use client'`와 같은 directive는 파일의 맨 처음에 있어야 하며 import 코드나 다른 코드보다 우선해야 합니다. 이는 백틱이 아닌 작은따옴표나 큰따옴표로 작성되어야 합니다. (`'use xyz'` directive 형식은 `useXyz()`Hook 네이밍 컨벤션과 다소 유사하지만 우연한 일치입니다.)


## Usage {/*usage*/}

<Wip>
이 섹션은 작업 중입니다.
이 API는 React 서버 컴포넌트를 지원하는 모든 프레임워크에서 사용할 수 있습니다. 이에 대한 추가 문서는 다음에서 찾을 수 있습니다.

* [Next.js 문서](https://nextjs.org/docs/getting-started/react-essentials)
* 추가 예정
</Wip>