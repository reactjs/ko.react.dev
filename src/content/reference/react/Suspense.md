---
title: <Suspense>
---

<Intro>

`<Suspense>`는 자식 요소를 로드하기 전까지 화면에 대체 UI<sup>Fallback</sup>를 보여줍니다.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}
* `children`: 궁극적으로 렌더링하려는 실제 UI입니다. `children`의 렌더링이 지연되면, Suspense는 `fallback`을 대신 렌더링합니다.
* `fallback`: 실제 UI가 로딩되기 전까지 대신 렌더링되는 대체 UI입니다. 올바른 React 노드 형식은 무엇이든 대체 UI로 활용할 수 있지만, 실제로는 보통 로딩 스피너나 스켈레톤처럼 간단한 Placeholder를 활용합니다. Suspense는 `children`의 렌더링이 지연되면 자동으로 `fallback`으로 전환하고, 데이터가 준비되면 `children`으로 다시 전환합니다. 만약 `fallback`의 렌더링이 지연되면, 가장 가까운 부모 Suspense가 활성화됩니다.
* <ExperimentalBadge /> **선택 사항** `defer`: 불리언 값입니다. `true`이면 `children` 안에서 아무것도 지연되지 않더라도 React가 `fallback`을 먼저 보여주고 `children`을 나중에 렌더링하거나 스트리밍할 수 있습니다. 렌더링 비용이 큰 콘텐츠에 사용하세요. 기본값은 `false`입니다.

#### 주의 사항 {/*caveats*/}

