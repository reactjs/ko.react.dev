---
title: experimental_useEffectEvent
---

<Wip>

**이 API는 실험 단계이므로 아직 안정된 버전의 리액트에는 사용할 수 없습니다.**

가장 최신 실험 버전으로 업그레이드하여 리액트 패키지를 사용해 볼 수 있습니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

실험 버전의 리액트는 버그가 발생할 수 있습니다. 제품환경에서는 이 버전을 사용하지 마세요.


</Wip>


<Intro>

`useEffectEvent`는 [Effect Event.](/learn/separating-events-from-effects#declaring-an-effect-event) 에 non-reactive 로직을 추출하는 리액트 훅입니다.

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
