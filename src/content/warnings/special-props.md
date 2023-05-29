---
title: 특별한 Props 경고
---

JSX 요소의 대부분의 props는 컴포넌트로 전달됩니다. 그러나 두 가지 특별한 props(`ref`와 `key`)는 React에서 사용되므로 컴포넌트로 전달되지 않습니다.

예를 들어, 컴포넌트에서 `props.key`를 읽을 수는 없습니다. 자식 컴포넌트 내에서 동일한 값을 액세스해야 하는 경우 다른 prop으로 전달해야 합니다. (예:`<ListItemWrapper key={result.id} id={result.id} />`와 같이 전달하고 `props.id`를 읽습니다.). 이는 불필요한 중복처럼 보일 수 있지만, 앱 로직을 React의 힌트와 분리하는 것이 중요합니다.
