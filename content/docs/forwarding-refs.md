---
id: forwarding-refs
title: Forwarding Refs
permalink: docs/forwarding-refs.html
---

ref 전달은 컴포넌트를 통해 자식 중 하나에 [ref](/docs/refs-and-the-dom.html)를 자동으로 전달하는 기법입니다. 일반적으로 애플리케이션 대부분의 컴포넌트에 필요하지는 않습니다. 그렇지만, 특히 재사용 가능한 컴포넌트 라이브러리와 같은 어떤 컴포넌트에서는 유용할 수 있습니다. 가장 보편적인 시나리오를 아래에 설명하겠습니다.

## DOM 에 refs 전달하기 {#forwarding-refs-to-dom-components}

기본 `button` DOM 요소를 렌더링하는 `FancyButton` 컴포넌트를 가정해 봅시다.
`embed:forwarding-refs/fancy-button-simple.js`

`FancyButton`를 사용하는 다른 컴포넌트들은 **일반적으로** 내부 `button` DOM 요소에 대한 [ref를 얻을](/docs/refs-and-the-dom.html) 필요가 없습니다. 이는 컴포넌트들이 서로의 DOM 구조에 지나치게 의존하지 않기 때문에 괜찮습니다.

이런 캡슐화는 `FeedStory`나 `Comment` 같은 애플리케이션 레벨의 컴포넌트에서는 바람직하지만, `FancyButton`이나 `MyTextInput`과 같은 재사용성이 높은 "말단" 요소에서는 불편할 수도 있습니다. 이런 컴포넌트들은 일반적인 DOM `button`, `input`과 유사한 방볍으로 애플리케이션 전체에 걸쳐 사용되는 경향이 있습니다. 그리고 포커스, 선택, 애니메이션을 관리하기 위해서는 이런 DOM 노드에 접근하는 것이 불가피할 수 있습니다.

**Ref 전달하기는 일부 컴포넌트가 수신한 `ref`를 받아 조금 더 아래로 전달(즉, "전송")할 수 있는 옵트인 기능입니다.**

아래의 예에서 `FancyButton`은 `React.forwardRef`를 사용하여 전달된 `ref`를 얻고, 그것을 렌더링 되는 DOM `button`으로 전달합니다.

`embed:forwarding-refs/fancy-button-simple-ref.js`

이런 방법으로 `FancyButton`을 사용하는 컴포넌트들은 `button` DOM 노드에 대한 참조를 가져올 수 있고, 필요한 경우 DOM `button`을 직접 사용하는 것처럼 접근할 수 있습니다.

위의 예제에서 어떤 일이 일어나는지 단계별로 설명하겠습니다. 

1. `React.createRef`를 호출해서 [React ref](/docs/refs-and-the-dom.html)를 생성하고 `ref` 변수에 할당합니다.
1. `ref`를 JSX 속성으로 지정해서 `<FancyButton ref={ref}>`로 전달합니다.
1. React는 이 `ref`를 `forwardRef` 내부의 `(props, ref) => ...` 함수의 두 번째 인자로 전달합니다.
1. 이 `ref`를 JSX 속성으로 지정해서 `<button ref={ref}>`으로 전달합니다.
1. ref가 첨부되면 `ref.current`는 `<button>` DOM 노드를 가리키게 됩니다.

>알아두기
>
>두 번째 `ref` 인자는 `React.forwardRef`와 같이 호출된 컴포넌트를 정의했을 때에만 생성됩니다. 일반 함수나 클래스 컴포넌트는 `ref` 인자를 받지도 않고 props에서 사용할 수도 없습니다.
>
>Ref 전달은 DOM 컴포넌트에만 한정적이지 않습니다. 클래스 컴포넌트 인스턴스에도 전달할 수 있습니다. 

## 컴포넌트 라이브러리 유지관리자를 위한 주의사항 {#note-for-component-library-maintainers}

**컴포넌트 라이브러리에서 `forwardRef`를 사용하기 시작할 때 이것을 변경사항으로 간주하고 라이브러리의 새로운 중요 버전을 릴리즈 해야 합니다.** 이는 라이브러리에 주목할 만하게 (ref가 할당되는 것이 무엇이며 내보내는 유형은 무엇인가와 같은) 다른 동작을 할 가능성이 높고 이전 동작에 의존하는 앱이나 다른 라이브러리들이 손상될 가능성이 크기 때문입니다.

조건적으로 `React.forwardRef`가 존재할 때 조건부로 적용하는 것도 같은 이유로 권장하지 않습니다: 라이브러리가 동작하는 방식을 변경하고 React 그 자체를 업데이트할 때 사용자 앱을 손상시킬 수도 있습니다.

## 고차원 컴포넌트에서의 ref 전달하기 {#forwarding-refs-in-higher-order-components}

이 기술은 (HOC로 알려진) [고차원 컴포넌트](/docs/higher-order-components.html)에서 부분적으로 유용할 수 있습니다. 콘솔에 컴포넌트 props를 로깅 하는 HOC 예제로 설명을 시작해 보겠습니다.
`embed:forwarding-refs/log-props-before.js`

"logProps" HOC는 모든 `props`를 래핑하는 컴포넌트로 전달하므로 렌더링 된 결과가 동일하게 됩니다. 예를 들어, 이 HOC를 사용해서 "fancy button" 컴포넌트로 전달하는 모든 props를 로깅 할 수 있습니다.
`embed:forwarding-refs/fancy-button.js`

위 예제에서 한 가지 주의사항이 있습니다: refs는 전달되지 않는다는 것입니다. 그것은 `ref`는 prop이 아니기 때문입니다. `key`와 마찬가지로 `ref`는 React에서 다르게 처리합니다. 만약 HOC에 ref를 추가하면 ref는 래핑 된 컴포넌트가 아니라 가장 바깥쪽 컨테이너 컴포넌트를 참조합니다.

`FancyButton` 컴포넌트를 위한 refs가 실제로는 `LogProps` 컴포넌트에 첨부된다는 것을 의미합니다.
`embed:forwarding-refs/fancy-button-ref.js`

다행히도 `React.forwardRef` API를 사용하여 내부 `FancyButton` 컴포넌트에 대한 refs를 명시적으로 전달할 수 있습니다. `React.forwardRef`는 `props`와 `ref` 파라미터를 받아 React 노드를 반환하는 렌더링 함수를 받습니다. 예를 들어:
`embed:forwarding-refs/log-props-after.js`

## DevTools에 사용자 정의 이름 표시하기 {#displaying-a-custom-name-in-devtools}

`React.forwardRef`는 렌더링 함수를 받습니다. React DevTools는 이 함수를 사용하여 ref 전달 컴포넌트에 대해서 무엇을 표시할 것인지 정의합니다.

예로, 다음의 컴포넌트는 DevTools에 "*ForwardRef*"로 나타날 것입니다.

`embed:forwarding-refs/wrapped-component.js`

만약 렌더링 함수를 지정하면 DevTools에 해당 이름도 포함됩니다. (예, "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

감싸고 있는 컴포넌트를 포함하도록 함수의 `displayName` 속성을 설정할 수도 있습니다.

`embed:forwarding-refs/customized-display-name.js`
