---
title: unsupported-syntax
---

<Intro>

React 컴파일러가 지원하지 않는 문법에 대해 검증합니다. 필요한 경우 독립적인 유틸리티 함수와 같이 React 외부에서 이 문법을 계속 사용할 수 있습니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

React 컴파일러는 최적화를 적용하기 위해 코드를 정적으로 분석합니다. `eval` 및 `with`와 같은 기능은 컴파일 타임에 코드가 무엇을 하는지 정적으로 이해하는 것을 불가능하게 만들기 때문에 컴파일러는 이를 사용하는 컴포넌트를 최적화할 수 없습니다.

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 컴포넌트에서 eval 사용
function Component({ code }) {
  const result = eval(code); // 분석할 수 없음
  return <div>{result}</div>;
}

// ❌ with 문 사용
function Component() {
  with (Math) { // 동적으로 스코프 변경
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ eval을 사용한 동적 프로퍼티 액세스
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 일반적인 프로퍼티 액세스 사용
function Component({propName, props}) {
  const value = props[propName]; // 분석 가능
  return <div>{value}</div>;
}

// ✅ 표준 Math 메서드 사용
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## 문제 해결 {/*troubleshooting*/}

### 동적 코드를 평가해야 합니다 {/*evaluate-dynamic-code*/}

사용자가 제공한 코드를 평가해야 할 수 있습니다.

```js
// ❌ 잘못된 예시: 컴포넌트에서 eval
function Calculator({expression}) {
  const result = eval(expression); // 안전하지 않고 최적화 불가능
  return <div>결과: {result}</div>;
}
```

대신 안전한 표현식 파서를 사용하세요.

```js
// ✅ 더 나은 방법: 안전한 파서 사용
import {evaluate} from 'mathjs'; // 또는 유사한 라이브러리

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // 안전한 수학적 표현식 평가
      setResult(evaluate(expression));
    } catch (error) {
      setResult('잘못된 표현식');
    }
  };

  return (
    <div>
      <button onClick={calculate}>계산</button>
      {result && <div>결과: {result}</div>}
    </div>
  );
}
```

<Note>

사용자 입력과 함께 `eval`을 절대 사용하지 마세요. 보안 위험이 있습니다. 수학적 표현식, JSON 파싱 또는 템플릿 평가와 같은 특정 사용 사례에는 전용 파싱 라이브러리를 사용하세요.

</Note>
