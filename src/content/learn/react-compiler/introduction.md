---
title: 소개
---

<Intro>
React 컴파일러는 React 앱을 자동으로 최적화하는 새로운 빌드 타임 도구입니다. 일반 JavaScript와 함께 작동하며 [React의 규칙](/reference/rules)을 이해하므로 코드를 다시 작성할 필요 없이 사용할 수 있습니다.
</Intro>

<YouWillLearn>

* React 컴파일러가 하는 일
* 컴파일러 시작하기
* 점진적 도입 전략
* 문제가 발생했을 때 디버깅 및 문제 해결
* React 라이브러리에서 컴파일러 사용하기

</YouWillLearn>

## React 컴파일러는 무엇을 하나요? {/*what-does-react-compiler-do*/}

React 컴파일러는 빌드 시점에 React 애플리케이션을 자동으로 최적화합니다. React는 최적화 없이도 충분히 빠른 경우가 많지만, 때로는 앱의 반응성을 유지하기 위해 컴포넌트와 값을 수동으로 메모이제이션해야 할 때가 있습니다. 이러한 수동 메모이제이션은 지루하고 실수하기 쉬우며 유지보수해야 할 추가 코드가 생깁니다. React 컴파일러는 이 최적화를 자동으로 수행하여 정신적 부담을 덜어주므로 기능 구현에 집중할 수 있습니다.

### React 컴파일러 이전 {/*before-react-compiler*/}

