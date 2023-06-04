---
title: 유효하지 않은 ARIA 프로퍼티 경고
---

이 경고는 Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [명세](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)에 존재하지 않는 `aria-*` 프로퍼티를 가진 DOM 요소를 렌더링하려고 할 때 발생합니다.

1. 유효한 prop을 사용하고 있다고 생각하는 경우 철자를 주의 깊게 확인해 보세요. `aria-labelledby`와 `aria-activedescendant`는 철자 실수가 잦습니다.

2. `aria-role`을 작성한 경우 `role`을 사용하려고 한 것일 수 있습니다.

3. 그렇지 않은 경우, 최신 버전의 React DOM을 사용하고 ARIA 명세에 나열된 유효한 프로퍼티 이름을 사용하고 있는지 확인한 경우 [버그를 보고해 주세요](https://github.com/facebook/react/issues/new/choose).
