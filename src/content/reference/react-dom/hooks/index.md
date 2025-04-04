---
title: "Built-in React DOM Hooks"
---

<Intro>

`react-dom` 패키지는 웹 애플리케이션만 지원하는 Hook을 포함하고 있습니다. 이 Hook은 iOS, 안드로이드, Windows 애플리케이션과 같은 브라우저가 아닌 환경들은 지원하지 않습니다. 웹 브라우저뿐만 아니라 *다른 환경*에서도 지원되는 Hook을 찾고 있다면 [React Hook 페이지](/reference/react)를 참고하세요. 이 페이지는 `react-dom` 패키지에 포함된 모든 Hook을 나열하고 있습니다.

</Intro>

---

## 폼 Hook {/*form-hooks*/}

*폼*은 정보 제출을 위한 상호 작용형 제어를 만들 수 있도록 해줍니다. 컴포넌트에 있는 폼을 관리하기 위해 다음과 같은 Hook 중 하나를 사용할 수 있습니다.

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) 폼의 상태에 따라 UI를 업데이트할 수 있게 해줍니다.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
