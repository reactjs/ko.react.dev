---
id: dom-elements
title: DOM 엘리먼트
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React는 성능 및 브라우저 간 호환성을 위해 브라우저의 독립적인 DOM 시스템을 구현합니다. React에서는 브라우저의 DOM 구현에서 몇 가지 어려운 부분을 정리할 수가 있었습니다.

React에서 모든 프로퍼티 및 어트리뷰트(이벤트 핸들러 포함)은 캐멀 케이스를 사용합니다.
예를 들어 HTML 어트리뷰트인 `tabindex`는 React의 `tabIndex`으로 표현합니다. 예외는 `aria-*` 및 `data-*` 어트리뷰트입니다. 이는 소문자로 표현합니다. 예를 들어, `aria-label`은 `aria-label`로 동일하게 유지됩니다.

## 어트리뷰트의 차이 {#differences-in-attributes}

React와 HTML 사이에는 다르게 작동하는 여러가지의 어트리뷰트들이 있습니다.

### checked {#checked}

`checked` 어트리뷰트는 `checkbox` 또는 `radio` 타입의 `<input>` 컴포넌트에 의해 지원됩니다. 이 어트리뷰트를 사용해서 컴포넌트의 선택 여부를 설정할 수 있습니다. 이는 제어 컴포넌트를 만들 때 유용합니다. `defaultChecked`는 비제어 컴포넌트가 사용되는 동등한 의미를 가지는 어트리뷰트이며 컴포넌트가 처음 마운트될 때 선택 여부를 설정합니다.

### className {#classname}

CSS class를 사용하려면 `className` 어트리뷰트를 사용하세요. 이는 `<div>`, `<a>` 등과 같은 모든 일반적인 DOM 및 SVG 엘리먼트에 적용됩니다.

일반적이진 않지만, React를 웹 컴포넌트에 사용하는 경우 `class` 어트리뷰트를 사용하세요.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML`은 브라우저 DOM에서 `innerHTML`을 사용하기 위한 React의 대체 방법입니다. 일반적으로 코드에서 HTML을 설정하는 것은 [사이트 간 스크립팅](https://ko.wikipedia.org/wiki/사이트_간_스크립팅) 공격에 쉽게 노출될 수 있기 때문에 위험합니다. 따라서 React에서 직접 HTML을 설정할 수는 있지만, 위험하다는 것을 상기시키기 위해 `dangerouslySetInnerHTML`을 작성하고 `__html` 키로 객체를 전달해야 합니다. 아래는 예시입니다.

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

`for`는 JavaScript에서 예약어이므로 React 엘리먼트는 `htmlFor`를 대신 사용합니다.

### onChange {#onchange}

`onChange` 이벤트는 예상한대로 폼 필드가 변경될 때 이벤트가 발생합니다. 의도적으로 기존 브라우저의 동작을 사용하지 않는데 `onChange`는 이러한 동작에 대해 잘못된 명칭이며 React는 실시간으로 유저 입력을 처리하는 이벤트에 의존하기 때문입니다.


### selected {#selected}

`<option>`을 선택됐다고 표시하고 싶다면, `<select>`의 `value`에서 해당 option의 값을 대신 참조하세요.

자세한 설명은 ["The select Tag"](/docs/forms.html#the-select-tag)을 확인해주세요.


### style {#style}

>주의
>
>문서의 일부 예시는 편의상 style을 사용하지만, **style 어트리뷰트를 스타일링의 주요 수단으로 사용하는 것은 일반적으로 권장되지 않습니다**. 대부분의 경우 [`className`](#classname) 외부 CSS stylesheet에 정의된 class를 참조하는데 사용해야 합니다. style은 보통 React 애플리케이션에서 렌더링 시점에 동적으로 계산된 스타일을 추가하기 위해 사용됩니다. [FAQ: Styling and CSS](/docs/faq-styling.html)를 참조해주세요.

`style` 어트리뷰트는 CSS 문자열 대신 캐멀 케이스 프로퍼티를 가진 JavaScript 객체로 받아들입니다. 이는 DOM style JavaScript 프로퍼티와 일관되며 더 효율적이며 XSS 보안 허점을 방지합니다. 아래는 예시입니다.

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

스타일에는 autoprefixer가 붙지 않습니다. 구형 브라우저에서 사용하려면 해당 스타일 프로퍼티를 입력해야 합니다.

```js
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

