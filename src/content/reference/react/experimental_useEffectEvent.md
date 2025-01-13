---
title: experimental_useEffectEvent
---

<Wip>

**이 API는 실험 단계이므로 아직 안정된 버전의 React에는 사용할 수 없습니다.**

React 패키지를 최신 실험 버전으로 업그레이드하여 API를 사용해 볼 수 있습니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

실험 버전의 React에는 버그가 있을 수 있습니다. 프로덕션 환경에서는 이 버전을 사용하지 마세요.

</Wip>


<Intro>

`useEffectEvent`는 [Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event)에 반응하지 않는 로직을 추출하는 React Hook입니다.

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
