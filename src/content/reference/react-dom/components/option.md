---
title: "<option>"
---

<Intro>

[브라우저에 내장된 `<option>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option)를 사용해 [`<select>`](/reference/react-dom/components/select) 박스 안에 옵션을 렌더링할 수 있습니다.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<option>` {/*option*/}

<<<<<<< HEAD
[브라우저에 내장된 `<option>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option)를 사용해 [`<select>`](/reference/react-dom/components/select) 박스 안에 옵션을 렌더링할 수 있습니다.
=======
The [built-in browser `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) lets you render an option inside a [`<select>`](/reference/react-dom/components/select) box.
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### Props {/*props*/}

`<option>` 은 모든 [일반적인 엘리먼트 props](/reference/react-dom/components/common#props)를 지원합니다.

또한, `<option>` 은 이러한 props를 지원합니다.

* [`disabled`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option#disabled): 불리언 타입. `true`면 옵션을 선택할 수 없으며 흐리게 표시됩니다.
* [`label`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option#label): 문자열 타입. 옵션의 의미를 지정합니다. 지정하지 않으면 옵션 내부의 텍스트가 사용됩니다.
* [`value`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option#value): 이 옵션을 선택한 경우 [폼에서 상위 `<select>` 를 제출할 때](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) 사용할 값입니다.

#### 유의 사항 {/*caveats*/}

* React는 `<option>`에서 `selected` 속성을 지원하지 않습니다. 대신, 이 옵션의 `value`를 제어되지 않은 select box의 경우 상위 [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) 에 전달하거나, 제어되는 select box의 경우 [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) 에 전달하세요.

---

## 사용법 {/*usage*/}

### 옵션이 포함된 select box 표시하기 {/*displaying-a-select-box-with-options*/}

내부에 `<option>` 컴포넌트 목록이 있는 `<select>`를 렌더링하여 select box를 보여줍니다. 각 `<option>`에 양식과 함께 제출할 데이터를 나타내는 `value`를 지정하세요.

[`<option>` 컴포넌트 목록과 함께 `<select>`를 표시하는 방법에 대해 알아보세요.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