스타일 키는 JS에서 DOM 노드의 프로퍼티에 접근하는 것과 일관되게 유지하기 위해 캐멜 케이스를 사용합니다. (예: `node.style.backgroundImage`). 벤더 프리픽스 [`ms` 제외](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/)는 대문자로 시작해야 합니다. 이것이 바로 `WebkitTransition`이 대문자 "W"를 갖는 이유입니다.

React는 특정 숫자 인라인 스타일 프로퍼티는 "px" 접미사를 자동으로 추가합니다. "px"이 아닌 다른 단위를 사용하길 원한다면, 원하는 단위와 함께 값을 문자열로 지정해주세요. 아래는 예시입니다.

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

모든 스타일 프로퍼티가 픽셀 문자열로 변환되는 것은 아닙니다. 어떤 속성들은 단위가 없습니다 (예: `zoom`, `order`, `flex`). 단위가 없는 모든 프로퍼티에 대한 목록을 [여기에서](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59) 확인할 수 있습니다.

### suppressContentEditableWarning {#suppresscontenteditablewarning}

일반적으로, 자식이 있는 엘리먼트가 `contentEditable`로 표시된다면 제대로 동작하지 않으므로 경고가 표시됩니다. `suppressContentEditableWarning` 어트리뷰트는 경고를 표시하지 않도록 합니다. `contentEditable`을 수동으로 관리하는 [Draft.js](https://facebook.github.io/draft-js/)와 같은 라이브러리를 만들지 않는 한 이 옵션으로 사용하지 마세요.

### suppressHydrationWarning {#suppresshydrationwarning}

서버 사이드 렌더링을 사용하는 경우, 일반적으로 서버와 클라이언트가 다른 내용을 렌더링할 때 경고가 표시됩니다. 그러나 매우 드물게 정확히 일치시키는 게 힘들거나 불가능합니다. 예를 들어 타임 스탬프 같은 경우 서버와 클라이언트에서는 다를 것으로 예상됩니다.

<<<<<<< HEAD
`suppressHydrationWarning`을 `true`로 설정하면, React는 어트리뷰트와 그 엘리먼트 내용의 불일치에 대해 경고하지 않습니다. 바로 밑 한 단계 깊이를 기준으로만 작동하며 해결책으로 사용하도록 되어 있습니다. 남용하지 마세요. 이벤트 보충에 대한 자세한 내용은 [`ReactDOM.hydrate()` 문서](/docs/react-dom.html#hydrate)를 참조해주세요.
=======
If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. You can read more about hydration in the [`ReactDOM.hydrateRoot()` documentation](/docs/react-dom-client.html#hydrateroot).
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e

### value {#value}

`value` 어트리뷰트는 `<input>`, `<select>`와 `<textarea>` 컴포넌트에 의해 지원됩니다. 이를 이용해 컴포넌트의 값을 설정할 수 있습니다. 이는 제어 컴포넌트를 만드는 데 유용합니다. `defaultValue` 비제어 컴포넌트에서 사용되는 동등한 의미를 가지는 어트리뷰트이며, 처음 마운트될 때 컴포넌트의 값을 설정합니다.

## 지원되는 모든 HTML 어트리뷰트 {#all-supported-html-attributes}

React 16부터는 모든 표준 [또는 사용자 정의](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM 어트리뷰트가 완벽하게 지원됩니다.

React는 항상 JavaScript 중심 API를 DOM에 제공했습니다. React 컴포넌트는 사용자 지정 및 DOM 관련 props 둘 다 받아들이기 때문에, React는 DOM API처럼 camelCase를 사용합니다.

```js
<div tabIndex={-1} />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

이러한 props는 위에 설명 된 특별한 경우를 제외하고는 해당 HTML 어트리뷰트와 유사하게 작동합니다.

React가 지원하는 DOM 어트리뷰트 중 일부는 다음과 같습니다.

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

마찬가지로, 모든 SVG 어트리뷰트가 완벽하게 지원됩니다.

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

또한 소문자로만 이뤄진 경우 사용자 지정 어트리뷰트을 사용할 수도 있습니다.
