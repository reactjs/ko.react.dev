---
id: faq-ajax
title: AJAX 와 APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### 어떻게 AJAX 호출을 할 수 있을까요? {#how-can-i-make-an-ajax-call}

당신이 선호하는 AJAX 라이브러리를 React와 함께 사용할 수 있습니다. 유명한 라이브러리로는 [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), 그리고 브라우저에 내장된 [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 등이 있습니다.

### 컴포넌트의 생명주기 중 어디에서 AJAX 호출을 할 수 있나요? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

AJAX 호출을 통한 데이터는 생명주기 메서드 중 [`componentDidMount`](/docs/react-component.html#mounting) 안에 추가되어야 합니다. 이는 데이터를 받아 올 때 `setState`를 통하여 컴포넌트를 업데이트하기 위함입니다.

### 예시: 로컬 state를 설정하기 위해 AJAX 결과 사용하기 {#example-using-ajax-results-to-set-local-state}

아래 컴포넌트는 로컬 컴포넌트의 state를 채우기 위하여 `componentDidMount` 안에서 어떻게 AJAX 호출을 만드는지 보여 줍니다.

API 예시는 다음과 같은 JSON 객체를 반환합니다.

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // 주의: 컴포넌트의 실제 버그에서 발생하는 예외사항들을 넘기지 않도록 
        // 에러를 catch() 블록(block)에서 처리하기보다는 
        // 이 부분에서 처리하는 것이 중요합니다.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```

아래 코드는 [Hook](https://reactjs.org/docs/hooks-intro.html)과 같습니다.

```js
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: 빈 deps 배열 []은
  // 이 useEffect가 componentDidMount()처럼,
  // 한 번 실행됨을 의미합니다.
  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // 주의: 컴포넌트의 실제 버그에서 발생하는 예외사항들을 넘기지 않도록 
        // 에러를 catch() 블록(block)에서 처리하기보다는 
        // 이 부분에서 처리하는 것이 중요합니다.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} {item.price}
          </li>
        ))}
      </ul>
    );
  }
}
```
