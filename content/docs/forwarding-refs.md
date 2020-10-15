---
id: forwarding-refs
title: Ref 전달하기
permalink: docs/forwarding-refs.html
---

Ref 포워딩은 구셩요소를 통해 자동으로 [ref](/docs/refs-and-the-dom.html)를 자식에게 전달하는 기법이다. 일반적으로 애플리케이셔의 대부분의 구성 요소에는 필요하지 않다. 그러나 일부 구성 요소, 특히 재사용 가능한 구성 요소 라이브러리에서 유용할 수 있다. 가장 일반적인 시나리오는 아래에 설명되어 있다.


## DOM 구성 요소로 참조 전달하기 {# forwarding-refs-to-dom-components}

`FancyButton` 구성 요소에서 기본`button` DOM 요소를 생각 해보자 :
ʻembed : forwarding-refs / fancy-button-simple.js`

React 구성 요소는 렌더링 된 출력을 포함하여 구현 세부 정보를 숨 깁니다. `FancyButton`을 사용하는 다른 구성 요소는 ** 일반적으로 ** 내부`button` DOM 요소에 대한 [ref 획득] (/ docs / refs-and-the-dom.html) 필요가 없습니다. 이는 구성 요소가 서로의 DOM 구조에 너무 많이 의존하는 것을 방지하기 때문에 좋습니다.

이러한 캡슐화는`FeedStory` 또는`Comment`와 같은 애플리케이션 수준 구성 요소에 바람직하지만`FancyButton` 또는`MyTextInput`과 같이 재사용 가능성이 높은 "리프"구성 요소에는 불편할 수 있습니다. 이러한 구성 요소는 일반 DOM '버튼'및 '입력'과 유사한 방식으로 애플리케이션 전체에서 사용되는 경향이 있으며, 포커스, 선택 또는 애니메이션을 관리하기 위해 해당 DOM 노드에 액세스하는 것은 불가피 할 수 있습니다.


** 참조 전달은 일부 구성 요소가 수신 한 '참조'를 가져 와서 하위 항목에게 더 아래로 전달 (즉, "전달") 할 수있는 옵트 인 기능입니다. **

아래 예에서`FancyButton`은`React.forwardRef`를 사용하여 전달 된`ref`를 얻은 다음 렌더링하는 DOM`button`으로 전달합니다.

ʻembed : forwarding-refs / fancy-button-simple-ref.js`

이렇게하면 'FancyButton'을 사용하는 구성 요소는 기본 '버튼'DOM 노드에 대한 참조를 가져 와서 필요한 경우 액세스 할 수 있습니다. 마치 DOM '버튼'을 직접 사용한 것처럼 말입니다.

다음은 위의 예에서 일어나는 일에 대한 단계별 설명입니다.


1.`React.createRef`를 호출하여 [React ref] (/ docs / refs-and-the-dom.html)를 생성하고`ref` 변수에 할당합니다.
1.`ref`를 JSX 속성으로 지정하여`<FancyButton ref = {ref}>`로 전달합니다.
1. React는`ref`를`forwardRef` 내부의`(props, ref) => ...`함수에 두 번째 인자로 전달합니다.
1.이`ref` 인수를 JSX 속성으로 지정하여`<button ref = {ref}>`로 전달합니다.
1. ref가 첨부되면`ref.current`는`<button>`DOM 노드를 가리 킵니다.

> 참고
>
> 두 번째`ref` 인수는`React.forwardRef` 호출로 구성 요소를 정의 할 때만 존재합니다. 일반 함수 또는 클래스 구성 요소는`ref` 인수를받지 않으며 ref는 props에서도 사용할 수 없습니다.
>
> 참조 전달은 DOM 구성 요소로 제한되지 않습니다. 참조를 클래스 구성 요소 인스턴스로 전달할 수도 있습니다.


## 컴포넌트 라이브러리 관리자를위한 참고 사항 {# note-for-component-library-maintainers}

** 컴포넌트 라이브러리에서`forwardRef`를 사용하기 시작하면이를 브레이킹 체인지로 취급하고 라이브러리의 새로운 메이저 버전을 릴리스해야합니다. ** 이는 라이브러리가 눈에 띄게 다른 동작 (예 : refs)을 가질 가능성이 있기 때문입니다. 할당되고 내보내는 유형) 이전 동작에 의존하는 앱 및 기타 라이브러리가 손상 될 수 있습니다.

`React.forwardRef`가 존재할 때 조건부로 적용하는 것도 같은 이유로 권장되지 않습니다. 라이브러리가 동작하는 방식을 변경하고 사용자가 React 자체를 업그레이드 할 때 사용자의 앱을 손상시킬 수 있습니다.


## 상위 구성 요소의 전달 참조 {# forwarding-refs-in-higher-order-components}

이 기술은 [고차 구성 요소] (/ docs / higher-order-components.html) (HOC라고도 함)에서도 특히 유용 할 수 있습니다. 구성 요소 소품을 콘솔에 기록하는 예제 HOC부터 시작하겠습니다.
ʻembed : forwarding-refs / log-props-before.js`

'logProps'HOC는 모든 'props'를 래핑하는 구성 요소로 전달하므로 렌더링 된 출력이 동일합니다. 예를 들어,이 HOC를 사용하여 "fancy button"구성 요소에 전달되는 모든 소품을 기록 할 수 있습니다.
ʻembed : forwarding-refs / fancy-button.js`

위의 예에 대한 한 가지주의 사항이 있습니다. 참조는 통과되지 않습니다. 그것은`ref`가 소품이 아니기 때문입니다. 'key'와 마찬가지로 React에서 다르게 처리됩니다. HOC에 ref를 추가하면 ref는 래핑 된 구성 요소가 아닌 가장 바깥 쪽 컨테이너 구성 요소를 참조합니다.

즉,`FancyButton` 구성 요소를위한 참조가 실제로`LogProps` 구성 요소에 첨부됩니다.
ʻembed : forwarding-refs / fancy-button-ref.js`

다행히도`React.forwardRef` API를 사용하여 내부`FancyButton` 구성 요소에 대한 참조를 명시 적으로 전달할 수 있습니다. `React.forwardRef`는`props` 및`ref` 매개 변수를 수신하고 React 노드를 반환하는 렌더링 함수를받습니다. 예를 들면 :
ʻembed : forwarding-refs / log-props-after.js`

## DevTools {# displaying-a-custom-name-in-devtools}에 사용자 지정 이름 표시

`React.forwardRef`는 렌더링 함수를받습니다. React DevTools는이 함수를 사용하여 참조 전달 구성 요소에 대해 표시 할 내용을 결정합니다.

예를 들어 다음 구성 요소는 DevTools에서 "* ForwardRef *"로 나타납니다.

ʻembed : forwarding-refs / wrapped-component.js`

렌더링 함수의 이름을 지정하면 DevTools에 해당 이름도 포함됩니다 (예 : "* ForwardRef (myFunction) *").

ʻembed : forwarding-refs / wrapped-component-with-function-name.js`

래핑하는 구성 요소를 포함하도록 함수의`displayName` 속성을 설정할 수도 있습니다.

ʻembed : forwarding-refs / customized-display-name.js`
