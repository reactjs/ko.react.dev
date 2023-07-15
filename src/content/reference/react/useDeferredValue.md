---
title: useDeferredValue
---

<Intro>

`useDeferredValue`는 UI 일부 업데이트를 지연시킬 수 있는 React Hook입니다.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useDeferredValue(value)` {/*usedeferredvalue*/}

컴포넌트의 최상위 레벨에서 `useDeferredValue`를 호출하여 지연된 버전의 값을 가져옵니다.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[아래에서 더 많은 예를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `value`: 지연시키려는 값입니다. 모든 타입을 가질 수 있습니다.

#### 반환 값 {/*returns*/}

초기 렌더링 중에는 반환된 ‘지연된 값’은 사용자가 제공한 값과 같습니다. 업데이트가 발생하면 React는 먼저 이전 값으로 리렌더링을 시도(반환 값이 이전 값과 일치하도록)하고, 그다음 백그라운드에서 다시 새 값으로 리렌더링을 시도(반환 값이 업데이트된 새 값과 일치하도록)합니다.

#### 주의사항 {/*caveats*/}

- `useDeferredValue`에 전달하는 값은 문자열 및 숫자와 같은 원시값이거나, 컴포넌트의 외부에서 생성된 객체여야 합니다. 렌더링 중에 새 객체를 생성하고 즉시 `useDeferredValue`에 전달하면 렌더링할 때마다 값이 달라져 불필요한 백그라운드 리렌더링이 발생할 수 있습니다.

- `useDeferredValue`가 현재 렌더링(여전히 이전 값을 사용하는 경우) 외에 다른 값([`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 비교)을 받으면 백그라운드에서 새 값으로 리렌더링하도록 예약합니다. `값`에 대한 또 다른 업데이트가 있으면 백그라운드 리렌더링은 중단될 수 있습니다. React는 백그라운드 리렌더링을 처음부터 다시 시작할 것입니다. 예를 들어 차트가 리렌더링 가능한 지연된 값을 받는 속도보다 사용자가 input에 값을 입력하는 속도가 더 빠른 경우, 차트는 사용자가 입력을 멈춘 후에만 리렌더링됩니다.

- `useDeferredValue`는 [`<Suspense>`](/reference/react/Suspense)와 통합됩니다. 새로운 값으로 인한 백그라운드 업데이트로 인해 UI가 일시 중단되면 사용자는 폴백을 볼 수 없습니다. 데이터가 로딩될 때까지 이전 지연된 값이 표시됩니다.

- `useDeferredValue`는 그 자체로 추가 네트워크 요청을 방지하지 않습니다.

- `useDeferredValue` 자체로 인한 고정된 지연은 없습니다. React는 원래의 리렌더링을 완료하자마자 즉시 새로운 지연된 값으로 백그라운드 리렌더링 작업을 시작합니다. 그러나 이벤트로 인한 업데이트(예: 타이핑)는 백그라운드 리렌더링을 중단하고 우선순위를 갖습니다.

- `useDeferredValue`로 인한 백그라운드 리렌더링은 화면에 커밋될 때까지 Effects를 실행하지 않습니다. 백그라운드 리렌더링이 일시 중단되면 데이터가 로딩되고 UI가 업데이트된 후에 해당 Effects가 실행됩니다.

---

## 사용법 {/*usage*/}

### 새 콘텐츠가 로딩되는 동안 오래된 콘텐츠 표시하기 {/*showing-stale-content-while-fresh-content-is-loading*/}

컴포넌트의 최상위 레벨에서 `useDeferredValue`를 호출하여 UI 일부 업데이트를 연기할 수 있습니다.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

초기 렌더링 중에 <CodeStep step={2}>지연된 값</CodeStep>은 사용자가 제공한 <CodeStep step={1}>값</CodeStep>과 일치합니다.

업데이트가 발생하면 <CodeStep step={2}>지연된 값</CodeStep>은 최신 <CodeStep step={1}>값</CodeStep>보다 "뒤쳐지게" 됩니다. React는 먼저 지연된 값을 업데이트하지 *않은 채로* 렌더링한 다음, 백그라운드에서 새로 받은 값으로 리렌더링을 시도합니다.


**이것이 언제 유용한지 예시를 통해 살펴보겠습니다.**

<Note>

