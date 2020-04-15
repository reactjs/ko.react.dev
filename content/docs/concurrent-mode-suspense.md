---
id: concurrent-mode-suspense
title: 데이터를 가져오기 위한 Suspense (실험 단계)
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>주의:
>
>이 페이지는 **안정된 배포판에서 [아직 제공되지 않는](/docs/concurrent-mode-adoption.html) 실험적인 기능들**에 대해 설명합니다. 프로덕션용 앱에선 React 실험 배포판을 사용하지 마세요. 이러한 기능들은 React의 일부가 되기 전에 아무 예고 없이 상당히 변경될 수 있습니다.
>
>이 문서는 얼리 어답터와 궁금해하시는 분을 대상으로 합니다. **React를 처음 쓰신다면 이 기능들에 대해 신경 쓰지 마세요.** 당장 익힐 필요는 없습니다. 예를 들어, 바로 작동하는 데이터 불러오기 튜토리얼을 찾고 있다면, [이 문서](https://www.robinwieruch.de/react-hooks-fetch-data/)를 대신 읽으시기 바랍니다.

</div>

React 16.6 added a `<Suspense>` component that lets you "wait" for some code to load and declaratively specify a loading state (like a spinner) while we're waiting:

React 16.6 버전에서는 코드를 불러오는 동안 "기다릴 수 있고", 기다리는 동안 로딩 상태(스피너와 같은 것)를 선언적으로 지정할 수 있도록 `<Suspense>` 컴포넌트가 추가되었습니다.

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 지연 로딩

// 프로필을 불러오는 동안 스피너를 표시합니다
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

데이터를 가져오기 위한 Suspense는 `<Suspense>`를 사용하여 선언적으로 데이터를 비롯한 무엇이든 "기다릴" 수 있도록 해주는 새로운 기능입니다. 이 페이지에서는 사용 사례 가운데 데이터 로딩에 초점을 두지만, 이 기능은 이미지, 스크립트, 그 밖의 비동기 작업을 기다리는 데에도 사용될 수 있습니다.

- [Suspense가 정확히 무엇인가요?](#what-is-suspense-exactly)
  - [Suspense가 아닌 것](#what-suspense-is-not)
  - [Suspense로 가능한 것](#what-suspense-lets-you-do)
- [실전에서 Suspense 사용하기](#using-suspense-in-practice)
  - [Relay를 사용하지 않는 경우에는?](#what-if-i-dont-use-relay)
  - [라이브러리 개발자의 경우](#for-library-authors)
- [기존의 접근 방식 vs Suspense](#traditional-approaches-vs-suspense)
  - [접근 방식 1: 렌더링 직후 불러오기 (Suspense 미사용)](#approach-1-fetch-on-render-not-using-suspense)
  - [접근 방식 2: 불러오기 이후 렌더링 (Suspense 미사용)](#approach-2-fetch-then-render-not-using-suspense)
  - [접근 방식 3: 불러올 때 렌더링 (Suspense 사용)](#approach-3-render-as-you-fetch-using-suspense)
- [일찍 불러오기 시작하기](#start-fetching-early)
  - [여전히 알아보는 중입니다](#were-still-figuring-this-out)
- [Suspense와 경쟁 상태](#suspense-and-race-conditions)
  - [useEffect에 의한 경쟁 상태](#race-conditions-with-useeffect)
  - [componentDidUpdate에 의한 경쟁 상태](#race-conditions-with-componentdidupdate)
  - [문제점](#the-problem)
  - [Suspense로 경쟁 상태 해결하기](#solving-race-conditions-with-suspense)
- [오류 처리하기](#handling-errors)
- [다음 단계](#next-steps)

## Suspense가 정확히 무엇인가요? {#what-is-suspense-exactly}

Suspense를 사용하면 컴포넌트가 렌더링되기 전까지 기다릴 수 있습니다. [이 예시](https://codesandbox.io/s/frosty-hermann-bztrp)에서는 두 컴포넌트가 데이터를 불러오는 비동기 API 호출을 기다립니다.

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 비록 아직 불러오기가 완료되지 않았겠지만, 사용자 정보 읽기를 시도합니다
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 비록 아직 불러오기가 완료되지 않았겠지만, 게시글 읽기를 시도합니다
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/frosty-hermann-bztrp)**

이 데모는 일부분에 불과합니다. 아직 잘 이해가 가지 않아도 걱정하지 마세요. 어떤 식으로 작동하는지 아래에서 더 자세하게 이야기할 겁니다. Suspense는 *메커니즘*에 가까운 것이고, 위 예시에 등장하는 `fetchProfileData()` 또는 `resource.posts.read()`와 같은 특정 API는 여기서 그렇게 중요하지 않다는 것만 유념하시기 바랍니다. 더 궁금하시다면, 각 API의 정의를 [샌드박스 데모](https://codesandbox.io/s/frosty-hermann-bztrp)에서 확인할 수 있습니다.

Suspense는 데이터 불러오기 라이브러리가 아닙니다. Suspense는 *컴포넌트가 읽어들이고 있는 데이터가 아직 준비되지 않았다*고 React에 알려줄 수 있는, **데이터 불러오기 라이브러리에서 사용할 수 있는 메커니즘**입니다. 이후에 React는 데이터가 준비되기를 기다렸다가 UI를 갱신할 수 있습니다. Facebook에서는 Relay와 Relay가 제공하는 [새로운 Suspense 통합 기능](https://relay.dev/docs/en/experimental/step-by-step)을 사용하고 있습니다. Apollo와 같은 다른 라이브러리에서도 유사한 통합 기능을 제공할 것으로 기대합니다.

장기적인 관점으로는, Suspense가 데이터 출처와 상관없이 컴포넌트로부터 비동기 데이터를 읽는 데에 사용되는 주된 방식으로 거듭나길 바라고 있습니다.

### Suspense가 아닌 것 {#what-suspense-is-not}

Suspense는 위의 문제에 대한 기존의 접근 방식과는 상당히 다르기 때문에, 처음 접할 때 종종 오해를 만들어냅니다. 가장 흔한 오해들을 명확히 짚어보겠습니다.

 * **Suspense는 데이터 불러오기에 대한 구현이 아닙니다.** 당신이 GraphQL, REST, 또는 그 이외의 특정한 데이터 형식, 라이브러리, 통신 방식, 프로토콜 등

 * **It is not a data fetching implementation.** It does not assume that you use GraphQL, REST, or any other particular data format, library, transport, or protocol.

 * **Suspense는 바로 사용할 수 있는 클라이언트가 아닙니다.** `fetch` 또는 Relay를 Suspense로 "대체"할 수 없습니다. 다만, Suspense로 통합된 라이브러리를 사용할 수는 있습니다(예를 들어, [새로운 Relay API](https://relay.dev/docs/en/experimental/api-reference)와 같은 것이 있습니다).

 * **Suspense는 데이터 불러오기 작업과 뷰 레이어를 결합해주지 않습니다.** UI 상에 로딩 상태를 표시할 수 있도록 조정하는 것을 돕지만, 이는 네트워크 로직을 React 컴포넌트에 종속시키는 것은 아닙니다.

### Suspense로 가능한 것 {#what-suspense-lets-you-do}

그렇다면 Suspense는 왜 사용하는 것일까요? 이에 대한 몇 가지 답이 있습니다.

* **데이터 불러오기 라이브러리들이 React와 깊게 결합할 수 있도록 해줍니다.** 데이터 불러오기 라이브러리가 Suspense 지원을 구현한다면, React 컴포넌트에서 이를 사용하는 것이 아주 자연스럽게 느껴질 것입니다.

* **의도적으로 설계된 로딩 상태를 조정할 수 있도록 해줍니다.** Suspense는 데이터가 _어떻게_ 불러져야 하는지를 정하지 않고, 당신이 앱의 시각적인 로딩 단계를 밀접하게 통제할 수 있도록 해줍니다.

* **경쟁 상태(Race Condition)를 피할 수 있도록 돕습니다.** `await`를 사용하더라도 비동기 코드는 종종 오류가 발생하기 쉽습니다. Suspense를 사용하면 데이터를 *동기적으로* 읽어오는 것처럼 느껴지게 해줍니다. 마치 이미 불러오기가 완료된 것처럼 말입니다.

## 실전에서 Suspense 사용하기 {#using-suspense-in-practice}

Facebook에서는 현재 Suspense를 사용한 Relay 통합만을 프로덕션 환경에서 사용하고 있습니다. **바로 시작할 수 있는 실무 가이드를 찾고 계시다면, [Relay 가이드를 확인하시기 바랍니다](https://relay.dev/docs/en/experimental/step-by-step)!** 이 문서에서는 프로덕션 환경에서 이미 잘 작동하고 있는 패턴들을 설명합니다.

**이 페이지의 코드 데모는 Relay가 아닌 "가짜" API 구현을 사용합니다.** 이 데모는 당신이 GraphQL에 익숙하지 않아도 이해하기 쉽지만, Suspense를 사용하여 앱을 만드는 "올바른 방법"을 알려주지는 않습니다. 이 페이지는 보다 개념적인 측면이 강하며, Suspense가 *왜* 특정 방식으로 작동하는지, 어떤 문제를 해결하고자 하는지를 당신이 이해하도록 돕고자 하는 목적을 가집니다.

### Relay를 사용하지 않는 경우에는? {#what-if-i-dont-use-relay}

당장 Relay를 사용할 것이 아니라면, 앱에서 Suspense를 실제로 사용할 수 있게 될 때까지 기다려야 할 겁니다. 현재까지 프로덕션 환경에서의 테스트를 완료하고, 사용에 문제가 없다고 자신할 수 있는 구현은 Relay 뿐입니다.

앞으로 수 개월 동안, Suspense API들을 사용하는 다양한 형태의 라이브러리들이 등장할 것입니다. **기능들이 안정된 뒤에 배우고 싶으시다면, 이와 관련된 작업은 잠시 잊고 계시다가 Suspense의 생태계가 보다 성숙한 뒤에 돌아오는 것이 좋을 겁니다.**

원하신다면, 데이터 불러오기 라이브러리를 위한 통합 기능을 직접 작성해보는 것도 좋습니다.

### 라이브러리 개발자의 경우 {#for-library-authors}

우리는 라이브러리를 개발하는 커뮤니티에서 다양한 실험이 이루어지기를 기대하고 있습니다. 데이터 불러오기 라이브러리를 개발하는 분들께 한 가지 말씀드릴 점이 있습니다.

Suspense는 기술적으로는 사용 가능한 상태이지만, 컴포넌트가 렌더링될 때 Suspense를 사용하여 데이터 불러오기를 시작하는 것은 현재 의도된 사용 방식이 **아닙니다.** 오히려, Suspense는 컴포넌트로 하여금 *이미 불러오기가 완료된* 데이터를 "기다리는 중"임을 나타내도록 해줍니다. **[Concurrent 모드와 Suspense를 사용하여 좋은 사용자 경험 만들기](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)** 문서에서 왜 이 사안이 중요한지, 그리고 이러한 패턴을 실무에서 어떻게 구현하는지를 설명합니다.

워터폴(Waterfall) 문제를 방지할 해결책이 있는 것이 아니라면, 렌더링 이전에 불러오기를 먼저 수행하는 API의 사용을 권장합니다. 구체적인 예시를 보려면, [Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery)가 프리 로딩(Preloading)을 수행하는 방식을 살펴보시기 바랍니다. 이 사안에 대한 우리의 입장은 지금까지 그렇게 일관적이지 않았습니다. 데이터 불러오기를 위한 Suspense는 현재에도 실험 단계이므로, 프로덕션 사용 예시와 이 사안에 대한 연구가 더 이루어지는 과정에서 우리가 제시하는 의견이 달라질 수도 있습니다.

## 기존의 접근 방식 vs Suspense {#traditional-approaches-vs-suspense}

Suspense를 소개할 때 대중적인 데이터 불러오기 방식을 언급하지 않을 수도 있을 것입니다. 하지만, 그러면 Suspense가 해결하고자 하는 문제가 무엇인지, 왜 그 문제가 해결할 가치를 가지는지, Suspense가 기존의 해결책과 다른 점이 무엇인지 이해하기 어려울 것입니다.

대신, Suspense를 일련의 접근 방식들에서 논리적인 다음 단계로 바라보겠습니다.

* **렌더링 직후 불러오기 (예를 들어, `useEffect` 내에서 `fetch`):** 컴포넌트 렌더링을 시작합니다. 각각의 컴포넌트는 Effect와 생명 주기 메서드 내에서 데이터 불러오기를 발동시킵니다. 이 접근법은 종종 "워터폴"로 이어집니다.
* **불러오기 이후 렌더링 (예를 들어, Suspense 없이 Relay 사용):** 최대한 일찍 다음 화면을 위한 데이터 불러오기를 시작합니다. 데이터가 준비되었을 때 화면을 렌더링합니다. 데이터가 도착하기 전까지는 아무 것도 할 수 없습니다.
* **불러올 때 렌더링 (예를 들어, Suspense와 함께 Relay 사용):** 최대한 일찍 다음 화면에서 필요한 데이터 불러오기를 시작하고, 다음 화면 렌더링을 *네트워크 응답을 받기 전에 즉시* 시작합니다. 데이터가 흘러들어옴에 따라, React는 모든 데이터가 준비될 때까지 데이터를 필요로 하는 컴포넌트의 렌더링을 다시 시도합니다.

>주의
>
>위의 설명은 다소 단순화된 것으로, 실제 해결 방안은 다양한 접근 방식을 혼합하여 사용하게 됩니다. 하지만 장단점을 잘 비교할 수 있도록 각각을 분리하여 생각해보겠습니다.

각 접근 방식을 비교하기 위하여, 각각을 사용하여 프로필 페이지를 구현하겠습니다.

### 접근 방식 1: 렌더링 직후 불러오기 (Suspense 미사용) {#approach-1-fetch-on-render-not-using-suspense}

React 앱에서 데이터를 불러오는 가장 흔한 방식은 Effect를 사용하는 것입니다.

```js
// 함수 컴포넌트에서:
useEffect(() => {
  fetchSomething();
}, []);

// 또는, 클래스 컴포넌트에서:
componentDidMount() {
  fetchSomething();
}
```

이러한 접근 방식을 "렌더링 직후 불러오기"라고 부릅니다. 왜냐하면 화면 상에 컴포넌트가 렌더링 완료된 *후에* 비로소 데이터 불러오기를 시작하기 때문입니다. 이는 "워터폴"이라고 부르는 문제로 이어집니다.

아래의 `<ProfilePage>`와 `<ProfileTimeline>` 컴포넌트를 보시기 바랍니다.

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/fragrant-glade-8huj6)**

위의 코드를 실행하고 콘솔 로그를 살펴보면, 아래와 같은 일련의 결과를 확인할 수 있습니다.

1. 사용자 정보 불러오기 시작
2. 기다리기...
3. 사용자 정보 불러오기 완료
4. 게시글 불러오기
5. 기다리기...
6. 게시글 불러오기 완료

만약 사용자 정보 불러오기가 3초 소요된다면, 3초가 지난 뒤에야 비로소 게시글 불러오기를 *시작*할 수 있는 것입니다! 이것이 바로 "워터폴"로, 병렬화될 수 있었으나 의도하지 않게 *순차적으로* 실행되는 현상입니다.

워터폴은 렌더링 직후 데이터를 불러오는 코드에서 흔히 발생합니다. 이를 고치는 것은 가능하지만, 앱이 거대해짐에 따라 많은 사람들은 이 문제를 방지할 수 있는 해결책을 원할 것입니다.

### 접근 방식 2: 불러오기 이후 렌더링 (Suspense 미사용) {#approach-2-fetch-then-render-not-using-suspense}

라이브러리는 데이터를 불러오는 데에 있어 보다 중앙화된 방식을 제공하는 것으로 워터폴을 방지할 수 있습니다. 예를 들어 Relay의 경우, 컴포넌트가 필요로 하는 데이터에 대한 정보를 정적으로 분석할 수 있는 *부분들*로 옮겨서 이 문제를 해결합니다. 이 부분들은 이후에 하나의 단일 쿼리로 통합됩니다.

이 페이지에서는 Relay에 대한 배경 지식이 없다고 가정하므로, Relay를 예시로 들지 않겠습니다. 대신, 데이터 불러오기 메서드를 하나로 합쳐서, 비슷한 앞서 설명한 것과 유사한 코드를 직접 작성해보겠습니다.

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

아래의 예시에서는 `<ProfilePage>`가 두 요청을 기다리는데, 두 요청은 동시에 시작됩니다.

```js{1,2,8-13}
// 최대한 일찍 불러오기를 발동시킵니다
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// 자식 컴포넌트들은 더 이상 불러오기를 발동시키지 않습니다
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/wandering-morning-ev6r0)**

이벤트가 발동하는 순서는 이제 아래와 같이 바뀝니다.

1. 사용자 정보를 불러오기 시작
2. 게시글 불러오기 시작
3. 기다리기...
4. 사용자 정보 불러오기 완료
5. 게시글 불러오기 완료

기존에 존재했던 네트워크 "워터폴" 현상은 고쳤지만, 의도하지 않은 또다른 문제를 만들었습니다. `fetchProfileData` 내에서 `Promise.all()`을 사용하는 과정에서 *모든* 데이터가 반환되기를 기다려야 합니다. 따라서 게시글들을 모두 불러오기 전까지는 프로필 정보를 렌더링할 수 없습니다. 둘 다 기다려야 합니다.

물론, 이 예시에서는 이를 고칠 수 있습니다. `Promise.all()` 호출을 없애고, 두 프라미스를 따로 기다리면 됩니다. 하지만, 이러한 접근 방식은 데이터와 컴포넌트 트리의 복잡도가 커짐에 따라 점점 더 어려워집니다. 데이터 트리 내의 임의 부분이 사라지거나 오래될 수 있는 상황에서는 신뢰할 수 있는 컴포넌트를 작성하기 어렵습니다. 따라서 새로운 화면을 위한 데이터를 모두 불러오고 *그 다음에* 렌더링하는 것이 종종 보다 현실적인 선택지입니다.

### 접근 방식 3: 불러올 때 렌더링 (Suspense 사용) {#approach-3-render-as-you-fetch-using-suspense}

직전의 접근 방식에서는 아래와 같이, `setState`를 호출하기 전에 데이터를 불러왔습니다.

1. 불러오기 시작
2. 불러오기 완료
3. 렌더링 시작

Suspense를 사용하면, 불러오기를 먼저 시작하면서도 아래와 같이 마지막 두 단계의 순서를 바꿔줄 수 있습니다.

1. 불러오기 시작
2. **불러오기 완료**
3. **렌더링 시작**

**Suspense를 사용하면, 렌더링을 시작하기 전에 응답이 오기를 기다리지 않아도 됩니다.** 사실 네트워크 요청을 발동시키고서, 아래와 같이 *상당히 바로* 렌더링을 발동시킵니다.

```js{2,17,23}
// 이것은 프라미스가 아닙니다. Suspense 통합에서 만들어낸 특별한 객체입니다.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // 아직 로딩이 완료되지 않았더라도, 사용자 정보 읽기를 시도합니다
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // 아직 로딩이 완료되지 않았더라도, 게시글 읽기를 시도합니다
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/frosty-hermann-bztrp)**

화면 상에 `<ProfilePage>`를 렌더링할 때에 아래와 같은 일들이 벌어집니다.

1. 이미 `fetchProfileData()` 내에서 요청을 발동시켰습니다. 이 함수는 프라미스가 아니라 특별한 "자원"을 돌려줍니다. 보다 현실적인 예시에서는, Relay와 같은 데이터 라이브러리에서 제공하는 Suspense 통합을 제공할 겁니다.
2. React는 `<ProfilePage>`의 렌더링을 시도합니다. 자식 컴포넌트로 `<ProfileDetails>`와 `<ProfileTimeline>`을 반환합니다.
3. React는 `<ProfileDetails>`의 렌더링을 시도합니다. `resource.user.read()`를 호출합니다. 아직 불러온 데이터가 아무 것도 없으므로, 이 컴포넌트는 "정지합니다". React는 이 컴포넌트를 넘기고, 트리 상의 다른 컴포넌트의 렌더링을 시도합니다.
4. React는 `<ProfileTimeline>`의 렌더링을 시도합니다. `resource.posts.read()`를 호출합니다. 또 한번, 아직 데이터가 없으므로, 이 컴포넌트 또한 "정지합니다". React는 이 컴포넌트도 넘기고, 트리 상의 다른 컴포넌트릐 렌더링을 시도합니다.
5. 렌더링을 시도할 컴포넌트가 남아있지 않습니다. `<ProfileDetails>`가 정지된 상태이므로, React는 트리 상에서 `<ProfielDetails>` 위에 존재하는 것 중 가장 가까운 `<Suspense>` Fallback을 찾습니다. 그것은 `<h1>Loading profile...</h1>`입니다. 일단, 지금으로서는 할 일이 다 끝났습니다.

여기에서 `resource` 객체는 아직은 존재하지 않지만, 결국엔 로딩이 이루어질 데이터를 나타냅니다. `read()`를 호출할 경우, 데이터를 얻거나, 또는 컴포넌트가 "정지합니다".

**데이터가 계속 흘러들어옴에 따라, React는 렌더링을 다시 시도하며, 그 때마다 React가 "더 깊은 곳까지" 처리할 수 있게 될 겁니다.** `resource.user`를 불러오고 나면, `<ProfileDetails>` 컴포넌트는 성공적으로 렌더링이 이루어지고 `<h1>Loading profile...</h1>` Fallback은 더 이상 필요가 없어집니다. 결국 모든 데이터가 준비될 것이고, 화면 상에는 Fallback이 사라질 것입니다.

이것은 아주 흥미로운 의미를 지닙니다. 설령 한번의 요청으로 모든 데이터 요구 사항을 충족시킬 수 있는 GraphQL 클라이언트를 사용할지라도, *응답이 계속 흘러들어오도록 하면 컨텐츠를 더 일찍 표시할 수 있게 해줍니다.* (불러오기 *이후*가 아니라) *불러올 때에* 렌더링을 수행하기 때문에, `user`가 `posts`보다 응답에 먼저 들어있을 경우, 응답이 완료되기도 전에 바깥의 `<Suspense>` 경계를 해제할 수 있습니다. 우리가 이 부분을 처음에 놓치고 지나갔겠지만, 불러오기 이후에 렌더링을 하는 해결 방식에서도 워터폴은 나타납니다. 바로 불러오기와 렌더링 사이에 말입니다. Suspense을 사용하면 애초부터 이러한 워터폴을 경험하지 않을 수 있고, Relay와 같은 라이브러리들은 이러한 이점을 활용하고 있습니다.

컴포넌트에서 "로딩 여부를 확인하는" `if (...)` 검사가 제거된 것을 유의하시기 바랍니다. 이렇게 하면 보일러플레이트 코드를 제거할 뿐만 아니라, 간단한 절차만으로 신속한 디자인 변화를 만들 수 있게 해줍니다. 예를 들어, 프로필 정보와 게시글이 항상 함께 "나타나도록" 해야 한다면, 그 둘 사이의 `<Suspense>` 경계를 제거해주면 됩니다. 또는 각 컴포넌트에게 *고유한* `<Suspense>` 경계를 부여하여 각각을 독립시켜줄 수도 있습니다. Suspense는 로딩 상태의 기본 단위를 변경할 수 있고, 코드를 크게 변경하지 않고도 로딩 상태의 배치를 조정할 수 있도록 해줍니다.

## 일찍 불러오기 시작하기 {#start-fetching-early}

만약 당신이 데이터 불러오기 라이브러리를 개발 중이라면, 불러올 때 렌더링을 다루는 데에 있어 주목해야 하는 아주 중요한 측면이 있습니다. **렌더링을 수행하기 _전에_ 불러오기를 발동시킵니다.** 아래의 코드 예시를 자세히 보십시오.

```js
// 불러오기를 일찍 시작!
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // 사용자 정보 읽기 시도
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/frosty-hermann-bztrp)**

위 예시에서 `read()` 호출은 불러오기를 *시작*시키지 않습니다. 단지 **이미 불러오기가 완료된** 데이터를 읽어들이기 시도할 뿐입니다. 이 차이는 Suspense를 사용하여 빠른 어플리케이션을 만들고자 할 때에 아주 중요합니다. 컴포넌트가 렌더링을 시작할 때까지 데이터 불러오기를 미루고 싶지 않기 때문입니다. 데이터 불러오기 라이브러리의 개발자로서, 불러오기가 시작되기 전에는 `resource` 객체를 사용할 수 없도록 하여서 이러한 정책을 강제할 수 있습니다. 이 페이지에서 "가짜 API 구현"을 사용하는 모든 데모에서는 이를 강제하고 있습니다.

위 예시와 같이 "최상위 수준에서" 불러오기를 수행하는 것은 현실적이지 않다고 반박할 수도 있을 것입니다. 만약 다른 프로필 페이지로 이동한다면 어떻게 할까요? Props에 기반하여 불러오기를 수행해야 할 수도 있습니다. 이에 대한 답은  **그 대신, 이벤트 핸들러에서 불러오기를 시작하는 것**입니다. 아래는 사용자 페이지 간에 전환하는 예시의 간단한 버전입니다.

```js{1,2,10,11}
// 첫번째 불러오기: 최대한 일찍
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // 다음 불러오기: 사용자가 클릭했을 때
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/infallible-feather-xjtbu)**

이러한 접근 방식에서는, 코드와 데이터를 동시에 불러올 수 있습니다. 페이지를 전환할 때, 페이지에서 필요한 데이터를 불러오기 위하여 페이지의 코드를 기다릴 필요는 없습니다. 똑같은 시점에 코드와 데이터를 동시에 가져오기 시작하여 (링크를 클릭하는 동안), 더 향상된 사용자 경험을 전달할 수 있습니다.

이는 다음 화면을 렌더링하기 전에 *무엇*을 불러올지 어떻게 알수 있는지에 대한 질문으로 이어집니다. 여기에는 몇 가지 방법이 존재합니다. 예를 들어, 당신이 사용하는 라우팅 방식에 데이터 불러오기를 깊게 결합하는 방법도 있습니다. 만약 데이터 불러오기 라이브러리를 작업하고 있다면, [Concurrent 모드와 Suspense를 사용하여 좋은 사용자 경험 만들기](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) 글을 통하여 위의 질문을 어떻게 해결할 수 있으며 이 문제가 왜 중요한지에 대하여 깊이있는 답을 확인할 수 있습니다.

### 여전히 알아보는 중입니다 {#were-still-figuring-this-out}

메커니즘으로서 Suspense는 유연하며 제약이 많은 편이 아닙니다. 프로덕션 코드에서는 워터폴이 없도록 보다 많은 제약 사항이 필요하지만, 이를 보장하는 방법은 다양합니다. 우리가 현재 탐구하고 있는 질문은 아래와 같은 것들이 있습니다.

* 일찍 불러오는 것은 표현하기 까다롭습니다. 더 쉽게 워터폴을 피하려면 어떻게 해야 할까요?
* 어떤 페이지 데이터를 불러올 때, 이 페이지*로부터의* 즉각적인 전환을 위한 데이터를 포함하게끔 API가 장려할 수 있을까요?
* 응답의 수명은 얼마나 될까요? 캐싱은 전역적이어야 할까요, 지역적이어야 할까요? 누가 캐시를 관리해야 할까요?
* 다른 위치에 `read()` 호출을 넣지 않고도 프록시(Proxy)가 지연 로딩된 API를 표현할 수 있을까요?
* 임의의 Suspense 데이터를 위한 GraphQL 쿼리를 구성한다면 어떤 형태를 가질까요?

Relay는 위의 질문들에 대하여 나름의 해답을 가지고 있습니다. 분명히 여러 가지 방법이 있고, React 커뮤니티에서 등장할 새로운 아이디어가 무엇일지 무척 궁금합니다.

## Suspense와 경쟁 상태 {#suspense-and-race-conditions}

경쟁 상태(Race Condition)는 코드가 실행되는 순서에 대한 부정확한 가정에서 비롯되는 버그입니다. `useEffect` Hook 또는 `componentDidUpdate`와 같은 클래스 생명주기 메서드 내에서 데이터를 불러오면 종종 이 버그로 이어집니다. Suspense는 여기서도 도움이 될 수 있습니다. 어떻게 그런지 살펴보겠습니다.

이 문제를 설명하려면, 최상위 수준에 `<App>` 컴포넌트를 아래와 같이 추가해야 합니다. 이 컴포넌트는 **다른 프로필로 전환**하게 해주는 버튼을 가지는 `<ProfilePage>`을 렌더링합니다.

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Next
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

이러한 요구 사항을 다루는 다른 데이터 불러오기 전략을 비교해보도록 하겠습니다.

### `useEffect`에 의한 경쟁 상태 {#race-conditions-with-useeffect}

우선, 가장 본래의 버전인 "Effect 내에서 불러오기" 예시를 사용해보도록 하겠습니다. 아래 코드에서는 조금 수정하여, `<ProfilePage>`의 Prop으로부터 `id` 매개 변수를 `fetchUser(id)`와 `fetchPosts(id)`에 전달하겠습니다.

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/nervous-glade-b5sel)**

Effect 의존성을 `[]`에서 `[id]`로 바꾼 것을 주목하시기 바랍니다. 이는 `id`가 바뀔 때마다 Effect를 다시 실행하도록 만들어야 하기 때문입니다. 그렇지 않으면 새로운 데이터를 다시 불러올 수 없을 겁니다.

이 코드를 사용하면, 처음에는 잘 동작하는 것처럼 보일 겁니다. 하지만, "가짜 API" 구현에서 지연 시간을 무작위로 부여하고, "Next" 버튼을 아주 빠르게 누르게 되면, 무언가 아주 잘못 동작되는 것을 콘솔 로그를 통하여 확인할 수 있을 것입니다. **다른 ID의 프로필로 전환하고 난 뒤에도 직전 프로필에서 보낸 요청이 돌아오는 경우가 가끔 발생하는 것입니다. 그리고 이로 인하여 새로운 State에 다른 ID에 대한 오래된 응답을 덮어쓰게 됩니다.**

이 문제는 고칠 수 있습니다. Effect를 정리하는 함수를 사용하여 오래된 요청을 무시하거나 취소할 수 있겠습니다. 하지만 이는 직관적이지 않고 디버그하기도 어렵습니다.

### `componentDidUpdate`에 의한 경쟁 상태{#race-conditions-with-componentdidupdate}

이 문제가 `useEffect` 또는 Hooks에 국한된 것이라고 생각하는 분도 계실 겁니다. 아마도 이 코드를 클래스로 변환하거나 `async` / `await`와 같은 편리한 문법을 사용한다면, 문제가 해결되지 않을까요?

한번 해봅시다.

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/trusting-clarke-8twuq)**

이 코드는 놀라울 정도로 읽기 쉽습니다.

유감스럽게도, 클래스를 사용하는 것도 `async` / `await` 문법을 사용하는 것도 이 문제를 해결하는 데에는 도움이 되지 않습니다. 이 버전의 코드는 똑같은 이유로, 똑같은 경쟁 상태에 빠지게 됩니다.

### 문제점 {#the-problem}

React 컴포넌트에는 고유한 "생명 주기"가 있습니다. 특정 시점마다 Props를 받거나 State를 갱신합니다. 하지만, 각각의 비동기 요청도 *또한* 고유한 "생명 주기"를 가집니다. 이 생명 주기는 요청이 발동되었을 때 시작되며, 응답이 돌아왔을 때에 끝납니다. 이 문제에서 경험하는 어려운 지점은 여러 프로세스가 서로에게 영향을 미치는 그 순간 프로세스들을 "동기화"하는 작업입니다. 이 문제는 생각해내기 어렵습니다.

### Suspense로 경쟁 상태 해결하기 {#solving-race-conditions-with-suspense}

같은 예시를 Suspense만을 사용하여 다시 작성해보겠습니다.

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/infallible-feather-xjtbu)**

기존에 사용했었던 Suspense 예시에서는 오직 하나의 `resource`만이 존재했고, 따라서 이 `resource`를 최상위 수준의 변수로서 관리했습니다. 지금은 여러 Resource들이 존재하므로, `<App>`의 컴포넌트 State로 이동시켰습니다.

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

"Next"를 누르면, `<App>` 컴포넌트가 다음 프로필에 대한 요청을 발동시키고, *그* 객체를 `<ProfilePage>` 컴포넌트로 전달합니다.

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Next
    </button>
    <ProfilePage resource={resource} />
  </>
```

다시 한번, **응답이 State를 설정하기를 기다리고 있지 않다**는 점에 주목하시기 바랍니다. **오히려 전혀 반대 방법입니다. 즉, 요청을 발동시킨 뒤에 즉시 State를 설정합니다(그리고 렌더링을 시작합니다).** 데이터를 더 확보하게 되는 즉시, React는 `<Suspense>` 컴포넌트 내에 컨텐츠를 "주입합니다".

이 코드는 아주 읽기 좋게 작성되어있지만, 기존의 예시들과 달리 Suspense 버전에서는 경쟁 상태가 존재하지 않습니다. 그 이유가 궁금하실 겁니다. 그 이유는 바로 Suspense 버전에서는 코드 상에서 *시간*에 대한 것을 그다지 고려하지 않아도 되기 때문입니다. 경쟁 상태가 존재했던 기존의 코드에서는 *이후의 적절한 시점에* State를 설정하지 않으면 코드가 제대로 작동하지 않게 됩니다. 하지만 Suspense를 사용할 때는 *즉시* State를 설정합니다. 따라서 오작동하는 것이 더 어려워질 정도입니다.

## 오류 처리하기 {#handling-errors}

프라미스를 사용하여 코드를 작성할 때, 오류를 처리하기 위하여 `catch()`를 사용했을 겁니다. Suspense를 사용할 때는 프라미스가 렌더링을 시작하길 *기다리지* 않는데, 이러한 오류 처리가 어떻게 이루어질까요?

Suspense를 사용하면, 불러오기에서 발생한 오류를 처리하는 것이 렌더링 오류를 처리하는 것과 동일한 방식으로 이루어집니다. 어디에서든 [오류 경계](/docs/error-boundaries.html)를 렌더링하여 그 아래에 존재하는 컴포넌트의 오류를 "잡아낼" 수 있습니다.

우선, 프로젝트 전체에 걸쳐 사용할 오류 경계 컴포넌트를 아래와 같이 정의합니다.

```js
// 오류 경계는 현재 클래스 형태이어야 합니다.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

이제 오류 경계를 아래와 같이 트리 상의 오류를 잡아낼 곳 어디에든 배치하면 됩니다.

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[CodeSandbox에서 따라해보기](https://codesandbox.io/s/adoring-goodall-8wbn7)**

이 오류 경계는 렌더링 오류, *그리고* 데이터 불러오기를 위한 Suspense에서 발생한 오류를 둘 다 잡아낼 겁니다. 오류 경계는 쓰고 싶은 만큼 사용할 수 있지만, 오류 경계의 배치는 [계획적으로](https://aweary.dev/fault-tolerance-react/) 이루어지는 것이 제일 좋습니다.

## 다음 단계 {#next-steps}

이제 데이터 불러오기를 위한 Suspense의 기본을 모두 다루었습니다! 더 중요한 것은, *왜* Suspense가 이런 방식으로 동작하는지, 데이터 불러오기 분야에 어떤 식으로 적용되는지 등을 보다 잘 이해할 수 있게 되었다는 것입니다.

Suspense는 몇몇 질문에 대한 해답을 제시하지만, 동시에 아래와 같은 새로운 질문을 제시하기도 합니다.

* 어떤 컴포넌트가 "정지할 때", 앱이 덩달아 멈출까요? 이를 피하려면 어떻게 할까요?
* 트리 상에서 컴포넌트 바로 위가 아닌, 다른 지점에 스피너를 표시하고 싶을 때에는 어떻게 할까요?
* 잠시 동안 *의도적으로* 일관적이지 않은 UI를 표시하고 싶다면, 이것이 가능할까요?
* 스피너를 표시하는 대신, 현재 화면을 "회색으로 만드는" 것과 같은 시각 효과를 더할 수 있나요?
* [마지막 Suspense 예시](https://codesandbox.io/s/infallible-feather-xjtbu)에서 "Next" 버튼을 클릭했을 때 왜 경고 로그가 표시되나요?

이러한 질문에 대한 답을 하기 위하여, [Concurrent UI 패턴](/docs/concurrent-mode-patterns.html)에서 다음 절을 읽어보도록 하겠습니다.
