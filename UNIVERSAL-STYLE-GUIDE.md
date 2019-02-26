# 공통 스타일 가이드

이 문서는 **모든** 언어에 적용돼야 할 규칙을 설명합니다.

## 제목 아이디

모든 제목에는 다음과 같이 아이디가 명시적으로 설정되어 있습니다.

```md
## Try React {#try-react}
```

**아이디는 번역하면 안 됩니다!** 이 아이디는 탐색을 위해 사용되므로 번역하면 아래처럼 외부에서 문서가 참조될 때 링크가 깨질 수 있습니다.

```md
자세한 내용은 [시작 부분](/getting-started#try-react)을 참조해주세요.
```

✅ 권장

```md
## React 시도해보기 {#try-react}
```

❌ 금지:

```md
## React 시도해보기 {#react-시도해보기}
```

이는 위에 있는 링크를 깨지게 만듭니다.

## 코드에 있는 문자

주석을 제외한 모든 코드는 번역하지 않고 그대로 놔둬 주세요. 선택적으로 문자열에 있는 텍스트를 수정할 수 있지만, 코드를 참조하는 문자열은 번역하지 않도록 주의해주세요.

예시는 다음과 같습니다.
```js
// Example
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ 권장

```js
// 예시
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ 허용:

```js
// 예시
const element = <h1>안녕 세상</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

❌ 금지:

```js
// 예시
const element = <h1>안녕 세상</h1>;
// "root"는 HTML 엘리먼트의 아이디를 의미합니다.
// 번역하지 마세요.
ReactDOM.render(element, document.getElementById('뿌리'));
```

❌ 절대 금지:

```js
// 예시
const 요소 = <h1>안녕 세상</h1>;
ReactDOM.그리다(요소, 문서.아이디로부터_엘리먼트_가져오기('뿌리'));
```

## 외부 링크

외부 링크가 [MDN]이나 [Wikipedia]같은 참고 문헌의 문서에 연결되어 있고 해당 문서가 자국어로 잘 번역되어 있다면 번역 문서를 링크하는 것도 고려해보세요.

[MDN]: https://developer.mozilla.org/en-US/
[Wikipedia]: https://en.wikipedia.org/wiki/Main_Page

예시는 다음과 같습니다.

```md
React elements are [immutable](https://en.wikipedia.org/wiki/Immutable_object).
```

✅ 허용:

```md
React 엘리먼트는 [불변객체](https://ko.wikipedia.org/wiki/불변객체)입니다.
```

외부 링크를 대체할 만한 자국어 자료가 없다면 (Stack Overflow, YouTube 비디오 등) 영어 링크를 사용해주세요.
