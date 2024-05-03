---
title: experimental_useEffectEvent
---

<Wip>

**이 API는 실험 단계이므로 아직 stable 버전의 리액트에는 사용할 수 없습니다.**

가장 최신 버전의 recent experimental 버전으로 업그레이드하여 사용해 볼 수 있습니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Experimental 버전의 리액트는 bugs가 발생할 수 있습니다. 제품에는 이 버전을 사용하지 마세요.


</Wip>


<Intro>

`useEffectEvent`는 [Effect Event.](/learn/separating-events-from-effects#declaring-an-effect-event) 에 non-reactive 로직을 추출하는 React Hook입니다.

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
