---
title: State를 사용해 Input 다루기
---

<Intro>

리액트는 선언적인 방식으로 UI를 조작합니다. 개별적인 UI를 직접 조작하는 것 대신에 컴포넌트 내부에 여러 state를 묘사하고 사용자의 입력에 따라 state를 변경합니다. 이는 디자이너가 UI를 바라보는 방식과 비슷합니다.

</Intro>

<YouWillLearn>

* 명령형 UI 프로그래밍이 아닌 선언형 UI 프로그래밍을 하는 방법
* 컴포넌트에 들어갈 수 있는 다양한 시각적 state를 열거하는 방법
* 코드에서 다른 시각적 state 간의 변경을 트리거 하는 방법

</YouWillLearn>

## 선언형 UI와 명령형 UI 비교 {/*how-declarative-ui-compares-to-imperative*/}

UI 인터랙션을 디자인할 때 유저가 액션을 하면 어떻게 UI를 *변경* 해야 할지 고민해본 적이 있을 것입니다. 유저가 폼을 제출한다고 생각해봅시다.

* 폼에 무언가를 입력하면 "제출" 버튼이 **활성화될** 것입니다.
* "제출" 버튼을 누르면 폼과 버튼이 **비활성화되고** 스피너가 **나타날** 것입니다.
* 네트워크 요청이 성공하면 폼은 **숨겨질** 것이고 "감사합니다." 메시지가 **나타날** 것입니다.
* 네트워크 요청이 실패하면 오류 메시지가 **보일** 것이고 폼은 다시 **활성화될** 것입니다.

위 내용은 **명령형 프로그래밍**에서 인터랙션을 구현하는 방법입니다. UI를 조작하기 위해서는 발생한 상황에 따라 정확한 지침을 작성해야만 합니다. 다른 방법을 한번 생각해봅시다. 옆에 누군가를 태우고 차례대로 어디를 가야 할지 말해준다고 상상해보세요.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In a car driven by an anxious-looking person representing JavaScript, a passenger orders the driver to execute a sequence of complicated turn by turn navigations." />

옆에 탄 운전기사는 당신이 어디를 가고싶어 하는지 모릅니다. 그저 명령에 따를 뿐이죠. (잘못된 지시를 하면 잘못된 곳에 도착하고 말겁니다.) 우리가 이것을 *명령형*이라 부르는 이유입니다. 왜냐하면 컴퓨터에게 스피너에서부터 버튼까지 각각의 요소에 UI를 *어떻게* 업데이트 해야할지 "명령"을 내려야하기 때문이죠.

아래의 명령형 UI 프로그래밍 예제는 리액트 *없이* 만들어진 폼입니다. 브라우저에 내장된 [DOM](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model)을 사용했습니다.

