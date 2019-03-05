---
title: React Element Factories and JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

아마도 코드에서 일반 함수처럼 컴포넌트를 호출했기 때문에 이 경고를 보게 된 것입니다. 아래의 코드는 현재 사용되지 않습니다.

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // 경고
}
```

## JSX {#jsx}

이렇게 직접 React 컴포넌트를 호출할 수 없습니다. [대신 JSX를 사용 할 수 있습니다.](/docs/jsx-in-depth.html)

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## JSX를 사용하지 않는다면 {#without-jsx}

JSX를 사용하고 싶지 않거나 사용할 수 없다면 컴포넌트를 호출하기 전에 팩토리에서 컴포넌트를 래핑해야합니다.

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

기존에 이런 함수 호출이 많다면 이렇게 하는 것이 쉽게 코드를 업그레이드할 수 있는 방법입니다.

## JSX를 사용하지 않는 동적 컴포넌트 {#dynamic-components-without-jsx}

동적인 소스에서 클래스 컴포넌트를 가져오는 경우라면 팩토리를 만들지 않아도 됩니다. 대신 엘리먼트를 인라인으로 만들면 됩니다.

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## 더 알아보기 {#in-depth}

[이렇게 변경된 이유에 대해 더 자세히 알아보세요.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