컴파일러 없이는 리렌더링을 최적화하기 위해 컴포넌트와 값을 수동으로 메모이제이션해야 합니다.

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```


<Note>

이 수동 메모이제이션에는 메모이제이션을 깨뜨리는 미묘한 버그가 있습니다.

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

`handleClick`이 `useCallback`으로 감싸져 있더라도, 화살표 함수 `() => handleClick(item)`은 컴포넌트가 렌더링될 때마다 새 함수를 생성합니다. 이는 `Item`이 항상 새로운 `onClick` prop을 받게 되어 메모이제이션이 깨진다는 것을 의미합니다.

React 컴파일러는 화살표 함수 유무와 관계없이 이를 올바르게 최적화하여 `props.onClick`이 변경될 때만 `Item`이 리렌더링되도록 합니다.

</Note>

### React 컴파일러 이후 {/*after-react-compiler*/}

React 컴파일러를 사용하면 수동 메모이제이션 없이 동일한 코드를 작성할 수 있습니다.

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

_[React 컴파일러 Playground에서 이 예시 보기](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

React 컴파일러는 자동으로 최적의 메모이제이션을 적용하여 앱이 필요할 때만 리렌더링되도록 합니다.

<DeepDive>
#### React 컴파일러는 어떤 종류의 메모이제이션을 추가하나요? {/*what-kind-of-memoization-does-react-compiler-add*/}

React 컴파일러의 자동 메모이제이션은 주로 **업데이트 성능 개선**(기존 컴포넌트의 리렌더링)에 초점을 맞추고 있으므로, 다음 두 가지 사용 사례에 집중합니다.

1. **컴포넌트의 연쇄적인 리렌더링 건너뛰기**
    * `<Parent />`를 리렌더링하면 `<Parent />`만 변경되었더라도 컴포넌트 트리의 많은 컴포넌트가 리렌더링됩니다.
1. **React 외부의 비용이 많이 드는 계산 건너뛰기**
    * 예를 들어, 해당 데이터가 필요한 컴포넌트나 Hook 내부에서 `expensivelyProcessAReallyLargeArrayOfObjects()`를 호출하는 경우

#### 리렌더링 최적화 {/*optimizing-re-renders*/}

React는 UI를 현재 state의 함수로 표현할 수 있게 해줍니다 (더 구체적으로는 props, state, context). 현재 구현에서 컴포넌트의 state가 변경되면 React는 `useMemo()`, `useCallback()`, `React.memo()`를 사용한 수동 메모이제이션을 적용하지 않는 한 해당 컴포넌트 _및 모든 자식 컴포넌트_를 리렌더링합니다. 예를 들어, 다음 예시에서 `<MessageButton>`은 `<FriendList>`의 state가 변경될 때마다 리렌더링됩니다.

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_React 컴파일러 Playground에서 이 예시 보기_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React 컴파일러는 수동 메모이제이션과 동등한 것을 자동으로 적용하여 state가 변경될 때 앱의 관련 부분만 리렌더링되도록 합니다. 이를 때때로 "세밀한 반응성"이라고 합니다. 위의 예시에서 React 컴파일러는 `friends`가 변경되더라도 `<FriendListCard />`의 반환 값을 재사용할 수 있다고 판단하고, 이 JSX를 다시 생성하지 않으며 count가 변경될 때 `<MessageButton>`의 리렌더링을 피할 수 있습니다.

#### 비용이 많이 드는 계산도 메모이제이션됩니다 {/*expensive-calculations-also-get-memoized*/}

React 컴파일러는 렌더링 중에 사용되는 비용이 많이 드는 계산도 자동으로 메모이제이션할 수 있습니다.

```js
// 컴포넌트나 Hook이 아니므로 React 컴파일러가 메모이제이션하지 **않음**
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// 컴포넌트이므로 React 컴파일러가 메모이제이션함
function TableContainer({ items }) {
  // 이 함수 호출이 메모이제이션됩니다.
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_React 컴파일러 Playground에서 이 예시 보기_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

그러나 `expensivelyProcessAReallyLargeArrayOfObjects`가 정말로 비용이 많이 드는 함수라면, 다음과 같은 이유로 React 외부에서 자체 메모이제이션을 구현하는 것을 고려해야 할 수 있습니다.

- React 컴파일러는 모든 함수가 아닌 React 컴포넌트와 Hook만 메모이제이션합니다.
- React 컴파일러의 메모이제이션은 여러 컴포넌트나 Hook 간에 공유되지 않습니다.

따라서 `expensivelyProcessAReallyLargeArrayOfObjects`가 여러 다른 컴포넌트에서 사용되는 경우, 정확히 동일한 items가 전달되더라도 비용이 많이 드는 계산이 반복적으로 실행됩니다. 코드를 더 복잡하게 만들기 전에 먼저 [프로파일링](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive)하여 정말로 비용이 많이 드는지 확인하는 것을 권장합니다.
</DeepDive>

## 컴파일러를 사용해 봐야 하나요? {/*should-i-try-out-the-compiler*/}

모든 분들이 React 컴파일러를 사용해 보시길 권장합니다. 현재 컴파일러는 React에 대한 선택적 추가 기능이지만, 미래에는 일부 기능이 완전히 작동하기 위해 컴파일러가 필요할 수 있습니다.

### 사용해도 안전한가요? {/*is-it-safe-to-use*/}

React 컴파일러는 이제 안정적이며 프로덕션에서 광범위하게 테스트되었습니다. Meta와 같은 회사에서 프로덕션에 사용되었지만, 앱의 프로덕션에 컴파일러를 배포하는 것은 코드베이스의 건강 상태와 [React의 규칙](/reference/rules)을 얼마나 잘 따랐는지에 따라 달라집니다.

## 어떤 빌드 도구가 지원되나요? {/*what-build-tools-are-supported*/}

React 컴파일러는 Babel, Vite, Metro, Rsbuild와 같은 [여러 빌드 도구](/learn/react-compiler/installation)에 설치할 수 있습니다.

React 컴파일러는 주로 핵심 컴파일러를 감싸는 가벼운 Babel 플러그인 래퍼로, Babel 자체와 분리되도록 설계되었습니다. 컴파일러의 초기 안정 버전은 주로 Babel 플러그인으로 유지되지만, swc 및 [oxc](https://github.com/oxc-project/oxc/issues/10048) 팀과 협력하여 React 컴파일러에 대한 일급 지원을 구축하고 있어 향후 빌드 파이프라인에 Babel을 다시 추가할 필요가 없을 것입니다.

Next.js 사용자는 [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 이상을 사용하여 swc로 호출되는 React 컴파일러를 활성화할 수 있습니다.

## useMemo, useCallback, React.memo는 어떻게 해야 하나요? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

기본적으로 React 컴파일러는 분석과 휴리스틱을 기반으로 코드를 메모이제이션합니다. 대부분의 경우 이 메모이제이션은 여러분이 작성한 것만큼 정확하거나 더 정확할 것입니다.

그러나 일부 경우에는 개발자가 메모이제이션에 대해 더 많은 제어가 필요할 수 있습니다. `useMemo`와 `useCallback` Hook은 어떤 값이 메모이제이션되는지에 대한 제어를 제공하는 탈출구로 React 컴파일러와 함께 계속 사용할 수 있습니다. 일반적인 사용 사례는 메모이제이션된 값이 Effect 의존성으로 사용되어 의존성이 의미 있게 변경되지 않더라도 Effect가 반복적으로 실행되지 않도록 하는 경우입니다.

새 코드의 경우, 메모이제이션은 컴파일러에 의존하고 정밀한 제어가 필요한 곳에서 `useMemo`/`useCallback`을 사용하는 것을 권장합니다.

기존 코드의 경우, 기존 메모이제이션을 그대로 두거나(제거하면 컴파일 출력이 변경될 수 있음) 메모이제이션을 제거하기 전에 신중하게 테스트하는 것을 권장합니다.

## React 컴파일러 사용해 보기 {/*try-react-compiler*/}

이 섹션은 React 컴파일러를 시작하고 프로젝트에서 효과적으로 사용하는 방법을 이해하는 데 도움이 됩니다.

* **[설치](/learn/react-compiler/installation)** - React 컴파일러를 설치하고 빌드 도구에 맞게 구성하기
* **[React 버전 호환성](/reference/react-compiler/target)** - React 17, 18, 19 지원
* **[설정](/reference/react-compiler/configuration)** - 특정 요구 사항에 맞게 컴파일러 커스텀하기
* **[점진적 도입](/learn/react-compiler/incremental-adoption)** - 기존 코드베이스에서 컴파일러를 점진적으로 배포하기 위한 전략
* **[디버깅 및 문제 해결](/learn/react-compiler/debugging)** - 컴파일러 사용 시 문제 식별 및 해결
* **[라이브러리 컴파일](/reference/react-compiler/compiling-libraries)** - 컴파일된 코드 배포를 위한 모범 사례
* **[API 레퍼런스](/reference/react-compiler/configuration)** - 모든 설정 옵션에 대한 자세한 문서

## 추가 리소스 {/*additional-resources*/}

이 문서 외에도 컴파일러에 대한 추가 정보와 논의를 위해 [React Compiler Working Group](https://github.com/reactwg/react-compiler)을 확인하는 것을 권장합니다.