<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {  
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // 네트워크에 접속한다고 가정해봅시다.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

위의 예시에서는 문제가 없겠지만 위와 같이 UI를 조작하면 더 복잡한 시스템에서는 난이도가 기하급수적으로 올라갑니다. 여러 다른 폼으로 가득 찬 페이지를 업데이트해야 한다고 생각해보세요. 새로운 UI 요소나 새로운 인터랙션을 추가하려면 버그의 발생을 막기 위해 기존의 모든 코드를 주의 깊게 살펴봐야만 할 겁니다 (예를 들면 어떤 것을 보여주거나 숨기거나 하는 것을 잊을지도 모릅니다).

리액트는 이러한 문제점을 해결하기 위해 만들어졌습니다.

리액트에서는 직접 UI를 조작할 필요가 없습니다. 컴포넌트를 직접 활성화하거나 비활성화하거나 보여주거나 숨길 필요가 없습니다. 대신에 **무엇을 보여주고 싶은지 선언**하기만 하면 됩니다. 그러면 리액트는 어떻게 UI를 업데이트 해야 할지 이해할 것입니다. 택시를 탄다고 생각해 봅시다. 운전기사에게 어디서 꺾어야 할지 알려주는게 아니라 가고 싶은 곳을 말한다고 생각해 보세요. 당신을 거기까지 데려다주는 것은 운전기사의 일이고 운전기사는 어쩌면 당신이 몰랐던 지름길을 알고 있을지도 모릅니다!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## UI를 선언적인 방식으로 생각하기 {/*thinking-about-ui-declaratively*/}

지금까지 폼을 선언적인 방식으로 구현하는 방법을 살펴보았습니다. 리액트처럼 생각하는 방법을 더 잘 이해하기 위해 UI를 리액트에서 다시 구현하는 과정을 아래에서 살펴봅시다.

1. 컴포넌트의 다양한 시각적 state를 **확인하세요.**
2. 무엇이 state 변화를 트리거하는지 **알아내세요.**
3. `useState`를 사용해서 메모리의 state를 **표현하세요.**
4. 불필요한 state 변수를 **제거하세요.**
5. state 설정을 위해 이벤트 핸들러를 **연결하세요.**

## 첫 번째: 컴포넌트의 다양한 시각적 state 확인하기 {/*step-1-identify-your-components-different-visual-states*/}

여러가지 "state"를 가지고 있는 ["상태 기계"](https://ko.wikipedia.org/wiki/유한_상태_기계)라는 것을 컴퓨터 과학에서 들어본 적이 있을 것입니다. 그리고 디자이너와 일한다면 다양한 "시각적 state"에 관한 모형을 본 적이 있을 것입니다. 리액트는 디자인과 컴퓨터 과학의 사이에 있기 때문에 두 아이디어 모두에게서 영감을 받았습니다.

먼저 사용자가 볼 수 있는 UI의 모든 "state"를 시각화해야 합니다.

* **Empty**: 폼은 비활성화된 "제출" 버튼을 가지고 있다.
* **Typing**: 폼은 활성화된 "제출" 버튼을 가지고 있다.
* **Submitting**: 폼은 완전히 비활성화되고 스피너가 보인다.
* **Success**: 폼 대신에 "감사합니다" 메시지가 보인다.
* **Error**: "Typing" state와 동일하지만 오류 메시지가 보인다.

디자이너처럼 로직을 추가하기 전에 여러 state를 "목업" 하거나 "모형"을 만들고 싶을 것입니다. 여기에 폼의 생김새와 관련된 모형이 있다고 생각해봅시다. 이 모형은 기본값이 `'empty'`인 `status` prop에 의해 컨트롤됩니다.

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

여기서 prop을 네이밍하는 것은 중요하지 않습니다. 원하는 이름을 붙이면 됩니다. `status = 'empty'`를 `status = 'success'`로 변경하고 성공 메시지가 나타나는 것을 보세요. 모형을 만듦으로써 로직을 연결하기 전에 UI에서 빠르게 테스트해볼 수 있습니다. 다음은 `status` prop에 의해 "컨트롤"되는 조금 더 구체적인 프로토타입입니다.

<Sandpack>

```js
export default function Form({
  // 'submitting', 'error', 'success'로 한 번 변경해보세요:
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive title="Displaying many visual states at once">

컴포넌트가 많은 시각적 state를 가지고 있다면 한 페이지에서 모두 보여주는 것도 편하게 할 수 있습니다.

<Sandpack>

```js App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

이런 페이지를 보통 "살아있는 스타일가이드(living styleguides)" 또는 "스토리북(storybooks)"이라고 부릅니다.

</DeepDive>

### 두 번째: 무엇이 state 변화를 트리거하는지 알아내기 {/*step-2-determine-what-triggers-those-state-changes*/}

<IllustrationBlock title="Types of inputs">
  <Illustration caption="Human inputs" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

두 종류의 인풋 유형으로 state 변경을 트리거할 수 있습니다.

* 버튼을 누르거나, 필드를 입력하거나, 링크를 이동하는 것 등의 **휴먼 인풋**
* 네트워크 응답이 오거나, 타임아웃이 되거나, 이미지를 로딩하거나 하는 등의 **컴퓨터 인풋**

두 가지 경우 모두 **UI를 업데이트하기 위해서는 [state 변수](/learn/state-a-components-memory#anatomy-of-usestate)를 설정해야 합니다**. 지금 만들고 있는 폼의 경우 몇 가지 입력에 따라 state를 변경해야 합니다.

* **텍스트 인풋을 변경하면** (휴먼) 텍스트 상자가 비어있는지 여부에 따라 state를 *Empty*에서 *Typing* 으로 또는 그 반대로 변경해야 합니다.
* **제출 버튼을 클릭하면** (휴먼) *Submitting* state를 변경해야 합니다.
* **네트워크 응답이 성공적으로 오면** (컴퓨터) *Success* state를 변경해야 합니다.
* **네트워크 요청이 실패하면** (컴퓨터) 해당하는 오류 메시지와 함께 *Error* state를 변경해야 합니다.

> 휴먼 인풋은 종종 [이벤트 핸들러](/learn/responding-to-events)가 필요할 수도 있다는 것도 기억하세요!

이와 같은 흐름은 종이에 그려 시각화할 수 있습니다. 종이에 각각의 state를 라벨링 된 원으로 그리고 각각의 state 변화를 화살표로 이어보세요. 이러한 과정을 통해 state 변화의 흐름을 파악할 수 있을 뿐 아니라 구현 전에 버그를 찾을 수도 있습니다.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Flow chart moving left to right with 5 nodes. The first node labeled 'empty' has one edge labeled 'start typing' connected to a node labeled 'typing'. That node has one edge labeled 'press submit' connected to a node labeled 'submitting', which has two edges. The left edge is labeled 'network error' connecting to a node labeled 'error'. The right edge is labeled 'network success' connecting to a node labeled 'success'.">

Form states

</Diagram>

</DiagramGroup>

### 세 번째: 메모리의 state를 `useState`로 표현하기 {/*step-3-represent-the-state-in-memory-with-usestate*/}

다음으로 [`useState`](/apis/usestate)를 사용하여 컴포넌트의 시각적 state를 표현해야 합니다. 이 과정은 단순함이 핵심입니다. 각각의 state는 "움직이는 조각"입니다. 그리고 **"움직이는 조각"은 적을수록 좋습니다**. 복잡한 건 버그를 일으키기 마련이기 때문입니다!

먼저 *반드시 필요한* state를 가지고 시작해봅시다. 예를 들면 인풋의 `응답`은 반드시 저장해야 할 것입니다. 그리고 (존재한다면) 가장 최근에 발생한 `오류`도 저장해야 할 겁니다.

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

그리고 나서는 앞서 필요하다고 나열했던 나머지 시각적 state도 살펴봅시다. 보통은 어떤 state 변수를 사용할지에 대한 방법이 여러 가지기 때문에 이것저것 실험해볼 필요가 있습니다.

좋은 방법이 곧바로 떠오르지 않는다면 가능한 모든 시각적 state를 커버할 수 있는 *확실한* 것을 먼저 추가하는 방식으로 시작하세요:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

처음으로 떠올린 생각이 최고의 방법은 아닐 수도 있습니다. 하지만 괜찮습니다. state를 리팩토링을 하는 것도 과정 중 하나니까요!

### 네 번째: 불필요한 state 변수를 제거하기 {/*step-4-remove-any-non-essential-state-variables*/}

state의 중복은 피하고 필수적인 state만 남겨두고 싶을 겁니다. state 구조를 리팩토링하는 데 시간을 조금만 투자하면 컴포넌트는 더 이해하기 쉬워질 것이고 불필요한 중복은 줄어들 것이며 의도하지 않은 의미를 피할 수도 있을 것입니다. 리팩토링의 목표는 **state가 사용자에게 유효한 UI를 보여주지 않는 경우를 방지하는 것입니다.** (예를 들면 오류 메시지가 나타났는데 인풋이 비활성화 돼 있어 유저가 오류를 수정할 수 없는 상황은 원하지 않을 겁니다!)

여기에 state 변수에 관한 몇 가지 질문이 있습니다.

<<<<<<< HEAD
* **state가 역설을 일으키지는 않나요?** 예를 들면 `isTyping`과 `isSubmitting`이 동시에 `true`일 수는 없습니다. 이러한 역설은 보통 state가 충분히 제한되지 않았음을 의미합니다. 여기에는 두 boolean에 대한 네 가지 조합이 있지만 오직 유효한 state는 세 개뿐입니다. 이러한 "불가능한" state를 제거하기 위해 세 가지 값 `'typing'`, `'submitting'`, `'success'`을 하나의 `status`로 합칠 수 있습니다.
* **다른 state 변수에 이미 같은 정보가 담겨있진 않나요?** `isEmpty`와 `isTyping`은 동시에 `true`가 될 수 없습니다. 이를 각각의 state 변수로 분리하면 싱크가 맞지 않거나 버그가 발생할 위험이 있습니다. 이 경우에는 운이 좋게도 `isEmpty`를 지우고 `message.length === 0`으로 체크할 수 있습니다.
* **다른 변수를 뒤집었을 때 같은 정보를 얻을 수 있진 않나요?** `isError`는 `error !== null`로도 대신 확인할 수 있기 때문에 필요하지 않습니다.
=======
* **Does this state cause a paradox?** For example, `isTyping` and `isSubmitting` can't both be `true`. A paradox usually means that the state is not constrained enough. There are four possible combinations of two booleans, but only three correspond to valid states. To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`. 
* **Is the same information available in another state variable already?** Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time. By making them separate state variables, you risk them going out of sync and causing bugs. Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.
* **Can you get the same information from the inverse of another state variable?** `isError` is not needed because you can check `error !== null` instead.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

이러한 정리 과정을 거친 후에는 세 가지 (일곱 개에서 줄어든!) *필수* 변수만 남게 됩니다.

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

어느 하나를 지웠을 때 정상적으로 작동하지 않는다는 점에서 이것들이 모두 필수라는 것을 알 수 있습니다.

<DeepDive title="Eliminating “impossible” states with a reducer">

여기 폼의 state를 나타내는데 충분한 세 가지 변수가 있습니다. 하지만 세 변수는 여전히 말이 안 되는 일부 중간 state를 가지고 있습니다. 예를 들면 `error`가 null이 아닌데 `status`가 `success`인 것은 말이 되지 않습니다. state를 조금 더 정확하게 모델링하기 위해서는 [리듀서로 분리](/learn/extracting-state-logic-into-a-reducer)하는 방법도 있습니다. 리듀서를 사용하면 여러 state 변수를 하나의 객체로 통합하고 관련된 모든 로직도 합칠 수 있습니다!

</DeepDive>

### 다섯 번째: state 설정을 위해 이벤트 핸들러를 연결하기 {/*step-5-connect-the-event-handlers-to-set-state*/}

마지막으로 state 변수를 설정하기 위해 이벤트 핸들러를 연결하세요. 아래는 이벤트 핸들러까지 연결된 최종 폼입니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // 네트워크에 접속한다고 가정해봅시다.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

이러한 코드가 기존의 명령형 프로그래밍 예제보다는 길지만 그래도 조금 더 견고합니다. 모든 인터랙션을 state로 표현하게 되면 이후에 새로운 시각적 state가 추가되더라도 기존의 로직이 손상되는 것을 막을 수 있습니다. 또한 인터랙션 자체의 로직을 변경하지 않고도 각각의 state에 표시되는 항목을 변경할 수 있습니다.

<Recap>

* 선언형 프로그래밍은 UI를 세밀하게 직접 조작하는 것(명령형)이 아니라 각각의 시각적 state로 UI를 묘사하는 것을 의미합니다.
* 컴포넌트를 개발할 때
  1. 모든 시각적 state를 확인하세요.
  2. 휴먼이나 컴퓨터가 state 변화를 어떻게 트리거 하는지 알아내세요.
  3. `useState`로 state를 모델링하세요.
  4. 버그와 모순을 피하려면 불필요한 state를 제거하세요.
  5. state 설정을 위해 이벤트 핸들러를 연결하세요.

</Recap>



<Challenges>

### CSS class를 추가하고 제거하기 {/*add-and-remove-a-css-class*/}

사진을 클릭하면 바깥에 있는 `<div>`의 `background--active` CSS class를 *제거*하고 `<img>`에 `picture--active` class를 추가합니다. 그리고 배경을 다시 클릭하면 원래 CSS class로 돌아와야 합니다.

화면상으로는 사진을 클릭하면 보라색 배경은 제거되고 사진의 테두리는 강조 표시됩니다. 사진 외부를 클릭하면 배경이 강조 표시되고 사진의 테두리 강조 표시는 제거됩니다.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

이 컴포넌트는 두 가지 시각적 state를 가지고 있습니다. 이미지가 활성화되었을 때와 비활성화되었을 때입니다.

* 이미지가 활성화되었을 때 CSS class는 `background`와 `picture picture--active`가 됩니다.
* 이미지가 비활성화되었을 때 CSS class는 `background background--active`와 `picture`가 됩니다.

이미지의 활성화 state를 기억하기 위해서는 하나의 boolean state 변수로 충분합니다. 원래 하려고 했던 것은 CSS class를 제거하거나 추가하는 것이었습니다. 하지만 리액트에서는 UI 요소를 *조작하는 것* 보다는 무엇을 보여주길 원하는지 *묘사하는 것*이 필요합니다. 그렇기 때문에 현재 state를 기반으로 두 CSS class 모두를 계산해야 합니다. 그리고 이미지를 클릭했을 때 배경이 클릭되지 않도록 이벤트의 [전파를 막을](/learn/responding-to-events#stopping-propagation) 필요가 있습니다.

이미지를 클릭한 다음 이미지 외부도 클릭해 잘 작동하는지 확인해봅시다.

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }
  
  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

아래와 같이 두 JSX 덩어리로 나눌 수도 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

두 개의 다른 JSX 덩어리가 동일한 트리를 표현할 경우 중첩된 요소들(첫 번째 `<div>` → 첫 번째 `<img>`)이 순서대로 작성되어야 한다는 것을 기억하세요. 그렇지 않으면 `isActive`는 하위 트리 전체를 다시 만들고 [state는 초기화](/learn/preserving-and-resetting-state)될 것입니다. 그렇기 때문에 유사한 JSX 트리가 반환될 경우에는 이를 하나로 만들어 사용하는 것이 좋습니다.

</Solution>

### 프로필 편집기 {/*profile-editor*/}

아래는 순수 자바스크립트만으로 작성된 짧은 코드입니다. 동작을 이해하기 위해 살펴봅시다.

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (button.textContent === 'Edit Profile') {
    button.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    button.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

이 폼은 두 가지 모드를 가지고 있습니다. 하나는 편집 모드이고 이때 인풋들을 볼 수 있습니다. 또 다른 하나는 보기 모드이고 이때는 오직 결과만 볼 수 있습니다. 버튼의 라벨은 속한 모드에 따라 "Edit"과 "Save"로 변경됩니다. 또한 인풋들의 내용을 변경할 때 환영 메시지를 실시간으로 확인할 수 있습니다.

당신의 목적은 아래 샌드박스에서 리액트로 다시 구현하는 것입니다. 편의를 위해 마크업은 이미 JSX로 변환되어 있습니다. 하지만 원래 구현돼있던 것처럼 인풋들을 보여주고 숨기는 것은 직접 구현해야 합니다.

마찬가지로 아래에 있는 텍스트도 업데이트시켜야 합니다!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

인풋의 값을 저장하기 위해서는 `firstName`과 `lastName` 두 가지 변수가 필요합니다. 또한 인풋들을 보여줄지 말지를 결정하는 `isEditing` 변수도 필요합니다. 하지만 `fullName` 변수는 필요하지 _않습니다._ 왜냐하면 전체 이름은 `firstName`과 `lastName` 변수를 합쳐 만들 수 있기 때문입니다.

마지막으로 `isEditing`에 따라 인풋들을 보여주고 숨기기 위해 [조건부 렌더링](/learn/conditional-rendering)을 해야 합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

위 코드와 원래의 명령형 코드를 비교해보세요. 차이점을 알겠나요?

</Solution>

### 명령형 코드를 리액트 없이 리팩토링하기 {/*refactor-the-imperative-solution-without-react*/}

여기 리액트 없이 명령형으로 작성된 챌린지 이전의 코드가 있습니다.

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (button.textContent === 'Edit Profile') {
    button.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    button.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

리액트가 없다고 상상해보세요. 이 로직을 조금 더 견고하고 리액트와 비슷하게 리팩토링할 수 있을까요? 리액트에서처럼 state를 명시적으로 표현하면 어떻게 보일까요?

어디서부터 시작해야할지 고민 중이라면 아래에 구조를 미리 만들어 두었습니다. 아래 구조에서 시작한다면 비어있는 `updateDOM` 함수 로직을 작성해보세요. (필요에 따라 원래 코드를 참조하시면 됩니다.)

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    button.textContent = 'Save Profile';
    // TODO: 인풋을 보여주고 텍스트는 숨깁니다.
  } else {
    button.textContent = 'Edit Profile';
    // TODO: 인풋을 숨기고 텍스트를 보여줍니다.
  }
  // TODO: 텍스트 라벨을 업데이트합니다.
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

누락된 로직에는 인풋과 텍스트의 표시 여부 토글 및 라벨 업데이트가 포함되어 있습니다.

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    button.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    button.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

작성된 `updateDOM` 함수는 리액트가 state를 설정할 때 어떤 작업을 수행하는지 보여줍니다. (하지만 리액트는 마지막으로 state가 설정된 이후 변경되지 않은 속성에 대해서는 DOM을 건드리지 않습니다.)

</Solution>

</Challenges>
