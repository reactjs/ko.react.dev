---
id: optimizing-performance
title: 성능 최적화
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

내부적으로 React는 UI를 최신화하기 위해 비용이 많이 드는 DOM 작업의 수를 최소화하기 위해 몇 가지 기발한 방법을 활용합니다. 많은 애플리케이션에서 React를 사용하면 성능을 특별히 최적화하기 위해 많은 작업을 수행하지 않고도 빠른 사용자 인터페이스로 이어질 수 있습니다. 그럼에도 불구하고 React 애플리케이션의 속도를 높일 수 있는 몇 가지 방법이 있습니다.

## 프로덕션 빌드를 활용하세요 {#use-the-production-build}

React 앱에서 성능 문제를 겪고 있거나 벤치마크하고 있는 경우, 축소된 프로덕션 빌드를 사용하여 테스트를 수행하고 있는지 확인하세요.

기본적으로 React에는 유용한 경고가 많이 포함되어 있습니다. 이 경고들은 개발하는데 있어 매우 유용합니다. 그러나 그 경고는 React를 더 크고 느리게 만들기 때문에 앱을 배포할 때 프로덕션 버전을 사용해야합니다.

빌드 프로세스가 올바르게 설정되었는지 잘 모르는 경우에는 [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)를 설치하여 확인할 수 있습니다. 프로덕션 모드의 React 기반 사이트에 접속하면 아이콘의 배경이 어두운 색으로 표시됩니다.

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

개발 모드의 React 기반 사이트에 접속하면 아이콘의 배경이 빨간색으로 표시됩니다.

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

앱을 개발할 때는 개발 모드를, 사용자에게 앱을 배포할 때는 프로덕션 모드를 사용해야 합니다.

아래에서 프로덕션 용도의 앱을 제작할 수 있는 방법을 확인할 수 있습니다.

### Create React App {#create-react-app}

프로젝트가 Create React App 기반이라면 아래 명령어를 실행하세요.

```
npm run build
```

명령어를 실행하면 프로젝트의 `build/` 폴더에 애플리케이션의 프로덕션 빌드파일이 만들어집니다.

프로덕션 환경에 배포하기 전에만 필요하다는 것을 기억하세요. 정상적인 개발 환경에선 `npm start`를 이용하세요.

### 단일 파일 빌드 {#single-file-builds}

React 및 React DOM의 프로덕션 준비 버전을 단일 파일로 제공합니다.

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

`.production.min.js`로 끝나는 React 파일만이 프로덕션 환경에 적합합니다.

### Brunch {#brunch}

