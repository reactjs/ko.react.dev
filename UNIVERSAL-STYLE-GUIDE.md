# 공통 스타일 가이드

이 문서는 **모든** 언어에 적용돼야 할 규칙을 설명합니다.

## 제목 아이디

모든 제목은 다음처럼 명시적인 아이디를 가집니다.

```md
## Try React {#try-react}
```

**아이디는 번역하면 안 됩니다!** 이 아이디는 탐색을 위해 사용되며 아래처럼 외부에서 문서가 참조될 때 유효하지 않을 수 있습니다.

```md
자세한 내용은 [시작 부분](/getting-started#try-react)을 참조해주세요.
```

✅ DO:

```md
## React 시도해보기 {#try-react}
```

❌ DON'T:

```md
## React 시도해보기 {#react-시도해보기}
```

이는 위에 있는 링크가 유효하지 않게 만듭니다.

## 코드에 있는 문자

주석을 제외한 모든 코드는 번역하지 않고 그대로 놔둬 주세요. 선택적으로 문자열에 있는 텍스트를 수정할 수 있지만, 코드로 활용되는 문자열은 번역하지 않도록 주의해주세요.

예를 든다면
```js
// Example
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ DO:

```js
// 예시
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ ALSO OKAY:

```js
// 예시
const element = <h1>안녕 세상</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

❌ DON'T:

```js
// 예시
const element = <h1>안녕 세상</h1>;
// "root"는 HTML 엘리먼트의 아이디를 의미합니다.
// 번역하지 마세요.
ReactDOM.render(element, document.getElementById('뿌리'));
```

❌ DEFINITELY DON'T:

```js
// 예시
const 요소 = <h1>안녕 세상</h1>;
ReactDOM.그리다(요소, 문서.아이디로부터_엘리먼트_가져오기('뿌리'));
```

## 외부 링크

외부 링크가 [MDN] 또는 [Wikipedia]의 문서를 참조하고 같은 문서의 번역본이 괜찮은 품질이라면 번역된 문서를 참조할지 고려해보세요.

[MDN]: https://developer.mozilla.org/en-US/
[Wikipedia]: https://en.wikipedia.org/wiki/Main_Page

예를 든다면

```md
React elements are [immutable](https://en.wikipedia.org/wiki/Immutable_object).
```

✅ OK:

```md
React 엘리먼트는 [불변객체](https://ko.wikipedia.org/wiki/%EB%B6%88%EB%B3%80%EA%B0%9D%EC%B2%B4)입니다.
```

외부 링크의 번역본이 없다면 (Stack Overflow, YouTube 비디오 등) 영어 링크를 사용해주세요.