- Suspense는 Effect 또는 이벤트 핸들러 내부에서 가져오는 데이터를 감지하지 않습니다. [아래에 나열된 경우](#what-activates-a-suspense-boundary)에만 활성화됩니다.
- React는 컴포넌트가 처음으로 마운트되기 전에 지연된 렌더링을 하는 동안의 어떤 State도 유지하지 않습니다. 컴포넌트가 로딩되면 React는 일시 중지된 트리를 처음부터 다시 렌더링합니다.
- Suspense가 트리의 콘텐츠를 보여주고 있을 때 또다시 지연되면 [`startTransition`](/reference/react/startTransition)이나 [`useDeferredValue`](/reference/react/useDeferredValue)로 인한 업데이트가 아닌 한, `fallback`이 다시 보입니다.
- React는 지연된 콘텐츠를 보여준 뒤 300ms가 지나야 다음 콘텐츠를 보여줍니다. 그 사이에 준비된 경계는 하나씩 나타나지 않고 [함께 나타납니다](/blog/2025/10/01/react-19-2#batching-suspense-boundaries-for-ssr).
- React가 다시 일시 중지되어 보이는 콘텐츠를 숨겨야 하는 경우, 콘텐츠 트리에서 [Layout Effect](/reference/react/useLayoutEffect)들을 정리합니다. 콘텐츠가 다시 보일 준비가 되면 React는 Layout Effect들을 다시 실행합니다. 이로써 DOM 레이아웃을 측정하는 Effect가 콘텐츠가 숨겨져 있는 동안 동작하지 않도록 보장합니다.
- React는 Suspense와 통합된 *스트리밍 서버 렌더링*과 *선택적 Hydration* 같은 내부 최적화를 포함하고 있습니다. [아키텍처 개요](https://github.com/reactwg/react-18/discussions/37)를 읽고 [기술 강연](https://www.youtube.com/watch?v=pj5N-Khihgc)을 시청하여 더 자세히 알아보세요.

---

### Suspense 경계가 활성화되는 경우 {/*what-activates-a-suspense-boundary*/}

Suspense 경계는 콘텐츠가 준비될 때까지 기다렸다가 보여줍니다. 다음 중 하나라도 해당하면 경계는 콘텐츠를 보여주지 않습니다.

- [`lazy`](/reference/react/lazy)로 컴포넌트 코드를 지연 로딩하는 경우.
- [`use`](/reference/react/use)로 Promise를 읽는 경우. [서버 컴포넌트](/reference/rsc/server-components)에서 스트리밍된 데이터나 [Suspense를 지원하는 프레임워크](#suspense-enabled-frameworks)로 불러온 데이터를 읽는 경우도 포함됩니다.
- [`<link rel="stylesheet">`와 `precedence` prop으로 렌더링한 스타일시트](/reference/react-dom/components/link#special-rendering-behavior)를 로딩하는 경우. React는 스타일시트가 로딩되거나 타임아웃에 도달할 때까지 경계를 차단합니다. [아래 예시를 참고하세요.](#waiting-for-a-stylesheet-to-load)
- 스트리밍 서버 렌더링 중에 큰 경계의 HTML이 도착하기를 기다리는 경우. HTML을 전송하는 데는 시간이 걸리므로 콘텐츠가 충분히 많은 경계는 내부에서 아무것도 지연되지 않더라도 활성화됩니다. React는 HTML이 도착하는 대로 콘텐츠를 보여줍니다.
- 폰트를 로딩하는 경우. Suspense는 기본적으로 폰트를 기다리지 않습니다. 하지만 [`<ViewTransition>`](/reference/react/ViewTransition)이 경계의 콘텐츠가 나타나는 과정에 애니메이션을 적용할 때는 텍스트가 대체 폰트로 깜빡이지 않도록 React가 새 폰트의 로딩을 최대 500ms 동안 기다립니다. [아래 예시를 참고하세요.](#waiting-for-a-font-to-load)
- 이미지를 로딩하는 경우. Suspense는 기본적으로 이미지를 기다리지 않습니다. 하지만 [`<ViewTransition>`](/reference/react/ViewTransition)이 경계의 콘텐츠가 나타나는 과정에 애니메이션을 적용할 때는 화면에 보이는 이미지가 로딩될 때까지 React가 최대 500ms 동안 기다렸다가 애니메이션을 시작합니다. `loading="lazy"`를 설정하거나 `onLoad` 핸들러를 추가하면 특정 이미지를 이 동작에서 제외할 수 있습니다. [아래 예시를 참고하세요.](#waiting-for-an-image-to-load)
- <ExperimentalBadge /> [`<Suspense defer>`](#props) 경계 안에서 CPU를 많이 사용하는 렌더링 작업을 수행하는 경우.

<Note>

#### Suspense를 지원하는 프레임워크 {/*suspense-enabled-frameworks*/}

*Suspense를 지원하는 프레임워크*를 사용하면 가장 가까운 Suspense 경계를 활성화하는 방식으로 컴포넌트에서 데이터를 읽을 수 있습니다. 데이터를 로딩하는 정확한 방법은 프레임워크마다 다르며 자세한 내용은 해당 프레임워크의 문서에서 확인할 수 있습니다. 내부적으로 이러한 프레임워크는 Promise 캐시를 유지하고 [`use`](/reference/react/use)를 호출해 Promise가 완료될 때까지 컴포넌트를 지연시킵니다.

프레임워크 없이도 `use`로 Promise를 직접 읽을 수 있습니다. 단, Promise를 [캐시해서 렌더링 간에 같은 인스턴스를 재사용해야 합니다.](/reference/react/use#caching-promises-for-client-components)

</Note>

---

## 사용법 {/*usage*/}

### 콘텐츠를 로딩하는 동안 대체 UI<sup>Fallback</sup> 보여주기 {/*displaying-a-fallback-while-content-is-loading*/}

애플리케이션의 모든 곳을 Suspense 경계로 감쌀 수 있습니다.

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React는 <CodeStep step={2}>children</CodeStep>에 필요한 모든 코드와 데이터를 로딩할 때까지 <CodeStep step={1}>loading fallback</CodeStep>을 보여줍니다.

아래 예시에서는 앨범 목록을 가져오는 동안 `Albums` 컴포넌트가 <em>지연(Suspend)</em>됩니다. 렌더링할 준비가 될 때까지 가장 가까운 Suspense는 Fallback, 즉 `Loading` 컴포넌트를 표시합니다. 데이터를 모두 로딩하면 React는 `Loading` Fallback을 숨기고 로딩된 데이터로 `Albums` 컴포넌트를 렌더링합니다.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

반면 Effect 내부처럼 `use` 바깥에서 데이터를 가져오는 코드는 경계를 활성화하지 않습니다.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import EffectAlbums from './EffectAlbums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <EffectAlbums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/EffectAlbums.js
import { useState, useEffect } from 'react';
import { fetchData } from './data.js';

export default function EffectAlbums({ artistId }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let active = true;
    fetchData(`/${artistId}/albums`).then(result => {
      if (active) {
        setAlbums(result);
      }
    });
    return () => {
      active = false;
    };
  }, [artistId]);

  // Suspense는 이 데이터 요청을 감지할 수 없으므로 Fallback이
  // 전혀 표시되지 않습니다. 데이터가 도착할 때까지 목록은 비어 있습니다.
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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

스트리밍 서버 렌더링 중에는 HTML이 아직 스트리밍되고 있는 경계도 활성화됩니다. 어떤 스트리밍 서버 렌더링 API를 사용하든 React는 먼저 `fallback`을 포함한 [셸](/reference/react-dom/server/renderToPipeableStream#specifying-what-goes-into-the-shell)을 보낸 다음 각 경계의 HTML을 스트리밍하면서 콘텐츠가 도착하는 대로 해당 경계의 `fallback`을 교체합니다. "Render the page"를 눌러 페이지가 스트리밍되는 모습을 확인해 보세요.

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Streaming SSR</title>
</head>
<body>
  <button id="render">Render the page</button>
  <br /><br />
  <iframe id="container" style="width: 100%; height: 180px; border: 1px solid #aaa;"></iframe>
</body>
</html>
```

```js src/index.js
import { flushReadableStreamToFrame } from './demo-helpers.js';
import { Suspense, use } from 'react';
import { renderToReadableStream } from 'react-dom/server';

let posts = null;

function Posts() {
  const text = use(posts.promise);
  return <p>{text}</p>;
}

function ProfilePage() {
  return (
    <html>
      <body>
        <h1>Alice</h1>
        <p>Photographer and traveler.</p>
        <Suspense fallback={<p>⌛ Loading posts...</p>}>
          <Posts />
        </Suspense>
      </body>
    </html>
  );
}

async function main(frame) {
  posts = Promise.withResolvers();
  const stream = await renderToReadableStream(<ProfilePage />);

  // 게시물 Promise는 셸이 스트리밍된 후에 해결되므로 React는
  // 게시물의 HTML을 스트리밍하고 Fallback을 교체합니다.
  setTimeout(() => {
    posts.resolve(
      'Just got back from two weeks along the coast. The drive ' +
      'was longer than expected, but every stop was worth it. ' +
      'A full write-up and more photos are coming soon.'
    );
  }, 1500);

  await flushReadableStreamToFrame(stream, frame);
}

document.getElementById('render').addEventListener('click', () => {
  main(document.getElementById('container'));
});
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

</Sandpack>

---

### 콘텐츠를 한꺼번에 함께 보여주기 {/*revealing-content-together-at-once*/}

기본적으로 Suspense 내부의 전체 트리는 하나의 단위로 취급됩니다. 예를 들어, 이러한 구성 요소 중 *하나라도* 어떤 데이터를 기다리며 지연되더라도 *모든* 구성 요소가 함께 로딩 표시로 대체됩니다.

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

그런 다음 모두 보일 준비가 되면 한꺼번에 모두 함께 보입니다.

아래 예시에서는 `Biography`와 `Albums` 모두 어떤 데이터를 가져옵니다. 하지만 두 구성 요소는 같은 단일 Suspense 아래에 그룹화되어 있기 때문에 항상 동시에 함께 그려지게 됩니다.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

데이터를 로딩하는 컴포넌트가 Suspense의 직접적인 자식일 필요는 없습니다. 예를 들어, `Biography`와 `Albums`를 새로운 `Details` 컴포넌트로 이동할 수 있습니다. 이렇게 해도 동작은 변경되지 않습니다. `Biography`와 `Albums`는 가장 가까운 상위 Suspense를 공유하므로 두 컴포넌트의 노출 여부는 함께 조정됩니다.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### 중첩된 콘텐츠가 로딩될 때 보여주기 {/*revealing-nested-content-as-it-loads*/}

컴포넌트가 일시 중단되면 가장 가까운 상위 Suspense 컴포넌트가 Fallback을 보여줍니다. 이를 통해 여러 Suspense 컴포넌트를 중첩하여 로딩 순서를 만들 수 있습니다. 각 Suspense의 Fallback은 다음 레벨의 콘텐츠를 사용할 수 있게 되면 채워집니다. 예를 들어 앨범 목록에 자체 Fallback을 지정할 수 있습니다.

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

이 변경으로 `Biography`를 보여줄 때 `Albums`가 로딩될 때까지 "기다릴" 필요가 없습니다.

순서는 다음과 같습니다.

1. `Biography`가 아직 로딩되지 않은 경우, 전체 콘텐츠 영역 대신 `BigSpinner`가 표시됩니다.
2. `Biography`의 로딩이 완료되면 `BigSpinner`가 콘텐츠로 대체됩니다.
3. `Albums`가 아직 로딩되지 않은 경우, `Albums`와 그 상위 `Panel` 대신 `AlbumsGlimmer`가 표시됩니다.
4. 마지막으로 `Albums`가 로딩을 완료하면 `AlbumsGlimmer`를 대체합니다.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Suspense 경계를 사용하면 UI의 어떤 부분이 항상 동시에 그려져야 하는지, 어떤 부분이 로딩 순서에서 점진적으로 더 많은 콘텐츠를 보여줘야 하는지 조정할 수 있습니다. 앱의 나머지 동작에 영향을 주지 않고 트리의 어느 위치에서나 Suspense를 추가, 이동, 삭제할 수 있습니다.

모든 컴포넌트 주위에 Suspense를 두지 마세요. Suspense는 사용자가 경험하기를 원하는 로딩 순서보다 더 세분화되어서는 안 됩니다. 디자이너와 함께 작업하는 경우 로딩 상태를 어디에 배치해야 하는지 디자이너에게 물어보세요. 디자이너가 이미 디자인 와이어 프레임에 포함했을 가능성이 높습니다.

---

### 새 콘텐츠가 로딩되는 동안 이전 콘텐츠 보여주기 {/*showing-stale-content-while-fresh-content-is-loading*/}

이 예시에서는 검색 결과를 가져오는 동안 `SearchResults` 컴포넌트가 지연됩니다. `"a"`를 입력하고 결과를 기다린 다음 `"ab"`로 바꿔보세요. `"a"`에 대한 결과는 로딩 Fallback으로 바뀝니다.

<Sandpack>

```js src/App.js
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

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

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
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
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

흔히 쓰는 또 다른 UI 패턴은 목록 업데이트를 <em>지연<sup>Defer</sup></em>하고 새 결과가 준비될 때까지 이전 결과를 계속 보여주는 것입니다. [`useDeferredValue`](/reference/react/useDeferredValue) Hook을 사용하면 쿼리의 지연된 버전을 아래로 전달할 수 있습니다.

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

`query`는 즉시 업데이트되므로 입력에 새 값이 표시됩니다. 그러나 `deferredQuery`는 데이터가 로딩될 때까지 이전 값을 유지하므로 `SearchResults`는 잠시 동안 이전 결과를 보여줍니다.

사용자에게 더 명확하게 알리기 위해 이전 결과 목록이 표시될 때 시각적 표시를 추가할 수 있습니다.

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1
}}>
  <SearchResults query={deferredQuery} />
</div>
```

아래 예시에서 `"a"`를 입력하고 결과가 로딩될 때까지 기다린 다음 입력을 `"ab"`로 편집해보세요. 이제 새 결과가 로드될 때까지 Suspense Fallback 대신 희미한 이전 결과 목록이 표시되는 것을 확인할 수 있습니다.


<Sandpack>

```js src/App.js
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
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

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
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
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

<Note>

지연된 값<sup>Deferred Value</sup>과 [Transition](#preventing-already-revealed-content-from-hiding)을 사용하면 Suspense Fallback 대신 인라인 표시기를 보여줄 수 있습니다. Transition은 전체 업데이트를 긴급하지 않은 것으로 처리하므로 일반적으로 프레임워크와 Router 라이브러리에서 Navigation을 위해 사용합니다. 반면에 지연된 값<sup>Deferred Value</sup>은 UI의 일부를 긴급하지 않은 것으로 처리하고 나머지 UI보다 "지연"시키려는 목적의 애플리케이션 코드에서 주로 유용합니다.

</Note>

---

### 이미 보인 콘텐츠가 숨겨지지 않도록 방지 {/*preventing-already-revealed-content-from-hiding*/}

컴포넌트가 지연되면 가장 가까운 상위 Suspense가 Fallback을 보여주도록 전환합니다. 이미 일부 콘텐츠가 보이는 경우 사용자 경험이 끊길 수 있습니다. 이 버튼을 눌러 보세요.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

버튼을 눌렀을 때 `Router` 컴포넌트가 `IndexPage` 대신 `ArtistPage`를 렌더링했습니다. `ArtistPage` 내부의 컴포넌트가 지연됐기 때문에 가장 가까운 Suspense가 Fallback을 보여주기 시작했습니다. 가장 가까운 Suspense가 Root 근처에 있었기 때문에 전체 사이트 레이아웃이 `BigSpinner`로 대체되었습니다.

이를 방지하려면 [`startTransition`](/reference/react/startTransition)을 사용하여 Navigation State 업데이트를 *Transition*으로 처리할 수 있습니다.

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

이는 State 전환이 급하지 않으며, 이미 공개된 콘텐츠를 숨기는 대신 이전 페이지를 계속 표시하는 것이 좋다는 것을 React에게 알려줍니다. 이제 버튼을 클릭하면 `Biography`가 로딩될 때까지 "대기"합니다.

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Transition은 *모든* 콘텐츠가 로딩될 때까지 기다리지 않습니다. 이미 보인 콘텐츠가 숨겨지지 않을 만큼만 기다립니다. 예를 들어 웹사이트 `Layout`은 이미 보이므로 로딩 스피너 뒤에 숨기는 것은 좋지 않을 것입니다. 그러나 `Albums` 주위에 중첩된 `Suspense`는 새로운 것이므로 Transition이 기다리지 않습니다.

<Note>

Suspense를 지원하는 Router는 기본적으로 Navigation 업데이트를 Transition으로 래핑할 것으로 예상합니다.

</Note>

---

### Transition이 발생하고 있음을 보여주기 {/*indicating-that-a-transition-is-happening*/}

위의 예시에서는 버튼을 클릭해도 Navigation이 진행 중이라는 시각적 표시가 없습니다. 표시기를 추가하려면 [`startTransition`](/reference/react/startTransition)을 불리언<sup>Boolean</sup> 값인 `isPending` 값을 제공하는 [`useTransition`](/reference/react/useTransition)으로 바꾸면 됩니다. 아래 예시에서는 Transition이 진행되는 동안 웹사이트 헤더 스타일을 변경하는 데 사용됩니다.

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Navigation에서 Suspense 재설정하기 {/*resetting-suspense-boundaries-on-navigation*/}

Transition이 진행되는 동안 React는 이미 보인 콘텐츠를 숨기지 않습니다. 하지만 다른 사용자의 프로필처럼 *다른* 콘텐츠로 이동할 때는 경계가 이전 콘텐츠 대신 Fallback을 보여주는 것이 좋습니다. 이를 `key`로 표현할 수 있습니다.

```js
<ProfilePage key={queryParams.id} />
```

`key`가 다르면 React는 각 프로필을 서로 다른 콘텐츠로 취급하고 Navigation 중에 Suspense 경계를 재설정합니다. `key`는 경계 자체에 지정할 수도 있고 그 위에 있는 컴포넌트에 지정할 수도 있습니다. Suspense와 통합된 Router는 이 동작을 자동으로 수행해야 합니다.

아래 예시에서 프로필 페이지를 열면 첫 번째 프로필이 로딩됩니다. "Bob"을 누르면 다른 프로필로 이동하고 `key`가 경계를 재설정하므로 이전 사용자의 소개 대신 Fallback이 표시됩니다. `key`를 제거해 보세요. 다음 소개가 로딩되는 동안 이전 소개가 계속 보입니다.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ProfilePage from './ProfilePage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return <ProfilePage />;
  }
  return (
    <button onClick={() => setShow(true)}>
      Open profile page
    </button>
  );
}
```

```js src/ProfilePage.js active
import { Suspense, useState, startTransition } from 'react';
import Bio from './Bio.js';
import { fetchBio } from './data.js';

export default function ProfilePage() {
  const [user, setUser] = useState(() => ({
    id: 'alice',
    bioPromise: fetchBio('alice'),
  }));
  function navigate(id) {
    startTransition(() => {
      setUser({ id, bioPromise: fetchBio(id) });
    });
  }
  return (
    <>
      <button onClick={() => navigate('alice')}>
        Alice
      </button>
      <button onClick={() => navigate('bob')}>
        Bob
      </button>
      <Suspense key={user.id} fallback={<p>⌛ Loading profile...</p>}>
        <Bio bioPromise={user.bioPromise} />
      </Suspense>
    </>
  );
}
```

```js src/Bio.js
import { use } from 'react';

export default function Bio({ bioPromise }) {
  const bio = use(bioPromise);
  return <p>{bio}</p>;
}
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.

export async function fetchBio(userId) {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return userId === 'alice'
    ? 'Alice is a photographer and traveler.'
    : 'Bob collects vintage synthesizers.';
}
```

```css
button {
  margin-right: 8px;
}
```

</Sandpack>

---

### 서버 에러 및 클라이언트 전용 콘텐츠에 대한 Fallback 제공 {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

[스트리밍 서버 렌더링 API](/reference/react-dom/server) 중 하나(또는 이에 의존하는 프레임워크)를 사용하는 경우, React는 서버의 에러를 처리하기 위해 `<Suspense>` 경계도 사용할 것입니다. 컴포넌트가 서버에서 에러를 발생시키더라도 React는 서버 렌더링을 중단하지 않습니다. 대신, 그 위에 있는 가장 가까운 `<Suspense>` 컴포넌트를 찾아서 그 Fallback(예: 스피너)을 생성된 서버 HTML에 포함합니다. 사용자는 처음에는 스피너를 보게 됩니다.

클라이언트에서 React는 동일한 컴포넌트를 다시 렌더링하려고 시도합니다. 클라이언트에서도 에러가 발생하면 React는 에러를 던지고 가장 가까운 [Error Boundary](/reference/react/Component#static-getderivedstatefromerror)를 표시합니다. 그러나 클라이언트에서 에러가 발생하지 않으면 콘텐츠가 결국 성공적으로 보였기 때문에 React는 사용자에게 에러를 보여주지 않습니다.

이를 사용하여 일부 컴포넌트를 서버에서 렌더링하지 않도록 선택할 수 있습니다. 이렇게 하려면 서버 환경에서 에러를 발생시킨 다음 `<Suspense>` 경계로 감싸서 해당 HTML을 Fallback으로 대체합니다.

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

서버 HTML에 로딩 UI가 포함됩니다. 클라이언트에서는 `Chat` 컴포넌트로 대체됩니다.

---

### 브라우저 전용 콘텐츠에 대한 Fallback 제공 {/*providing-a-fallback-for-browser-only-content*/}

Suspense 경계는 브라우저 전용 컴포넌트에 Fallback을 제공할 수 있습니다. 컴포넌트를 `<Suspense>`로 감싸고 해당 컴포넌트 안에서 [`use(browser())`](/reference/react/use#use-browser)를 호출하세요.

초기 HTML에서 로딩 Fallback을 보려면 **새로고침**을 클릭하세요. Hydration 이후 React는 `localStorage`에서 불러온 초안을 표시합니다.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Fallback과 Hydration 이후의 콘텐츠가 모두 보이도록 기다립니다.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

서버 렌더링 중에 React는 Suspense 경계의 Fallback을 HTML에 포함합니다. 브라우저에서는 React가 Fallback을 저장된 초안으로 교체합니다.

---

### 스타일시트가 로딩될 때까지 기다리기 {/*waiting-for-a-stylesheet-to-load*/}

[`<link rel="stylesheet">`와 `precedence` prop으로 렌더링한 스타일시트](/reference/react-dom/components/link#special-rendering-behavior)는 콘텐츠가 스타일 없이 나타나지 않도록 로딩이 끝나거나 타임아웃에 도달할 때까지 Suspense 경계를 차단합니다.

아래 예시에서 `Card` 컴포넌트는 `precedence`를 지정한 스타일시트를 렌더링합니다. "Show card"를 누르면 React는 스타일시트가 로딩될 때까지 Fallback을 표시한 다음 스타일이 적용된 카드를 보여줍니다.

비교를 위해 두 번째 버튼은 React 없이 별도의 문서에서 같은 업데이트를 수행합니다. 이때는 스타일시트를 기다리지 않으므로 카드의 텍스트가 먼저 대체 폰트로 나타났다가 나중에 바뀝니다.

<Sandpack>

```js
import { Suspense, useState, startTransition } from 'react';
import { freshStylesheetUrl } from './styles.js';
import VanillaCard from './VanillaCard.js';

function Card({ href }) {
  return (
    <>
      <link rel="stylesheet" href={href} precedence="default" />
      <div className="fancy-card">This card uses a font from the stylesheet.</div>
    </>
  );
}

export default function App() {
  const [href, setHref] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setHref(freshStylesheetUrl());
          });
        }}>
        Show card
      </button>
      {href && (
        <Suspense fallback={<p>⌛ Loading styles...</p>}>
          <Card href={href} />
        </Suspense>
      )}
      <hr />
      <VanillaCard />
    </>
  );
}
```

```js src/VanillaCard.js
import { useRef } from 'react';
import { freshStylesheetUrl } from './styles.js';

export default function VanillaCard() {
  const ref = useRef(null);
  function show() {
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; }
        .fancy-card {
          padding: 20px;
          border-radius: 8px;
          color: white;
          font-family: 'Caveat', sans-serif;
          font-size: 24px;
          background: linear-gradient(135deg, #087ea4, #2b3491);
        }
      </style>
      <div class="fancy-card">This card uses a font from the stylesheet.</div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show card (without React)</button>
      <iframe ref={ref} title="Vanilla card" className="vanilla-frame" />
    </>
  );
}
```

```js src/styles.js hidden
// 스타일시트가 캐시되지 않고 실행할 때마다 로딩 상태가
// 보이도록 고유한 매개변수를 추가합니다.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}
```

```css
#root {
  min-height: 300px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.fancy-card {
  margin-top: 1em;
  padding: 20px;
  border-radius: 8px;
  color: white;
  font-family: 'Caveat', sans-serif;
  font-size: 24px;
  background: linear-gradient(135deg, #087ea4, #2b3491);
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 90px;
}
```

</Sandpack>

---

### Suspense 콘텐츠에서 애니메이션 적용하기 {/*animating-from-suspense-content*/}

Suspense를 [`<ViewTransition>`](/reference/react/ViewTransition)과 함께 사용하면 Fallback이 콘텐츠로 교체되는 과정에 애니메이션을 적용할 수 있습니다. 경계를 `<ViewTransition>`으로 감싸면 React는 이 교체를 업데이트로 처리하며 기본적으로 Fallback과 콘텐츠 사이를 크로스 페이드합니다.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

경계를 기준으로 `<ViewTransition>`을 어디에 배치하느냐에 따라 Fallback과 콘텐츠가 하나의 업데이트로 크로스 페이드될지 아니면 별도의 exit 및 enter 애니메이션으로 실행될지가 결정됩니다. View Transition 클래스로 [애니메이션을 커스터마이징](/reference/react/ViewTransition#customizing-animations)할 수도 있습니다.

[Suspense 콘텐츠에서 애니메이션을 적용하는 방법을 자세히 알아보세요.](/reference/react/ViewTransition#animating-from-suspense-content)

</Note>

---

### 폰트가 로딩될 때까지 기다리기 {/*waiting-for-a-font-to-load*/}

[`<ViewTransition>`](/reference/react/ViewTransition)이 Suspense 경계의 콘텐츠가 나타나는 과정에 애니메이션을 적용할 때 React는 텍스트가 대체 폰트로 깜빡이지 않도록 콘텐츠가 새로 사용하는 폰트를 최대 500ms 동안 기다립니다. 이 동작은 `<ViewTransition>` 업데이트 중에만 발생합니다.

아래 예시에서 Suspense 경계는 `<ViewTransition>` 안에 있고 `Quote` 컴포넌트는 데이터를 로딩하는 동안 지연됩니다. 인용문을 렌더링하면 폰트를 추가하는 스타일시트가 로딩됩니다. React는 스타일시트와 폰트가 로딩되는 동안 Fallback을 계속 표시합니다. 폰트가 500ms 제한 안에 로딩되면 인용문은 이미 해당 폰트가 적용된 상태로 나타납니다.

비교를 위해 두 번째 버튼은 React 없이 같은 업데이트를 수행합니다. 이때는 폰트를 기다리지 않으므로 텍스트가 먼저 대체 폰트로 나타났다가 나중에 바뀝니다.

<Sandpack>

```js
import {
  ViewTransition,
  Suspense,
  use,
  useState,
  startTransition,
} from 'react';
import { fetchQuote } from './data.js';
import {
  freshFontUrl,
  freshStylesheetUrl,
} from './font.js';
import VanillaQuote from './VanillaQuote.js';

function Quote({ stylesheet }) {
  const quote = use(fetchQuote());
  return (
    <>
      <link
        rel="stylesheet"
        href={stylesheet}
        precedence="default"
      />
      <p className="quote fancy">{quote}</p>
    </>
  );
}

export default function App() {
  const [stylesheet, setStylesheet] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setStylesheet(freshStylesheetUrl());
          });
        }}>
        Show quote
      </button>
      {stylesheet && (
        <ViewTransition>
          <Suspense fallback={<p className="quote">⌛ Loading quote...</p>}>
            <Quote stylesheet={stylesheet} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaQuote />
    </>
  );
}
```

```js src/VanillaQuote.js
import { useRef } from 'react';
import { freshFontUrl } from './font.js';

export default function VanillaQuote() {
  const ref = useRef(null);
  function show() {
    const style = document.createElement('style');
    style.textContent = `@font-face {
      font-family: 'VanillaFancy';
      src: url(${freshFontUrl()}) format('woff2');
      font-display: swap;
    }`;
    document.head.appendChild(style);
    ref.current.innerHTML = `<p class="quote vanilla-fancy">The best way to predict the future is to invent it.</p>`;
  }
  return (
    <>
      <button onClick={show}>Show quote (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/font.js hidden
export function freshStylesheetUrl() {
  // 스타일시트가 캐시되지 않도록 고유한 매개변수를 추가합니다.
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshFontUrl() {
  // 폰트가 캐시되지 않도록 고유한 매개변수를 추가합니다.
  return (
    'https://fonts.gstatic.com/s/caveat/v23/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpYT5Kmgq3sw.woff2' +
    '?t=' +
    Date.now()
  );
}
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = null;

export function fetchQuote() {
  if (!cache) {
    cache = new Promise((resolve) => {
      // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
      setTimeout(() => {
        resolve(
          'The best way to predict the future is to invent it.'
        );
      }, 500);
    });
  }
  return cache;
}
```

```css
#root {
  min-height: 260px;
}
.quote {
  font-size: 20px;
  margin-top: 1em;
}
.fancy {
  font-family: 'Caveat', sans-serif;
}
.vanilla-fancy {
  font-family: 'VanillaFancy', sans-serif;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### 이미지가 로딩될 때까지 기다리기 {/*waiting-for-an-image-to-load*/}

Suspense 경계가 [`<ViewTransition>`](/reference/react/ViewTransition) 안에서 콘텐츠를 보여줄 때 React는 화면에 보이는 이미지가 로딩될 때까지 최대 500ms 동안 기다렸다가 애니메이션을 시작합니다. `loading="lazy"`를 설정하거나 `onLoad` 핸들러를 추가하면 해당 이미지는 이 동작에서 제외됩니다.

`<ViewTransition>` 안과 밖에 있는 같은 경계를 비교해 보세요. 안에서는 이미지가 로딩되는 동안 React가 최대 500ms까지 프로필 스켈레톤을 계속 보여주므로 이미지가 이미 준비된 상태로 카드가 나타날 수 있습니다. 밖에서는 Promise가 해결되는 즉시 Suspense가 스켈레톤 표시를 멈춥니다. 이미지가 아직 로딩 중이라면 카드가 먼저 나타나고 이미지는 뒤늦게 나타납니다.

<Sandpack>

```js
import {
  ViewTransition,
  Suspense,
  use,
  useState,
} from 'react';
import { fetchImageSrc } from './image.js';

function Profile({ cacheKey }) {
  const src = use(fetchImageSrc(cacheKey));
  return (
    <div className="card">
      <img src={src} alt="" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [showWithTransition, setShowWithTransition] =
    useState(false);
  const [showWithoutTransition, setShowWithoutTransition] =
    useState(false);
  return (
    <>
      <button onClick={() => setShowWithTransition(true)}>
        Show profile with View Transition
      </button>
      {showWithTransition && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile cacheKey="with-transition" />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <button onClick={() => setShowWithoutTransition(true)}>
        Show profile without View Transition
      </button>
      {showWithoutTransition && (
        <Suspense fallback={<ProfilePlaceholder />}>
          <Profile cacheKey="without-transition" />
        </Suspense>
      )}
    </>
  );
}
```

```js src/image.js hidden
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.
const cache = new Map();

export function fetchImageSrc(cacheKey) {
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, loadImageSrc());
  }
  return cache.get(cacheKey);
}

async function loadImageSrc() {
  // Suspense Fallback이 보이도록 응답을 지연시킵니다.
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 이미지가 캐시되지 않도록 고유한 매개변수를 추가합니다.
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### 폰트, 이미지, 스타일시트 조율하기 {/*coordinating-fonts-images-and-stylesheets*/}

Suspense 경계는 데이터, 스타일시트, 폰트, 이미지를 한 번에 기다릴 수 있습니다. 폰트와 이미지를 기다리는 동작은 [`<ViewTransition>`](/reference/react/ViewTransition) 업데이트 중에만 발생합니다. 아래 예시에서 `ProfileCard` 컴포넌트는 데이터를 로딩하는 동안 지연됩니다. 이 컴포넌트는 `precedence`를 지정한 스타일시트, 새 폰트를 사용하는 텍스트, 인물 사진을 렌더링합니다. React는 데이터와 스타일시트가 로딩되는 동안 스켈레톤을 계속 보여줍니다. 그런 다음 `<ViewTransition>`이 콘텐츠를 보여주기 전에 폰트와 이미지를 기다리므로 카드가 완성된 상태로 나타납니다.

비교를 위해 React를 사용하지 않는 버전은 같은 데이터를 로딩하고 모든 리소스를 각자 도착하는 대로 표시합니다.

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import VanillaProfileCard from './VanillaProfileCard.js';

function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

function ProfileCardPlaceholder() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>
      {resources && (
        <ViewTransition>
          <Suspense fallback={<ProfileCardPlaceholder />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfileCard />
    </>
  );
}
```

```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export default function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
        .avatar-placeholder { width: 80px; height: 80px; border-radius: 50%; background: #dfe3e9; }
        .name-placeholder, .bio-placeholder { border-radius: 4px; background: #dfe3e9; color: transparent; }
        .name-placeholder { width: 90px; }
        .bio-placeholder { width: 220px; height: 52px; }
      </style>
      <div class="profile-card">
        <div class="avatar-placeholder"></div>
        <div>
          <p class="name name-placeholder">&nbsp;</p>
          <p class="bio bio-placeholder">&nbsp;</p>
        </div>
      </div>
    `);
    doc.close();

    const quote = await fetchQuote();
    doc.body.innerHTML = `
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>`;
    const stylesheet = doc.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = freshStylesheetUrl();
    doc.head.appendChild(stylesheet);
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// 리소스가 캐시되지 않고 실행할 때마다 로딩 상태가
// 보이도록 고유한 매개변수를 추가합니다.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.

export async function fetchQuote() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
  height: 52px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

## 문제 해결 {/*troubleshooting*/}

### 업데이트 중에 UI가 Fallback으로 대체되는 것을 방지하려면 어떻게 해야 하나요? {/*preventing-unwanted-fallbacks*/}

표시되는 UI를 Fallback으로 대체하면 사용자 환경이 불안정해집니다. 이는 업데이트로 인해 컴포넌트가 지연되고 가장 가까운 Suspense가 이미 사용자에게 콘텐츠를 보여주고 있을 때 발생할 수 있습니다.

이런 일이 발생하지 않도록 하려면, [`startTransition`](#preventing-already-revealed-content-from-hiding)을 사용하여 업데이트를 긴급하지 않은 것으로 처리하세요. Transition이 진행되는 동안 React는 원치 않는 Fallback이 나타나지 않도록 충분한 데이터가 로딩될 때까지 기다립니다.

```js {2-3,5}
function handleNextPageClick() {
  // 이 업데이트가 지연되더라도 이미 표시된 콘텐츠를 숨기지 않습니다
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

이렇게 하면 기존 콘텐츠가 숨겨지지 않습니다. 그러나 새로 렌더링된 `Suspense`는 여전히 즉시 Fallback을 보여줘서 UI를 차단하지 않고 콘텐츠가 준비되는 대로 사용자가 볼 수 있게 합니다.

**React는 긴급하지 않은 업데이트 중에만 원치 않는 Fallback을 방지합니다**. 긴급한 업데이트의 결과인 경우 렌더링을 지연시키지 않습니다. [`startTransition`](/reference/react/startTransition) 또는 [`useDeferredValue`](/reference/react/useDeferredValue)와 같은 API를 사용해야 합니다.

Router가 Suspense와 통합된 경우, Router는 업데이트를 자동으로 [`startTransition`](/reference/react/startTransition)에 래핑해야 합니다.