가장 효율적인 Brunch 프로덕션 빌드를 위해 [`terser-brunch`](https://github.com/brunch/terser-brunch)를 설치하세요.

```
# npm을 사용한다면
npm install --save-dev terser-brunch

# Yarn을 사용한다면
yarn add --dev terser-brunch
```

다음 프로덕션 빌드를 생성하기 위해 `build` 명령어에 `-p` 플래그를 추가합니다.

```
brunch build -p
```

프로덕션 빌드에 대해서만 이 작업을 수행하면 됩니다. React의 유용한 경고문구를 숨기고 빌드를 훨씬 느리게 만들기 때문에 개발 환경에서 플러그인을 적용하거나 `-p`플래그를 추가하지 마세요.

### Browserify {#browserify}

가장 효율적인 Browserify 프로덕션 빌드를 위해 몇 가지 플러그인을 설치하세요.

```
# npm을 사용하는 경우
npm install --save-dev envify terser uglifyify

# Yarn을 사용하는 경우
yarn add --dev envify terser uglifyify
```

프로덕션 빌드를 만들려면, 다음 변환을 추가하세요. **(순서는 중요합니다.)**

* [`envify`](https://github.com/hughsk/envify) 변환은 올바른 빌드 환경이 설정되도록 합니다. 또한 전역 (`-g`)으로 변환시킵니다.
* [`uglifyify`](https://github.com/hughsk/uglifyify) 변환은 개발에서만 사용하는 package를 제거합니다. 또한 전역(`-g`)으로 변환시킵니다.
* 마지막으로 최종 bundle은 mangling을 위해 [`terser`](https://github.com/terser-js/terser)로 연결됩니다. ([원리](https://github.com/hughsk/uglifyify#motivationusage))

예시를 확인하세요.

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

프로덕션 빌드에서만 필요한 작업이라는 점을 기억하세요. 이러한 플러그인은 React의 유용한 경고를 숨기고 빌드를 훨씬 느리게 만들기 때문에 개발 중에는 적용하지 마세요.

### Rollup {#rollup}

가장 효율적인 Rollup 프로덕션 빌드를 위해 몇 가지 플러그인을 설치하세요.

```bash
# npm을 사용하는 경우
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# Yarn을 사용하는 경우
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

프로덕션 빌드를 만들려면, 다음 플러그인을 추가하세요. **(순서는 중요합니다.)**

*  [`replace`](https://github.com/rollup/rollup-plugin-replace) 플러그인은 올바른 빌드 환경이 설정되도록 해줍니다.
*  [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) 플러그인은 CommonJS를 지원하도록 해줍니다.
*  [`terser`](https://github.com/TrySound/rollup-plugin-terser) 플러그인은 최종 bundle을 압축하고 mangle 해줍니다.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

전체적인 설정 예시는 [gist](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0)를 참고하세요.

프로덕션 빌드에서만 필요한 작업이라는 점을 기억하세요. React의 유용한 경고를 숨기고 빌드를 훨씬 느리게 만들기 때문에 `terser` 플러그인이나 `replace` 플러그인을 개발 중에  `'production'` 값으로 적용하지 마세요.

### webpack {#webpack}

>**주의**
>
>Create React App을 사용한다면 [위 설명](#create-react-app)을 참고하세요.<br>
>이 부분은 webpack을 직접 구성할 경우에만 해당합니다.

Webpack v4 이상에서는 프로덕션 모드에서 기본적으로 코드를 축소합니다.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

이 부분에 대해 더 알고 싶다면 [webpack 문서](https://webpack.js.org/guides/production/)를 참고하세요.

production 빌드에서만 필요한 작업이라는 점을 기억하세요. React의 유용한 경고를 숨기고 빌드를 훨씬 느리게 만들기 때문에 `TerserPlugin`을 개발 중에 적용하지 마세요.

## Chrome Performance 탭으로 컴포넌트 프로파일링 {#profiling-components-with-the-chrome-performance-tab}

**개발** 모드에서 지원되는 브라우저의 Performance 탭을 사용하여 어떻게 컴포넌트가 마운트, 업데이트, 그리고 마운트 해제되는지 시각화할 수 있습니다. 예를 들면.

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React components in Chrome timeline" /></center>

Chrome에서 이 작업을 하려면

1. 일시적으로 **특히 React 개발 도구를 포함해 모든 Chrome 확장 프로그램을 비활성화하세요.** 결과가 크게 왜곡될 수 있습니다!

2. 개발 모드에서 애플리케이션을 실행 중인지 확인하세요.

3. Chrome 개발 도구의 **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** 탭을 열고 **Record**버튼을 클릭하세요.

4. 프로파일링할 작업을 진행하세요. 20초 이상 기록하지 마세요. 그렇지 않으면 Chrome이 멈출 수 있습니다.

5. 기록을 멈추세요.

6. React 이벤트는 **User Timing** 라벨로 그룹화됩니다.

더 자세한 사례를 보려면 [Ben Schwarz의 글](https://calibreapp.com/blog/react-performance-profiling-optimization)을 확인하세요.

**수치는 상대적이어서 프로덕션 상태에서는 컴포넌트가 더 빠르게 렌더링 될 수 있다는 사실**을 기억하세요. 그래도 관계없는 UI가 실수에 의해 업데이트되는 현상과 UI 업데이트의 깊이와 빈도를 깨닫는 데 도움을 줄 것입니다.

현재는 Chrome, Edge 그리고 IE만이 이 기능을 지원하는 브라우저지만 [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)가 표준으로 사용되기 때문에 더 많은 브라우저가 지원을 추가할 것으로 예상됩니다.

## Profiler DevTools Profiler로 컴포넌트 프로파일링 {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+와  `react-native` 0.57+는 React DevTools Profiler를 사용하여 개발 모드에서 향상된 프로파일링 기능을 제공합니다.
Profiler에 대한 내용은 블로그 포스트 ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html)에서 확인할 수 있습니다.
Profiler에 대한 영상도 [YouTube](https://www.youtube.com/watch?v=nySib7ipZdk)에서 확인 가능합니다.

아직 React DevTools를 설치하지 않은 경우 다음 링크에서 확인하세요.

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

> 주의
>
> `react-dom`의 프로덕션 프로파일링 bundle은 `react-dom/profiling`으로 이용할 수 있습니다.
> bundle을 사용하는 법에 대한 자세한 내용은 [fb.me/react-profiling](https://fb.me/react-profiling)에서 확인하세요.

## 긴 목록 가상화하세요 {#virtualize-long-lists}

애플리케이션에서 긴 목록(수백 또는 수천행)을 렌더링하는 경우 'windowing'이라는 기법을 사용하는 것을 추천합니다. 이 기법은 주어진 시간에 목록의 부분 목록만 렌더링하며 컴포넌트를 다시 렌더링하는 데 걸리는 시간과 생성된 DOM 노드의 수를 크게 줄일 수 있습니다.

[react-window](https://react-window.now.sh/)와 [react-virtualized](https://bvaughn.github.io/react-virtualized/)는 널리 알려진 windowing 라이브러리입니다. 목록, 그리드 및 표 형식 데이터를 표시하기 위한 몇 가지 재사용 가능한 컴포넌트를 제공합니다. 애플리케이션의 특정한 활용 사례에 더 적합한 것을 원한다면 Twitter처럼 자신만의 windowing 컴포넌트를 만들 수 있습니다.

## 재조정을 피하세요 {#avoid-reconciliation}

React는 렌더링 된 UI의 internal representation을 빌드하고 유지 관리합니다. 여기에는 컴포넌트에서 반환되는 React 엘리먼트가 포함됩니다. representation은 React가 JavaScript 객체에서의 작업보다 느릴 수 있기 때문에 필요에 따라 DOM 노드를 만들고 기존 노드에 접근하지 못하도록 합니다. 때론 "virtual DOM"이라고 불리기도 하지만, React Native에서 같은 방식으로 동작합니다.

컴포넌트의 prop이나 state가 변경되면 React는 새로 반환된 엘리먼트를 이전에 렌더링된 엘리먼트와 비교해서 실제 DOM 업데이트가 필요한지 여부를 결정합니다. 같지 않을 경우 React는 DOM을 업데이트합니다.

React가 변경된 DOM 노드만 업데이트하더라도 리렌더링에는 여전히 다소 시간이 걸립니다. 대부분의 경우 문제가 되지 않지만 속도 저하가 눈에 띄는 경우 다시 렌더링이 시작되기 전에 실행되는 생명주기 함수 `shouldComponentUpdate`로 이 기능을 무시함으로써 속도를 높일 수 있습니다. 이 함수의 기본 implementation은 `true`를 반환하고 React는 업데이트를 진행합니다.

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

몇몇 상황에서 컴포넌트를 업데이트할 필요가 없다는 것을 알고 있다면 `shouldComponentUpdate`에서 `false`를 반환해서 컴포넌트와 그 자식 컴포넌트에서 `render()`를 호출하는 것을 포함해서 전체 렌더링 프로세스를 건너뛰게 할 수 있습니다.

대부분의 경우 `shouldComponentUpdate()`를 직접 작성하는 대신 [`React.PureComponent`](/docs/react-api.html#reactpurecomponent)에서 상속 받을 수 있습니다. 그것은 현재와 이전의 prop과 state의 얕은 비교로 `shouldComponentUpdate()`를 호출하는 것과 같습니다.

## shouldComponentUpdate In Action {#shouldcomponentupdate-in-action}

컴포넌트의 하위트리를 살펴보세요. 각 항목에 대해 `SCU`는 `shouldComponentUpdate`가 반환한 것을 나타내며, `vDOMEq`는 React 엘리먼트가 동일한지 여부를 표시합니다. 마지막으로 원의 색은 컴포넌트를 조정해야 하는지 여부를 나타냅니다.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

`shouldComponentUpdate`는 C2에 뿌리를 둔 하위트리에서 `false`를 반환했기 때문에 React는 C2를 렌더링하려고 시도하지 않았으므로 C4 및 C5에서  `shouldComponentUpdate`를 호출할 필요가 없었습니다.

C1과 C3의 경우 `shouldComponentUpdate`가 `true`를 반환했으므로 React가 트리의 가장 하위에 가서 확인해야 했습니다. C6의 경우 `shouldComponentUpdate`는 `true`를 반환했고 렌더링 된 엘리먼트는 동일하지 않기 때문에 React는 DOM을 업데이트해야 했습니다.

마지막 흥미로운 경우는 C8입니다. React는 이 컴포넌트를 렌더링 해야 했지만 이전에 렌더링 된 React 엘리먼트와 동일했기 때문에 DOM을 업데이트할 필요가 없었습니다.

React는 C6에 대해 DOM 변경(mutation)을 수행하면 되는데, 이는 불가피했습니다. C8의 경우 렌더링 된 React 엘리먼트를 비교해서 빠져(bail out)나오고 C2의 하위트리와 C7의 경우 `shouldComponentUpdate`를 구제할 때 엘리먼트를 비교할 필요조차 없었고 `render`도 호출되지 않았습니다.

## 예시 {#examples}

컴포넌트가 변경되는 유일한 방법이 `props.color` 또는 `state.count`변수가 변경되는 경우라면 `shouldComponentUpdate`에서 다음을 확인하세요.

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

이 코드에서 `shouldComponentUpdate`는 `props.color` 또는 `state.count`에 변화가 있는지 확인합니다. 해당 값들이 변경되지 않으면 컴포넌트가 업데이트되지 않습니다. 컴포넌트가 더 복잡해지면 `props`와 `state`의 모든 필드 사이에 "얕은 비교"를 하는 것과 유사한 패턴을 사용해서 컴포넌트가 업데이트되어야만 하는지 여부를 결정할 수 있습니다. 이 패턴은 React가 `React.PureComponent`에서 단순히 상속받아 활용되는 이 로직을 사용하는 데 도움을 줄 만큼 일반적입니다. 따라서 이 코드는 동일한 효과를 얻을 수 있는 더 간단한 방법입니다.

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

대부분의 경우 `shouldComponentUpdate`를 쓰는 대신 `React.PureComponent`를 사용할 수 있습니다. 얕은 비교만 수행하기 때문에 얕은 비교로는 지나칠 수 있는 방식으로 state나 props가 변화한다면 사용할 수 없습니다.

이런 부분은 복잡한 데이터 구조인 경우 문제가 될 수 있습니다. 예를 들어 `listOfWords`라는 컴포넌트가 쉼표로 구분된 단어 목록을 렌더링하고 단어를 목록에 추가할 수 있는 버튼을 클릭하도록 해주는 상위의 `WordAdder` 컴포넌트를 사용한다고 가정을 해보겠습니다. 이 코드는 정상적으로 **작동하지 않습니다.**

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

문제는 `PureComponent`가 `this.props.words`의 이전 값과 새로운 값을 간단하게 비교한다는 점입니다. 이 코드는 `WordAdder`의 `handleClick`메서드에서 `words`배열을 변경시키기 때문에 배열의 실제 단어가 변경되었다 하더라도 `this.props.words`의 이전 값과 새로운 값은 동일하게 비교됩니다. 따라서 `ListOfWords`는 렌더링 되어야 하는 새로운 단어가 있어도 업데이트되지 않습니다.

## 데이터를 변형시키지 않음으로써 얻는 효과 {#the-power-of-not-mutating-data}

이 문제를 피하는 가장 간단한 방법은 props와 state로 사용중인 값의 변경을 피하는 것입니다. 예를 들어 `handleClick`메서드는 `concat`을 사용해서 다시 작성될 수 있습니다.

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6는 이런 동작을 쉽게 만들어주는 [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)를 배열에서 지원합니다. Create React App을 사용하고 있다면 이 문법은 기본적으로 사용할 수 있습니다.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

비슷한 방법으로 mutation을 피하기 위해 객체를 변경하는 코드를 다시 쓸 수 있습니다. 예를 들어 `colormap`이란 객체가 있고 `colormap.right`를 `'blue'`로 변경시키는 함수를 만들고 싶다고 가정해봅시다. 그렇다면 아래와 같이 작성할 수 있습니다.

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

객체 원본을 변경시키지 않고 작성하려면 [Object.assign](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)메서드를 사용하세요.

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap`은 기존 객체를 변경하지않고 새로운 객체를 반환합니다. `Object.assign`은 ES6의 문법이고 폴리필(polyfill)을 필요로합니다.

객체 또한 변경 없이 손쉽게 업데이트될 수 있도록 [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread)를 추가하자는 JavaScript 제안이 있습니다.

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

Create React App을 사용하고 있다면 `Object.assign`과 object spread 문법은 기본적으로 활용 가능합니다.

깊게 중첩된 객체를 처리할 때 불변성을 지키는 방식으로 객체를 업데이트하면 복잡하다고 느낄 수 있습니다. 이런 문제를 마주했다면 [Immer](https://github.com/mweststrate/immer) 혹은 [immutability-helper](https://github.com/kolodny/immutability-helper)를 살펴보세요. 불변성이 가져다주는 이득을 잃지 않고 조금 더 가독성 있는 코드를 작성할 수 있게 해줄겁니다.
