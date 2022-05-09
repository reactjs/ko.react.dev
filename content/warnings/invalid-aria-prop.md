---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

웹 접근성 이니셔티브(WAI) 접근 가능한 리치 인터넷 애플리케이션(Rich Internet Application)의 [명세](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)에 없는 aria-* 프로퍼티로 DOM 요소를 렌더링하려고 하면 invalid-aria-prop 경고가 발생합니다.

1. 유효한 프로퍼티를 사용했는데도 이 문제가 발생했다면 철자를 확인해주세요. `aria-labelledby`와 `aria-activedescendant`의 철자를 틀리는 경우가 종종 있습니다.

<<<<<<< HEAD
2. React는 알 수 없는 속성을 아직 인식하지 못합니다. 이것은 React의 다음 버전에서 수정될 가능성이 있습니다. 하지만 React는 현재 알 수 없는 속성을 모두 제거하므로 React 애플리케이션에 설정된 알 수 없는 속성은 렌더링 되지 않습니다.
=======
2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React.
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985