이 예제에서는 Suspense 지원 데이터 소스 중 하나를 사용한다고 가정합니다

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) 및 [Next.js](https://nextjs.org/docs/advanced-features/react-18)와 같은 Suspense 지원 프레임워크를 사용한 데이터 페칭

- [`lazy`](/reference/react/lazy)를 사용한 지연 로딩 컴포넌트 코드

[Suspense와 그 한계 자세히 알아보기](/reference/react/Suspense)

</Note>


이 예시에서는 검색 결과를 불러오는 동안 `SearchResults` 컴포넌트가 [일시 중지](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)됩니다. `"a"`를 입력하고 결과를 기다린 다음 `"ab"`로 수정해 보세요. `"a"`에 대한 결과가 로딩 폴백으로 대체될 것입니다.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

일반적인 대체 UI 패턴은 결과 목록 업데이트를 *지연*하고 새 결과가 준비될 때까지 이전 결과를 계속 표시합니다. `useDeferredValue`를 호출하여 쿼리의 지연된 버전을 전달하세요.

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query`는 즉시 업데이트되므로 input에 새 값이 표시됩니다. 그러나 `deferredQuery`는 데이터가 로딩될 때까지 이전 값을 유지하므로 `SearchResults`는 잠시 동안 오래된 결과를 표시합니다.

아래 예시에서 `"a"`를 입력하고 결과가 로딩될 때까지 기다린 다음, 입력값을 `"ab"`로 수정해보세요. 이제 새 결과가 로딩될 때까지 Suspense 폴백 대신 오래된 결과 목록이 표시되는 것을 확인할 수 있습니다:

<Sandpack>
```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### 값을 지연시키는 것은 내부적으로 어떻게 작동하나요? {/*how-does-deferring-a-value-work-under-the-hood*/}
두 단계로 진행된다고 생각하면 됩니다

1. **먼저, React는 새로운 `query`(`"ab"`)로 리렌더링하지만 이전 `deferredQuery`(여전히 `"a"`)를 사용합니다.** 결과 목록에 전달하는 `deferredQuery` 값은 "지연"된 `query` 값입니다.

2. **백그라운드에서 React는 `query`와 `deferredQuery`를 모두 `"ab"`로 업데이트한 상태로 리렌더링을 시도합니다.** 이 리렌더링이 완료되면 React는 이를 화면에 표시합니다. 그러나 일시 중단되는 경우(`"ab"`에 대한 결과가 아직 로딩되지 않은 경우) React는 이 렌더링 시도를 포기하며, 데이터가 로딩된 후 이 리렌더링을 다시 시도합니다. 사용자는 데이터가 준비될 때까지 오래된 지연된 값을 계속 보게 됩니다.

지연된 "background" 렌더링은 중단할 수 있습니다. 예를 들어 input을 다시 입력하면 React는 지연된 값을 버리고 새 값으로 다시 시작합니다. React는 항상 가장 최근에 제공받은 값을 사용합니다.

여전히 각 키 입력마다 네트워크 요청이 있다는 점에 주의하세요. 여기서 지연되는 것은 네트워크 요청 자체가 아니라 결과가 준비될 때까지 결과를 표시하는 것입니다. 사용자가 계속 입력하더라도 각 키 입력에 대한 응답은 캐시 되므로 백스페이스를 누르면 즉시 다시 가져오지 않습니다.

</DeepDive>

---

### 콘텐츠가 오래되었음을 표시하기 {/*indicating-that-the-content-is-stale*/}

위의 예에서는 최신 쿼리에 대한 결과 목록이 아직 로딩 중이라는 표시가 없습니다. 새 결과를 로딩하는 데 시간이 오래 걸리는 경우 사용자에게 혼란을 줄 수 있습니다. 결과 목록이 최신 쿼리와 일치하지 않는다는 것을 사용자에게 더 명확하게 알리기 위해, 오래된 결과 목록이 표시될 때 시각적 표시를 추가할 수 있습니다.


```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

이렇게 변경하면 입력을 시작하자마자 새 결과 목록이 로딩될 때까지 오래된 결과 목록이 약간 어두워집니다. 아래 예시에서와 같이 점진적으로 어두워진다고 느껴지도록 CSS transition을 추가하여 흐리게 표시되는 것을 지연시킬 수도 있습니다.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### UI 일부에 대해 리렌더링 연기하기 {/*deferring-re-rendering-for-a-part-of-the-ui*/}

`useDeferredValue`를 성능 최적화로 적용할 수도 있습니다. UI 일부가 리렌더링 속도가 느리고, 이를 최적화할 쉬운 방법이 없으며, 나머지 UI를 차단하지 않도록 하려는 경우에 유용합니다.

키 입력 시마다 리렌더링되는 텍스트 필드와 컴포넌트(예: 차트 또는 긴 목록)가 있다고 상상해 보세요

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

먼저, props가 같은 경우 리렌더링을 건너뛰도록 `SlowList`를 최적화합니다. 이렇게 하려면, [`memo`](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)로 감싸주세요.

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

그러나 이는 `SlowList` props가 이전 렌더링 때와 *동일한* 경우에만 도움이 됩니다. 지금 직면하고 있는 문제는 props가 *다르고* 실제로 다른 시각적 출력을 보여줘야 할 때 속도가 느리다는 것입니다.

구체적으로, 주요 성능 문제는 input에 타이핑할 때마다 `SlowList`가 새로운 props를 수신하고 전체 트리를 리렌더링하면 타이핑이 끊기는 느낌이 든다는 것입니다. 이 경우 `useDeferredValue`를 사용하면 입력 업데이트(빨라야 하는)를 결과 목록 업데이트(느려도 되는)보다 높은 우선순위에 둘 수 있습니다.

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

이렇게 한다고 해서 `SlowList`의 리렌더링 속도가 빨라지지는 않습니다. 하지만 키 입력을 차단하지 않도록 목록 리렌더링의 우선순위를 낮출 수 있다는 것을 React에 알려줍니다. 목록은 입력보다 "지연"되었다가 "따라잡을" 것입니다. 이전과 마찬가지로 React는 가능한 한 빨리 목록을 업데이트하려고 시도하지만, 사용자가 입력하는 것을 차단하지는 않습니다.

<Recipes titleText="useDeferredValue와 최적화되지 않은 리렌더링의 차이점" titleId="examples">

#### 목록 리렌더링 연기 {/*deferred-re-rendering-of-the-list*/}

이 예시에서는 `SlowList` 컴포넌트의 각 항목을 **인위적으로 느려지도록 하여** `useDeferredValue`를 통해 input의 반응성을 유지하는 방법을 확인할 수 있습니다. input에 타이핑하면 입력은 빠르게 느껴지는 반면 목록은 "지연"되는 것을 확인할 수 있습니다.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### 목록의 최적화되지 않은 리렌더링 {/*unoptimized-re-rendering-of-the-list*/}

이 예시에서는 `SlowList` 컴포넌트의 각 항목이 인위적으로 느려지도록 하여 `useDeferredValue`를 통해 입력 반응성을 유지하는 방법을 확인할 수 있습니다. input에 타이핑하면 입력은 빠르게 느껴지는 반면 목록은 “지연”되는 것을 확인할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

이 최적화를 위해서는 `SlowList`를 [`memo`](/reference/react/memo)로 감싸야 합니다. `text`가 변경될 때마다 React는 부모 컴포넌트를 빠르게 리렌더링할 수 있어야 하기 때문입니다. 리렌더링하는 동안 `deferredText`는 여전히 이전 값을 가지므로 `SlowList`는 리렌더링을 건너뛸 수 있습니다(props는 변경되지 않았습니다). [`memo`](/reference/react/memo)가 없으면 어쨌든 리렌더링해야 하므로 최적화의 취지가 무색해집니다.

</Pitfall>

<DeepDive>

#### 값을 연기하는 것은 디바운싱 및 스로틀링과 어떤 점이 다른가요? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

이 시나리오에서 이전에 사용했을 수 있는 두 가지 일반적인 최적화 기술이 있습니다

- *디바운싱*은 타이핑을 멈출 때까지(예: 1초 동안) 기다렸다가 목록을 업데이트하는 것을 의미합니다.
- *스로틀링*은 가끔씩(예: 최대 1초에 한 번) 목록을 업데이트하는 것을 의미합니다.

이러한 기법들은 경우에 따라 유용하지만, `useDeferredValue`는 React 자체와 깊게 통합되어 있고 사용자의 기기에 맞게 조정되기 때문에 렌더링을 최적화하는 데 더 적합합니다.

디바운싱이나 스로틀링과 달리 고정된 지연을 선택할 필요가 없습니다. 사용자의 디바이스가 빠른 경우(예: 고성능 노트북) 지연된 리렌더링은 거의 즉시 발생하며 눈에 띄지 않습니다. 사용자의 디바이스가 느린 경우, 기기 속도에 비례하여 목록이 input에 '지연'됩니다.

또한 디바운싱이나 스로틀링과 달리, `useDeferredValue`에 의해 수행되는 지연된 리렌더링은 기본적으로 중단할 수 있습니다. 즉, React가 큰 목록을 리렌더링하는 도중에 사용자가 다른 키 입력을 하면 React는 해당 리렌더링을 중단하고 키 입력을 처리한 다음 백그라운드에서 리렌더링을 시작합니다. 반면 디바운싱과 스로틀링은 렌더링이 키 입력을 차단하는 순간을 연기할 뿐이므로 여전히 불안정한 경험을 만들어 냅니다.

최적화하려는 작업이 렌더링 중에 발생하지 않는 경우에도 디바운싱과 스로틀링은 여전히 유용합니다. 예를 들어 디바운싱과 스로틀링을 사용하면 네트워크 요청을 더 적게 처리할 수 있습니다. 이러한 기술을 함께 사용할 수도 있습니다.

</DeepDive>
